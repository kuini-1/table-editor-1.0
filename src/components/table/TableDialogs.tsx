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

  // Reset file state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setError(null);
    }
  }, [isOpen]);

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
        throw new Error(errorData.error || 'Failed to import data');
      }

      toast.success('Data imported successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {file && (
            <Button 
              onClick={handleImport}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
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
  tableId: string;
  tableName: string;
}

export function useExport({ tableId, tableName }: ExportDialogProps) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export?table=${tableName}&table_id=${tableId}`);
      if (!response.ok) throw new Error('Export failed');

      const data = await response.json();
      if (!data.downloadUrl) throw new Error('No download URL provided');

      const a = document.createElement('a');
      a.href = data.downloadUrl;
      a.download = `${tableName}.rdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success('Data exported successfully');
    } catch (error: object | unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to export data');
    }
  };

  return handleExport;
} 