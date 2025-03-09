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
import { skillSchema } from "./schema";
import SkillForm from "./SkillForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillRow extends SkillFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Skill",
      edit: "Edit Skill",
      duplicate: "Duplicate Skill"
    }
  },
  description: {
    text: {
      add: "Add a new skill to the database.",
      edit: "Edit the selected skill's details.",
      duplicate: "Create a new skill based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add Skill",
      edit: "Save Changes",
      duplicate: "Duplicate Entry"
    },
    className: "flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
  },
} as const;

export default function SkillPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Skill Table',
    type: 'skill',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<SkillRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: "tblidx",
      label: "ID",
      type: "number" as const,
      validation: skillSchema.shape.tblidx,
    },
    {
      key: "skill_name",
      label: "Skill Name",
      type: "text" as const,
      validation: skillSchema.shape.skill_name,
    },
    {
      key: "wsznametext",
      label: "Display Name",
      type: "text" as const,
      validation: skillSchema.shape.wsznametext,
    },
    {
      key: "byskill_class",
      label: "Skill Class",
      type: "number" as const,
      validation: skillSchema.shape.byskill_class,
    },
    {
      key: "byskill_type",
      label: "Skill Type",
      type: "number" as const,
      validation: skillSchema.shape.byskill_type,
    },
    {
      key: "byskill_active_type",
      label: "Active Type",
      type: "number" as const,
      validation: skillSchema.shape.byskill_active_type,
    },
    {
      key: "byskill_grade",
      label: "Grade",
      type: "number" as const,
      validation: skillSchema.shape.byskill_grade,
    },
    {
      key: "byrequire_train_level",
      label: "Required Level",
      type: "number" as const,
      validation: skillSchema.shape.byrequire_train_level,
    },
    {
      key: "bvalidity_able",
      label: "Validity",
      type: "number" as const,
      validation: skillSchema.shape.bvalidity_able,
    },
    {
      key: "szicon_name",
      label: "Icon",
      type: "text" as const,
      validation: skillSchema.shape.szicon_name,
    },
  ];

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
    handleDuplicateRow,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<SkillRow>({
    config: {
      tableName: "table_skill_data",
      columns,
    },
    tableId,
  });

  // Handle import dialog
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

  // Handle import confirmation
  const handleImportConfirm = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tableName", "skill");
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

  // Handle export
  const handleExport = async () => {
    try {
      const response = await fetch(
        `/api/export?table=skill&table_id=${tableId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export data");
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "skill_export.csv";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create a blob from the response and download it
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
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
        title={selectedTable?.name || 'Skill Table'}
        description="Manage skills and their properties"
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
            setSelectedRow({ ...rest, id: '' } as SkillRow);
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

      {/* Skill Form */}
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
          <SkillForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            mode={formMode === 'duplicate' ? 'add' : formMode}
            initialData={selectedRow || undefined}
            onSubmit={(data) => {
              switch (formMode) {
                case 'add':
                  handleAddRow(data as SkillRow);
                  break;
                case 'edit':
                  if (selectedRow?.id) {
                    handleEditRow(selectedRow.id, data as SkillRow);
                  }
                  break;
                case 'duplicate':
                  handleAddRow(data as SkillRow);
                  break;
              }
              setIsFormOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportConfirm}
        file={null}
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
        itemName={selectedRow?.skill_name || "this skill"}
      />
    </div>
  );
} 