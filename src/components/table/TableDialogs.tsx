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
import { Upload, File as FileIcon, X, Download } from "lucide-react";
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
      <DialogContent className="max-w-[90vw] sm:max-w-[85vw] md:max-w-3xl h-[90vh] p-0 gap-0 [&>button]:hidden overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          <ModularForm
            columns={columns as ModularFormColumn[]}
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
            mode={mode}
            tableId={tableId}
          />
        </div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setJobId(null);
      setQueuePosition(0);
      setEstimatedWaitTime(0);
      setStatus(null);
      setDownloadUrl(null);
      setIsSaving(false);
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
          // Store download URL and show download button
          // This ensures the file picker is triggered by a fresh user gesture
          setDownloadUrl(data.downloadUrl);
          setIsLoading(false);
          setStatus('completed');
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

  // Browser detection helper
  const detectBrowser = () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = /firefox/i.test(navigator.userAgent);
    const isChrome = /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
    const isEdge = /edg/i.test(navigator.userAgent);
    return { isSafari, isFirefox, isChrome, isEdge };
  };

  // Helper function to save file using File System Access API or fallback
  const saveFileToUserChosenLocation = async (url: string, filename: string) => {
    // Check if File System Access API is available and we're in a secure context
    const isSecureContext = window.isSecureContext;
    const hasFileSystemAccess = typeof window !== 'undefined' && 'showSaveFilePicker' in window;
    const browser = detectBrowser();
    
    console.log('=== File Save Debug Info ===');
    console.log('File save context:', { 
      isSecureContext, 
      hasFileSystemAccess, 
      browser,
      userAgent: navigator.userAgent,
      location: window.location.href,
      protocol: window.location.protocol
    });
    console.log('===========================');

    // Try to use File System Access API if available and in secure context
    if (hasFileSystemAccess && isSecureContext) {
      console.log('Attempting to use File System Access API...');
      try {
        setIsSaving(true);
        
        // Fetch the file first
        console.log('Fetching file from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log('File fetched successfully, size:', blob.size);

        // Show save file picker - this allows user to choose folder and filename
        // This MUST be called directly from a user gesture (button click)
        console.log('Calling showSaveFilePicker with options:', {
          suggestedName: filename,
          types: [{
            description: 'RDF Files',
            accept: {
              'application/octet-stream': ['.rdf'],
              'application/x-rdf': ['.rdf'],
            },
          }]
        });
        
        // Ensure we're calling this synchronously from user gesture
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'RDF Files',
            accept: {
              'application/octet-stream': ['.rdf'],
              'application/x-rdf': ['.rdf'],
            },
          }],
        });
        
        console.log('File picker dialog should have appeared. File handle:', fileHandle);

        console.log('File handle obtained, writing file...');
        // Write the file to the user-selected location
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        console.log('File saved successfully to user-selected location');
        setIsSaving(false);
        return true; // Success
      } catch (error: unknown) {
        setIsSaving(false);
        
        // If user cancels the file picker, don't show an error
        if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
          console.log('User cancelled file save dialog');
          return false; // User cancelled
        }
        
        // Log specific error types for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorName = error && typeof error === 'object' && 'name' in error ? error.name : 'Unknown';
        console.error('File System Access API failed:', { 
          error: errorMessage, 
          name: errorName,
          errorObject: error 
        });
        
        // Show user-friendly error message
        if (errorName === 'SecurityError') {
          toast.error('Security error: File System Access API requires HTTPS and user interaction.');
        } else if (errorName === 'NotAllowedError') {
          toast.error('Permission denied: Please allow file access when prompted.');
        } else {
          toast.error(`Failed to save file: ${errorMessage}`);
        }
        
        // Fall through to fallback
      }
    } else {
      // Log why we're not using File System Access API
      if (!isSecureContext) {
        console.warn('File System Access API requires HTTPS. Using fallback download method.');
        toast.info('For folder selection, please use HTTPS. Using default download location.');
      } else if (!hasFileSystemAccess) {
        console.warn('File System Access API not supported in this browser. Using fallback download method.');
        
        // Show browser-specific helpful messages
        if (browser.isSafari) {
          toast.info(
            'Safari doesn\'t support folder selection. Use Chrome or Edge, or configure Safari: Preferences > General > File download location > "Ask for each download"'
          );
        } else if (browser.isFirefox) {
          toast.info('Firefox doesn\'t support folder selection. Please use Chrome or Edge for this feature.');
        }
      }
    }

    // Fallback: Use traditional download (browser's default download location)
    // Note: This doesn't allow folder selection, but works in all browsers
    // For browsers that support it, we can try to trigger "Save As" by using a blob URL
    console.log('Using fallback download method');
    try {
      setIsSaving(true);
      
      // Try to fetch and create a blob URL to potentially trigger "Save As" dialog
      // Some browsers show "Save As" when downloading blob URLs
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          // Clean up blob URL and anchor element
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            setIsSaving(false);
          }, 100);
          
          // Show helpful message for browsers that don't support folder selection
          if (browser.isSafari) {
            toast.info('File downloading. For folder selection, use Chrome or Edge, or configure Safari: Preferences > General > File download location > "Ask for each download"');
          } else if (browser.isFirefox) {
            toast.info('File downloading. For folder selection, please use Chrome or Edge.');
          }
          
          return true;
        }
      } catch (blobError) {
        console.warn('Blob URL method failed, trying direct download:', blobError);
      }
      
      // Fallback to direct URL download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(a);
        setIsSaving(false);
      }, 100);
      
      return true;
    } catch (fallbackError) {
      setIsSaving(false);
      console.error('Fallback download also failed:', fallbackError);
      toast.error('Failed to download file. Please try right-clicking the link and selecting "Save As".');
      return false;
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
        setDownloadUrl(data.downloadUrl);
        setIsLoading(false);
        setStatus('completed');
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
            Export your table data to an RDF file.
            {(() => {
              const browser = typeof window !== 'undefined' ? detectBrowser() : { isSafari: false, isFirefox: false, isChrome: false, isEdge: false };
              const hasFileSystemAccess = typeof window !== 'undefined' && 'showSaveFilePicker' in window;
              const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
              
              if (hasFileSystemAccess && isSecureContext) {
                return (
                  <span className="block mt-1 text-xs text-green-600 dark:text-green-400">
                    You&apos;ll be able to choose where to save it on your computer.
                  </span>
                );
              } else if (browser.isSafari) {
                return (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Safari doesn&apos;t support folder selection. Use Chrome or Edge, or configure Safari: Preferences &gt; General &gt; File download location &gt; &quot;Ask for each download&quot;
                  </span>
                );
              } else if (browser.isFirefox) {
                return (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Firefox doesn&apos;t support folder selection. Please use Chrome or Edge for this feature.
                  </span>
                );
              } else if (!isSecureContext) {
                return (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Folder selection requires HTTPS. Using default download location.
                  </span>
                );
              } else {
                return (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    For folder selection, use Chrome or Edge browser. Other browsers will save to your default download folder.
                  </span>
                );
              }
            })()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          {status === 'completed' && downloadUrl && (
            <div className="space-y-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Export completed successfully!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Click the button below to choose where to save the file on your computer.
              </p>
              {typeof window !== 'undefined' && (() => {
                const hasAPI = 'showSaveFilePicker' in window;
                const isSecure = window.isSecureContext;
                const browser = detectBrowser();
                
                if (!hasAPI || !isSecure) {
                  return (
                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs">
                      {!isSecure ? (
                        <p className="text-amber-800 dark:text-amber-200">
                          ⚠️ Folder selection requires HTTPS. Currently using: {window.location.protocol}
                        </p>
                      ) : browser.isSafari ? (
                        <p className="text-amber-800 dark:text-amber-200">
                          ⚠️ Safari doesn&apos;t support folder selection. Use Chrome or Edge for this feature.
                        </p>
                      ) : browser.isFirefox ? (
                        <p className="text-amber-800 dark:text-amber-200">
                          ⚠️ Firefox doesn&apos;t support folder selection. Use Chrome or Edge for this feature.
                        </p>
                      ) : (
                        <p className="text-amber-800 dark:text-amber-200">
                          ⚠️ Your browser doesn&apos;t support folder selection. Use Chrome or Edge.
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
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
          <Button variant="outline" onClick={onClose} disabled={isLoading && !downloadUrl}>
            {downloadUrl ? "Close" : "Cancel"}
          </Button>
          {downloadUrl ? (
            <Button 
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (downloadUrl && !isSaving) {
                  console.log('Button clicked, starting save process...');
                  console.log('Download URL:', downloadUrl);
                  console.log('Browser support check:', {
                    hasFileSystemAccess: 'showSaveFilePicker' in window,
                    isSecureContext: window.isSecureContext,
                    userAgent: navigator.userAgent
                  });
                  
                  try {
                    const success = await saveFileToUserChosenLocation(downloadUrl, `${tableName}.rdf`);
                    console.log('Save result:', success);
                    if (success) {
                      toast.success('File saved successfully');
                      onSuccess?.();
                      onClose();
                    }
                  } catch (err) {
                    console.error('Error in save handler:', err);
                    toast.error('Failed to save file. Check console for details.');
                  }
                }
              }}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 !text-white dark:!text-white"
              disabled={isSaving}
            >
              <Download className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Choose Save Location'}
            </Button>
          ) : (
            <Button 
              onClick={handleExport}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
              disabled={isLoading || !!error}
            >
              {isLoading ? "Exporting..." : "Export"}
            </Button>
          )}
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