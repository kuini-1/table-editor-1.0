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
  onRowSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (row: T) => void;
  onDuplicate: (row: T) => void;
  onDelete: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onEdit,
  onDuplicate,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
      <div className="overflow-x-auto">
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <th className="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left">
                    <Checkbox
                      checked={data.length > 0 && selectedRows.size === data.length}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      aria-label="Select all"
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="sticky right-0 z-20 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
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
                    <td className="sticky left-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 px-4 py-3 transition-colors">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => onRowSelect(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-1 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                      >
                        {String(row[column.key as keyof T])}
                      </td>
                    ))}
                    <td className="sticky right-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 px-4 py-3 text-right whitespace-nowrap transition-colors">
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
      </div>
    </div>
  );
} 