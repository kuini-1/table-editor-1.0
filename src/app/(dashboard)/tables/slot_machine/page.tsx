'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useTableData } from '@/hooks/useTableData';
import { TableHeader } from '@/components/table/TableHeader';
import { DataTable } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog } from '@/components/table/TableDialogs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { slotMachineSchema } from './schema';
import { SlotMachineForm } from './SlotMachineForm';
import type { FormMode } from '@/components/table/ModularForm';
import { z } from 'zod';

type SlotMachineFormData = z.infer<typeof slotMachineSchema>;

interface SlotMachineRow extends SlotMachineFormData {
  id: string;
}

const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: slotMachineSchema.shape.tblidx },
  { key: 'dwname', label: 'Name', type: 'text' as const, validation: slotMachineSchema.shape.dwname },
  { key: 'wsznametext', label: 'Display Name', type: 'text' as const, validation: slotMachineSchema.shape.wsznametext },
  { key: 'szfile_name', label: 'File Name', type: 'text' as const, validation: slotMachineSchema.shape.szfile_name },
  { key: 'bycoin', label: 'Coin', type: 'number' as const, validation: slotMachineSchema.shape.bycoin },
  { key: 'bonoff', label: 'On/Off', type: 'number' as const, validation: slotMachineSchema.shape.bonoff },
  { key: 'bytype', label: 'Type', type: 'number' as const, validation: slotMachineSchema.shape.bytype },
  { key: 'wfirstwincoin', label: 'First Win Coin', type: 'number' as const, validation: slotMachineSchema.shape.wfirstwincoin },
];

const formTheme = {
  title: {
    text: {
      add: "Add Slot Machine",
      edit: "Edit Slot Machine",
      duplicate: "Duplicate Slot Machine"
    }
  },
  description: {
    text: {
      add: "Create a new slot machine entry with the details below.",
      edit: "Modify the slot machine values for this entry.",
      duplicate: "Create a new entry based on the selected slot machine data."
    }
  },
} as const;

export default function SlotMachinePage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Slot Machine Table',
    type: 'slot_machine',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<SlotMachineRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

  const {
    data,
    loading,
    error,
    totalRows,
    page,
    pageSize,
    filters,
    selectedRows,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleDuplicateRow,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<SlotMachineRow>({
    config: {
      tableName: 'table_slot_machine_data',
      columns,
    },
    tableId,
  });

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileToImport(file);
        setIsImportDialogOpen(true);
      }
    };
    input.click();
  };

  const handleImportConfirm = async () => {
    if (!fileToImport) return;

    const formData = new FormData();
    formData.append('file', fileToImport);
    formData.append('table_id', tableId);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      toast.success('Data imported successfully');
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to import data');
    } finally {
      setFileToImport(null);
      setIsImportDialogOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export?table=slot_machine&table_id=${tableId}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slot_machine_table.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export data');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorDisplay 
          message={error} 
          onRetry={refreshData} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <TableHeader
        title={selectedTable?.name || 'Slot Machine Table'}
        description="Manage slot machine entries and their properties"
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setFormMode('add');
          setSelectedRow(null);
          setIsFormOpen(true);
        }}
        onImport={handleImport}
        onExport={handleExport}
        onRefresh={refreshData}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onSelectAll={(checked) => {
            if (checked) {
              handleRowSelection('all');
            } else {
              handleRowSelection('none');
            }
          }}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            const { id, ...rest } = row;
            setSelectedRow({ ...rest, id: '' } as SlotMachineRow);
            setFormMode('duplicate');
            setIsFormOpen(true);
          }}
          onDelete={(row) => {
            setSelectedRow(row);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <TablePagination
        currentPage={page}
        currentPageSize={pageSize}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent 
          side="right" 
          className="w-[100vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[50vw] bg-gray-900 border-gray-800 p-0"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
              {formTheme.title.text[formMode]}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formTheme.description.text[formMode]}
            </SheetDescription>
          </SheetHeader>
          <SlotMachineForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            mode={formMode === 'duplicate' ? 'add' : formMode}
            initialData={selectedRow || undefined}
            onSubmit={(data) => {
              switch (formMode) {
                case 'add':
                  handleAddRow(data);
                  break;
                case 'edit':
                  if (selectedRow?.id) {
                    handleEditRow(selectedRow.id, data);
                  }
                  break;
                case 'duplicate':
                  handleAddRow(data);
                  break;
              }
              setIsFormOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedRow) {
            handleDeleteRow(selectedRow.id);
            setIsDeleteDialogOpen(false);
          }
        }}
        itemName={selectedRow?.dwname || "this slot machine"}
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => {
          setFileToImport(null);
          setIsImportDialogOpen(false);
        }}
        onImport={async (file) => {
          await handleImportConfirm();
          setFileToImport(null);
          setIsImportDialogOpen(false);
        }}
        file={fileToImport}
      />
    </div>
  );
} 