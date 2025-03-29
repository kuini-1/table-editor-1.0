"use client";
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
import { DataTable } from "@/components/table/DataTable";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { useStore } from "@/lib/store";
import { itemTableSchema } from "./schema";
import ItemForm from "./ItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';
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
  const selectedTable = React.useMemo(() => 
    userProfile?.data?.id === tableId ? {
      id: tableId,
      name: 'Item Table',
      type: 'item',
    } : undefined,
    [userProfile?.data?.id, tableId]
  );
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ItemTableRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Define columns for the data table
  const columns = [
    {
      key: "tblidx",
      label: "ID",
      type: "number" as const,
      validation: itemTableSchema.shape.tblidx,
    },
    {
      key: "name",
      label: "Name",
      type: "text" as const,
      validation: itemTableSchema.shape.name,
    },
    {
      key: "wsznametext",
      label: "Display Name",
      type: "text" as const,
      validation: itemTableSchema.shape.wsznametext,
    },
    {
      key: "szicon_name",
      label: "Icon Name",
      type: "text" as const,
      validation: itemTableSchema.shape.szicon_name,
    },
    {
      key: "byitem_type",
      label: "Item Type",
      type: "number" as const,
      validation: itemTableSchema.shape.byitem_type,
    },
    {
      key: "byequip_type",
      label: "Equip Type",
      type: "number" as const,
      validation: itemTableSchema.shape.byequip_type,
    },
    {
      key: "byrank",
      label: "Rank",
      type: "number" as const,
      validation: itemTableSchema.shape.byrank,
    },
    {
      key: "dwcost",
      label: "Cost",
      type: "number" as const,
      validation: itemTableSchema.shape.dwcost,
    },
    {
      key: "dwsell_price",
      label: "Sell Price",
      type: "number" as const,
      validation: itemTableSchema.shape.dwsell_price,
    },
    {
      key: "bvalidity_able",
      label: "Valid",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bvalidity_able,
    },
    {
      key: "biscanhaveoption",
      label: "Can Have Option",
      type: "boolean" as const,
      validation: itemTableSchema.shape.biscanhaveoption,
    },
    {
      key: "bcreatesuperiorable",
      label: "Can Create Superior",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bcreatesuperiorable,
    },
    {
      key: "bcreateexcellentable",
      label: "Can Create Excellent",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bcreateexcellentable,
    },
    {
      key: "bcreaterareable",
      label: "Can Create Rare",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bcreaterareable,
    },
    {
      key: "bcreatelegendaryable",
      label: "Can Create Legendary",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bcreatelegendaryable,
    },
    {
      key: "biscanrenewal",
      label: "Can Renewal",
      type: "boolean" as const,
      validation: itemTableSchema.shape.biscanrenewal,
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
        title={selectedTable?.name || 'Item Table'}
        description="Manage items and their properties"
        columns={columns}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setFormMode('add');
          setSelectedRow(null);
          setIsFormOpen(true);
        }}
        onImport={() => setIsImportDialogOpen(true)}
        onExport={handleExport}
        onRefresh={refreshData}
        onBulkDelete={() => {
          if (selectedRows.size > 0) {
            handleBulkDelete();
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
            setSelectedRow(row as ItemTableRow);
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

      {/* Item Form */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent 
          side="right" 
          className="w-[100vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[50vw] bg-gray-900 border-gray-800 p-0 flex flex-col"
        >
          <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
              {formMode === 'add' ? 'Add Item' : 
               formMode === 'edit' ? 'Edit Item' : 
               'Duplicate Item'}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formMode === 'add' ? 'Create a new item with the details below.' :
               formMode === 'edit' ? 'Modify the item values for this entry.' :
               'Create a new entry based on the selected item data.'}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <ItemForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode}
              initialData={selectedRow || undefined}
              onSubmit={(data) => {
                switch (formMode) {
                  case 'add':
                    handleAddRow(data as ItemTableRow);
                    break;
                  case 'edit':
                    if (selectedRow?.id) {
                      handleEditRow(selectedRow.id, data as ItemTableRow);
                    }
                    break;
                  case 'duplicate':
                    handleAddRow(data as ItemTableRow);
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
              {formMode === 'add' ? 'Add Item' :
               formMode === 'edit' ? 'Save Changes' :
               'Duplicate Item'}
            </Button>
          </SheetFooter>
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
        itemName={selectedRow?.name || "this item"}
      />
    </div>
  );
} 