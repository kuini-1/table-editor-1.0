import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { conversionQueue } from '@/lib/queue/conversion-queue';
import '@/lib/queue/worker'; // Ensure workers are started

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials');
  }

  return createServiceClient(supabaseUrl, serviceRoleKey);
}

async function cleanupExistingFiles(supabase: SupabaseClient, userId: string, userDir: string) {
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

async function ensureExportsBucket() {
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
    console.error('Error ensuring exports bucket:', error);
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const tableId = searchParams.get('table_id');
  const folder = searchParams.get('folder') || '';

  if (!table || !tableId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Validate folder name
  if (folder) {
    const cleanedFolder = folder.trim().replace(/^\/+|\/+$/g, '');
    if (cleanedFolder && !/^[a-zA-Z0-9\s_\-/]+$/.test(cleanedFolder)) {
      return NextResponse.json({ 
        error: 'Invalid folder name',
        details: 'Folder name can only contain letters, numbers, spaces, hyphens, underscores, and forward slashes'
      }, { status: 400 });
    }
    if (cleanedFolder.includes('..')) {
      return NextResponse.json({ 
        error: 'Invalid folder path',
        details: 'Path traversal is not allowed'
      }, { status: 400 });
    }
  }

  try {
    const supabase = createClient();
    
    if (!await ensureExportsBucket()) {
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

    // Check rate limiting
    if (conversionQueue.isRateLimited(user.id, table, 'export')) {
      console.log('Rate limited:', { userId: user.id, tableName: table, type: 'export' });
      return NextResponse.json({
        error: 'Too Many Requests',
        details: 'Please wait before exporting this table again. You can export different tables without limits.'
      }, { status: 429 });
    }

    // Ensure exports directory exists
    const userDir = path.join(process.cwd(), 'exports', user.id);
    try {
      await cleanupExistingFiles(supabase, user.id, userDir);
      fs.mkdirSync(userDir, { recursive: true });
    } catch (fsError: object | unknown) {
      console.error('File system error:', fsError);
      return NextResponse.json({
        error: 'Failed to prepare export directory',
        details: fsError instanceof Error ? fsError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Check bandwidth limit before export (5MB per export)
    try {
      const { checkBandwidthLimit } = await import('@/lib/bandwidth-tracker');
      const { allowed, error: limitError } = await checkBandwidthLimit(user.id, 5 * 1024 * 1024); // 5MB
      if (!allowed) {
        return NextResponse.json({
          error: 'Bandwidth limit exceeded',
          details: limitError || 'You have exceeded your monthly bandwidth limit. Please upgrade your plan to continue exporting.'
        }, { status: 429 });
      }
    } catch (error) {
      console.error('Error checking bandwidth limit:', error);
      // Continue with export if check fails (don't block user)
    }

    // Get CSV data - fetch all rows efficiently using parallel batches
    // Use service client for higher limits and better performance
    const serviceClient = getServiceClient();
    
    // Determine sort field (prefer tblidx if exists, otherwise id)
    // First, check what columns exist by fetching one row and get total count
    const { data: sampleRow, count: totalCount, error: countError } = await serviceClient
      .from(table)
      .select('*', { count: 'exact', head: false })
      .eq('table_id', tableId)
      .limit(1);
    
    if (countError) {
      console.error('Count query error:', countError);
      return NextResponse.json({
        error: 'Failed to count rows',
        details: countError.message
      }, { status: 500 });
    }
    
    if (!sampleRow || sampleRow.length === 0) {
      return NextResponse.json({
        error: 'No data found',
        details: 'The query returned no results'
      }, { status: 404 });
    }
    
    const sortField = sampleRow[0] && 'tblidx' in sampleRow[0] ? 'tblidx' : 'id';
    const totalRows = totalCount || 0;
    
    console.log(`[Export] Fetching ${totalRows} rows for table ${table} with table_id ${tableId}, sorting by ${sortField}`);
    
    // Use larger batch size and parallel fetching for better performance
    // Adjust concurrency based on dataset size to avoid overwhelming Supabase or connection pools
    const batchSize = 5000; // Larger batches reduce number of requests
    const numBatches = Math.ceil(totalRows / batchSize);
    // Limit concurrency: smaller datasets can use more parallelism, larger ones need to be more conservative
    // This prevents connection pool exhaustion and Supabase rate limiting
    const maxConcurrent = totalRows < 10000 ? 5 : totalRows < 50000 ? 3 : 2;
    
    // Fetch all batches in parallel (with concurrency limit)
    const fetchBatch = async (batchIndex: number): Promise<Record<string, unknown>[]> => {
      const offset = batchIndex * batchSize;
      const { data: batchData, error: batchError } = await serviceClient
        .from(table)
        .select('*')
        .eq('table_id', tableId)
        .order(sortField, { ascending: true })
        .range(offset, offset + batchSize - 1);
      
      if (batchError) {
        throw new Error(`Batch ${batchIndex} fetch error: ${batchError.message}`);
      }
      
      return batchData || [];
    };
    
    // Fetch batches with concurrency control and error handling
    const allRows: Record<string, unknown>[] = [];
    for (let i = 0; i < numBatches; i += maxConcurrent) {
      const batchPromises = [];
      for (let j = 0; j < maxConcurrent && i + j < numBatches; j++) {
        batchPromises.push(fetchBatch(i + j));
      }
      
      try {
        const batchResults = await Promise.all(batchPromises);
        const batchRows = batchResults.flat();
        allRows.push(...batchRows);
        console.log(`[Export] Fetched ${allRows.length}/${totalRows} rows (${Math.min(i + maxConcurrent, numBatches)}/${numBatches} batches, ${maxConcurrent} concurrent)...`);
        
        // Small delay between batch groups to avoid overwhelming Supabase
        // Only add delay if we have more batches to fetch
        if (i + maxConcurrent < numBatches) {
          await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between batch groups
        }
      } catch (error) {
        console.error('Parallel batch fetch error:', error);
        // Check if it's a rate limit error
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          return NextResponse.json({
            error: 'Rate limit exceeded',
            details: 'Supabase rate limit reached. Please try again in a moment.'
          }, { status: 429 });
        }
        return NextResponse.json({
          error: 'Failed to fetch data',
          details: errorMessage
        }, { status: 500 });
      }
    }
    
    if (allRows.length === 0) {
      return NextResponse.json({
        error: 'No data found',
        details: 'The query returned no results'
      }, { status: 404 });
    }
    
    console.log(`[Export] Total rows fetched: ${allRows.length}`);
    
    // Convert to CSV efficiently using array operations
    const headers = Object.keys(allRows[0]);
    const csvLines: string[] = [];
    
    // Add header row
    csvLines.push(headers.join(','));
    
    // Process rows in chunks to avoid memory issues with very large datasets
    const processRow = (row: Record<string, unknown>): string => {
      const values = headers.map(header => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        // Convert boolean to 0/1
        if (value === true || value === 'true') {
          return '1';
        }
        if (value === false || value === 'false') {
          return '0';
        }
        // Escape commas and quotes in string values
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      return values.join(',');
    };
    
    // Process all rows and build CSV string efficiently
    for (const row of allRows) {
      csvLines.push(processRow(row));
    }
    
    const csvData = csvLines.join('\n') + '\n';

    // Track bandwidth usage for export (5MB per export)
    // Use immediate flush for server-side operations to ensure updates are applied
    try {
      const { trackBandwidthUsage, flushBandwidthUpdatesImmediate } = await import('@/lib/bandwidth-tracker');
      await trackBandwidthUsage(user.id, 5 * 1024 * 1024); // 5MB
      // Force immediate flush on server-side to ensure sub owner updates are applied
      await flushBandwidthUpdatesImmediate();
    } catch (error) {
      console.error('Error tracking bandwidth for export:', error);
      // Don't fail the export if bandwidth tracking fails
    }

    // Write CSV file
    const csvPath = path.join(userDir, `${table}.csv`);
    try {
      fs.writeFileSync(csvPath, csvData);
    } catch (writeError: object | unknown) {
      console.error('File write error:', writeError);
      return NextResponse.json({
        error: 'Failed to write CSV file',
        details: writeError instanceof Error ? writeError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Verify CSV file
    try {
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      const csvLines = csvContent.trim().split('\n');
      
      if (csvLines.length < 2) { // At least header + one data row
        throw new Error('CSV file has insufficient data');
      }
    } catch (csvError: object | unknown) {
      console.error('CSV verification failed:', csvError);
      return NextResponse.json({
        error: 'Invalid CSV data',
        details: csvError instanceof Error ? csvError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Add job to queue with folder parameter
    let job;
    try {
      const cleanedFolder = folder.trim().replace(/^\/+|\/+$/g, '');
      job = conversionQueue.addJob(
        user.id,
        table,
        tableId,
        'export',
        csvPath,
        userDir,
        cleanedFolder || undefined // Pass folder if provided
      );
      console.log('Job added to queue:', job.id, cleanedFolder ? `folder: ${cleanedFolder}` : '');
    } catch (queueError: object | unknown) {
      console.error('Failed to add job to queue:', queueError);
      // Clean up files
      try {
        fs.unlinkSync(csvPath);
        fs.rmdirSync(userDir);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      return NextResponse.json({
        error: 'Queue is full',
        details: queueError instanceof Error ? queueError.message : 'Please try again later.'
      }, { status: 503 });
    }

    // Get queue status
    const queueStatus = conversionQueue.getQueueStatus(job.id);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      position: queueStatus?.position || 0,
      estimatedWaitTime: queueStatus?.estimatedWaitTime || 0,
      status: job.status
    });

  } catch (error: object | unknown) {
    console.error('Unexpected export error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}
