"use client";
import { useState } from "react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/table/DataTable";
import { useTableData } from "@/hooks/useTableData";
import { TableHeader } from '@/components/table/TableHeader';
import { TablePagination } from '@/components/table/TablePagination';
import { DeleteDialog, ImportDialog, useExport } from '@/components/table/TableDialogs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { itemTableSchema } from "./schema";
import ItemForm from "./ItemForm";
import { ErrorDisplay } from '@/components/ErrorDisplay';

type ItemTableFormData = z.infer<typeof itemTableSchema>;

interface ItemTableRow extends ItemTableFormData {
  id: string;
}

type FormMode = 'add' | 'edit' | 'duplicate';

// Form theme configuration
const formTheme = {
  title: {
    text: {
      add: "Add New Item",
      edit: "Edit Item",
      duplicate: "Duplicate Item"
    }
  },
  description: {
    text: {
      add: "Add a new item to the database.",
      edit: "Edit the selected item's details.",
      duplicate: "Create a new item based on the selected one."
    }
  },
  button: {
    text: {
      add: "Add Item",
      edit: "Save Changes",
      duplicate: "Duplicate Entry"
    },
    className: "flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
  },
} as const;

export default function ItemTablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const tableName = 'table_item_data';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Item Table',
    type: 'item',
  } : undefined;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ItemTableRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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

  // Define filter definitions for the data table
  const filterDefinitions = [
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
      key: "byitem_type",
      label: "Item Type",
      type: "number" as const,
      validation: itemTableSchema.shape.byitem_type,
    },
    {
      key: "byrank",
      label: "Rank",
      type: "number" as const,
      validation: itemTableSchema.shape.byrank,
    },
    {
      key: "bvalidity_able",
      label: "Valid",
      type: "boolean" as const,
      validation: itemTableSchema.shape.bvalidity_able,
    },
  ];

  // Define tabs for the form
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      fields: [
        "tblidx",
        "name",
        "wsznametext",
        "szicon_name",
        "bymodel_type",
        "szmodel",
        "szsub_weapon_act_model",
        "byitem_type",
        "byequip_type",
        "dwequip_slot_type_bit_flag",
        "wfunction_bit_flag",
        "bymax_stack",
        "byrank",
        "dwweight",
        "dwcost",
        "dwsell_price",
        "bvalidity_able",
        "note",
      ],
    },
    {
      id: "attributes",
      label: "Attributes",
      fields: [
        "bydurability",
        "bydurability_count",
        "bybattle_attribute",
        "wphysical_offence",
        "wenergy_offence",
        "wphysical_defence",
        "wenergy_defence",
        "fattack_range_bonus",
        "wattack_speed_rate",
        "fattack_physical_revision",
        "fattack_energy_revision",
        "fdefence_physical_revision",
        "fdefence_energy_revision",
      ],
    },
    {
      id: "requirements",
      label: "Requirements",
      fields: [
        "byneed_min_level",
        "byneed_max_level",
        "dwneed_class_bit_flag",
        "dwneed_gender_bit_flag",
        "byclass_special",
        "byrace_special",
        "wneed_str",
        "wneed_con",
        "wneed_foc",
        "wneed_dex",
        "wneed_sol",
        "wneed_eng",
        "byrestricttype",
        "byneedfunction",
      ],
    },
    {
      id: "options",
      label: "Options",
      fields: [
        "biscanhaveoption",
        "item_option_tblidx",
        "byitemgroup",
        "charm_tblidx",
        "wcostumehidebitflag",
        "needitemtblidx",
        "set_item_tblidx",
        "use_item_tblidx",
      ],
    },
    {
      id: "scouter",
      label: "Scouter",
      fields: [
        "bybag_size",
        "wscouter_watt",
        "dwscouter_maxpower",
        "byscouter_parts_type1",
        "byscouter_parts_type2",
        "byscouter_parts_type3",
        "byscouter_parts_type4",
      ],
    },
    {
      id: "enhancement",
      label: "Enhancement",
      fields: [
        "bcreatesuperiorable",
        "bcreateexcellentable",
        "bcreaterareable",
        "bcreatelegendaryable",
        "enchantratetblidx",
        "excellenttblidx",
        "raretblidx",
        "legendarytblidx",
        "biscanrenewal",
      ],
    },
    {
      id: "duration",
      label: "Duration",
      fields: [
        "commonpoint",
        "bycommonpointtype",
        "dwusedurationmax",
        "bydurationtype",
        "contentstblidx",
        "dwdurationgroup",
      ],
    },
    {
      id: "disassembly",
      label: "Disassembly",
      fields: [
        "wdisassemble_bit_flag",
        "bydisassemblenormalmin",
        "bydisassemblenormalmax",
        "bydisassembleuppermin",
        "bydisassembleuppermax",
        "bydropvisual",
        "byusedisassemble",
        "bydroplevel",
      ],
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
    handleBulkDelete,
    handleDuplicateRow,
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

  // Handle import dialog
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImportFile(file);
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

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tableName", "item");
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
      setImportFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import data");
    } finally {
      setIsImporting(false);
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
        title={selectedTable?.name || 'Item Table'}
        description="Manage items and their properties"
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
            const { id, ...rest } = row;
            setSelectedRow({ ...rest, id: '' } as ItemTableRow);
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
              {formTheme.title.text[formMode]}
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              {formTheme.description.text[formMode]}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            <ItemForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              mode={formMode === 'duplicate' ? 'add' : formMode}
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
              className={formTheme.button.className}
              onClick={() => {
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }}
            >
              {formTheme.button.text[formMode]}
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