'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { useTableData } from '@/hooks/useTableData';
import { TableHeader } from '@/components/table/TableHeader';
import { DataTable } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { ModularForm } from '@/components/table/ModularForm';
import { DeleteDialog, ImportDialog } from '@/components/table/TableDialogs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import * as z from 'zod';
import type { DatabaseTable } from '../page';
import type { FormSection, FormMode, FormTab } from '@/components/table/ModularForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

// Form schema for validation
const hlsItemSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits').optional(),
  wszname: z.string().optional(),
  wszcjiproductid: z.string().optional(),
  szicon_name: z.string().optional(),
  whlsitemtype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byhlsdurationtype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwhlsdurationtime: z.coerce.number().min(0, 'Must be a positive number').optional(),
  idxnametext: z.coerce.number().min(0, 'Must be a positive number').optional(),
  idxnotetext: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bonsale: z.boolean().optional().transform(val => val ? 1 : 0),
  byselltype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwcash: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bydiscount: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount: z.coerce.number().min(0, 'Must be a positive number').optional(),
  wdisplaybitflag: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byquicklink: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwpriority: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bydisplayconsumetype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byyadrattype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_0: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_0: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_1: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_1: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_2: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_2: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_3: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_3: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_4: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_4: z.coerce.number().min(0, 'Must be a positive number').optional(),
});

type HlsItemFormData = z.infer<typeof hlsItemSchema>;

interface HlsItemRow extends HlsItemFormData {
  id: string;
}

// Custom column type that includes 'boolean'
interface CustomColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
  validation: any;
}

const columns: CustomColumn[] = [
  { key: 'tblidx', label: 'Table ID', type: 'number', validation: hlsItemSchema.shape.tblidx },
  { key: 'wszname', label: 'Name', type: 'text', validation: hlsItemSchema.shape.wszname },
  { key: 'wszcjiproductid', label: 'Product ID', type: 'text', validation: hlsItemSchema.shape.wszcjiproductid },
  { key: 'szicon_name', label: 'Icon Name', type: 'text', validation: hlsItemSchema.shape.szicon_name },
  { key: 'whlsitemtype', label: 'Item Type', type: 'number', validation: hlsItemSchema.shape.whlsitemtype },
  { key: 'byhlsdurationtype', label: 'Duration Type', type: 'number', validation: hlsItemSchema.shape.byhlsdurationtype },
  { key: 'dwhlsdurationtime', label: 'Duration Time', type: 'number', validation: hlsItemSchema.shape.dwhlsdurationtime },
  { key: 'idxnametext', label: 'Name Text Index', type: 'number', validation: hlsItemSchema.shape.idxnametext },
  { key: 'idxnotetext', label: 'Note Text Index', type: 'number', validation: hlsItemSchema.shape.idxnotetext },
  { key: 'itemtblidx', label: 'Item Table Index', type: 'number', validation: hlsItemSchema.shape.itemtblidx },
  { key: 'bonsale', label: 'On Sale', type: 'boolean', validation: hlsItemSchema.shape.bonsale },
  { key: 'byselltype', label: 'Sell Type', type: 'number', validation: hlsItemSchema.shape.byselltype },
  { key: 'dwcash', label: 'Cash', type: 'number', validation: hlsItemSchema.shape.dwcash },
  { key: 'bydiscount', label: 'Discount', type: 'number', validation: hlsItemSchema.shape.bydiscount },
  { key: 'bystackcount', label: 'Stack Count', type: 'number', validation: hlsItemSchema.shape.bystackcount },
  { key: 'wdisplaybitflag', label: 'Display Bit Flag', type: 'number', validation: hlsItemSchema.shape.wdisplaybitflag },
  { key: 'byquicklink', label: 'Quick Link', type: 'number', validation: hlsItemSchema.shape.byquicklink },
  { key: 'dwpriority', label: 'Priority', type: 'number', validation: hlsItemSchema.shape.dwpriority },
  { key: 'bydisplayconsumetype', label: 'Display Consume Type', type: 'number', validation: hlsItemSchema.shape.bydisplayconsumetype },
  { key: 'byyadrattype', label: 'Yadrat Type', type: 'number', validation: hlsItemSchema.shape.byyadrattype },
  { key: 'itemtblidx_0', label: 'Item Table Index 0', type: 'number', validation: hlsItemSchema.shape.itemtblidx_0 },
  { key: 'bystackcount_0', label: 'Stack Count 0', type: 'number', validation: hlsItemSchema.shape.bystackcount_0 },
  { key: 'itemtblidx_1', label: 'Item Table Index 1', type: 'number', validation: hlsItemSchema.shape.itemtblidx_1 },
  { key: 'bystackcount_1', label: 'Stack Count 1', type: 'number', validation: hlsItemSchema.shape.bystackcount_1 },
  { key: 'itemtblidx_2', label: 'Item Table Index 2', type: 'number', validation: hlsItemSchema.shape.itemtblidx_2 },
  { key: 'bystackcount_2', label: 'Stack Count 2', type: 'number', validation: hlsItemSchema.shape.bystackcount_2 },
  { key: 'itemtblidx_3', label: 'Item Table Index 3', type: 'number', validation: hlsItemSchema.shape.itemtblidx_3 },
  { key: 'bystackcount_3', label: 'Stack Count 3', type: 'number', validation: hlsItemSchema.shape.bystackcount_3 },
  { key: 'itemtblidx_4', label: 'Item Table Index 4', type: 'number', validation: hlsItemSchema.shape.itemtblidx_4 },
  { key: 'bystackcount_4', label: 'Stack Count 4', type: 'number', validation: hlsItemSchema.shape.bystackcount_4 },
];

const hlsItemSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this HLS item',
    columns: ['tblidx', 'wszname', 'wszcjiproductid', 'szicon_name', 'whlsitemtype']
  }
];

const hlsItemTabs = [
  {
    id: 'duration',
    label: 'Duration Settings',
    sections: [
      {
        id: 'duration-settings',
        title: 'Duration Settings',
        description: 'Configure duration settings for this item',
        columns: [
          'byhlsdurationtype',
          'dwhlsdurationtime'
        ]
      }
    ]
  },
  {
    id: 'text-indices',
    label: 'Text Indices',
    sections: [
      {
        id: 'text-indices',
        title: 'Text Indices',
        description: 'Configure text indices for this item',
        columns: [
          'idxnametext',
          'idxnotetext'
        ]
      }
    ]
  },
  {
    id: 'sale-settings',
    label: 'Sale Settings',
    sections: [
      {
        id: 'sale-settings',
        title: 'Sale Settings',
        description: 'Configure sale settings for this item',
        columns: [
          'bonsale',
          'byselltype',
          'dwcash',
          'bydiscount',
          'bystackcount'
        ]
      }
    ]
  },
  {
    id: 'display-settings',
    label: 'Display Settings',
    sections: [
      {
        id: 'display-settings',
        title: 'Display Settings',
        description: 'Configure display settings for this item',
        columns: [
          'wdisplaybitflag',
          'byquicklink',
          'dwpriority',
          'bydisplayconsumetype',
          'byyadrattype'
        ]
      }
    ]
  },
  {
    id: 'item-bundles',
    label: 'Item Bundles',
    sections: [
      {
        id: 'item-bundles',
        title: 'Item Bundles',
        description: 'Configure bundled items',
        columns: [
          'itemtblidx',
          'itemtblidx_0',
          'bystackcount_0',
          'itemtblidx_1',
          'bystackcount_1',
          'itemtblidx_2',
          'bystackcount_2',
          'itemtblidx_3',
          'bystackcount_3',
          'itemtblidx_4',
          'bystackcount_4'
        ]
      }
    ]
  }
];

