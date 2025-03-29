'use client';

import { useState } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DataTable } from "@/components/table/DataTable";
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useStore } from "@/lib/store";
import { systemEffectSchema } from "./schema";
import SystemEffectForm from "./SystemEffectForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';

type SystemEffectFormData = z.infer<typeof systemEffectSchema>;

interface SystemEffectRow extends SystemEffectFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New System Effect",
      edit: "Edit System Effect",
      duplicate: "Duplicate System Effect"
    }
  },
  description: {
    text: {
      add: "Add a new system effect to the database.",
      edit: "Edit the selected system effect's details.",
      duplicate: "Create a new system effect based on the selected one."
    }
  },
} as const;

export default function SystemEffectPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_system_effect_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'System Effect Table',
    type: 'system_effect',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<SystemEffectRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: "tblidx",
      label: "ID",
      type: "number" as const,
      validation: systemEffectSchema.shape.tblidx,
    },
    {
      key: "wszname",
      label: "Name",
      type: "text" as const,
      validation: systemEffectSchema.shape.wszname,
    },
    {
      key: "byeffect_type",
      label: "Effect Type",
      type: "number" as const,
      validation: systemEffectSchema.shape.byeffect_type,
    },
    {
      key: "byactive_effect_type",
      label: "Active Effect Type",
      type: "number" as const,
      validation: systemEffectSchema.shape.byactive_effect_type,
    },
    {
      key: "effect_info_text",
      label: "Effect Info",
      type: "text" as const,
      validation: systemEffectSchema.shape.effect_info_text,
    },
    {
      key: "keep_effect_name",
      label: "Keep Effect Name",
      type: "text" as const,
      validation: systemEffectSchema.shape.keep_effect_name,
    },
    {
      key: "bytarget_effect_position",
      label: "Target Effect Position",
      type: "number" as const,
      validation: systemEffectSchema.shape.bytarget_effect_position,
    },
    {
      key: "szsuccess_effect_name",
      label: "Success Effect Name",
      type: "text" as const,
      validation: systemEffectSchema.shape.szsuccess_effect_name,
    },
    {
      key: "bysuccess_projectile_type",
      label: "Success Projectile Type",
      type: "number" as const,
      validation: systemEffectSchema.shape.bysuccess_projectile_type,
    },
  ];

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
  } = useTableData<SystemEffectRow>({
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
        title={selectedTable?.name || 'System Effect Table'}
        description="Manage system effects and their properties"
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
            setSelectedRow(row);
            setFormMode('duplicate');
            setIsFormOpen(true);
          }}
          onDelete={(row) => handleDeleteRow(row.id)}
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
              {formTheme.title.text[formMode]}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formTheme.description.text[formMode]}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <SystemEffectForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode === 'duplicate' ? 'add' : formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as SystemEffectRow);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as SystemEffectRow);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as SystemEffectRow);
                    break;
                }
                setIsFormOpen(false);
              }}
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
              {formMode === 'add' ? 'Add System Effect' :
               formMode === 'edit' ? 'Save Changes' :
               'Duplicate System Effect'}
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
        itemName={selectedRow?.wszname || "this system effect"}
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