import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModularForm, Column as ModularFormColumn } from "./ModularForm";
import { cn } from "@/lib/utils";
import { Upload, File as FileIcon, X } from "lucide-react";
import { toast } from "sonner";

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
  validation?: z.ZodTypeAny;
}

interface BaseFormData {
  table_id: string;
  [key: string]: string | number | boolean;
}

export interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tableId: string;
  tableName: string;
}

export function ImportDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  tableId,
  tableName 
}: ImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null);

  // Reset file state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setError(null);
      setJobId(null);
      setQueuePosition(0);
      setEstimatedWaitTime(0);
      setStatus(null);
    }
  }, [isOpen]);

  // Poll job status
  useEffect(() => {
    if (!jobId || !isOpen) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/conversion/status?jobId=${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to get job status');
        }

        const data = await response.json();
        setQueuePosition(data.position || 0);
        setEstimatedWaitTime(data.estimatedWaitTime || 0);
        setStatus(data.status);

        if (data.status === 'completed') {
          setIsLoading(false);
          toast.success('Data imported successfully');
          onSuccess?.();
          onClose();
        } else if (data.status === 'failed') {
          setIsLoading(false);
          setError(data.error || 'Import failed');
          toast.error(data.error || 'Import failed');
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    };

    const interval = setInterval(pollStatus, 1500); // Poll every 1.5 seconds
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [jobId, isOpen, onSuccess, onClose]);

  const validateFile = (file: File) => {
    const allowedExtensions = ['.rdf'];  // Only allow RDF files
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      setError(`Only ${allowedExtensions.join(', ')} files are supported`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (newFile: File) => {
    if (!newFile) return;
    
    if (!validateFile(newFile)) {
      return;
    }

    setFile(newFile);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('tableId', tableId);
      formData.append('tableName', tableName);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details || errorData.error || 'Failed to import data';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setJobId(data.jobId);
      setQueuePosition(data.position || 0);
      setEstimatedWaitTime(data.estimatedWaitTime || 0);
      setStatus(data.status || 'pending');

      if (data.status === 'completed') {
        // Job completed immediately (shouldn't happen, but handle it)
        setIsLoading(false);
        toast.success('Data imported successfully');
        onSuccess?.();
        onClose();
      } else {
        // Job is queued or processing, polling will handle completion
        toast.info('Import job queued. Processing...');
      }
    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const clearFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFile(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[85vw] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a RDF file to import data into your table.
            <br />
            Any existing data in the table will be replaced, so be careful.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div
            className={cn(
              "relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-lg border-2 border-dashed transition-colors duration-200 ease-in-out",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              file && !error && "border-primary/50 bg-primary/5",
              error && "border-destructive/50 bg-destructive/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".rdf"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex items-center gap-2 p-4">
                <FileIcon className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={clearFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-lg font-medium">
                  Drag and drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports .rdf files
                </p>
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {jobId && status && status !== 'completed' && status !== 'failed' && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm capitalize">{status}</span>
              </div>
              {queuePosition > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Position in queue:</span>
                  <span className="text-sm font-medium">{queuePosition}</span>
                </div>
              )}
              {estimatedWaitTime > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated wait:</span>
                  <span className="text-sm font-medium">
                    {Math.ceil(estimatedWaitTime / 1000)}s
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {file && (
            <Button 
              onClick={handleImport}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
              disabled={isLoading || !!error}
            >
              {isLoading ? "Importing..." : "Import"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {itemName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FormDialogProps<T extends BaseFormData> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  columns: Column[];
  initialData?: Partial<T>;
  mode: 'add' | 'edit' | 'duplicate';
  tableId: string;
}

export function FormDialog<T extends BaseFormData>({
  isOpen,
  onClose,
  onSubmit,
  columns,
  initialData,
  mode,
  tableId,
}: FormDialogProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[85vw] md:max-w-3xl h-[90vh] overflow-hidden">
        <ModularForm
          columns={columns as ModularFormColumn[]}
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          mode={mode}
          tableId={tableId}
        />
      </DialogContent>
    </Dialog>
  );
}

export interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tableId: string;
  tableName: string;
}

export function ExportDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  tableId,
  tableName 
}: ExportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setJobId(null);
      setQueuePosition(0);
      setEstimatedWaitTime(0);
      setStatus(null);
    }
  }, [isOpen]);

  // Poll job status
  useEffect(() => {
    if (!jobId || !isOpen) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/conversion/status?jobId=${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to get job status');
        }

        const data = await response.json();
        setQueuePosition(data.position || 0);
        setEstimatedWaitTime(data.estimatedWaitTime || 0);
        setStatus(data.status);

        if (data.status === 'completed' && data.downloadUrl) {
          // Use File System Access API to let user choose save location
          await saveFileToUserChosenLocation(data.downloadUrl, `${tableName}.rdf`);

          setIsLoading(false);
          toast.success('Data exported successfully');
          onSuccess?.();
          onClose();
        } else if (data.status === 'failed') {
          setIsLoading(false);
          setError(data.error || 'Export failed');
          toast.error(data.error || 'Export failed');
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    };

    const interval = setInterval(pollStatus, 1500); // Poll every 1.5 seconds
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [jobId, isOpen, tableName, onSuccess, onClose]);

  // Helper function to save file using File System Access API or fallback
  const saveFileToUserChosenLocation = async (url: string, filename: string) => {
    try {
      // Check if File System Access API is available (Chrome, Edge, etc.)
      if ('showSaveFilePicker' in window) {
        // Fetch the file
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch file');
        }
        const blob = await response.blob();

        // Show save file picker
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'RDF Files',
            accept: {
              'application/octet-stream': ['.rdf'],
            },
          }],
        });

        // Write the file
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // Fallback for browsers that don't support File System Access API
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error: unknown) {
      // If user cancels the file picker, don't show an error
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        return;
      }
      // Fallback to traditional download if File System Access API fails
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        table: tableName,
        table_id: tableId,
      });

      const response = await fetch(`/api/export?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details || errorData.error || 'Export failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Check if job was completed immediately (unlikely but possible)
      if (data.status === 'completed' && data.downloadUrl) {
        await saveFileToUserChosenLocation(data.downloadUrl, `${tableName}.rdf`);
        setIsLoading(false);
        toast.success('Data exported successfully');
        onSuccess?.();
        onClose();
      } else {
        // Job is queued or processing
        setJobId(data.jobId);
        setStatus(data.status || 'pending');
        if (data.position > 0) {
          toast.info(`Export queued. Position: ${data.position}`);
        } else {
          toast.info('Export processing...');
        }
      }
    } catch (error: object | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      setJobId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Table</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Export your table data to an RDF file. You&apos;ll be able to choose where to save it on your computer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          {jobId && status && status !== 'completed' && status !== 'failed' && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm capitalize">{status}</span>
              </div>
              {queuePosition > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Position in queue:</span>
                  <span className="text-sm font-medium">{queuePosition}</span>
                </div>
              )}
              {estimatedWaitTime > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated wait:</span>
                  <span className="text-sm font-medium">
                    {Math.ceil(estimatedWaitTime / 1000)}s
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
            disabled={isLoading || !!error}
          >
            {isLoading ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface ExportDialogPropsHook {
  tableId: string;
  tableName: string;
}

export function useExport({ tableId, tableName }: ExportDialogPropsHook) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return {
    openDialog,
    ExportDialog: (
      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        tableId={tableId}
        tableName={tableName}
      />
    ),
  };
} 