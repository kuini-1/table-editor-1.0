import type { 
  ConversionJob, 
  ConversionJobType, 
  ConversionJobStatus,
  QueueStatus 
} from './types';

// Configuration from environment variables
const WORKER_POOL_SIZE = parseInt(process.env.CONVERSION_WORKER_POOL_SIZE || '5', 10);
const MAX_QUEUE_SIZE = parseInt(process.env.CONVERSION_QUEUE_MAX_SIZE || '50', 10);
const RATE_LIMIT_COOLDOWN = parseInt(process.env.CONVERSION_RATE_LIMIT_COOLDOWN || '20000', 10);

class ConversionQueue {
  private queue: ConversionJob[] = [];
  private jobs: Map<string, ConversionJob> = new Map();
  private rateLimits: Map<string, number> = new Map(); // key: userId:tableName:operationType
  private activeWorkers: Set<number> = new Set(); // Set of active worker indices
  private jobIdCounter = 0;
  private instanceId: string = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  /**
   * Get instance ID for debugging
   */
  getInstanceId(): string {
    return this.instanceId;
  }

  /**
   * Generate a unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${++this.jobIdCounter}`;
  }

  /**
   * Get rate limit key
   */
  private getRateLimitKey(userId: string, tableName: string, operationType: ConversionJobType): string {
    return `${userId}:${tableName}:${operationType}`;
  }

  /**
   * Check if user is rate limited for this operation
   */
  isRateLimited(userId: string, tableName: string, operationType: ConversionJobType): boolean {
    const key = this.getRateLimitKey(userId, tableName, operationType);
    const lastOperationTime = this.rateLimits.get(key);
    
    if (!lastOperationTime) {
      return false;
    }

    const timeSinceLastOperation = Date.now() - lastOperationTime;
    return timeSinceLastOperation < RATE_LIMIT_COOLDOWN;
  }

  /**
   * Record rate limit entry
   */
  recordRateLimit(userId: string, tableName: string, operationType: ConversionJobType): void {
    const key = this.getRateLimitKey(userId, tableName, operationType);
    this.rateLimits.set(key, Date.now());
    
    // Clean up after cooldown period
    setTimeout(() => {
      this.rateLimits.delete(key);
    }, RATE_LIMIT_COOLDOWN);
  }

  /**
   * Add job to queue
   */
  addJob(
    userId: string,
    tableName: string,
    tableId: string,
    type: ConversionJobType,
    filePath?: string,
    outputDir?: string
  ): ConversionJob {
    // Check if queue is full
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      throw new Error('Queue is full. Please try again later.');
    }

    const job: ConversionJob = {
      id: this.generateJobId(),
      userId,
      tableName,
      tableId,
      type,
      status: 'pending',
      createdAt: Date.now(),
      position: this.queue.length + 1,
      filePath,
      outputDir,
    };

    this.queue.push(job);
    this.jobs.set(job.id, job);
    this.updatePositions();

    // Record rate limit
    this.recordRateLimit(userId, tableName, type);

    return job;
  }

  /**
   * Get next job from queue for a worker
   */
  getNextJob(workerIndex: number): ConversionJob | null {
    if (this.activeWorkers.has(workerIndex)) {
      return null; // Worker is already processing a job
    }

    const job = this.queue.shift();
    if (!job) {
      return null;
    }

    job.status = 'processing';
    job.startedAt = Date.now();
    job.position = 0; // No longer in queue
    this.activeWorkers.add(workerIndex);
    this.updatePositions();

    return job;
  }

  /**
   * Mark job as completed
   */
  completeJob(jobId: string, downloadUrl?: string): void {
    console.log(`[Queue ${this.instanceId}] completeJob called for jobId: ${jobId}, downloadUrl: ${downloadUrl}`);
    const job = this.jobs.get(jobId);
    if (!job) {
      console.error(`[Queue ${this.instanceId}] ERROR: Job ${jobId} not found in jobs Map when trying to complete`);
      // Log all current job IDs for debugging
      const allJobIds = Array.from(this.jobs.keys());
      console.log(`[Queue ${this.instanceId}] Current job IDs in Map (${this.jobs.size} total): ${allJobIds.join(', ')}`);
      return;
    }

    job.status = 'completed';
    job.completedAt = Date.now();
    if (downloadUrl) {
      job.downloadUrl = downloadUrl;
    }

    console.log(`[Queue ${this.instanceId}] Job ${jobId} marked as completed. Status: ${job.status}, downloadUrl: ${job.downloadUrl}`);
    console.log(`[Queue ${this.instanceId}] Total jobs in Map after completion: ${this.jobs.size}`);

    // Find and remove from active workers
    for (const workerIndex of this.activeWorkers) {
      // We'll need to track which worker has which job
      // For now, we'll remove from active workers when job completes
    }
  }

  /**
   * Mark job as failed
   */
  failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    job.status = 'failed';
    job.completedAt = Date.now();
    job.error = error;
  }

  /**
   * Release worker (called when worker finishes processing)
   */
  releaseWorker(workerIndex: number): void {
    this.activeWorkers.delete(workerIndex);
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): ConversionJob | undefined {
    const job = this.jobs.get(jobId);
    if (!job) {
      console.log(`[Queue] getJob: Job ${jobId} not found. Total jobs in Map: ${this.jobs.size}`);
    }
    return job;
  }

  /**
   * Get queue status for a job
   */
  getQueueStatus(jobId: string): QueueStatus | null {
    const job = this.jobs.get(jobId);
    if (!job) {
      return null;
    }

    if (job.status === 'completed' || job.status === 'failed') {
      return {
        position: 0,
        totalInQueue: this.queue.length,
        estimatedWaitTime: 0,
        status: job.status,
      };
    }

    if (job.status === 'processing') {
      return {
        position: 0,
        totalInQueue: this.queue.length,
        estimatedWaitTime: 0,
        status: 'processing',
      };
    }

    // Calculate estimated wait time (average 5 seconds per job)
    const avgJobTime = 5000;
    const estimatedWaitTime = job.position * avgJobTime;

    return {
      position: job.position,
      totalInQueue: this.queue.length + this.activeWorkers.size,
      estimatedWaitTime,
      status: job.status,
    };
  }

  /**
   * Update positions of jobs in queue
   */
  private updatePositions(): void {
    this.queue.forEach((job, index) => {
      job.position = index + 1;
    });
  }

  /**
   * Get available worker index
   */
  getAvailableWorkerIndex(): number | null {
    for (let i = 1; i <= WORKER_POOL_SIZE; i++) {
      if (!this.activeWorkers.has(i)) {
        return i;
      }
    }
    return null;
  }

  /**
   * Clean up old completed/failed jobs (older than 5 minutes)
   */
  cleanupOldJobs(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    let deletedCount = 0;
    for (const [jobId, job] of this.jobs.entries()) {
      if (
        (job.status === 'completed' || job.status === 'failed') &&
        job.completedAt &&
        job.completedAt < fiveMinutesAgo
      ) {
        this.jobs.delete(jobId);
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      console.log(`[Queue] Cleaned up ${deletedCount} old jobs. Remaining jobs: ${this.jobs.size}`);
    }
  }
  
  /**
   * Debug method to get all job IDs
   */
  getAllJobIds(): string[] {
    return Array.from(this.jobs.keys());
  }
}

// Singleton instance
export const conversionQueue = new ConversionQueue();

// Cleanup old jobs every minute
setInterval(() => {
  conversionQueue.cleanupOldJobs();
}, 60 * 1000);

