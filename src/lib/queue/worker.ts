import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { conversionQueue } from './conversion-queue';
import type { ConversionJob } from './types';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

const execAsync = promisify(exec);

const WORKER_POOL_SIZE = parseInt(process.env.CONVERSION_WORKER_POOL_SIZE || '5', 10);
const EXPORT_CLEANUP_DAYS = parseInt(process.env.EXPORT_CLEANUP_DAYS || '7', 10);

/**
 * Get the executable path for a worker
 */
function getExecutablePath(workerIndex: number): string {
  const exeName = workerIndex === 0 ? 'Convert.exe' : `Convert_${workerIndex}.exe`;
  return path.join(process.cwd(), 'exports', exeName);
}

/**
 * Verify executable exists
 */
function verifyExecutable(workerIndex: number): boolean {
  const exePath = getExecutablePath(workerIndex);
  if (!fs.existsSync(exePath)) {
    console.error(`Executable not found for worker ${workerIndex}: ${exePath}`);
    return false;
  }
  try {
    fs.accessSync(exePath, fs.constants.X_OK);
    return true;
  } catch (error) {
    console.error(`Executable not accessible for worker ${workerIndex}:`, error);
    return false;
  }
}

function resolveFolderName(outputDir: string | undefined, workingDir: string, fallback: string): string {
  if (!outputDir) {
    return fallback;
  }

  const relative = path.relative(workingDir, outputDir);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    return fallback;
  }

  return relative.split(path.sep).join('/');
}

/**
 * Get Supabase service client for workers
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials');
  }

  return createServiceClient(supabaseUrl, serviceRoleKey);
}

/**
 * Process an import job
 */
