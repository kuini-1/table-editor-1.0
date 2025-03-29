'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTableData } from '@/hooks/useTableData';
import { TableHeader } from '@/components/table/TableHeader';
import { DataTable } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import * as z from 'zod';
import type { FormMode } from '@/components/table/ModularForm';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { hlsItemSchema } from './schema';
import { HlsItemForm } from './HlsItemForm';
import { Button } from "@/components/ui/button";

type HlsItemFormData = z.infer<typeof hlsItemSchema>;

interface HlsItemRow extends HlsItemFormData {
  id: string;
}

const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: hlsItemSchema.shape.tblidx },
  { key: 'wszname', label: 'Name', type: 'text' as const, validation: hlsItemSchema.shape.wszname },
  { key: 'wszcjiproductid', label: 'Product ID', type: 'text' as const, validation: hlsItemSchema.shape.wszcjiproductid },
  { key: 'szicon_name', label: 'Icon Name', type: 'text' as const, validation: hlsItemSchema.shape.szicon_name },
  { key: 'whlsitemtype', label: 'Item Type', type: 'number' as const, validation: hlsItemSchema.shape.whlsitemtype },
  { key: 'byhlsdurationtype', label: 'Duration Type', type: 'number' as const, validation: hlsItemSchema.shape.byhlsdurationtype },
  { key: 'dwhlsdurationtime', label: 'Duration Time', type: 'number' as const, validation: hlsItemSchema.shape.dwhlsdurationtime },
  { key: 'idxnametext', label: 'Name Text Index', type: 'number' as const, validation: hlsItemSchema.shape.idxnametext },
  { key: 'idxnotetext', label: 'Note Text Index', type: 'number' as const, validation: hlsItemSchema.shape.idxnotetext },
  { key: 'itemtblidx', label: 'Item IDX', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx },
  { key: 'bonsale', label: 'On Sale', type: 'boolean' as const, validation: hlsItemSchema.shape.bonsale },
  { key: 'byselltype', label: 'Sell Type', type: 'number' as const, validation: hlsItemSchema.shape.byselltype },
  { key: 'dwcash', label: 'Cash', type: 'number' as const, validation: hlsItemSchema.shape.dwcash },
  { key: 'bydiscount', label: 'Discount', type: 'number' as const, validation: hlsItemSchema.shape.bydiscount },
  { key: 'bystackcount', label: 'Stack Count', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount },
  { key: 'wdisplaybitflag', label: 'Display Bit Flag', type: 'number' as const, validation: hlsItemSchema.shape.wdisplaybitflag },
  { key: 'byquicklink', label: 'Quick Link', type: 'number' as const, validation: hlsItemSchema.shape.byquicklink },
  { key: 'dwpriority', label: 'Priority', type: 'number' as const, validation: hlsItemSchema.shape.dwpriority },
  { key: 'bydisplayconsumetype', label: 'Display Consume Type', type: 'number' as const, validation: hlsItemSchema.shape.bydisplayconsumetype },
  { key: 'byyadrattype', label: 'Yadrat Type', type: 'number' as const, validation: hlsItemSchema.shape.byyadrattype },
  { key: 'itemtblidx_0', label: 'Item IDX 0', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx_0 },
  { key: 'bystackcount_0', label: 'Stack Count 0', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount_0 },
  { key: 'itemtblidx_1', label: 'Item IDX 1', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx_1 },
  { key: 'bystackcount_1', label: 'Stack Count 1', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount_1 },
  { key: 'itemtblidx_2', label: 'Item IDX 2', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx_2 },
  { key: 'bystackcount_2', label: 'Stack Count 2', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount_2 },
  { key: 'itemtblidx_3', label: 'Item IDX 3', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx_3 },
  { key: 'bystackcount_3', label: 'Stack Count 3', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount_3 },
  { key: 'itemtblidx_4', label: 'Item IDX 4', type: 'number' as const, validation: hlsItemSchema.shape.itemtblidx_4 },
  { key: 'bystackcount_4', label: 'Stack Count 4', type: 'number' as const, validation: hlsItemSchema.shape.bystackcount_4 },
];

export default function HlsItemPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_hls_item_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'HLS Item Table',
    type: 'hls',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<HlsItemRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const {
    data,
    error,
    totalRows,
    page,
    pageSize,
    filters,
    selectedRows,
    handleAddRow,
    handleEditRow,
    handleDeleteRow,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<HlsItemRow>({
    config: {
      tableName,
      columns,
    },
    tableId,
  });

  const handleExport = useExport({ tableId, tableName });

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
        title={selectedTable?.name || 'HLS Item Table'}
        description="Manage HLS items and their properties"
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setFormMode('add');
          setSelectedRow(null);
          setIsFormOpen(true);
        }}
        onImport={() => setIsImportDialogOpen(true)}
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
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            setSelectedRow(row as HlsItemRow);
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
          className="w-[100vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[50vw] bg-gray-900 border-gray-800 p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
              {formMode === 'add' ? 'Add HLS Item' : 
               formMode === 'edit' ? 'Edit HLS Item' : 
               'Duplicate HLS Item'}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formMode === 'add' ? 'Create a new HLS item with the details below.' :
               formMode === 'edit' ? 'Modify the HLS item values for this entry.' :
               'Create a new entry based on the selected HLS item data.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <HlsItemForm
              initialData={selectedRow ?? undefined}
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
              onCancel={() => {
                setSelectedRow(null);
                setIsFormOpen(false);
              }}
              mode={formMode}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
            />
          </div>

          <SheetFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRow(null);
                setIsFormOpen(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }}
            >
              {formMode === 'add' ? 'Add HLS Item' :
               formMode === 'edit' ? 'Save Changes' :
               'Duplicate HLS Item'}
            </Button>
          </SheetFooter>
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
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={refreshData}
        tableId={tableId}
        tableName="table_hls_item_data"
      />
    </div>
  );
} 