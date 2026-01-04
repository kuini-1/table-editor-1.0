import { useState, useEffect, useCallback, useRef } from 'react';
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
  const permissionCacheRef = useRef<Record<string, { result: boolean; timestamp: number }>>({});
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoize supabase client to prevent recreation
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const filterDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingFiltersRef = useRef<ColumnFilters>({});
  
  // Extract config values to refs to avoid dependency issues
  const configRef = useRef(config);
  configRef.current = config;

  const PERMISSION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const FILTER_DEBOUNCE_MS = 400; // 400ms debounce for filter changes

  const checkPermission = useCallback(async (action: 'get' | 'put' | 'post' | 'delete'): Promise<boolean> => {
    if (!tableId) {
      console.error('No table ID provided for permission check');
      return false;
    }

    const cacheKey = `${tableId}-${action}`;
    const cached = permissionCacheRef.current[cacheKey];
    if (cached && Date.now() - cached.timestamp < PERMISSION_CACHE_DURATION) {
      return cached.result;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return false;
      }

      const actionMap = {
        'get': 'select',
        'put': 'update',
        'post': 'insert',
        'delete': 'delete'
      };

      const dbAction = actionMap[action];
      const { data, error } = await supabase.rpc('check_table_permission', {
        p_table_id: tableId,
        p_action: dbAction
      });

      if (error) {
        return false;
      }

      const result = !!data;
      permissionCacheRef.current = {
        ...permissionCacheRef.current,
        [cacheKey]: { result, timestamp: Date.now() }
      };

      return result;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }, [tableId, supabase]);

  const handleError = (err: object | unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const fetchData = useCallback(async (currentFilters = filters, useExactCount = false) => {
    if (!tableId) {
      setError('No table ID provided');
      setLoading(false);
      setIsFiltering(false);
      return;
    }

    try {
      const hasPermission = await checkPermission('get');
      if (!hasPermission) {
        setError('You do not have permission to view this table');
        setLoading(false);
        setIsFiltering(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Use estimated count for better performance, especially with filters
      // Only use exact count when explicitly requested (e.g., for export)
      const countMode = useExactCount ? 'exact' : 'estimated';

      let query = supabase
        .from(configRef.current.tableName)
        .select('*', { count: countMode })
        .eq('table_id', tableId)
        .range((page - 1) * pageSize, (page * pageSize) - 1);

      // Apply filters
      for (const [column, filter] of Object.entries(currentFilters)) {
        const columnConfig = configRef.current.columns.find(col => col.key === column);
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
                table_name: configRef.current.tableName,
                column_name: column,
                search_value: value
              });
              if (rpcError) {
                console.error('Error in partial number search:', rpcError);
                continue;
              }
              if (matchingRows && matchingRows.length > 0) {
                const matchingIds = matchingRows.map((row: Record<string, unknown>) => row.id);
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
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [filters, tableId, checkPermission, page, pageSize]);

  const handleAddRow = async (formData: Omit<T, 'id'>) => {
    try {
      const hasPermission = await checkPermission('post');
      if (!hasPermission) {
        throw new Error('You do not have permission to add rows to this table');
      }

      const { data: newRow, error } = await supabase
        .from(configRef.current.tableName)
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, newRow as T]);
      setTotalRows(prev => prev + 1);
      toast.success('Row added successfully');
      return newRow as T;
    } catch (err) {
      handleError(err);
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
        .from(configRef.current.tableName)
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(row => row.id === id ? (updatedRow as T) : row));
      toast.success('Row updated successfully');
      return updatedRow as T;
    } catch (err: object | unknown) {
      handleError(err);
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
        .from(configRef.current.tableName)
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
    } catch (err: object | unknown) {
      handleError(err);
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
          .from(configRef.current.tableName)
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
    } catch (err: object | unknown) {
      handleError(err);
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
        .from(configRef.current.tableName)
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, newRow as T]);
      setTotalRows(prev => prev + 1);
      toast.success('Row duplicated successfully');
      return newRow as T;
    } catch (err: object | unknown) {
      handleError(err);
      throw err;
    }
  };

  const handleAddFilter = (column: string, operator: ColumnFilter['operator'], value: string) => {
    // Clear existing debounce timer
    if (filterDebounceTimer.current) {
      clearTimeout(filterDebounceTimer.current);
    }

    // Update pending filters immediately for UI responsiveness
    const newFilters = {
      ...filters,
      [column]: { operator, value }
    };
    pendingFiltersRef.current = newFilters;
    setIsFiltering(true);

    // Debounce the actual filter application
    filterDebounceTimer.current = setTimeout(() => {
      setFilters(pendingFiltersRef.current);
      setPage(1);
      filterDebounceTimer.current = null;
    }, FILTER_DEBOUNCE_MS);
  };

  const handleRemoveFilter = (column: string) => {
    // Clear existing debounce timer
    if (filterDebounceTimer.current) {
      clearTimeout(filterDebounceTimer.current);
    }

    // Update pending filters immediately
    const newFilters = { ...filters };
    delete newFilters[column];
    pendingFiltersRef.current = newFilters;
    setIsFiltering(true);

    // Debounce the actual filter removal
    filterDebounceTimer.current = setTimeout(() => {
      setFilters(pendingFiltersRef.current);
      setPage(1);
      filterDebounceTimer.current = null;
    }, FILTER_DEBOUNCE_MS);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleRowSelection = (id: string | 'all' | 'none') => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (id === 'all') {
        data.forEach(row => next.add(row.id));
      } else if (id === 'none') {
        next.clear();
      } else {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
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
  }, [tableId, page, pageSize, filters, fetchData]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (filterDebounceTimer.current) {
        clearTimeout(filterDebounceTimer.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    totalRows,
    page,
    pageSize,
    filters,
    selectedRows,
    isFiltering,
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
