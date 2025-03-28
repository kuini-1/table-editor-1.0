import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, RefreshCw, Trash2 } from 'lucide-react';
import { TableFilter, type ColumnFilter, type ColumnFilters } from './TableFilter';

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
  onBulkDelete: () => void;
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
    <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRow}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Row</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedCount})</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <TableFilter
            columns={columns}
            filters={filters}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter}
          />
        </div>
      </div>
    </div>
  );
} 