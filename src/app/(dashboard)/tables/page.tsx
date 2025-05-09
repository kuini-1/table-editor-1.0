'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { RefreshCcw, ExternalLink, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStore } from '@/lib/store';

interface ActivityLogResponse {
  id: string;
  action: 'POST' | 'PUT' | 'DELETE';
  details: string;
  user_id: string;
  created_at: string;
  table_id: string;
  profile: {
    email: string;
    full_name: string;
  };
}

interface TableResponse {
  id: string;
  name: string;
  type: string;
  owner_id: string;
}

interface SubOwnerPermissionResponse {
  table_id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  table: TableResponse;
}

interface ActivityLog {
  id: string;
  action: 'POST' | 'PUT' | 'DELETE';
  details: string;
  user_id: string;
  created_at: string;
  table_id: string;
  user?: {
    profile: {
      full_name: string | null;
      email: string;
    };
  };
}

export interface Table {
  id: string;
  name: string;
  type: string;
  owner_id: string;
  permissions?: {
    can_get: boolean;
    can_put: boolean;
    can_post: boolean;
    can_delete: boolean;
  };
}

export interface SubOwnerPermission {
  id: string;
  table_id: string;
  sub_owner_id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  profile: {
    email: string;
    full_name: string;
  };
}

export interface DatabaseTable {
  id: string;
  name: string;
  type: string;
  owner_id: string;
  permissions: {
    can_get: boolean;
    can_put: boolean;
    can_post: boolean;
    can_delete: boolean;
  };
  subAccounts?: SubOwnerPermission[];
  activity_logs?: ActivityLog[];
}

interface CachedTables {
  data: DatabaseTable[];
  timestamp: number;
  userRole: string;
  activityLogs: {
    [tableId: string]: {
      logs: ActivityLog[];
      timestamp: number;
    };
  };
}

interface SubOwnerProfileResponse {
  profile: {
    email: string;
    full_name: string | null;
  };
}

interface SubOwnerWithProfileResponse {
  sub_owner: SubOwnerProfileResponse;
  id: string;
  table_id: string;
  sub_owner_id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
}

