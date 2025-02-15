import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import Papa from 'papaparse';

const execAsync = promisify(exec);

// Add these helper functions from export route
const LOCK_FILE = path.join(process.cwd(), 'exports', '.lock');
const MAX_RETRIES = 60;
const RETRY_INTERVAL = 1000;

async function verifyConvertExecutable() {
  const exePath = path.join(process.cwd(), 'exports', 'Convert.exe');
  if (!fs.existsSync(exePath)) return false;
  try {
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
      const lockFileHandle = fs.openSync(LOCK_FILE, 'wx');
      fs.closeSync(lockFileHandle);
      return true;
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
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
  if (fs.existsSync(userDir)) {
    fs.rmSync(userDir, { recursive: true, force: true });
  }
  const { data: files, error: listError } = await supabase.storage
    .from('exports')
    .list(userId);
  if (listError) return;
  if (files?.length > 0) {
    await supabase.storage
      .from('exports')
      .remove(files.map((file: any) => `${userId}/${file.name}`));
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

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const tableId = formData.get('tableId') as string;
    const tableName = formData.get('tableName') as string;

    if (!file || !tableId || !tableName) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create user directory
    const userDir = path.join(process.cwd(), 'exports', user.id);
    try {
      await cleanupExistingFiles(supabase, user.id, userDir);
      fs.mkdirSync(userDir, { recursive: true });
    } catch (fsError: any) {
      return NextResponse.json({
        error: 'Failed to prepare import directory',
        details: fsError.message
      }, { status: 500 });
    }

    // Write RDF file
    const rdfPath = path.join(userDir, `${tableName}.rdf`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(rdfPath, buffer);

    // Verify RDF file
    if (!fs.existsSync(rdfPath)) {
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
      try {
        fs.unlinkSync(rdfPath);
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
      } catch (execError: any) {
        throw new Error(`Conversion failed: ${execError.message}`);
      }

      // Add delay and verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if CSV was generated
      const csvPath = path.join(userDir, `${tableName}.csv`);
      if (!fs.existsSync(csvPath)) {
        throw new Error('CSV file was not generated');
      }

      // Read and parse CSV
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      console.log('CSV Content:', csvContent.substring(0, 200)); // Log first 200 chars

      const { data: records, errors, meta } = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true // Automatically convert numbers
      });

      console.log('Parsed Records:', records.length);
      console.log('First Record:', records[0]);
      console.log('Parse Meta:', meta);

      if (errors.length > 0) {
        throw new Error(`CSV parsing error: ${errors[0].message}`);
      }

      // Delete existing data
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('table_id', tableId);

      if (deleteError) {
        throw new Error(`Failed to clear existing data: ${deleteError.message}`);
      }

      // Prepare records for insertion
      const recordsToInsert = records.map((record: any) => {
        // Ensure all numeric fields are numbers
        const processedRecord = { ...record };
        for (const key in processedRecord) {
          if (typeof processedRecord[key] === 'string') {
            const num = Number(processedRecord[key]);
            if (!isNaN(num)) {
              processedRecord[key] = num;
            }
          }
        }
        return {
          ...processedRecord,
          table_id: tableId
        };
      });

      console.log('Records to insert:', recordsToInsert.length);
      console.log('Sample record:', recordsToInsert[0]);

      // Insert new data
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(recordsToInsert);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Failed to insert new data: ${insertError.message}`);
      }

    } finally {
      releaseLock();
    }

    // Clean up
    fs.rmSync(userDir, { recursive: true, force: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({
      error: 'Import failed',
      details: error.message
    }, { status: 500 });
  }
} 