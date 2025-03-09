import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, RefreshCcw, Trash2 } from "lucide-react";
import { TableFilter } from "./TableFilter";
import type { ColumnFilter, ColumnFilters } from "./TableFilter";

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
}

interface TableHeaderProps {
  title: string;
  description: string;
  columns: Column[];
  filters: ColumnFilters;
  selectedCount: number;
  onAddRow: () => void;
  onImport: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onBulkDelete?: () => void;
  onAddFilter: (column: string, operator: ColumnFilter['operator'], value: string) => void;
  onRemoveFilter: (column: string) => void;
  showExport?: boolean;
}

export function TableHeader({
  title,
  description,
  columns,
  filters,
  selectedCount,
  onAddRow,
  onImport,
  onExport,
  onRefresh,
  onBulkDelete,
  onAddFilter,
  onRemoveFilter,
  showExport = true,
}: TableHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:gap-0">
              {selectedCount > 0 && onBulkDelete && (
                <Button 
                  variant="destructive" 
                  onClick={onBulkDelete}
                  className="flex items-center justify-center gap-2 w-full lg:hidden"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCount})
                </Button>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {selectedCount > 0 && onBulkDelete && (
                  <Button 
                    variant="destructive" 
                    onClick={onBulkDelete}
                    className="hidden lg:flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedCount})
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onImport}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
                {showExport && (
                  <Button
                    variant="outline"
                    onClick={onExport}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                )}
                <div className="w-full">
                  <TableFilter
                    columns={columns}
                    filters={filters}
                    onAddFilter={onAddFilter}
                    onRemoveFilter={onRemoveFilter}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  onClick={onAddRow}
                  className="col-span-2 md:col-span-4 lg:col-span-1 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white dark:text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 