async function processImportJob(job: ConversionJob, workerIndex: number): Promise<void> {
  const supabase = getSupabaseClient();
  const exePath = getExecutablePath(workerIndex);
  const workingDir = path.join(process.cwd(), 'exports');
  const folderName = resolveFolderName(job.outputDir, workingDir, job.userId);

  if (!verifyExecutable(workerIndex)) {
    throw new Error(`Conversion executable not found for worker ${workerIndex}`);
  }

  if (!job.filePath || !job.outputDir) {
    throw new Error('Missing file path or output directory for import job');
  }

  const rdfPath = job.filePath;
  const userDir = job.outputDir;
  const tableName = job.tableName;

  try {
    // Execute conversion: Convert.exe tableName folderName csv
    const command = `"${exePath}" "${tableName}" "${folderName}" "csv"`;
    console.log(`[Worker ${workerIndex}] Processing import: ${command}`);

    const { stdout, stderr } = await execAsync(command, {
      cwd: workingDir,
      env: {
        ...process.env,
        PATH: `${workingDir};${process.env.PATH}`,
        RDF_PATH: rdfPath,
        OUTPUT_DIR: userDir,
      },
    });

    console.log(`[Worker ${workerIndex}] Import stdout:`, stdout);
    if (stderr) console.error(`[Worker ${workerIndex}] Import stderr:`, stderr);

    // Wait a bit for file system to sync
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if CSV was generated
    const csvPath = path.join(userDir, `${tableName}.csv`);
    if (!fs.existsSync(csvPath)) {
      throw new Error('CSV file was not generated');
    }

    // Read and parse CSV
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    // Disable dynamicTyping to preserve all values as strings initially
    // This allows us to properly handle BIGINT values that exceed INTEGER max
    const { data: records, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings, we'll convert manually
    });

    if (errors.length > 0) {
      throw new Error(`CSV parsing error: ${errors[0].message}`);
    }

    // Delete existing data
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('table_id', job.tableId);

    if (deleteError) {
      throw new Error(`Failed to clear existing data: ${deleteError.message}`);
    }

    // Prepare records for insertion
    // Note: Column names are preserved as-is from CSV to match database schema (case-sensitive)
    const recordsToInsert = (records as Record<string, unknown>[]).map((record: Record<string, unknown>) => {
      const processedRecord: Record<string, unknown> = {};
      for (const key in record) {
        // Preserve original column name (database columns are case-sensitive)
        let value = record[key];
        
        // Handle string values (all values come as strings when dynamicTyping is false)
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          if (trimmedValue !== '') {
            const num = Number(trimmedValue);
            if (!isNaN(num) && isFinite(num)) {
              // If the number exceeds INTEGER max (2147483647), keep it as a string
              // This ensures PostgreSQL treats it as BIGINT instead of INTEGER
              // PostgreSQL INTEGER max: 2147483647, BIGINT can handle much larger values
              if (num > 2147483647 || num < -2147483648) {
                // Keep as string for BIGINT columns
                value = trimmedValue;
              } else {
                // Safe to convert to number for INTEGER/SMALLINT columns
                value = num;
              }
            } else {
              // Not a valid number, keep as string (might be text or other data)
              value = trimmedValue;
            }
          } else {
            value = null; // Empty strings become null
          }
        } else if (typeof value === 'number') {
          // Handle numbers (fallback in case dynamicTyping was enabled)
          // If the number exceeds INTEGER max, convert it back to string for BIGINT columns
          // PostgreSQL INTEGER max: 2147483647, BIGINT can handle much larger values
          if (value > 2147483647 || value < -2147483648) {
            // Convert to string for BIGINT columns to prevent PostgreSQL from casting as INTEGER
            value = String(value);
          }
          // Otherwise keep as number for INTEGER/SMALLINT columns
        }
        
        processedRecord[key] = value;
      }

      return {
        ...processedRecord,
        table_id: job.tableId,
      };
    });

    // Insert new data in batches to better identify problematic records
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < recordsToInsert.length; i += batchSize) {
      const batch = recordsToInsert.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(recordsToInsert.length / batchSize);
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch);

      if (insertError) {
        // Parse error to extract column information
        const errorMessage = insertError.message || 'Unknown error';
        // Supabase errors may have additional properties
        const errorWithDetails = insertError as { details?: string; hint?: string; code?: string };
        const errorDetails = errorWithDetails.details || '';
        const errorHint = errorWithDetails.hint || '';
        const errorCode = errorWithDetails.code || '';
        
        let columnName = 'unknown';
        let problematicValue: unknown = null;
        let rowIndex = i;
        
        // Try to extract column name from error message or details
        // PostgreSQL errors often include column info like: "column \"columnName\" ..."
        const fullErrorText = `${errorMessage} ${errorDetails} ${errorHint}`;
        const columnMatch = fullErrorText.match(/column\s+["']([^"']+)["']/i);
        if (columnMatch) {
          columnName = columnMatch[1];
        }
        
        // Try to extract value from error message
        // Errors like: "value \"4294967295\" is out of range" or "value 4294967295 is out of range"
        const valueMatch = fullErrorText.match(/value\s+["']?([0-9]+)["']?\s+is\s+out\s+of\s+range/i);
        if (valueMatch) {
          problematicValue = valueMatch[1];
        }
        
        // Try to find which record in the batch has the problematic value
        if (columnName !== 'unknown') {
          for (let j = 0; j < batch.length; j++) {
            const record = batch[j] as Record<string, unknown>;
            if (columnName in record) {
              const recordValue = record[columnName];
              // Check if this value matches the problematic value or is out of range
              if (problematicValue && String(recordValue) === String(problematicValue)) {
                rowIndex = i + j;
                problematicValue = recordValue;
                break;
              } else if (typeof recordValue === 'number') {
                // Check for integer overflow
                if (recordValue > 2147483647 || recordValue < -2147483648) {
                  rowIndex = i + j;
                  problematicValue = recordValue;
                  break;
                }
                // Check for smallint overflow
                if (recordValue > 32767 || recordValue < -32768) {
                  rowIndex = i + j;
                  problematicValue = recordValue;
                  break;
                }
              }
            }
          }
        } else {
          // If we can't find the column, check all records for out-of-range values
          for (let j = 0; j < batch.length; j++) {
            const record = batch[j] as Record<string, unknown>;
            for (const key in record) {
              const value = record[key];
              if (typeof value === 'number') {
                // Check for integer overflow
                if (value > 2147483647 || value < -2147483648) {
                  rowIndex = i + j;
                  columnName = key;
                  problematicValue = value;
                  break;
                }
                // Check for smallint overflow
                if (value > 32767 || value < -32768) {
                  rowIndex = i + j;
                  columnName = key;
                  problematicValue = value;
                  break;
                }
              }
            }
            if (columnName !== 'unknown') break;
          }
        }
        
        // Build detailed error message
        const errorParts = [
          `Failed to insert new data at row ${rowIndex + 1} (batch ${batchNumber}/${totalBatches}):`,
          `Column: "${columnName}"`,
          `Value: ${problematicValue !== null ? JSON.stringify(problematicValue) : 'N/A'}`,
          `Error Code: ${errorCode || 'N/A'}`,
          `Error: ${errorMessage}`,
        ];
        
        if (errorDetails) {
          errorParts.push(`Details: ${errorDetails}`);
        }
        if (errorHint) {
          errorParts.push(`Hint: ${errorHint}`);
        }
        
        // Include the problematic record for debugging
        const problematicRecord = batch[rowIndex - i] || batch[0] || {};
        errorParts.push(`\nProblematic record:\n${JSON.stringify(problematicRecord, null, 2)}`);
        
        const detailedError = errorParts.join('\n');
        
        throw new Error(detailedError);
      }
      
      insertedCount += batch.length;
      console.log(`[Worker ${workerIndex}] Inserted batch ${batchNumber}/${totalBatches} (${insertedCount}/${recordsToInsert.length} records)`);
    }

    console.log(`[Worker ${workerIndex}] Import completed successfully`);
  } catch (error) {
    console.error(`[Worker ${workerIndex}] Import error:`, error);
    throw error;
  }
}

