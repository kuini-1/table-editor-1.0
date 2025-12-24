import { NextResponse } from 'next/server';
import { conversionQueue } from '@/lib/queue/conversion-queue';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({
      error: 'Missing required parameter',
      details: 'jobId is required'
    }, { status: 400 });
  }

  try {
    const job = conversionQueue.getJob(jobId);
    
    if (!job) {
      return NextResponse.json({
        error: 'Job not found',
        details: `Job with ID ${jobId} does not exist`
      }, { status: 404 });
    }

    const queueStatus = conversionQueue.getQueueStatus(jobId);

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      position: queueStatus?.position || 0,
      totalInQueue: queueStatus?.totalInQueue || 0,
      estimatedWaitTime: queueStatus?.estimatedWaitTime || 0,
      downloadUrl: job.downloadUrl,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    });
  } catch (error: object | unknown) {
    console.error('Error getting job status:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

