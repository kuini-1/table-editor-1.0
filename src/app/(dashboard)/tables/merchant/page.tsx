'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useTableData } from '@/hooks/useTableData';
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DataTable } from '@/components/table/DataTable';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useStore } from '@/lib/store';
import { merchantSchema } from './schema';
import MerchantForm from './MerchantForm';
import { ErrorDisplay } from '@/components/ErrorDisplay';

type MerchantFormData = z.infer<typeof merchantSchema>;

interface MerchantRow extends MerchantFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: 'Add New Merchant',
      edit: 'Edit Merchant',
      duplicate: 'Duplicate Merchant'
    }
  },
  description: {
    text: {
      add: 'Add a new merchant to the database.',
      edit: 'Edit the selected merchant\'s details.',
      duplicate: 'Create a new merchant based on the selected one.'
    }
  },
  button: {
    text: {
      add: 'Add Merchant',
      edit: 'Save Changes',
      duplicate: 'Duplicate Entry'
    },
    className: 'flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700',
  },
} as const;

export default function MerchantPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_merchant_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Merchant Table',
    type: 'merchant',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<MerchantRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: 'tblidx',
      label: 'ID',
      type: 'number' as const,
      validation: merchantSchema.shape.tblidx,
    },
    {
      key: 'wsznametext',
      label: 'Name',
      type: 'text' as const,
      validation: merchantSchema.shape.wsznametext,
    },
    {
      key: 'bysell_type',
      label: 'Sell Type',
      type: 'number' as const,
      validation: merchantSchema.shape.bysell_type,
    },
    {
      key: 'tab_name',
      label: 'Tab Name',
      type: 'text' as const,
      validation: merchantSchema.shape.tab_name,
    },
    {
      key: 'dwneedmileage',
      label: 'Need Mileage',
      type: 'number' as const,
      validation: merchantSchema.shape.dwneedmileage,
    },
    {
      key: 'aitem_tblidx_0',
      label: 'Item 1 ID',
      type: 'number' as const,
      validation: merchantSchema.shape.aitem_tblidx_0,
    },
    {
      key: 'aneeditemtblidx_0',
      label: 'Need Item 1 ID',
      type: 'number' as const,
      validation: merchantSchema.shape.aneeditemtblidx_0,
    },
    {
      key: 'abyneeditemstack_0',
      label: 'Need Item 1 Stack',
      type: 'number' as const,
      validation: merchantSchema.shape.abyneeditemstack_0,
    },
    {
      key: 'adwneedzenny_0',
      label: 'Need Zenny 1',
      type: 'number' as const,
      validation: merchantSchema.shape.adwneedzenny_0,
    },
  ];

  // Use the custom hook to fetch and manage data
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
    handleBulkDelete,
    handleDuplicateRow,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<MerchantRow>({
    config: {
      tableName,
      columns,
    },
    tableId,
  });

  const handleExport = useExport({ tableId, tableName });

  // Handle import dialog
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsImportDialogOpen(true);
      }
    };
    input.click();
  };

  // Handle import confirmation
  const handleImportConfirm = async (file: File) => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tableName', 'merchant');
      formData.append('tableId', tableId);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import data');
      }

      toast.success('Data imported successfully');
      refreshData();
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import data');
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
        title={selectedTable?.name || 'Merchant Table'}
        description="Manage merchants and their items"
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setSelectedRow(null);
          setFormMode('add');
          setIsFormOpen(true);
        }}
        onImport={() => setIsImportDialogOpen(true)}
        onExport={handleExport}
        onRefresh={refreshData}
        onBulkDelete={() => {
          if (selectedRows.size > 0) {
            handleDeleteRow(Array.from(selectedRows).join(','));
          }
        }}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            const { id, ...rest } = row;
            setSelectedRow({ ...rest, id: '' } as MerchantRow);
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

      {/* Merchant Form */}
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
          <MerchantForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            mode={formMode === 'duplicate' ? 'add' : formMode}
            initialData={selectedRow || undefined}
            onSubmit={(data) => {
              switch (formMode) {
                case 'add':
                  handleAddRow(data as MerchantRow);
                  break;
                case 'edit':
                  if (selectedRow?.id) {
                    handleEditRow(selectedRow.id, data as MerchantRow);
                  }
                  break;
                case 'duplicate':
                  handleAddRow(data as MerchantRow);
                  break;
              }
              setIsFormOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={refreshData}
        tableId={tableId}
        tableName={tableName}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedRow) {
            handleDeleteRow(selectedRow.id);
            setIsDeleteDialogOpen(false);
          }
        }}
        itemName={selectedRow?.wsznametext || 'this merchant'}
      />
    </div>
  );
} 