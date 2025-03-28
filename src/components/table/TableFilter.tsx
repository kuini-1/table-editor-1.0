import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface ColumnFilter {
  operator: 'contains' | 'equals' | 'greater' | 'less';
  value: string;
}

export interface ColumnFilters {
  [key: string]: ColumnFilter;
}

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
}

interface TableFilterProps {
  columns: Column[];
  filters: ColumnFilters;
  onAddFilter: (column: string, operator: ColumnFilter['operator'], value: string) => void;
  onRemoveFilter: (column: string) => void;
}

export function TableFilter({
  columns,
  filters,
  onAddFilter,
  onRemoveFilter,
}: TableFilterProps) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [operator, setOperator] = useState<ColumnFilter['operator']>('contains');
  const [value, setValue] = useState('');
  const [booleanValue, setBooleanValue] = useState<boolean>(false);
  const [selectedColumnType, setSelectedColumnType] = useState<'text' | 'number' | 'boolean'>('text');

  const columnLabels = Object.fromEntries(
    columns.map(col => [col.key, col.label])
  );

  // Update the selected column type when the column changes
  useEffect(() => {
    if (selectedColumn) {
      const column = columns.find(col => col.key === selectedColumn);
      if (column) {
        setSelectedColumnType(column.type || 'text');
        // Reset operator for boolean columns
        if (column.type === 'boolean') {
          setOperator('equals');
        }
      }
    }
  }, [selectedColumn, columns]);

  const handleAddFilter = () => {
    if (!selectedColumn) return;
    
    // Handle different value types
    let filterValue = value;
    if (selectedColumnType === 'boolean') {
      filterValue = booleanValue.toString();
    } else if (!value.trim()) {
      return;
    }
    
    onAddFilter(selectedColumn, operator, filterValue);
    setSelectedColumn('');
    setOperator('contains');
    setValue('');
    setBooleanValue(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
          {Object.keys(filters).length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-medium text-white">
              {Object.keys(filters).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[600px] p-4">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium">Filter Data</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add filters to refine the table data
            </p>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
            <Select
              value={selectedColumn}
              onValueChange={setSelectedColumn}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <ScrollArea className="h-[200px]">
                  {columns
                    .filter(col => !filters[col.key])
                    .map(col => (
                      <SelectItem key={col.key} value={col.key}>
                        {col.label}
                      </SelectItem>
                    ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            <Select
              value={operator}
              onValueChange={(value) => setOperator(value as ColumnFilter['operator'])}
              disabled={selectedColumnType === 'boolean'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
              </SelectContent>
            </Select>

            {selectedColumnType === 'boolean' ? (
              <div className="flex items-center h-10 px-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <Checkbox 
                  id="boolean-value" 
                  checked={booleanValue} 
                  onCheckedChange={(checked) => setBooleanValue(!!checked)}
                  className="h-4 w-4 rounded-sm border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                />
                <Label htmlFor="boolean-value" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {booleanValue ? 'True' : 'False'}
                </Label>
              </div>
            ) : (
              <Input
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
            )}
          </div>
          <Button 
            onClick={handleAddFilter}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white dark:text-white"
            disabled={!selectedColumn || (!value.trim() && selectedColumnType !== 'boolean')}
          >
            Add Filter
          </Button>
          {Object.keys(filters).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Active Filters</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([column, filter]) => (
                  <Badge
                    key={column}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2"
                  >
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">{columnLabels[column]}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {filter.operator}
                    </span>
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">{filter.value}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => onRemoveFilter(column)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 