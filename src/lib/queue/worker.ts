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
    // Execute conversion: Convert.exe tableName userId csv
    const command = `"${exePath}" "${tableName}" "${job.userId}" "csv"`;
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
    const { data: records, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
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
        
        // Convert string numbers to actual numbers
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          if (trimmedValue !== '') {
            const num = Number(trimmedValue);
            if (!isNaN(num) && isFinite(num)) {
              value = num;
            }
          } else {
            value = null; // Empty strings become null
          }
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
 * Ensure exports bucket exists
 */
async function ensureExportsBucket(): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase service role credentials');
      return false;
    }

    const { createClient: createServiceClient } = await import('@supabase/supabase-js');
    const serviceClient = createServiceClient(supabaseUrl, serviceRoleKey);
    
    const { error: createError } = await serviceClient.storage.createBucket('exports', {
      public: true,
      fileSizeLimit: 50000000
    });
    
    if (createError && 
        !createError.message.includes('already exists') && 
        !createError.message.includes('The resource already exists')) {
      return false;
    }

    const { error: updateError } = await serviceClient.storage.updateBucket('exports', {
      public: true,
      fileSizeLimit: 50000000
    });
    
    if (updateError) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring exports bucket:', error);
    return false;
  }
}

/**
 * Process an export job
 */
async function processExportJob(job: ConversionJob, workerIndex: number): Promise<string> {
  const supabase = getSupabaseClient();
  
  // Ensure exports bucket exists
  if (!await ensureExportsBucket()) {
    throw new Error('Failed to ensure exports bucket exists');
  }

  const exePath = getExecutablePath(workerIndex);
  const workingDir = path.join(process.cwd(), 'exports');

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
  const storagePath = `${job.userId}/${timestamp}/${tableName}.rdf`;

  try {
    // Execute conversion: Convert.exe tableName userId rdf
    const command = `"${exePath}" "${tableName}" "${job.userId}" "rdf"`;
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

    // Verify RDF file was created
    const rdfPath = path.join(userDir, `${tableName}.rdf`);
    if (!fs.existsSync(rdfPath)) {
      throw new Error(`RDF file was not generated at expected path: ${rdfPath}`);
    }

    // Check file size to ensure it's not empty
    const stats = fs.statSync(rdfPath);
    if (stats.size === 0) {
      throw new Error('RDF file was generated but is empty');
    }

    // Upload to storage
    const rdfContent = fs.readFileSync(rdfPath);
    
    const { error: uploadError } = await supabase.storage
      .from('exports')
      .upload(storagePath, rdfContent, {
        contentType: 'application/octet-stream',
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('exports')
      .getPublicUrl(storagePath);

    console.log(`[Worker ${workerIndex}] Export completed successfully`);
    console.log(`[Worker ${workerIndex}] Public URL: ${publicUrl}`);
    console.log(`[Worker ${workerIndex}] Storage path: ${storagePath}`);
    
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
            // Clean up user directory after processing
            // Note: For exports, RDF is already uploaded to storage
            // For imports, CSV is already processed into database
            fs.rmSync(job.outputDir, { recursive: true, force: true });
            console.log(`[Worker ${workerIndex}] Cleaned up directory: ${job.outputDir}`);
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
}

