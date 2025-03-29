import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import Papa from 'papaparse';
import { SupabaseClient } from '@supabase/supabase-js';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

const execAsync = promisify(exec);

// Add these helper functions from export route
const LOCK_FILE = path.join(process.cwd(), 'exports', '.lock');
const MAX_RETRIES = 60;
const RETRY_INTERVAL = 1000;

async function verifyConvertExecutable() {
  const exePath = path.join(process.cwd(), 'exports', 'Convert.exe');
  console.log('Verifying Convert.exe at:', exePath);
  if (!fs.existsSync(exePath)) {
    console.error('Convert.exe not found at:', exePath);
    return false;
  }
  try {
    fs.accessSync(exePath, fs.constants.X_OK);
    console.log('Convert.exe is executable');
    return true;
  } catch (error) {
    console.error('Convert.exe access error:', error);
    return false;
  }
}

async function acquireLock(): Promise<boolean> {
  let retries = 0;
  console.log('Attempting to acquire lock file:', LOCK_FILE);
  while (retries < MAX_RETRIES) {
    try {
      const lockFileHandle = fs.openSync(LOCK_FILE, 'wx');
      fs.closeSync(lockFileHandle);
      console.log('Lock acquired successfully');
      return true;
    } catch (error: object | unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
        console.log(`Lock acquisition attempt ${retries + 1}/${MAX_RETRIES} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        retries++;
        continue;
      }
      console.error('Lock acquisition error:', error);
      throw error;
    }
  }
  console.error('Failed to acquire lock after maximum retries');
  return false;
}

function releaseLock() {
  console.log('Attempting to release lock');
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
      console.log('Lock released successfully');
    } else {
      console.log('Lock file not found during release');
    }
  } catch (error) {
    console.error('Error releasing lock:', error);
  }
}

async function cleanupExistingFiles(supabase: SupabaseClient, userId: string, userDir: string) {
  console.log('Starting cleanup for user:', userId);
  if (fs.existsSync(userDir)) {
    console.log('Removing existing user directory:', userDir);
    fs.rmSync(userDir, { recursive: true, force: true });
  }
  
  console.log('Checking for existing files in storage');
  const { data: files, error: listError } = await supabase.storage
    .from('exports')
    .list(userId);
    
  if (listError) {
    console.error('Error listing files:', listError);
    return;
  }
  
  if (files?.length > 0) {
    console.log(`Found ${files.length} files to remove from storage`);
    const { error: removeError } = await supabase.storage
      .from('exports')
      .remove(files.map((file: StorageFile) => `${userId}/${file.name}`));
      
    if (removeError) {
      console.error('Error removing files from storage:', removeError);
    } else {
      console.log('Successfully removed files from storage');
    }
  }
}

export async function POST(req: Request) {
  console.log('Starting import process');
  
  if (!await verifyConvertExecutable()) {
    console.error('Convert.exe verification failed');
    return NextResponse.json({
      error: 'Server configuration error',
      details: 'Conversion utility is not properly configured'
    }, { status: 500 });
  }

  try {
    const supabase = createClient();
    console.log('Supabase client created');

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Authentication error:', userError);
      return NextResponse.json({ error: 'Unauthorized', details: userError.message }, { status: 401 });
    }
    if (!user) {
      console.error('No user found in session');
      return NextResponse.json({ error: 'Unauthorized', details: 'No user found in session' }, { status: 401 });
    }
    console.log('User authenticated:', user.id);

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const tableId = formData.get('tableId') as string;
    const tableName = formData.get('tableName') as string;

    console.log('Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      tableId,
      tableName
    });

    if (!file || !tableId || !tableName) {
      const missing = [];
      if (!file) missing.push('file');
      if (!tableId) missing.push('tableId');
      if (!tableName) missing.push('tableName');
      console.error('Missing required fields:', missing);
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: `Missing: ${missing.join(', ')}` 
      }, { status: 400 });
    }

    // Create user directory
    const userDir = path.join(process.cwd(), 'exports', user.id);
    try {
      console.log('Setting up user directory:', userDir);
      await cleanupExistingFiles(supabase, user.id, userDir);
      fs.mkdirSync(userDir, { recursive: true });
      console.log('User directory created successfully');
    } catch (fsError: object | unknown) {
      console.error('File system error during directory setup:', fsError);
      return NextResponse.json({
        error: 'Failed to prepare import directory',
        details: fsError instanceof Error ? fsError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Write RDF file
    const rdfPath = path.join(userDir, `${tableName}.rdf`);
    console.log('Writing RDF file to:', rdfPath);
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(rdfPath, buffer);
      console.log('RDF file written successfully');
    } catch (writeError: object | unknown) {
      console.error('Error writing RDF file:', writeError);
      return NextResponse.json({
        error: 'Failed to write RDF file',
        details: writeError instanceof Error ? writeError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Verify RDF file
    if (!fs.existsSync(rdfPath)) {
      console.error('RDF file verification failed - file does not exist');
      throw new Error('RDF file was not written');
    }
    const rdfStats = fs.statSync(rdfPath);
    console.log('RDF file details:', {
      path: rdfPath,
      size: rdfStats.size,
      exists: fs.existsSync(rdfPath)
    });

    // Acquire lock
    const lockAcquired = await acquireLock();
    if (!lockAcquired) {
      console.error('Failed to acquire lock for conversion');
      try {
        console.log('Cleaning up after lock acquisition failure');
        fs.unlinkSync(rdfPath);
        fs.rmdirSync(userDir);
      } catch (cleanupError: object | unknown) {
        console.error('Cleanup error after lock failure:', cleanupError);
      }
      return NextResponse.json({
        error: 'Server is busy',
        details: 'Could not acquire lock for conversion process. Please try again later.'
      }, { status: 503 });
    }

    try {
      // Execute conversion
      const exePath = path.join(process.cwd(), 'exports', 'Convert.exe');
      const workingDir = path.join(process.cwd(), 'exports');
      
      if (!fs.existsSync(exePath)) {
        console.error('Conversion executable not found:', exePath);
        throw new Error(`Conversion executable not found at: ${exePath}`);
      }

      try {
        console.log('Starting conversion with:', {
          command: `"${exePath}" "${tableName}" "${user.id}" "csv"`,
          workingDir,
          rdfPath,
          userDir
        });

        const { stdout, stderr } = await execAsync(
          `"${exePath}" "${tableName}" "${user.id}" "csv"`, 
          { 
            cwd: workingDir,
            env: {
              ...process.env,
              PATH: `${workingDir};${process.env.PATH}`,
              RDF_PATH: rdfPath,
              OUTPUT_DIR: userDir
            }
          }
        );
        
        console.log('Conversion stdout:', stdout);
        if (stderr) console.error('Conversion stderr:', stderr);
      } catch (execError: object | unknown) {
        console.error('Conversion execution error:', execError);
        throw new Error(`Conversion failed: ${execError instanceof Error ? execError.message : 'Unknown error'}`);
      }

      // Add delay and verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if CSV was generated
      const csvPath = path.join(userDir, `${tableName}.csv`);
      console.log('Checking for CSV file:', csvPath);
      if (!fs.existsSync(csvPath)) {
        console.error('CSV file not found after conversion');
        throw new Error('CSV file was not generated');
      }

      // Read and parse CSV
      console.log('Reading CSV file');
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      console.log('CSV Content preview:', csvContent.substring(0, 200));

      console.log('Parsing CSV content');
      const { data: records, errors, meta } = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });

      console.log('CSV parsing results:', {
        recordCount: records.length,
        errorCount: errors.length,
        firstRecord: records[0],
        meta
      });

      if (errors.length > 0) {
        console.error('CSV parsing errors:', errors);
        throw new Error(`CSV parsing error: ${errors[0].message}`);
      }

      // Delete existing data
      console.log('Deleting existing data for table:', tableName);
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('table_id', tableId);

      if (deleteError) {
        console.error('Error deleting existing data:', deleteError);
        throw new Error(`Failed to clear existing data: ${deleteError.message}`);
      }

      // Prepare records for insertion
      console.log('Preparing records for insertion');
      const recordsToInsert = (records as Record<string, unknown>[]).map((record: Record<string, unknown>) => {
        const lowercaseRecord: Record<string, unknown> = {};
        for (const key in record) {
          const lowercaseKey = key.toLowerCase();
          let value = record[key];
          
          if (typeof value === 'string') {
            const num = Number(value);
            if (!isNaN(num)) {
              value = num;
            }
          }
          
          lowercaseRecord[lowercaseKey] = value;
        }

        return {
          ...lowercaseRecord,
          table_id: tableId
        };
      });

      console.log('Insertion preparation complete:', {
        recordCount: recordsToInsert.length,
        sampleRecord: recordsToInsert[0]
      });

      // Insert new data
      console.log('Inserting records into database');
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(recordsToInsert);

      if (insertError) {
        console.error('Database insertion error:', insertError);
        throw new Error(`Failed to insert new data: ${insertError.message}`);
      }

      console.log('Data insertion completed successfully');

    } finally {
      console.log('Releasing lock');
      releaseLock();
    }

    // Clean up
    console.log('Cleaning up temporary files');
    fs.rmSync(userDir, { recursive: true, force: true });
    console.log('Cleanup completed');

    return NextResponse.json({ success: true });

  } catch (error: object | unknown) {
    console.error('Import process error:', error);
    console.error('Error stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json({
      error: 'Import failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    }, { status: 500 });
  }
} 