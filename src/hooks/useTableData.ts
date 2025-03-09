import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { ColumnFilter, ColumnFilters } from '@/components/table/TableFilter';
import { ErrorDisplay } from '@/components/ErrorDisplay';

interface TableConfig {
  tableName: string;
  columns: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'boolean';
  }[];
}

interface TableData<T> {
  data: T[];
  totalRows: number;
  lastFetched: number;
  filters: ColumnFilters;
  page: number;
  pageSize: number;
}

interface UseTableDataProps {
  config: TableConfig;
  tableId: string;
}

export function useTableData<T extends { id: string }>({ config, tableId }: UseTableDataProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<ColumnFilters>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const checkPermission = async (action: 'get' | 'put' | 'post' | 'delete'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_table_permission', {
        p_table_id: tableId,
        p_action: action.toUpperCase()
      });

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Permission check failed for ${action}:`, error);
      return false;
    }
  };

  const handleError = (err: any, customMessage?: string) => {
    const errorMessage = err.message || customMessage || 'An unexpected error occurred';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const fetchData = async (currentFilters = filters) => {
    if (!tableId) return;

    try {
      const hasPermission = await checkPermission('get');
      if (!hasPermission) {
        throw new Error('You do not have permission to view this table');
      }

      setLoading(true);
      setError(null);

      let query = supabase
        .from(config.tableName)
        .select('*', { count: 'exact' })
        .eq('table_id', tableId)
        .range((page - 1) * pageSize, (page * pageSize) - 1);

      // Apply filters
      for (const [column, filter] of Object.entries(currentFilters)) {
        const columnConfig = config.columns.find(col => col.key === column);
        const value = filter.value.trim();
        const isNumericColumn = columnConfig?.type === 'number';
        const isBooleanColumn = columnConfig?.type === 'boolean';
        
        if (!value) continue;

        if (isBooleanColumn) {
          // Handle boolean values (stored as 0/1 in the database)
          const boolValue = value.toLowerCase() === 'true' || value === '1';
          query = query.eq(column, boolValue ? 1 : 0);
        } else if (isNumericColumn) {
          const numValue = Number(value);
          if (isNaN(numValue)) continue;

          switch (filter.operator) {
            case 'equals':
              query = query.eq(column, numValue);
              break;
            case 'greater':
              query = query.gt(column, numValue);
              break;
            case 'less':
              query = query.lt(column, numValue);
              break;
            case 'contains': {
              const { data: matchingRows, error: rpcError } = await supabase.rpc('search_partial_number', {
                table_name: config.tableName,
                column_name: column,
                search_value: value
              });
              if (rpcError) {
                console.error('Error in partial number search:', rpcError);
                continue;
              }
              if (matchingRows && matchingRows.length > 0) {
                const matchingIds = matchingRows.map((row: any) => row.id);
                if (matchingIds.length > 0) {
                  query = query.in('id', matchingIds);
                }
              }
              break;
            }
          }
        } else {
          switch (filter.operator) {
            case 'equals':
              query = query.eq(column, value);
              break;
            case 'contains':
              query = query.ilike(column, `%${value}%`);
              break;
            case 'greater':
              query = query.gt(column, value);
              break;
            case 'less':
              query = query.lt(column, value);
              break;
          }
        }
      }

      const { data: rows, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setData(rows as T[]);
      setTotalRows(count || 0);
    } catch (err: any) {
      handleError(err, 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async (formData: Omit<T, 'id'>) => {
    try {
      const hasPermission = await checkPermission('post');
      if (!hasPermission) {
        throw new Error('You do not have permission to add rows to this table');
      }

      const { data: newRow, error } = await supabase
        .from(config.tableName)
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, newRow as T]);
      setTotalRows(prev => prev + 1);
      toast.success('Row added successfully');
      return newRow as T;
    } catch (err: any) {
      handleError(err, 'Failed to add row');
      throw err;
    }
  };

  const handleEditRow = async (id: string, formData: Partial<T>) => {
    try {
      const hasPermission = await checkPermission('put');
      if (!hasPermission) {
        throw new Error('You do not have permission to edit rows in this table');
      }

      const { data: updatedRow, error } = await supabase
        .from(config.tableName)
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(row => row.id === id ? (updatedRow as T) : row));
      toast.success('Row updated successfully');
      return updatedRow as T;
    } catch (err: any) {
      handleError(err, 'Failed to update row');
      throw err;
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const hasPermission = await checkPermission('delete');
      if (!hasPermission) {
        throw new Error('You do not have permission to delete rows from this table');
      }

      const { error } = await supabase
        .from(config.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => prev.filter(row => row.id !== id));
      setTotalRows(prev => prev - 1);
      setSelectedRows(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success('Row deleted successfully');
    } catch (err: any) {
      handleError(err, 'Failed to delete row');
      throw err;
    }
  };

  const handleBulkDelete = async () => {
    try {
      const hasPermission = await checkPermission('delete');
      if (!hasPermission) {
        throw new Error('You do not have permission to delete rows from this table');
      }

      const deletePromises = Array.from(selectedRows).map(id =>
        supabase
          .from(config.tableName)
          .delete()
          .eq('id', id)
      );

      const results = await Promise.all(deletePromises);
      const errors = results.filter(result => result.error).map(result => result.error);

      if (errors.length > 0) {
        throw new Error(`Failed to delete some rows: ${errors.map(e => e?.message || 'Unknown error').join(', ')}`);
      }

      setData(prev => prev.filter(row => !selectedRows.has(row.id)));
      setTotalRows(prev => prev - selectedRows.size);
      setSelectedRows(new Set());
      toast.success('Selected rows deleted successfully');
    } catch (err: any) {
      handleError(err, 'Failed to delete rows');
      throw err;
    }
  };

  const handleDuplicateRow = async (formData: Omit<T, 'id'>) => {
    try {
      const hasPermission = await checkPermission('post');
      if (!hasPermission) {
        throw new Error('You do not have permission to add rows to this table');
      }

      const { data: newRow, error } = await supabase
        .from(config.tableName)
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, newRow as T]);
      setTotalRows(prev => prev + 1);
      toast.success('Row duplicated successfully');
      return newRow as T;
    } catch (err: any) {
      handleError(err, 'Failed to duplicate row');
      throw err;
    }
  };

  const handleAddFilter = (column: string, operator: ColumnFilter['operator'], value: string) => {
    const newFilters = {
      ...filters,
      [column]: { operator, value }
    };
    setFilters(newFilters);
    setPage(1);
  };

  const handleRemoveFilter = (column: string) => {
    const { [column]: _, ...rest } = filters;
    setFilters(rest);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const refreshData = () => {
    fetchData();
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (tableId) {
      fetchData();
    }
  }, [tableId, page, pageSize, filters]);

  return {
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
    ErrorDisplay,
  };
} 