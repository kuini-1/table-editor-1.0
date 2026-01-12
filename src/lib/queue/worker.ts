import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { conversionQueue } from './conversion-queue';
import type { ConversionJob } from './types';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { TYPE_TO_FOLDER_MAP } from '@/lib/tableTypeMapping';

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
 * Extract table type from table name (e.g., 'table_hls_item_data' -> 'hls_item')
 */
function getTableTypeFromName(tableName: string): string | null {
  // Remove 'table_' prefix and '_data' suffix
  const match = tableName.match(/^table_(.+?)_data$/);
  if (match) {
    return match[1];
  }
  // Try without _data suffix
  const match2 = tableName.match(/^table_(.+)$/);
  if (match2) {
    return match2[1];
  }
  return null;
}

/**
 * Get column names from schema file for a given table name
 */
async function getSchemaColumns(tableName: string): Promise<string[]> {
  try {
    const tableType = getTableTypeFromName(tableName);
    if (!tableType) {
      return [];
    }

    // Map table type to folder name
    const folderName = TYPE_TO_FOLDER_MAP[tableType] || tableType;
    
    // Try to dynamically import the schema
    // Schema files export a schema object with keys matching column names
    try {
      const schemaModule = await import(`@/app/(dashboard)/tables/${folderName}/schema`);
      
      // Look for schema exports (usually named like {tableType}Schema, {tableType}TableSchema, etc.)
      const schemaKeys = Object.keys(schemaModule);
      const schemaKey = schemaKeys.find(key => 
        key.toLowerCase().includes('schema') && 
        !key.toLowerCase().includes('form') &&
        !key.toLowerCase().includes('type') &&
        !key.toLowerCase().includes('row')
      );
      
      if (schemaKey && schemaModule[schemaKey]) {
        const schema = schemaModule[schemaKey];
        // Zod schemas have a 'shape' property with the field definitions
        if (schema.shape) {
          const columns = Object.keys(schema.shape).filter(key => key !== 'table_id');
          return columns;
        }
        // If it's already an object with keys
        if (typeof schema === 'object' && !schema.shape) {
          return Object.keys(schema).filter(key => key !== 'table_id');
        }
      }
      
      // If no schema found, try common naming patterns
      const commonPatterns = [
        `${folderName}Schema`,
        `${folderName}TableSchema`,
        `${tableType}Schema`,
        `${tableType}TableSchema`,
        'schema'
      ];
      
      for (const pattern of commonPatterns) {
        if (schemaModule[pattern]?.shape) {
          return Object.keys(schemaModule[pattern].shape).filter(key => key !== 'table_id');
        }
      }
    } catch {
      // Silently fail - we'll fall back to database query
      return [];
    }
  } catch {
    // Silently fail - we'll fall back to database query
    return [];
  }
  
  return [];
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

    // Get actual column names from schema file (preferred) or database
    let dbColumns: string[] = [];
    
    // First, try to get columns from the schema file
    dbColumns = await getSchemaColumns(tableName);
    
    if (dbColumns.length > 0) {
      console.log(`[Worker ${workerIndex}] Got ${dbColumns.length} columns from schema file for ${tableName}`);
    } else {
      // Fallback: try to get columns from a sample row
      try {
        const { data: sampleData } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (sampleData && sampleData.length > 0) {
          dbColumns = Object.keys(sampleData[0]);
          console.log(`[Worker ${workerIndex}] Got ${dbColumns.length} columns from sample data for ${tableName}`);
        }
      } catch (err) {
        console.warn(`[Worker ${workerIndex}] Could not fetch sample data from ${tableName}:`, err);
      }
    }

    // Create a case-insensitive mapping from CSV column names to database column names
    const columnMap = new Map<string, string>();
    if (records.length > 0) {
      const csvColumns = Object.keys(records[0] as Record<string, unknown>);
      
      if (dbColumns.length > 0) {
        // Create case-insensitive mapping from database columns
        const dbColumnMap = new Map<string, string>();
        dbColumns.forEach((col) => {
          dbColumnMap.set(col.toLowerCase(), col);
        });
        
        csvColumns.forEach((csvCol) => {
          const dbCol = dbColumnMap.get(csvCol.toLowerCase());
          if (dbCol) {
            columnMap.set(csvCol, dbCol);
            if (csvCol !== dbCol) {
              console.log(`[Worker ${workerIndex}] Mapped CSV column "${csvCol}" to DB column "${dbCol}"`);
            }
          } else {
            // If not found, try exact match (preserve original case)
            columnMap.set(csvCol, csvCol);
            console.warn(`[Worker ${workerIndex}] CSV column "${csvCol}" not found in DB schema, using as-is`);
          }
        });
        
        console.log(`[Worker ${workerIndex}] Column mapping for ${tableName}:`, Array.from(columnMap.entries()));
      } else {
        // If we couldn't get DB columns, we'll try lowercase mapping
        // But we'll also log a warning and let the insert attempt reveal the actual column names
        csvColumns.forEach((csvCol) => {
          // Try lowercase version (PostgreSQL/Supabase typically stores unquoted identifiers in lowercase)
          columnMap.set(csvCol, csvCol.toLowerCase());
        });
        console.warn(`[Worker ${workerIndex}] Could not determine DB columns for ${tableName}, using lowercase mapping. CSV columns:`, csvColumns.slice(0, 5).join(', '));
      }
    }

    // Delete existing data
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('table_id', job.tableId);

    if (deleteError) {
      throw new Error(`Failed to clear existing data: ${deleteError.message}`);
    }

    // Prepare records for insertion with case-insensitive column mapping
    const recordsToInsert = (records as Record<string, unknown>[]).map((record: Record<string, unknown>) => {
      const processedRecord: Record<string, unknown> = {};
      for (const csvKey in record) {
        // Map CSV column name to database column name (case-insensitive)
        const dbKey = columnMap.get(csvKey) || csvKey;
        if (csvKey !== dbKey) {
          console.log(`[Worker ${workerIndex}] Mapping "${csvKey}" -> "${dbKey}" for ${tableName}`);
        }
        let value = record[csvKey];
        
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
        
        processedRecord[dbKey] = value;
      }

      return {
        ...processedRecord,
        table_id: job.tableId,
      };
    });

    // Log first record's column names for debugging
    if (recordsToInsert.length > 0) {
      const firstRecordKeys = Object.keys(recordsToInsert[0]);
      console.log(`[Worker ${workerIndex}] Inserting ${recordsToInsert.length} records into ${tableName} with columns:`, firstRecordKeys.slice(0, 10).join(', '), firstRecordKeys.length > 10 ? '...' : '');
    }

    // Insert new data
    let insertError = null;
    
    // Try insert with current mapping
    const { error: firstInsertError } = await supabase
      .from(tableName)
      .insert(recordsToInsert);
    
    insertError = firstInsertError;
    
    // If insert failed with column error and we used lowercase mapping (no schema detected),
    // try again with original case column names
    if (insertError && dbColumns.length === 0 && insertError.message?.includes('column')) {
      console.log(`[Worker ${workerIndex}] Insert failed with column error, retrying with original case column names`);
      const originalCaseRecords = (records as Record<string, unknown>[]).map((record: Record<string, unknown>) => {
        const processedRecord: Record<string, unknown> = {};
        for (const csvKey in record) {
          // Use original CSV column name (no mapping)
          let value = record[csvKey];
          
          // Convert string numbers to actual numbers
          if (typeof value === 'string') {
            const trimmedValue = value.trim();
            if (trimmedValue !== '') {
              const num = Number(trimmedValue);
              if (!isNaN(num) && isFinite(num)) {
                value = num;
              }
            } else {
              value = null;
            }
          }
          
          processedRecord[csvKey] = value;
        }
        return {
          ...processedRecord,
          table_id: job.tableId,
        };
      });
      
      const { error: retryError } = await supabase
        .from(tableName)
        .insert(originalCaseRecords);
      
      if (!retryError) {
        // Success with original case!
        console.log(`[Worker ${workerIndex}] Insert succeeded with original case column names`);
        insertError = null;
      } else {
        // Still failed, use the original error
        console.error(`[Worker ${workerIndex}] Retry with original case also failed:`, retryError.message);
      }
    }

    if (insertError) {
      console.error(`[Worker ${workerIndex}] Insert error details:`, {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        tableName,
        sampleColumns: recordsToInsert.length > 0 ? Object.keys(recordsToInsert[0]).slice(0, 5) : []
      });
      throw new Error(`Failed to insert new data: ${insertError.message}`);
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

