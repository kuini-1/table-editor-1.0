'use client';

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTableData } from "@/hooks/useTableData";
import { useEditingSession } from '@/hooks/useEditingSession';
import { useEditingIndicators } from '@/hooks/useEditingIndicators';
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DataTable } from "@/components/table/DataTable";
import { DeleteDialog, ImportDialog, ExportDialog } from '@/components/table/TableDialogs';
import { EditConflictWarning } from '@/components/table/EditConflictWarning';
import { EditingIndicator } from '@/components/table/EditingIndicator';
import { useStore } from "@/lib/store";
import { setItemSchema, columns as schemaColumns } from "./schema";
import SetItemForm from "./SetItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

type SetItemFormData = z.infer<typeof setItemSchema>;

interface SetItemRow extends SetItemFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Set Item",
      edit: "Edit Set Item",
      duplicate: "Duplicate Set Item"
    }
  },
  description: {
    text: {
      add: "Add a new set item to the database.",
      edit: "Edit the selected set item's details.",
      duplicate: "Create a new set item based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add Set Item",
      edit: "Save Changes",
      duplicate: "Duplicate Entry"
    },
    className: "flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white",
  },
} as const;

export default function SetItemPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_set_item_data';
  const { userProfile, permissions, fetchTablePermissions } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Set Item Table',
    type: 'set_item',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<SetItemRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  // Get current user ID and permissions from store
  const currentUserId = userProfile?.data?.id;
  const tablePermissions = permissions[tableId];
  const hasPermission = tablePermissions?.can_get ?? null;

  // Fetch permissions if not cached
  useEffect(() => {
    if (!tableId || !currentUserId) return;
    
    // Check if permissions are cached and valid
    const now = Date.now();
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
    const isCached = tablePermissions && (now - tablePermissions.timestamp) < CACHE_DURATION;
    
    if (!isCached) {
      fetchTablePermissions(tableId);
    }
  }, [tableId, currentUserId, tablePermissions, fetchTablePermissions]);

  // Track editing session when edit form is open
  useEditingSession({
    tableId,
    rowId: formMode === 'edit' && selectedRow ? selectedRow.id : null,
    sessionType: 'editing',
    enabled: isFormOpen && formMode === 'edit' && !!selectedRow,
    userId: currentUserId,
    userEmail: userProfile?.data?.email,
    userName: userProfile?.data?.full_name,
  });

  // Get real-time editing indicators
  const {
    viewing,
    editing,
    getOtherUsersEditingRow,
  } = useEditingIndicators({
    tableId,
    enabled: !!tableId,
    hasPermission,
  });

  // Use columns from schema with correct casing
  const columns = schemaColumns;

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
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<SetItemRow>({
    config: {
      tableName,
      columns,
    },
    tableId,
  userId: currentUserId,
    hasGetPermission: hasPermission,});

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
        title={selectedTable?.name || 'Set Item Table'}
        description={
          <div className="flex items-center gap-2">
            <span>Manage set items and their properties</span>
            
              <EditingIndicator sessions={viewing} type="viewing" currentUserId={currentUserId} />
            
          </div>
        }
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setSelectedRow(null);
          setFormMode('add');
          setIsFormOpen(true);
        }}
        onImport={userProfile?.data?.role === 'owner' ? () => setIsImportDialogOpen(true) : undefined}
        onExport={() => setIsExportDialogOpen(true)}
        onRefresh={refreshData}
        onBulkDelete={() => {
          if (selectedRows.size > 0) {
            handleDeleteRow(Array.from(selectedRows).join(','));
          }
        }}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="flex-1 overflow-hidden px-4 pb-4">
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
            setSelectedRow(row as SetItemRow);
            setFormMode('duplicate');
            setIsFormOpen(true);
          }}
          onDelete={(row) => {
            setSelectedRow(row);
            setIsDeleteDialogOpen(true);
          }}
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

      {/* Set Item Form */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent 
          side="right" 
          className="w-[100vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] bg-gray-900 border-gray-800 p-0 flex flex-col max-w-[95vw]"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <SheetTitle className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
              {formTheme.title.text[formMode]}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-800">
            {formMode === 'edit' && selectedRow && (
              <div className="px-6 pt-4 flex-shrink-0">
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
            
            <div className="flex-1 min-h-0">
              <SetItemForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as SetItemRow);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as SetItemRow);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as SetItemRow);
                    break;
                }
                setIsFormOpen(false);
              }}
              tableId={tableId}
            />
            </div>
          </div>
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
        itemName={`Set Item ${selectedRow?.tblidx || ""}`}
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