/**
 * Process an export job
 */
async function processExportJob(job: ConversionJob, workerIndex: number): Promise<string> {
  const exePath = getExecutablePath(workerIndex);
  const workingDir = path.join(process.cwd(), 'exports');
  const folderName = resolveFolderName(job.outputDir, workingDir, job.userId);

  if (!verifyExecutable(workerIndex)) {
    throw new Error(`Conversion executable not found for worker ${workerIndex}`);
  }

  if (!job.filePath || !job.outputDir) {
    throw new Error('Missing file path or output directory for export job');
  }

  const csvPath = job.filePath;
  const userDir = job.outputDir;
  const tableName = job.tableName;
  
  // Generate timestamp to create unique folder and prevent caching issues
  const timestamp = Date.now();
  
  const exportRoot = path.join(process.cwd(), 'exports');
  const finalDir = path.join(exportRoot, job.userId, String(timestamp));
  const finalPath = path.join(finalDir, `${tableName}.rdf`);

  try {
    // Execute conversion: Convert.exe tableName folderName rdf
    const command = `"${exePath}" "${tableName}" "${folderName}" "rdf"`;
    console.log(`[Worker ${workerIndex}] Processing export: ${command}`);

    await execAsync(command, {
      cwd: workingDir,
      env: {
        ...process.env,
        PATH: `${workingDir};${process.env.PATH}`,
        CSV_PATH: csvPath,
        OUTPUT_DIR: userDir,
      },
    });

    // Verify RDF file was created (support legacy output path)
    let rdfPath = path.join(userDir, `${tableName}.rdf`);
    if (!fs.existsSync(rdfPath)) {
      const legacyPath = path.join(process.cwd(), 'exports', job.userId, `${tableName}.rdf`);
      if (fs.existsSync(legacyPath)) {
        rdfPath = legacyPath;
      } else {
        throw new Error(`RDF file was not generated at expected path: ${rdfPath}`);
      }
    }

    // Check file size to ensure it's not empty
    const stats = fs.statSync(rdfPath);
    if (stats.size === 0) {
      throw new Error('RDF file was generated but is empty');
    }

    fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(rdfPath, finalPath);

    const publicUrl = `https://editor.dbod.cc/${job.userId}/${timestamp}/${tableName}.rdf`;
    console.log(`[Worker ${workerIndex}] Export completed successfully`);
    console.log(`[Worker ${workerIndex}] Public URL: ${publicUrl}`);
    console.log(`[Worker ${workerIndex}] Storage path: ${finalPath}`);
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for exported file');
    }
    
    return publicUrl;
  } catch (error) {
    console.error(`[Worker ${workerIndex}] Export error:`, error);
    throw error;
  }
}

/**
 * Worker function that processes jobs
 */
