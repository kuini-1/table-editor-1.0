import { createClient } from '@/lib/supabase/server';
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

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { tableId, tableName } = await req.json();

    if (!tableId || !tableName) {
      return NextResponse.json(
        { error: 'Table ID and name are required' },
        { status: 400 }
      );
    }

    // Validate table name
    if (!(tableName in EXPORT_COLUMNS)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      );
    }

    // Clean up existing files
    const userDir = path.join(process.cwd(), 'exports', userId);
    await cleanupExistingFiles(supabase, userId, userDir);

    // Create user directory
    fs.mkdirSync(userDir, { recursive: true });

    // Get CSV from Supabase with only specified columns for the table
    const columns = EXPORT_COLUMNS[tableName as TableName].join(',');
    const { data: csvData, error: csvError } = await supabase
      .from(tableName)
      .select(columns)
      .eq('table_id', tableId)
      .csv();

    if (csvError) {
      console.error('Supabase CSV error:', csvError);
      return NextResponse.json(
        { error: 'Failed to generate CSV' },
        { status: 500 }
      );
    }

    // Write CSV to file
    const csvPath = path.join(userDir, `${tableName}.csv`);
    fs.writeFileSync(csvPath, csvData);

    // Try to acquire the lock
    const lockAcquired = await acquireLock();
    if (!lockAcquired) {
      // Clean up and return error if we couldn't get the lock
      fs.unlinkSync(csvPath);
      fs.rmdirSync(userDir);
      return NextResponse.json(
        { error: 'Server is busy, please try again later' },
        { status: 503 }
      );
    }

    try {
      // Execute the external program
      const exePath = path.join(process.cwd(), 'exports', 'export.exe');
      await execAsync(`${exePath} ${tableName} ${userId}`);
    } catch (execError: any) {
      console.error('Execution error:', execError);
      return NextResponse.json(
        { error: 'Failed to process export' },
        { status: 500 }
      );
    } finally {
      // Always release the lock
      releaseLock();
    }

    // Check if .rdf file was created
    const rdfPath = path.join(userDir, `${tableName}.rdf`);
    if (!fs.existsSync(rdfPath)) {
      return NextResponse.json(
        { error: 'RDF file was not generated' },
        { status: 500 }
      );
    }

    // Upload .rdf file to Supabase Storage
    const rdfContent = fs.readFileSync(rdfPath);
    const storagePath = `${userId}/${tableName}.rdf`;
    
    const { error: uploadError } = await supabase.storage
      .from('exports')
      .upload(storagePath, rdfContent, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload RDF file' },
        { status: 500 }
      );
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
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 