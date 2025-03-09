import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModularForm, Column as ModularFormColumn } from "./ModularForm";

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
  validation?: any;
}

interface BaseFormData {
  table_id: string;
  [key: string]: string | number | boolean;
}

export interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void | Promise<void>;
  file: File | null;
}

export function ImportDialog({ isOpen, onClose, onImport, file }: ImportDialogProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {file ? `Import Data from ${file.name}` : 'Import Data'}
          </DialogTitle>
          <DialogDescription>
            {file
              ? 'Are you sure you want to import data from this file? This will add new rows to your table.'
              : 'Please select a file to import data from.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {file && (
            <Button 
              onClick={() => onImport(file)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            >
              Import
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