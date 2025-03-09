'use client';

import { useState } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DataTable } from "@/components/table/DataTable";
import { DeleteDialog, ImportDialog } from '@/components/table/TableDialogs';
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
  } = useTableData<SystemEffectRow>({
    config: {
      tableName: "table_system_effect_data",
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
        setIsImportDialogOpen(true);
      }
    };
    input.click();
  };

  const handleImportConfirm = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tableName", "system_effect");
      formData.append("tableId", tableId);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import data");
      }

      toast.success("Data imported successfully");
      refreshData();
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import data");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `/api/export?table=system_effect&table_id=${tableId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export data");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system_effect_export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to export data");
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
        onImport={handleImport}
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
          onSelectAll={(checked) => {
            if (checked) {
              const allIds = data.map((row) => row.id);
              allIds.forEach(handleRowSelection);
            } else {
              selectedRows.forEach((id) => handleRowSelection(id));
            }
          }}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            const { id, ...rest } = row;
            setSelectedRow({ ...rest, id: '' } as SystemEffectRow);
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
        onImport={handleImportConfirm}
        file={null}
      />
    </div>
  );
} 