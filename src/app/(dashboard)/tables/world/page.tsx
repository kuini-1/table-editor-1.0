'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { worldSchema, columns as worldColumns } from './schema';
import WorldForm from './WorldForm';
import { DataTable } from '@/components/table/DataTable';
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useEditingSession } from '@/hooks/useEditingSession';
import { useEditingIndicators } from '@/hooks/useEditingIndicators';
import { EditConflictWarning } from '@/components/table/EditConflictWarning';
import { EditingIndicator } from '@/components/table/EditingIndicator';
import { useTableData } from '@/hooks/useTableData';
import { useStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type WorldData = z.infer<typeof worldSchema> & { id: string };
type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New World",
      edit: "Edit World",
      duplicate: "Duplicate World"
    }
  },
  description: {
    text: {
      add: "Add a new world to the database.",
      edit: "Edit the selected world's details.",
      duplicate: "Create a new world based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add World",
      edit: "Save Changes",
      duplicate: "Duplicate World"
    },
    className: "flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white",
  },
} as const;

export default function WorldPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_world_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'World Table',
    type: 'world',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<WorldData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
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

  // Use columns from schema to avoid recreating on every render
  const columns = useMemo(() => worldColumns, []);

  // Memoize config object to prevent re-renders
  const tableConfig = useMemo(() => ({
    tableName,
    columns,
  }), [columns, tableName]);

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
  } = useTableData<WorldData>({
    config: tableConfig,
    tableId,
  });

  const handleExport = useExport({ tableId, tableName });

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
        title={selectedTable?.name || 'World Table'}
        description={
          <div className="flex items-center gap-2">
            <span>Manage world data and properties</span>
            
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

      <div className="flex-1 overflow-hidden px-4 pb-4">
        <DataTable
          columns={columns}
          data={data || []}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            setSelectedRow(row as WorldData);
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
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
              {formTheme.title.text[formMode]}
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
              <WorldForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as WorldData);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as WorldData);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as WorldData);
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

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (selectedRow) {
            handleDeleteRow(selectedRow.id);
            setIsDeleteDialogOpen(false);
            setSelectedRow(null);
          }
        }}
        itemName={selectedRow?.szName || "this world"}
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={refreshData}
        tableId={tableId}
        tableName={tableName}
      />
    </div>
  );
} 