async function workerLoop(workerIndex: number): Promise<void> {
  while (true) {
    try {
      // Get next job from queue
      const job = conversionQueue.getNextJob(workerIndex);
      
      if (!job) {
        // No jobs available, wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      console.log(`[Worker ${workerIndex}] Starting job ${job.id} (${job.type} for ${job.tableName})`);

      try {
        if (job.type === 'import') {
          await processImportJob(job, workerIndex);
          conversionQueue.completeJob(job.id);
          console.log(`[Worker ${workerIndex}] Job ${job.id} marked as completed (import)`);
        } else if (job.type === 'export') {
          console.log(`[Worker ${workerIndex}] Starting export job ${job.id}`);
          try {
            const downloadUrl = await processExportJob(job, workerIndex);
            console.log(`[Worker ${workerIndex}] processExportJob returned downloadUrl: ${downloadUrl}`);
            console.log(`[Worker ${workerIndex}] About to call completeJob for job ${job.id}`);
            conversionQueue.completeJob(job.id, downloadUrl);
            console.log(`[Worker ${workerIndex}] completeJob called successfully`);
            
            // Verify job is in queue
            const verifyJob = conversionQueue.getJob(job.id);
            if (!verifyJob) {
              console.error(`[Worker ${workerIndex}] ERROR: Job ${job.id} not found in queue after completion!`);
            } else {
              console.log(`[Worker ${workerIndex}] Verified job ${job.id} in queue with status: ${verifyJob.status}, downloadUrl: ${verifyJob.downloadUrl}`);
            }
          } catch (exportError) {
            console.error(`[Worker ${workerIndex}] Error in export job processing:`, exportError);
            throw exportError;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Worker ${workerIndex}] Job ${job.id} failed:`, errorMessage);
        conversionQueue.failJob(job.id, errorMessage);
      } finally {
        // Clean up temporary files
        try {
          if (job.outputDir && fs.existsSync(job.outputDir)) {
            // Check if we should keep CSV files for testing (export jobs only)
            const keepCsvFiles = process.env.KEEP_EXPORT_CSV_FILES === 'true' || process.env.KEEP_EXPORT_CSV_FILES === '1';
            
            if (job.type === 'export') {
              if (!keepCsvFiles && job.filePath && fs.existsSync(job.filePath)) {
                fs.unlinkSync(job.filePath);
                console.log(`[Worker ${workerIndex}] Removed CSV file: ${job.filePath}`);
              } else if (keepCsvFiles && job.filePath) {
                console.log(`[Worker ${workerIndex}] Keeping CSV file for testing: ${job.filePath}`);
              }

              const exportRoot = path.join(process.cwd(), 'exports');
              const relativePath = path.relative(exportRoot, job.outputDir);
              if (relativePath.startsWith(`tmp${path.sep}`)) {
                fs.rmSync(job.outputDir, { recursive: true, force: true });
                console.log(`[Worker ${workerIndex}] Cleaned up temp directory: ${job.outputDir}`);
              }
            } else {
              // Normal cleanup for import jobs
              fs.rmSync(job.outputDir, { recursive: true, force: true });
              console.log(`[Worker ${workerIndex}] Cleaned up directory: ${job.outputDir}`);
            }
          }
        } catch (cleanupError) {
          console.error(`[Worker ${workerIndex}] Error cleaning up files:`, cleanupError);
        }

        // Release worker
        conversionQueue.releaseWorker(workerIndex);
      }
    } catch (error) {
      console.error(`[Worker ${workerIndex}] Worker error:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

function parseTimestampDir(dirName: string): number | null {
  if (!/^\d+$/.test(dirName)) {
    return null;
  }
  const value = Number(dirName);
  return Number.isFinite(value) ? value : null;
}

function cleanupOldExports(): void {
  if (!Number.isFinite(EXPORT_CLEANUP_DAYS) || EXPORT_CLEANUP_DAYS <= 0) {
    return;
  }

  const exportRoot = path.join(process.cwd(), 'exports');
  const cutoff = Date.now() - EXPORT_CLEANUP_DAYS * 24 * 60 * 60 * 1000;

  try {
    if (!fs.existsSync(exportRoot)) {
      return;
    }

    const userDirs = fs.readdirSync(exportRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && entry.name !== 'tmp');

    for (const userDir of userDirs) {
      const userPath = path.join(exportRoot, userDir.name);
      const timestampDirs = fs.readdirSync(userPath, { withFileTypes: true })
        .filter(entry => entry.isDirectory());

      for (const timestampDir of timestampDirs) {
        const timestamp = parseTimestampDir(timestampDir.name);
        if (timestamp === null || timestamp >= cutoff) {
          continue;
        }

        const targetPath = path.join(userPath, timestampDir.name);
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`[Cleanup] Removed old export directory: ${targetPath}`);
      }
    }
  } catch (error) {
    console.error('[Cleanup] Failed to remove old exports:', error);
  }
}

/**
 * Start all workers
 */
export function startWorkers(): void {
  console.log(`Starting ${WORKER_POOL_SIZE} conversion workers...`);
  
  for (let i = 1; i <= WORKER_POOL_SIZE; i++) {
    // Start each worker in its own async context
    workerLoop(i).catch(error => {
      console.error(`Worker ${i} crashed:`, error);
    });
  }
  
  console.log(`All ${WORKER_POOL_SIZE} workers started`);
}

// Start workers when module is loaded (in Next.js API routes, this runs on server startup)
if (typeof window === 'undefined') {
  startWorkers();
  setInterval(cleanupOldExports, 60 * 60 * 1000);
}

