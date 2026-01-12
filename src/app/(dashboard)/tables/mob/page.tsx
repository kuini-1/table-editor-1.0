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
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { EditConflictWarning } from '@/components/table/EditConflictWarning';
import { EditingIndicator } from '@/components/table/EditingIndicator';
import { useStore } from "@/lib/store";
import { createClient } from '@/lib/supabase/client';
import { mobSchema, columns as schemaColumns } from "./schema";
import { MobForm } from "./MobForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { DataTableSkeleton } from '@/components/ui/DataTableSkeleton';

type MobFormData = z.infer<typeof mobSchema>;

interface MobRow extends MobFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Mob",
      edit: "Edit Mob",
      duplicate: "Duplicate Mob"
    }
  },
  description: {
    text: {
      add: "Add a new mob to the database.",
      edit: "Edit the selected mob's details.",
      duplicate: "Create a new mob based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add Mob",
      edit: "Save Changes",
      duplicate: "Duplicate Entry"
    },
    className: "flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white",
  },
} as const;

export default function MobPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_mob_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Mob Table',
    type: 'mob',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<MobRow | null>(null);
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
  } = useTableData<MobRow>({
    config: {
      tableName,
      columns,
    },
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
        title={selectedTable?.name || 'Mob Table'}
        description={
          <div className="flex items-center gap-2">
            <span>Manage mobs and their properties</span>
            
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
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            setSelectedRow(row as MobRow);
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

      {/* Mob Form */}
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
              <MobForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as MobRow);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as MobRow);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as MobRow);
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
        itemName={selectedRow?.wszNameText || "this mob"}
      />
    </div>
  );
} 