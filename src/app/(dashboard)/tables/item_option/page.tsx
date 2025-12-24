'use client';

import { useState } from "react";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DataTable } from "@/components/table/DataTable";
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useStore } from "@/lib/store";
import { itemOptionSchema } from "./schema";
import { ItemOptionForm } from "./ItemOptionForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';

type ItemOptionFormData = z.infer<typeof itemOptionSchema>;

interface ItemOptionRow extends ItemOptionFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Item Option",
      edit: "Edit Item Option",
      duplicate: "Duplicate Item Option"
    }
  },
  description: {
    text: {
      add: "Add a new item option to the database.",
      edit: "Edit the selected item option's details.",
      duplicate: "Create a new item option based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add Item Option",
      edit: "Save Changes",
      duplicate: "Duplicate Entry"
    },
    className: "flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white",
  },
} as const;

export default function ItemOptionPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_item_option_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Item Option Table',
    type: 'item_option',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ItemOptionRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: "tblidx",
      label: "ID",
      type: "number" as const,
      validation: itemOptionSchema.shape.tblidx,
    },
    {
      key: "wszoption_name",
      label: "Option Name",
      type: "text" as const,
      validation: itemOptionSchema.shape.wszoption_name,
    },
    {
      key: "byoption_rank",
      label: "Rank",
      type: "number" as const,
      validation: itemOptionSchema.shape.byoption_rank,
    },
    {
      key: "byitem_group",
      label: "Item Group",
      type: "number" as const,
      validation: itemOptionSchema.shape.byitem_group,
    },
    {
      key: "bvalidity_able",
      label: "Validity",
      type: "number" as const,
      validation: itemOptionSchema.shape.bvalidity_able,
    },
    {
      key: "dwcost",
      label: "Cost",
      type: "number" as const,
      validation: itemOptionSchema.shape.dwcost,
    },
    {
      key: "bylevel",
      label: "Level",
      type: "number" as const,
      validation: itemOptionSchema.shape.bylevel,
    },
    {
      key: "system_effect_0",
      label: "Effect 1",
      type: "text" as const,
      validation: itemOptionSchema.shape.system_effect_0,
    },
    {
      key: "bappliedinpercent_0",
      label: "% Effect 1",
      type: "boolean" as const,
      validation: itemOptionSchema.shape.bappliedinpercent_0,
    },
    {
      key: "nvalue_0",
      label: "Value 1",
      type: "number" as const,
      validation: itemOptionSchema.shape.nvalue_0,
    },
  ];

  // Use the custom hook to fetch and manage data
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
  } = useTableData<ItemOptionRow>({
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
    <div className="flex flex-col h-screen bg-gray-900">
      <TableHeader
        title={selectedTable?.name || 'Item Option Table'}
        description="Manage item options and their properties"
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

      {/* Item Option Form */}
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
          
          <div className="flex-1 overflow-hidden">
            <ItemOptionForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as ItemOptionRow);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as ItemOptionRow);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as ItemOptionRow);
                    break;
                }
                setIsFormOpen(false);
              }}
              tableId={tableId}
            />
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
        itemName={selectedRow?.wszoption_name || "this item option"}
      />
    </div>
  );
} 