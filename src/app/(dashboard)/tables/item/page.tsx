"use client";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/table/DataTable";
import { useTableData } from "@/hooks/useTableData";
import { useEditingSession } from "@/hooks/useEditingSession";
import { useEditingIndicators } from "@/hooks/useEditingIndicators";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, ExportDialog } from '@/components/table/TableDialogs';
import { EditConflictWarning } from '@/components/table/EditConflictWarning';
import { EditingIndicator } from '@/components/table/EditingIndicator';
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { itemTableSchema, columns } from "./schema";
import ItemForm from "./ItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import React from "react";

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
    loading,
    error,
    totalRows,
    page,
    pageSize,
    filters,
    selectedRows,
    isFiltering,
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
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const supabase = createClient();

  // Get current user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id);
    };
    fetchUserId();
  }, [supabase]);

  // Track editing session when edit form is open
  useEditingSession({
    tableId,
    rowId: formMode === 'edit' && selectedRow ? selectedRow.id : null,
    sessionType: 'editing',
    enabled: isFormOpen && formMode === 'edit' && !!selectedRow,
  });

  // Get real-time editing indicators
  const {
    viewing,
    editing,
    getOtherUsersEditingRow,
  } = useEditingIndicators({
    tableId,
    enabled: !!tableId,
  });

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


  const handleFormSubmit = useMemo(() => (data: ItemTableFormData) => {
    if (formMode === 'add') {
      handleAddRow(data);
    } else if (formMode === 'edit' && selectedRow) {
      handleEditRow(selectedRow.id, data);
    } else if (formMode === 'duplicate' && selectedRow) {
      handleAddRow(data); // For duplicate, add as new row
    }
    // Close the form after submission
    setIsFormOpen(false);
    setSelectedRow(null);
  }, [formMode, selectedRow, handleAddRow, handleEditRow]);

  if (loading) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

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
    <div className="flex flex-col h-screen bg-gray-900">
      <TableHeader
        title={selectedTable?.name || 'Item Table'}
        description={
          <div className="flex items-center gap-2">
            <span>Manage items and their properties</span>
            <EditingIndicator sessions={viewing} type="viewing" currentUserId={currentUserId} />
          </div>
        }
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={handleAdd}
        onImport={handleImport}
        onExport={() => setIsExportDialogOpen(true)}
        onRefresh={refreshData}
        onBulkDelete={handleBulkDelete}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
        isFiltering={isFiltering}
      />
      
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          editingSessions={editing}
          currentUserId={currentUserId}
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
          className="w-[100vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] bg-gray-900 border-gray-800 p-0 flex flex-col max-w-[95vw]"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <SheetTitle className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
              {formMode === 'add' ? 'Add Item' : 
               formMode === 'edit' ? 'Edit Item' : 'Duplicate Item'}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
            {formMode === 'edit' && selectedRow && (
              <div className="px-6 pt-4">
                <EditConflictWarning
                  sessions={getOtherUsersEditingRow(selectedRow.id, currentUserId)}
                  currentUserId={currentUserId}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedRow(null);
                  }}
                />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <ItemForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                mode={formMode}
                initialData={selectedRow || undefined}
                onSubmit={handleFormSubmit}
                tableId={tableId}
              />
            </div>
          </div>
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
        itemName={selectedRow?.wszNameText || "this item"}
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

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        tableId={tableId}
        tableName={tableName}
      />
    </div>
  );
} 