export default function TablesPage() {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [subAccounts, setSubAccounts] = useState<SubOwnerPermission[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [cachedTables, setCachedTables] = useState<CachedTables | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();
  const [isLoadingMoreLogs, setIsLoadingMoreLogs] = useState(false);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const activityLogRef = useRef<HTMLDivElement>(null);

  const {
    userProfile,
    fetchUserProfile,
  } = useStore();

  const CACHE_DURATION = {
    TABLES: 5 * 60 * 1000, // 5 minutes
    ACTIVITY_LOGS: 2 * 60 * 1000, // 2 minutes
    SUB_ACCOUNTS: 5 * 60 * 1000 // 5 minutes
  };

  useEffect(() => {
    const initProfile = async () => {
      fetchUserAndTables();
      if (!userProfile) {
        await fetchUserProfile();
      }
    };
    initProfile();
  });

  useEffect(() => {
    if (selectedTable) {
      const cachedLogs = cachedTables?.activityLogs?.[selectedTable.id];
      if (cachedLogs && Date.now() - cachedLogs.timestamp < CACHE_DURATION.ACTIVITY_LOGS) {
        setActivityLogs(cachedLogs.logs);
      } else {
        fetchActivityLogs(selectedTable.id);
      }
    } else {
      setActivityLogs([]);
    }
  }, [selectedTable]);

  const fetchUserAndTables = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cachedTables && Date.now() - cachedTables.timestamp < CACHE_DURATION.TABLES) {
        setTables(cachedTables.data);
        setUserRole(cachedTables.userRole);
        setLoading(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Get profile, tables, and permissions in a single query
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          role,
          owners!owners_profile_id_fkey (
            id,
            tables (
              id,
              name,
              type,
              owner_id
            )
          ),
          sub_owners!sub_owners_profile_id_fkey (
            id,
            owner_id,
            permissions:sub_owner_permissions (
              table_id,
              can_get,
              can_put,
              can_post,
              can_delete,
              table:tables (
                id,
                name,
                type,
                owner_id
              )
            )
          )
        `)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('No profile found');

      setUserRole(profileData.role);
      let formattedTables: DatabaseTable[] = [];

      if (profileData.role === 'owner' && profileData.owners?.[0]?.tables) {
        const tables = profileData.owners[0].tables as unknown as TableResponse[];
        formattedTables = tables.map(table => ({
          id: table.id,
          name: table.name,
          type: table.type,
          owner_id: table.owner_id,
          permissions: {
            can_get: true,
            can_put: true,
            can_post: true,
            can_delete: true
          }
        }));
      } else if (profileData.role === 'sub_owner' && profileData.sub_owners?.[0]?.permissions) {
        const permissions = profileData.sub_owners[0].permissions as unknown as SubOwnerPermissionResponse[];
        formattedTables = permissions
          .filter(p => p.table)
          .map(p => ({
            id: p.table.id,
            name: p.table.name,
            type: p.table.type,
            owner_id: p.table.owner_id,
            permissions: {
              can_get: p.can_get,
              can_put: p.can_put,
              can_post: p.can_post,
              can_delete: p.can_delete
            }
          }));
      }

      // Fetch activity logs for all tables in a single query
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          details,
          user_id,
          created_at,
          table_id,
          profile:profiles (
            full_name,
            email
          )
        `)
        .in('table_id', formattedTables.map(t => t.id))
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      // Group logs by table
      const activityLogsMap: { [key: string]: { logs: ActivityLog[], timestamp: number } } = {};
      const logs = logsData as unknown as ActivityLogResponse[];
      logs?.forEach(log => {
        if (!activityLogsMap[log.table_id]) {
          activityLogsMap[log.table_id] = {
            logs: [],
            timestamp: Date.now()
          };
        }
        activityLogsMap[log.table_id].logs.push({
          id: log.id,
          action: log.action,
          details: log.details,
          user_id: log.user_id,
          created_at: log.created_at,
          table_id: log.table_id,
          user: {
            profile: {
              full_name: log.profile?.full_name,
              email: log.profile?.email
            }
          }
        });
      });

      // Update cache and state
      setCachedTables({
        data: formattedTables,
        timestamp: Date.now(),
        userRole: profileData.role,
        activityLogs: activityLogsMap
      });
      setTables(formattedTables);
      setLoading(false);
    } catch (err: object | unknown) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setLoading(false);
    }
  };

  const fetchSubAccounts = async (tableId: string) => {
    try {
      // Check if we have cached sub-accounts
      const cachedSubAccounts = cachedTables?.data.find(t => t.id === tableId)?.subAccounts;
      if (cachedSubAccounts && Date.now() - (cachedTables?.timestamp || 0) < CACHE_DURATION.SUB_ACCOUNTS) {
        setSubAccounts(cachedSubAccounts);
        return;
      }

      const { data: permissions, error: permissionsError } = await supabase
        .from('sub_owner_permissions')
        .select(`
          id,
          table_id,
          sub_owner_id,
          can_get,
          can_put,
          can_post,
          can_delete,
          sub_owner:sub_owners (
            profile:profiles (
              email,
              full_name
            )
          )
        `)
        .eq('table_id', tableId);

      if (permissionsError) throw permissionsError;

      const permissionsData = permissions as unknown as SubOwnerWithProfileResponse[];
      const formattedPermissions = permissionsData?.map(p => ({
        id: p.id,
        table_id: p.table_id,
        sub_owner_id: p.sub_owner_id,
        can_get: p.can_get,
        can_put: p.can_put,
        can_post: p.can_post,
        can_delete: p.can_delete,
        profile: {
          email: p.sub_owner.profile.email,
          full_name: p.sub_owner.profile.full_name || ''
        }
      })) || [];

      // Update cache with sub-accounts
      if (cachedTables) {
        const updatedTables = cachedTables.data.map(t => 
          t.id === tableId ? { ...t, subAccounts: formattedPermissions } : t
        );
        setCachedTables({
          ...cachedTables,
          data: updatedTables
        });
      }

      setSubAccounts(formattedPermissions);
    } catch (err) {
      console.error('Error fetching sub accounts:', err);
    }
  };

  const handleManageSubAccounts = (table: Table, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Stop event from bubbling up to row click
    setSelectedTable(table);
    setIsManageDialogOpen(true);
    fetchSubAccounts(table.id);
  };

  const getPermissionBadge = (type: string, enabled: boolean, onClick?: () => void) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded transition-all duration-200";
    const colors = {
      GET: enabled 
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400" 
        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-50",
      PUT: enabled 
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400" 
        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-50",
      POST: enabled 
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400" 
        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-50",
      DELETE: enabled 
        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400" 
        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 opacity-50",
    };

    return (
      <button 
        type="button"
        className={`${baseClasses} ${colors[type as keyof typeof colors]} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-200 dark:hover:ring-gray-700' : ''}`}
        onClick={onClick}
        disabled={!onClick}
      >
        {type}
      </button>
    );
  };

  const toggleSubAccountPermission = async (account: SubOwnerPermission, permissionType: 'can_get' | 'can_put' | 'can_post' | 'can_delete') => {
    try {
      const supabase = createClient();
      
      // Update the permission in the database
      const { error: updateError } = await supabase
        .from('sub_owner_permissions')
        .update({ [permissionType]: !account[permissionType] })
        .eq('id', account.id);
      
      if (updateError) throw updateError;

      // Update local state for sub-accounts dialog
      const updatedSubAccounts = subAccounts.map(acc => {
        if (acc.id === account.id) {
          return {
            ...acc,
            [permissionType]: !acc[permissionType]
          };
        }
        return acc;
      });
      setSubAccounts(updatedSubAccounts);

      // No need to refresh the entire tables list since we're only updating permissions in the dialog
    } catch (err) {
      console.error('Error updating permission:', err);
      // Show error to user
      setError('Failed to update permission. Please try again.');
    }
  };

  const fetchActivityLogs = useCallback(async (tableId: string, isLoadMore: boolean = false) => {
    try {
      setIsLoadingMoreLogs(isLoadMore);
      const currentLogs = isLoadMore ? activityLogs : [];
      
      const { data: logsData, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          details,
          user_id,
          created_at,
          table_id,
          profile:profiles!activity_logs_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('table_id', tableId)
        .order('created_at', { ascending: false })
        .range(currentLogs.length, currentLogs.length + 9);

      if (error) throw error;

      const logs = logsData as unknown as ActivityLogResponse[];
      const formattedLogs = logs?.map(log => ({
        id: log.id,
        action: log.action as 'POST' | 'PUT' | 'DELETE',
        details: log.details,
        user_id: log.user_id,
        created_at: log.created_at,
        table_id: log.table_id,
        user: {
          profile: {
            full_name: log.profile?.full_name || null,
            email: log.profile?.email
          }
        }
      })) || [];

      setHasMoreLogs(formattedLogs.length === 10);
      setActivityLogs([...currentLogs, ...formattedLogs]);

      // Update cache
      if (cachedTables) {
        setCachedTables({
          ...cachedTables,
          activityLogs: {
            ...cachedTables.activityLogs,
            [tableId]: {
              logs: [...currentLogs, ...formattedLogs],
              timestamp: Date.now()
            }
          }
        });
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    } finally {
      setIsLoadingMoreLogs(false);
    }
  }, [activityLogs, cachedTables, supabase]);

  // Add scroll handler for infinite scrolling
  const handleActivityLogScroll = useCallback(() => {
    if (!activityLogRef.current || !hasMoreLogs || isLoadingMoreLogs || !selectedTable?.id) return;

    const { scrollTop, scrollHeight, clientHeight } = activityLogRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchActivityLogs(selectedTable.id, true);
    }
  }, [hasMoreLogs, isLoadingMoreLogs, selectedTable, fetchActivityLogs]);

  useEffect(() => {
    const scrollContainer = activityLogRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleActivityLogScroll);
      return () => scrollContainer.removeEventListener('scroll', handleActivityLogScroll);
    }
  }, [handleActivityLogScroll]);

  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-gray-900 dark:text-gray-100">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tables Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tables</h2>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchUserAndTables()}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="sr-only">Refresh</span>
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 px-3 pr-10 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTables.map((table) => (
                        <tr 
                          key={table.id} 
                          className={`hover:bg-gray-50/80 dark:hover:bg-gray-700/50 cursor-pointer ${
                            selectedTable?.id === table.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                          }`}
                          onClick={() => setSelectedTable(table)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {table.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {getPermissionBadge('GET', table.permissions?.can_get || false)}
                              {getPermissionBadge('PUT', table.permissions?.can_put || false)}
                              {getPermissionBadge('POST', table.permissions?.can_post || false)}
                              {getPermissionBadge('DELETE', table.permissions?.can_delete || false)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-8 w-8 p-0"
                              >
                                <Link href={`/tables/${table.type}?id=${table.id}`} target="_blank">
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">Open in new tab</span>
                                </Link>
                              </Button>
                              {userRole === 'owner' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleManageSubAccounts(table, e);
                                      }}
                                    >
                                      Manage Sub-Accounts
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Activity Log Section */}
            <div className="lg:col-span-1 xl:fixed xl:w-[350px] xl:right-[30px]">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Log</h2>
                    {selectedTable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchActivityLogs(selectedTable.id)}
                        className="h-8 w-8 p-0"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="sr-only">Refresh logs</span>
                      </Button>
                    )}
                  </div>
                  {selectedTable ? (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Showing activity for {selectedTable.name}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Select a table to view its activity
                    </p>
                  )}
                </div>
                <div 
                  ref={activityLogRef}
                  className="h-[500px] overflow-y-auto p-4"
                >
                  {selectedTable ? (
                    activityLogs.length > 0 ? (
                      <div className="space-y-3">
                        {activityLogs.map((log, index) => (
                          <div 
                            key={`${log.id}-${log.created_at}-${index}`} 
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`
                                min-w-[60px] text-center px-2 py-1 rounded text-xs font-medium
                                ${log.action === 'POST' ? 'bg-emerald-900/50 text-emerald-400' : ''}
                                ${log.action === 'PUT' ? 'bg-blue-900/50 text-blue-400' : ''}
                                ${log.action === 'DELETE' ? 'bg-red-900/50 text-red-400' : ''}
                              `}>
                                {log.action}
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white mb-1">
                              {log.details}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by {log.user?.profile?.full_name || log.user?.profile?.email || 'Unknown User'}
                            </p>
                          </div>
                        ))}
                        {isLoadingMoreLogs && (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading more logs...</p>
                          </div>
                        )}
                        {!hasMoreLogs && activityLogs.length > 0 && (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No more logs to load</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No activity logs found for this table
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Select a table to view its activity logs
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-accounts management dialog */}
          {userRole === 'owner' && (
            <Dialog 
              open={isManageDialogOpen} 
              onOpenChange={(open) => {
                if (!open) {
                  setIsManageDialogOpen(false);
                  setSelectedTable(null);
                  setSubAccounts([]);
                }
              }}
            >
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    Manage Sub-Account Permissions - {selectedTable?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Manage access permissions for sub-accounts to this table. You can control their ability to read, write, create, and delete data.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="p-6">
                  {subAccounts.length > 0 ? (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Permissions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {subAccounts.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {account.profile?.full_name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {account.profile?.email}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  {getPermissionBadge('GET', account.can_get, 
                                    () => toggleSubAccountPermission(account, 'can_get'))}
                                  {getPermissionBadge('PUT', account.can_put, 
                                    () => toggleSubAccountPermission(account, 'can_put'))}
                                  {getPermissionBadge('POST', account.can_post, 
                                    () => toggleSubAccountPermission(account, 'can_post'))}
                                  {getPermissionBadge('DELETE', account.can_delete, 
                                    () => toggleSubAccountPermission(account, 'can_delete'))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <p className="text-gray-500 dark:text-gray-400">
                        No sub-accounts found for this table. Add sub-accounts to manage their permissions.
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
