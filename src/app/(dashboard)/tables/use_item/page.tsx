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
import { useItemSchema } from "./schema";
import UseItemForm from "./UseItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';

type UseItemFormData = z.infer<typeof useItemSchema>;

interface UseItemRow extends UseItemFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Use Item",
      edit: "Edit Use Item",
      duplicate: "Duplicate Use Item"
    }
  },
  description: {
    text: {
      add: "Add a new use item to the database.",
      edit: "Edit the selected use item's details.",
      duplicate: "Create a new use item based on the selected one."
    }
  },
} as const;

export default function UseItemPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Use Item Table',
    type: 'use_item',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<UseItemRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: "tblidx",
      label: "ID",
      type: "number" as const,
      validation: useItemSchema.shape.tblidx,
    },
    {
      key: "byuse_item_active_type",
      label: "Active Type",
      type: "number" as const,
      validation: useItemSchema.shape.byuse_item_active_type,
    },
    {
      key: "bybuff_group",
      label: "Buff Group",
      type: "number" as const,
      validation: useItemSchema.shape.bybuff_group,
    },
    {
      key: "bybuffkeeptype",
      label: "Buff Keep Type",
      type: "number" as const,
      validation: useItemSchema.shape.bybuffkeeptype,
    },
    {
      key: "use_info_text",
      label: "Info Text",
      type: "text" as const,
      validation: useItemSchema.shape.use_info_text,
    },
    {
      key: "dwcool_time",
      label: "Cool Time",
      type: "number" as const,
      validation: useItemSchema.shape.dwcool_time,
    },
    {
      key: "dwkeep_time",
      label: "Keep Time",
      type: "number" as const,
      validation: useItemSchema.shape.dwkeep_time,
    },
    {
      key: "byuse_range_max",
      label: "Use Range Max",
      type: "number" as const,
      validation: useItemSchema.shape.byuse_range_max,
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
  } = useTableData<UseItemRow>({
    config: {
      tableName: "table_use_item_data",
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
      formData.append("tableName", "use_item");
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
        `/api/export?table=use_item&table_id=${tableId}`,
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
      a.download = `use_item_export.csv`;
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
        title={selectedTable?.name || 'Use Item Table'}
        description="Manage use items and their properties"
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
            setSelectedRow({ ...rest, id: '' } as UseItemRow);
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
          <UseItemForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            mode={formMode === 'duplicate' ? 'add' : formMode}
            initialData={selectedRow || undefined}
            onSubmit={(data) => {
              switch (formMode) {
                case 'add':
                  handleAddRow(data as UseItemRow);
                  break;
                case 'edit':
                  if (selectedRow?.id) {
                    handleEditRow(selectedRow.id, data as UseItemRow);
                  }
                  break;
                case 'duplicate':
                  handleAddRow(data as UseItemRow);
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
        itemName={`Use Item ${selectedRow?.tblidx || ""}`}
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