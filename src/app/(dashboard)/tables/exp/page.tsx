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
import type { FormSection } from '@/components/table/ModularForm';
import type { FormMode } from '@/components/table/ModularForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorDisplay } from '@/components/ErrorDisplay';

// Form schema for validation
const expTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Exp: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wNormal_Race: z.coerce.number().min(0, 'Must be a positive number'),
  wSuperRace: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwPhyDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwEngDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobZenny: z.coerce.number().min(0, 'Must be a positive number'),
});

type ExpTableFormData = z.infer<typeof expTableSchema>;

interface ExpTableRow extends ExpTableFormData {
  id: string;
}

const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: expTableSchema.shape.tblidx },
  { key: 'dwExp', label: 'Experience', type: 'number' as const, validation: expTableSchema.shape.dwExp },
  { key: 'dwNeed_Exp', label: 'Required Exp', type: 'number' as const, validation: expTableSchema.shape.dwNeed_Exp },
  { key: 'wStageWinSolo', label: 'Stage Win Solo', type: 'number' as const, validation: expTableSchema.shape.wStageWinSolo },
  { key: 'wStageDrawSolo', label: 'Stage Draw Solo', type: 'number' as const, validation: expTableSchema.shape.wStageDrawSolo },
  { key: 'wStageLoseSolo', label: 'Stage Lose Solo', type: 'number' as const, validation: expTableSchema.shape.wStageLoseSolo },
  { key: 'wWinSolo', label: 'Win Solo', type: 'number' as const, validation: expTableSchema.shape.wWinSolo },
  { key: 'wPerfectWinSolo', label: 'Perfect Win Solo', type: 'number' as const, validation: expTableSchema.shape.wPerfectWinSolo },
  { key: 'wStageWinTeam', label: 'Stage Win Team', type: 'number' as const, validation: expTableSchema.shape.wStageWinTeam },
  { key: 'wStageDrawTeam', label: 'Stage Draw Team', type: 'number' as const, validation: expTableSchema.shape.wStageDrawTeam },
  { key: 'wStageLoseTeam', label: 'Stage Lose Team', type: 'number' as const, validation: expTableSchema.shape.wStageLoseTeam },
  { key: 'wWinTeam', label: 'Win Team', type: 'number' as const, validation: expTableSchema.shape.wWinTeam },
  { key: 'wPerfectWinTeam', label: 'Perfect Win Team', type: 'number' as const, validation: expTableSchema.shape.wPerfectWinTeam },
  { key: 'wNormal_Race', label: 'Normal Race', type: 'number' as const, validation: expTableSchema.shape.wNormal_Race },
  { key: 'wSuperRace', label: 'Super Race', type: 'number' as const, validation: expTableSchema.shape.wSuperRace },
  { key: 'dwMobExp', label: 'Mob Exp', type: 'number' as const, validation: expTableSchema.shape.dwMobExp },
  { key: 'dwPhyDefenceRef', label: 'Physical Defence', type: 'number' as const, validation: expTableSchema.shape.dwPhyDefenceRef },
  { key: 'dwEngDefenceRef', label: 'Energy Defence', type: 'number' as const, validation: expTableSchema.shape.dwEngDefenceRef },
  { key: 'dwMobZenny', label: 'Mob Zenny', type: 'number' as const, validation: expTableSchema.shape.dwMobZenny },
];

const expTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this experience entry',
    columns: ['tblidx', 'dwExp', 'dwNeed_Exp']
  }
];

const expTableTabs = [
  {
    id: 'solo',
    label: 'Solo Statistics',
    sections: [
      {
        id: 'solo-stats',
        title: 'Solo Statistics',
        description: 'Configure statistics for solo gameplay',
        columns: [
          'wStageWinSolo',
          'wStageDrawSolo',
          'wStageLoseSolo',
          'wWinSolo',
          'wPerfectWinSolo'
        ]
      }
    ]
  },
  {
    id: 'team',
    label: 'Team Statistics',
    sections: [
      {
        id: 'team-stats',
        title: 'Team Statistics',
        description: 'Configure statistics for team gameplay',
        columns: [
          'wStageWinTeam',
          'wStageDrawTeam',
          'wStageLoseTeam',
          'wWinTeam',
          'wPerfectWinTeam'
        ]
      }
    ]
  },
  {
    id: 'other',
    label: 'Other Statistics',
    sections: [
      {
        id: 'other-stats',
        title: 'Other Statistics',
        description: 'Configure additional game statistics',
        columns: [
          'wNormal_Race',
          'wSuperRace',
          'dwMobExp',
          'dwPhyDefenceRef',
          'dwEngDefenceRef',
          'dwMobZenny'
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
      add: "Add Experience Entry",
      edit: "Edit Experience Entry",
      duplicate: "Duplicate Experience Entry"
    },
    className: "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold",
  },
  description: {
    text: {
      add: "Create a new experience entry with the details below.",
      edit: "Modify the experience values for this entry.",
      duplicate: "Create a new entry based on the selected experience data."
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
        add: "Add Entry",
        edit: "Save Changes",
        duplicate: "Duplicate Entry"
      },
      className: "flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    },
  },
} as const;

export default function ExpTablePage() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id') || '';
  const { userProfile } = useStore();
  const selectedTable = userProfile?.data?.id === tableId ? {
    id: tableId,
    name: 'Experience Table',
    type: 'exp',
  } : undefined;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [selectedRow, setSelectedRow] = useState<ExpTableRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

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
  } = useTableData<ExpTableRow>({
    config: {
      tableName: 'table_exp_data',
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
      const response = await fetch(`/api/export?table=exp&table_id=${tableId}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exp_table.csv`;
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
        title={selectedTable?.name || 'Experience Table'}
        description="Manage experience points and rewards"
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
            setSelectedRow({ ...rest, id: '' } as ExpTableRow);
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
          <ModularForm<ExpTableFormData>
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
            sections={expTableSections}
            tabs={expTableTabs}
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