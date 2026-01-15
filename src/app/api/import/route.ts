import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SupabaseClient } from '@supabase/supabase-js';
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

    // Check bandwidth limit before import (5MB per import)
    try {
      const { checkBandwidthLimit } = await import('@/lib/bandwidth-tracker');
      const { allowed, error: limitError } = await checkBandwidthLimit(user.id, 5 * 1024 * 1024); // 5MB
      if (!allowed) {
        return NextResponse.json({
          error: 'Bandwidth limit exceeded',
          details: limitError || 'You have exceeded your monthly bandwidth limit. Please upgrade your plan to continue importing.'
        }, { status: 429 });
      }
    } catch (error) {
      console.error('Error checking bandwidth limit:', error);
      // Continue with import if check fails (don't block user)
    }

    // Check rate limiting
    if (conversionQueue.isRateLimited(user.id, tableName, 'import')) {
      console.log('Rate limited:', { userId: user.id, tableName, type: 'import' });
      return NextResponse.json({
        error: 'Too Many Requests',
        details: 'Please wait before importing this table again. You can import different tables without limits.'
      }, { status: 429 });
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
      return NextResponse.json({
        error: 'RDF file was not written',
        details: 'Failed to write RDF file to disk'
      }, { status: 500 });
    }

    const rdfStats = fs.statSync(rdfPath);
    console.log('RDF file details:', {
      path: rdfPath,
      size: rdfStats.size,
      exists: fs.existsSync(rdfPath)
    });

    // Add job to queue
    let job;
    try {
      job = conversionQueue.addJob(
        user.id,
        tableName,
        tableId,
        'import',
        rdfPath,
        userDir
      );
      console.log('Job added to queue:', job.id);

      // Track bandwidth usage for import (5MB per import)
      // Use immediate flush for server-side operations to ensure updates are applied
      try {
        const { trackBandwidthUsage, flushBandwidthUpdatesImmediate } = await import('@/lib/bandwidth-tracker');
        await trackBandwidthUsage(user.id, 5 * 1024 * 1024); // 5MB
        // Force immediate flush on server-side to ensure sub owner updates are applied
        await flushBandwidthUpdatesImmediate();
      } catch (error) {
        console.error('Error tracking bandwidth for import:', error);
        // Don't fail the import if bandwidth tracking fails
      }
    } catch (queueError: object | unknown) {
      console.error('Failed to add job to queue:', queueError);
      // Clean up files
      try {
        fs.unlinkSync(rdfPath);
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
    console.error('Import process error:', error);
    console.error('Error stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    return NextResponse.json({
      error: 'Import failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    }, { status: 500 });
  }
}
