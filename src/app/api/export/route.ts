import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { EXPORT_COLUMNS, type TableName } from '@/config/export-columns';

const execAsync = promisify(exec);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
}

const LOCK_FILE = path.join(process.cwd(), 'exports', '.lock');
const MAX_RETRIES = 60; // Maximum number of retries (60 * 1000ms = 60 seconds max wait)
const RETRY_INTERVAL = 1000; // 1 second between retries

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials');
  }

  return createServiceClient(supabaseUrl, serviceRoleKey);
}

async function verifyConvertExecutable() {
  const exePath = path.join(process.cwd(), 'exports', 'Convert.exe');
  
  if (!fs.existsSync(exePath)) {
    return false;
  }

  try {
    const stats = fs.statSync(exePath);
    fs.accessSync(exePath, fs.constants.X_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function acquireLock(): Promise<boolean> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Try to create the lock file
      const lockFileHandle = fs.openSync(LOCK_FILE, 'wx');
      fs.closeSync(lockFileHandle);
      return true;
    } catch (error: any) {
      // If file exists, wait and retry
      if (error.code === 'EEXIST') {
        await sleep(RETRY_INTERVAL);
        retries++;
        continue;
      }
      throw error;
    }
  }
  
  return false;
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch (error) {
    console.error('Error releasing lock:', error);
  }
}

async function cleanupExistingFiles(supabase: any, userId: string, userDir: string) {
  // Clean up local directory if it exists
  if (fs.existsSync(userDir)) {
    fs.rmSync(userDir, { recursive: true, force: true });
  }

  // List all files in the user's storage folder
  const { data: files, error: listError } = await supabase.storage
    .from('exports')
    .list(userId);

  if (listError) {
    console.error('Error listing storage files:', listError);
    return;
  }

  // Delete all files in the user's storage folder
  if (files && files.length > 0) {
    const filePaths = files.map((file: StorageFile) => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from('exports')
      .remove(filePaths);

    if (deleteError) {
      console.error('Error deleting storage files:', deleteError);
    }
  }
}

async function ensureExportsBucket(supabase: any) {
  try {
    const serviceClient = getServiceClient();
    
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
    return false;
  }
}

export async function POST(req: Request) {
  if (!await verifyConvertExecutable()) {
    return NextResponse.json({
      error: 'Server configuration error',
      details: 'Conversion utility is not properly configured'
    }, { status: 500 });
  }

  try {
    const supabase = createClient();
    
    if (!await ensureExportsBucket(supabase)) {
      return NextResponse.json({
        error: 'Storage configuration error',
        details: 'Failed to configure storage bucket'
      }, { status: 500 });
    }

    // Get authenticated user data instead of session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Authentication error:', userError);
      return NextResponse.json({ 
        error: 'Authentication failed', 
        details: userError.message 
      }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ 
        error: 'No authenticated user found'
      }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError: any) {
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError.message
      }, { status: 400 });
    }

    const { tableId, tableName } = body;

    if (!tableId || !tableName) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: {
          tableId: !tableId ? 'Table ID is required' : null,
          tableName: !tableName ? 'Table name is required' : null
        }
      }, { status: 400 });
    }

    // Validate table name
    if (!(tableName in EXPORT_COLUMNS)) {
      return NextResponse.json({
        error: 'Invalid table configuration',
        details: `Table "${tableName}" is not configured for export`
      }, { status: 400 });
    }

    // Ensure exports directory exists
    const userDir = path.join(process.cwd(), 'exports', user.id);
    try {
      await cleanupExistingFiles(supabase, user.id, userDir);
      fs.mkdirSync(userDir, { recursive: true });
    } catch (fsError: any) {
      console.error('File system error:', fsError);
      return NextResponse.json({
        error: 'Failed to prepare export directory',
        details: fsError.message
      }, { status: 500 });
    }

    // Get CSV data
    const columns = EXPORT_COLUMNS[tableName as TableName].join(',');
    const { data: csvData, error: csvError } = await supabase
      .from(tableName)
      .select(columns)
      .eq('table_id', tableId)
      .csv();

    if (csvError) {
      console.error('CSV generation error:', csvError);
      return NextResponse.json({
        error: 'Failed to generate CSV',
        details: csvError.message
      }, { status: 500 });
    }

    if (!csvData) {
      return NextResponse.json({
        error: 'No data found',
        details: 'The query returned no results'
      }, { status: 404 });
    }

    // Write CSV file
    const csvPath = path.join(userDir, `${tableName}.csv`);
    try {
      fs.writeFileSync(csvPath, csvData);
    } catch (writeError: any) {
      console.error('File write error:', writeError);
      return NextResponse.json({
        error: 'Failed to write CSV file',
        details: writeError.message
      }, { status: 500 });
    }

    // Verify CSV file
    try {
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      const csvLines = csvContent.trim().split('\n');
      
      if (csvLines.length < 2) { // At least header + one data row
        throw new Error('CSV file has insufficient data');
      }
    } catch (csvError: any) {
      console.error('CSV verification failed:', csvError);
      return NextResponse.json({
        error: 'Invalid CSV data',
        details: csvError.message
      }, { status: 500 });
    }

    // Acquire lock
    const lockAcquired = await acquireLock();
    if (!lockAcquired) {
      try {
        // Clean up if lock fails
        fs.unlinkSync(csvPath);
        fs.rmdirSync(userDir);
      } catch (cleanupError: any) {
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
        throw new Error(`Conversion executable not found at: ${exePath}`);
      }

      try {
        // Execute with output capture and working directory set
        const { stdout, stderr } = await execAsync(
          `"${exePath}" "${tableName}" "${user.id}" "rdf"`, 
          { 
            cwd: workingDir,
            env: {
              ...process.env,
              PATH: `${workingDir};${process.env.PATH}`,
              CSV_PATH: csvPath, // Pass CSV path as environment variable
              OUTPUT_DIR: userDir // Pass output directory as environment variable
            }
          }
        );
      } catch (execError: any) {
        console.error('Conversion execution error:', execError);
        // Log more details about the error
        if (execError.code) console.error('Exit code:', execError.code);
        if (execError.signal) console.error('Signal:', execError.signal);
        if (execError.killed) console.error('Process was killed');
        throw new Error(`Conversion process failed: ${execError.message}`);
      }

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
      const storagePath = `${user.id}/${tableName}.rdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('exports')
        .upload(storagePath, rdfContent, {
          contentType: 'application/octet-stream',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('exports')
        .getPublicUrl(storagePath);

      // Clean up local files
      fs.unlinkSync(csvPath);
      fs.unlinkSync(rdfPath);
      fs.rmdirSync(userDir);

      return NextResponse.json({ 
        success: true,
        filePath: storagePath,
        downloadUrl: publicUrl
      });

    } catch (processError: any) {
      console.error('Processing error:', processError);
      return NextResponse.json({
        error: 'Export processing failed',
        details: processError.message
      }, { status: 500 });
    } finally {
      releaseLock();
    }

  } catch (error: any) {
    console.error('Unexpected export error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 