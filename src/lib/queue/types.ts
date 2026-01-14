export type ConversionJobType = 'import' | 'export';

export type ConversionJobStatus = 
  | 'pending'      // In queue, waiting for worker
  | 'processing'   // Currently being processed by worker
  | 'completed'    // Successfully completed
  | 'failed';      // Failed with error

export interface ConversionJob {
  id: string;
  userId: string;
  tableName: string;
  tableId: string;
  type: ConversionJobType;
  status: ConversionJobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  position: number; // Position in queue
  // Job-specific data
  filePath?: string; // For import: RDF file path, For export: CSV file path
  outputDir?: string; // User directory for output
  downloadUrl?: string; // For export: download URL after completion
  folder?: string; // Optional folder path for organizing exports
}

export interface ConversionJobResult {
  success: boolean;
  jobId: string;
  error?: string;
  downloadUrl?: string; // For export
}

export interface QueueStatus {
  position: number;
  totalInQueue: number;
  estimatedWaitTime: number; // in milliseconds
  status: ConversionJobStatus;
}

export interface RateLimitEntry {
  userId: string;
  tableName: string;
  operationType: ConversionJobType;
  lastOperationTime: number;
}

