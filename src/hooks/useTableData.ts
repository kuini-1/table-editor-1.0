import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { ColumnFilter, ColumnFilters } from '@/components/table/TableFilter';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { useEditingSession } from './useEditingSession';

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
  const userCacheRef = useRef<{ user: { id: string } | null; timestamp: number } | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Memoize supabase client to prevent recreation
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const filterDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingFiltersRef = useRef<ColumnFilters>({});
  
  // Extract config values to refs to avoid dependency issues
  const configRef = useRef(config);
  configRef.current = config;

  // Track viewing session for this table
  useEditingSession({
    tableId,
    sessionType: 'viewing',
    enabled: !!tableId,
  });

  const PERMISSION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const USER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes - cache user to avoid duplicate getUser() calls
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
      // Use cached user if available to avoid duplicate getUser() calls
      let user = userCacheRef.current?.user || null;
      if (!userCacheRef.current || Date.now() - userCacheRef.current.timestamp > USER_CACHE_DURATION) {
        const { data: { user: fetchedUser } } = await supabase.auth.getUser();
        user = fetchedUser;
        userCacheRef.current = { user: fetchedUser, timestamp: Date.now() };
      }
      
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
        console.error('Error checking table permission:', {
          tableId,
          action: dbAction,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return false;
      }

      // Log the actual RPC response
      console.log('RPC check_table_permission response:', {
        tableId,
        action: dbAction,
        data,
        dataType: typeof data,
        dataValue: data,
        isTrue: data === true,
        isTruthy: !!data,
        isStrictlyTrue: data === true,
        isStrictlyFalse: data === false,
        isNull: data === null,
        isUndefined: data === undefined
      });

      // If RPC returns false but we have permission in database, log a warning
      if (!data && userCacheRef.current?.user) {
        // Double-check by querying directly
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: subOwner } = await supabase
              .from('sub_owners')
              .select('id')
              .eq('profile_id', user.id)
              .single();
            
            if (subOwner) {
              const { data: directPerms } = await supabase
                .from('sub_owner_permissions')
                .select('can_get, can_put, can_post, can_delete')
                .eq('sub_owner_id', subOwner.id)
                .eq('table_id', tableId)
                .single();
              
              if (directPerms && directPerms[`can_${action === 'get' ? 'get' : action === 'put' ? 'put' : action === 'post' ? 'post' : 'delete'}`]) {
                console.warn('RPC function returned false but direct query shows permission exists!', {
                  tableId,
                  action,
                  dbAction,
                  directPerms,
                  rpcResult: data
                });
              }
            }
          }
        } catch (checkError) {
          console.error('Error in permission double-check:', checkError);
        }
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
    let errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    
    // Check if it's a bandwidth limit error
    if (err && typeof err === 'object' && 'error' in err) {
      const supabaseError = err as { error?: { code?: string; message?: string } };
      if (supabaseError.error?.code === 'BANDWIDTH_LIMIT_EXCEEDED') {
        errorMessage = supabaseError.error.message || 'Bandwidth limit exceeded. Please upgrade your plan to continue.';
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/settings?section=subscription'
          }
        });
        return;
      }
    }
    
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
        // Try to get more diagnostic info
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check if user is sub_owner
            const { data: subOwner } = await supabase
              .from('sub_owners')
              .select('id')
              .eq('profile_id', user.id)
              .single();
            
            if (subOwner) {
              // Check permissions directly
              const { data: permissions } = await supabase
                .from('sub_owner_permissions')
                .select('can_get, table_id')
                .eq('sub_owner_id', subOwner.id)
                .eq('table_id', tableId)
                .single();
              
              console.error('Permission check failed. Diagnostic info:', {
                tableId,
                userId: user.id,
                subOwnerId: subOwner.id,
                permissions,
                hasPermissionRecord: !!permissions,
                canGet: permissions?.can_get,
              });
            }
          }
        } catch (diagError) {
          console.error('Error getting diagnostic info:', diagError);
        }
        
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

      // Determine the ID field to sort by - prefer tblidx if it exists, otherwise use id
      // Check if table has tblidx column (common in game data tables)
      const hasTblidxColumn = configRef.current.columns.some(col => col.key === 'tblidx');
      const sortField = hasTblidxColumn ? 'tblidx' : 'id';
      
      let query = supabase
        .from(configRef.current.tableName)
        .select('*', { count: countMode })
        .eq('table_id', tableId)
        .order(sortField, { ascending: true }) // Default sort by ID ascending (small to big)
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

      if (fetchError) {
        // Check if it's a bandwidth limit error
        if (fetchError.code === 'BANDWIDTH_LIMIT_EXCEEDED') {
          const errorMsg = fetchError.message || 'Bandwidth limit exceeded. Please upgrade your plan to continue.';
          setError(errorMsg);
          toast.error(errorMsg);
          setLoading(false);
          setIsFiltering(false);
          return;
        }
        throw fetchError;
      }

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

  // Track last fetch to prevent duplicate calls (including React Strict Mode double renders)
  const fetchInProgressRef = useRef(false);
  const lastFetchKeyRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  // Fetch data when dependencies change
  useEffect(() => {
    if (!tableId) return;
    
    // Create a unique key for this fetch
    const fetchKey = `${tableId}-${page}-${pageSize}-${JSON.stringify(filters)}`;
    
    // Skip if this exact fetch is already in progress or was just completed
    if (fetchInProgressRef.current || lastFetchKeyRef.current === fetchKey) {
      return;
    }
    
    // On first mount, wait a tiny bit to avoid React Strict Mode double calls
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Use a small delay to batch React Strict Mode calls
      const timeoutId = setTimeout(() => {
        if (lastFetchKeyRef.current !== fetchKey) {
          lastFetchKeyRef.current = fetchKey;
          fetchInProgressRef.current = true;
          
          // Debounce filter changes, but not page/pageSize changes or initial load
          if (Object.keys(filters).length > 0) {
            if (filterDebounceTimer.current) {
              clearTimeout(filterDebounceTimer.current);
            }
            
            filterDebounceTimer.current = setTimeout(async () => {
              await fetchData(filters, false);
              fetchInProgressRef.current = false;
            }, FILTER_DEBOUNCE_MS);
          } else {
            // Immediate fetch for page/pageSize changes or initial load
            fetchData().finally(() => {
              fetchInProgressRef.current = false;
            });
          }
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
    
    lastFetchKeyRef.current = fetchKey;
    fetchInProgressRef.current = true;
    
    // Debounce filter changes, but not page/pageSize changes
    if (Object.keys(filters).length > 0) {
      if (filterDebounceTimer.current) {
        clearTimeout(filterDebounceTimer.current);
      }
      
      filterDebounceTimer.current = setTimeout(async () => {
        await fetchData(filters, false);
        fetchInProgressRef.current = false;
      }, FILTER_DEBOUNCE_MS);
    } else {
      // Immediate fetch for page/pageSize changes
      fetchData().finally(() => {
        fetchInProgressRef.current = false;
      });
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