const formTheme = {
  header: {
    className: "pb-6 border-b border-gray-200 dark:border-gray-800",
    before: null,
    after: null
  },
  title: {
    text: {
      add: "Add HLS Item",
      edit: "Edit HLS Item",
      duplicate: "Duplicate HLS Item"
    },
    className: "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold",
  },
  description: {
    text: {
      add: "Create a new HLS item with the details below.",
      edit: "Modify the HLS item values for this entry.",
      duplicate: "Create a new entry based on the selected HLS item data."
    },
    className: "text-gray-500 dark:text-gray-400",
  },
  inputs: {
    container: {
      className: "grid grid-cols-1 gap-6",
    },
    item: {
      className: "space-y-2",
      labelClassName: "text-sm font-medium text-gray-700 dark:text-gray-300",
      inputClassName: "h-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all duration-200",
    },
  },
  footer: {
    className: "flex gap-4 w-full",
    before: null,
    after: null,
    cancelButton: {
      text: "Cancel",
      className: "flex-1 border hover:bg-gray-50 dark:hover:bg-gray-800",
    },
    submitButton: {
      text: {
        add: "Add Item",
        edit: "Save Changes",
        duplicate: "Duplicate Item"
      },
      className: "flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    },
  },
} as const;

// Custom ModularForm component that supports boolean fields
function CustomModularForm<T extends { table_id: string; [key: string]: any }>(props: {
  columns: CustomColumn[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
  sections?: FormSection[];
  tabs?: FormTab[];
}) {
  // Use the standard ModularForm but override the renderField function
  return (
    <ModularForm<T>
      {...props}
      columns={props.columns as any}
    />
  );
}

export default function HlsItemPage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'HLS Item Table',
    type: 'hls',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<HlsItemRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

  // Transform data for display - convert numeric bonsale to boolean
  const transformDataForDisplay = (data: any[]) => {
    return data.map(item => ({
      ...item,
      bonsale: item.bonsale === 1 || item.bonsale === true
    }));
  };

  // Transform data for submission - convert boolean bonsale to number
  const transformDataForSubmission = (data: any) => {
    return {
      ...data,
      bonsale: data.bonsale ? 1 : 0
    };
  };

  const {
    data: rawData,
    loading,
    error,
    totalRows,
    page,
    pageSize,
    filters,
    selectedRows,
    handleAddRow: originalHandleAddRow,
    handleEditRow: originalHandleEditRow,
    handleDeleteRow,
    handleDuplicateRow: originalHandleDuplicateRow,
    handleAddFilter,
    handleRemoveFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelection,
    refreshData,
  } = useTableData<HlsItemRow>({
    config: {
      tableName: 'hls_item_table',
      columns: columns as any,
    },
    tableId,
  });

  // Transform data for display
  const data = transformDataForDisplay(rawData);

  // Wrap the original handlers to handle boolean transformation
  const handleAddRow = (formData: any) => {
    const transformedData = transformDataForSubmission(formData);
    return originalHandleAddRow(transformedData);
  };

  const handleEditRow = (id: string, formData: any) => {
    const transformedData = transformDataForSubmission(formData);
    return originalHandleEditRow(id, transformedData);
  };

  const handleDuplicateRow = (formData: any) => {
    const transformedData = transformDataForSubmission(formData);
    return originalHandleDuplicateRow(transformedData);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileToImport(file);
        setIsImportDialogOpen(true);
      }
    };
    input.click();
  };

  const handleImportConfirm = async () => {
    if (!fileToImport) return;

    const formData = new FormData();
    formData.append('file', fileToImport);
    formData.append('table_id', tableId);
    formData.append('tableName', 'hls_item_table');

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      toast.success('Data imported successfully');
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to import data');
    } finally {
      setFileToImport(null);
      setIsImportDialogOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export?table=hls&table_id=${tableId}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hls_item_table.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export data');
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
        title={selectedTable?.name || 'HLS Item Table'}
        description="Manage HLS items and their properties"
        columns={columns as any}
        filters={filters}
        selectedCount={selectedRows.size}
        onAddRow={() => {
          setFormMode('add');
          setSelectedRow(null);
          setIsFormOpen(true);
        }}
        onImport={handleImport}
        onExport={handleExport}
        onRefresh={refreshData}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns as any}
          data={data}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelection}
          onSelectAll={(checked) => {
            if (checked) {
              handleRowSelection('all');
            } else {
              handleRowSelection('none');
            }
          }}
          onEdit={(row) => {
            setSelectedRow(row);
            setFormMode('edit');
            setIsFormOpen(true);
          }}
          onDuplicate={(row) => {
            const { id, ...rest } = row;
            setSelectedRow({ ...rest, id: '' } as HlsItemRow);
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
          <CustomModularForm<HlsItemFormData>
            columns={columns}
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
            sections={hlsItemSections}
            tabs={hlsItemTabs}
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
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => {
          setFileToImport(null);
          setIsImportDialogOpen(false);
        }}
        onImport={async (file) => {
          await handleImportConfirm();
          setFileToImport(null);
          setIsImportDialogOpen(false);
        }}
        file={fileToImport}
      />
    </div>
  );
} 