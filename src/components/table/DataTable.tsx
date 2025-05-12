import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Copy, Trash2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  selectedRows: Set<string>;
  onRowSelect: (id: string | 'all' | 'none') => void;
  onEdit: (row: T) => void;
  onDuplicate: (row: T) => void;
  onDelete: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  selectedRows,
  onRowSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    onRowSelect(checked ? 'all' : 'none');
  };

  const handleSelectRow = (id: string) => {
    onRowSelect(id);
  };

  const isAllSelected = data.length > 0 && data.every(row => selectedRows.has(row.id));
  const isIndeterminate = !isAllSelected && data.some(row => selectedRows.has(row.id));

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
      <div className="relative max-h-[calc(100vh-16rem)] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="sticky top-0 z-30">
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <th className="sticky left-0 z-40 bg-gray-50 dark:bg-gray-800 w-[50px] px-4 py-3">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="h-4 w-4 rounded-sm border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                    data-state={isIndeterminate ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked'}
                  />
                </div>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 z-40 bg-gray-50 dark:bg-gray-800 w-[120px] px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="sticky left-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 w-[50px] px-4 py-3 transition-colors">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                      aria-label={`Select row ${row.id}`}
                      className="h-4 w-4 rounded-sm border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                    />
                  </div>
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                  >
                    {column.type === 'boolean' ? (
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${row[column.key as keyof T] ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="ml-2">{row[column.key as keyof T] ? 'Yes' : 'No'}</span>
                      </div>
                    ) : (
                      String(row[column.key as keyof T])
                    )}
                  </td>
                ))}
                <td className="sticky right-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 w-[120px] px-4 py-3 text-right transition-colors">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicate(row)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(row)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 