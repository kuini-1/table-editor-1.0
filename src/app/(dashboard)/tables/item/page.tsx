"use client";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/table/DataTable";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useStore } from "@/lib/store";
import { itemTableSchema, columns } from "./schema";
import ItemForm from "./ItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import React from "react";
import { Button } from "@/components/ui/button";

type ItemTableFormData = z.infer<typeof itemTableSchema>;

interface ItemTableRow extends ItemTableFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

export default function ItemTablePage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_item_data';
  const { userProfile } = useStore();
  
  // Memoize selected table to prevent unnecessary re-renders
  const selectedTable = useMemo(() => 
    userProfile?.data?.id === tableId ? {
      id: tableId,
      name: 'Item Table',
      type: 'item',
    } : undefined,
    [userProfile?.data?.id, tableId]
  );
  
  // Use table data hook
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
    handleBulkDelete,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<ItemTableRow>({
    config: {
      tableName,
      columns,
    },
    tableId,
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ItemTableRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleAdd = useMemo(() => () => {
    setFormMode('add');
    setSelectedRow(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useMemo(() => (row: ItemTableRow) => {
    setFormMode('edit');
    setSelectedRow(row);
    setIsFormOpen(true);
  }, []);

  const handleDuplicate = useMemo(() => (row: ItemTableRow) => {
    setFormMode('duplicate');
    setSelectedRow(row);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useMemo(() => (row: ItemTableRow) => {
    setSelectedRow(row);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleImport = useMemo(() => () => {
    setIsImportDialogOpen(true);
  }, []);

  const handleExport = useExport({ tableId, tableName });

  const handleFormSubmit = useMemo(() => (data: ItemTableFormData) => {
    if (formMode === 'add') {
      handleAddRow(data);
    } else if (formMode === 'edit' && selectedRow) {
      handleEditRow(selectedRow.id, data);
    } else if (formMode === 'duplicate' && selectedRow) {
      handleDuplicate(selectedRow);
    }
  }, [formMode, selectedRow, handleAddRow, handleEditRow, handleDuplicate]);

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
        title={selectedTable?.name || 'Item Table'}
        description="Manage items and their properties"
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={handleAdd}
        onImport={handleImport}
        onExport={handleExport}
        onRefresh={refreshData}
        onBulkDelete={handleBulkDelete}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />
      
      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
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
              {formMode === 'add' ? 'Add Item' : 
               formMode === 'edit' ? 'Edit Item' : 'Duplicate Item'}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formMode === 'add' ? 'Create a new item with the details below.' :
               formMode === 'edit' ? 'Modify the item properties.' :
               'Create a new item based on the selected item data.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <ItemForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={handleFormSubmit}
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
              {formMode === 'add' ? 'Add Item' :
               formMode === 'edit' ? 'Save Changes' :
               'Duplicate Item'}
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
        itemName={selectedRow?.name || "this item"}
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={() => {
          setIsImportDialogOpen(false);
          refreshData();
        }}
        tableName={tableName}
        tableId={tableId}
      />
    </div>
  );
} 