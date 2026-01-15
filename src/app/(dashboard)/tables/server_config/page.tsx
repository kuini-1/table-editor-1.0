'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTableData } from '@/hooks/useTableData';
import { useEditingSession } from '@/hooks/useEditingSession';
import { useEditingIndicators } from '@/hooks/useEditingIndicators';
import { TableHeader } from '@/components/table/TableHeader';
import { DataTable } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, ExportDialog } from '@/components/table/TableDialogs';
import { EditConflictWarning } from '@/components/table/EditConflictWarning';
import { EditingIndicator } from '@/components/table/EditingIndicator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { FormMode } from '@/components/table/ModularForm';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import { ServerConfigForm } from './ServerConfigForm';
import { columns, type ServerConfigTableRow } from './schema';

export default function ServerConfigTablePage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_server_config_data';
  const { userProfile, permissions, fetchTablePermissions } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Server Config Table',
    type: 'server_config',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ServerConfigTableRow | null>(null);
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
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<ServerConfigTableRow>({
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
        title={selectedTable?.name || 'Server Config Table'}
        description={
          <div className="flex items-center gap-2">
            <span>Manage server config data and configurations</span>
            
              <EditingIndicator sessions={viewing} type="viewing" currentUserId={currentUserId} />
            
          </div>
        }
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setFormMode('add');
          setSelectedRow(null);
          setIsFormOpen(true);
        }}
        onImport={userProfile?.data?.role === 'owner' ? () => setIsImportDialogOpen(true) : undefined}
        onExport={() => setIsExportDialogOpen(true)}
        onRefresh={refreshData}
        onBulkDelete={() => {
          if (selectedRows.size > 0) {
            handleBulkDelete();
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
            setSelectedRow(row as ServerConfigTableRow);
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

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent 
          side="right" 
          className="w-[100vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] bg-gray-900 border-gray-800 p-0 flex flex-col max-w-[95vw]"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <SheetTitle className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
              {formMode === 'add' ? 'Add Server Config Entry' : 
               formMode === 'edit' ? 'Edit Server Config Entry' : 
               'Duplicate Server Config Entry'}
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
              <ServerConfigForm
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
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={refreshData}
        tableId={tableId}
        tableName="table_server_config_data"
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

