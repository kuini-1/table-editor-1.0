'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { RefreshCcw, ExternalLink, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ActivityLog {
  id: string;
  action: 'PUT' | 'POST' | 'DELETE';
  details: string;
  user: string;
  timestamp: string;
  table_id: string;
}

interface Table {
  id: string;
  name: string;
  type: 'exp' | 'merchant' | 'item';
  owner_id: string;
  permissions?: {
    can_get: boolean;
    can_put: boolean;
    can_post: boolean;
    can_delete: boolean;
  };
}

interface SubOwnerPermission {
  id: string;
  table_id: string;
  sub_owner_id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  profile?: {
    email: string;
    full_name?: string;
  };
}

// Add test data for activity logs
const TEST_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '1',
    action: 'POST',
    details: 'Added new expense record: 2500 EXP, 35000 Zenny',
    user: 'John Smith',
    timestamp: '2024-03-20 14:30',
    table_id: '1'
  },
  {
    id: '2',
    action: 'PUT',
    details: 'Updated expense amount from 1000 to 1500 EXP',
    user: 'Jane Smith',
    timestamp: '2024-03-20 14:25',
    table_id: '1'
  },
  {
    id: '3',
    action: 'DELETE',
    details: 'Removed expense record: ID 1005',
    user: 'Mike Johnson',
    timestamp: '2024-03-20 14:20',
    table_id: '1'
  },
  {
    id: '4',
    action: 'POST',
    details: 'Imported 10 expense records from CSV',
    user: 'John Smith',
    timestamp: '2024-03-20 14:15',
    table_id: '1'
  },
  {
    id: '5',
    action: 'PUT',
    details: 'Updated Zenny value from 25000 to 30000',
    user: 'Jane Smith',
    timestamp: '2024-03-20 14:10',
    table_id: '1'
  },
  {
    id: '6',
    action: 'PUT',
    details: 'Modified owner from user_001 to user_002',
    user: 'Mike Johnson',
    timestamp: '2024-03-20 14:05',
    table_id: '1'
  },
  {
    id: '7',
    action: 'DELETE',
    details: 'Bulk deleted 3 inactive expense records',
    user: 'John Smith',
    timestamp: '2024-03-20 14:00',
    table_id: '1'
  }
];

// Add test data for tables
const TEST_TABLES: Table[] = [
  {
    id: '1',
    name: 'Expenses 2024',
    type: 'exp',
    owner_id: '1',
    permissions: {
      can_get: true,
      can_put: true,
      can_post: true,
      can_delete: true
    }
  },
  {
    id: '2',
    name: 'Merchant List',
    type: 'merchant',
    owner_id: '1',
    permissions: {
      can_get: true,
      can_put: false,
      can_post: false,
      can_delete: false
    }
  },
  {
    id: '3',
    name: 'Items Inventory',
    type: 'item',
    owner_id: '1',
    permissions: {
      can_get: true,
      can_put: true,
      can_post: true,
      can_delete: false
    }
  }
];

// Add test data for sub-accounts
const TEST_SUB_ACCOUNTS: SubOwnerPermission[] = [
  {
    id: '1',
    table_id: '1',
    sub_owner_id: '1',
    can_get: true,
    can_put: true,
    can_post: false,
    can_delete: false,
    profile: {
      email: 'john.doe@example.com',
      full_name: 'John Doe'
    }
  },
  {
    id: '2',
    table_id: '1',
    sub_owner_id: '2',
    can_get: true,
    can_put: false,
    can_post: false,
    can_delete: false,
    profile: {
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith'
    }
  },
  {
    id: '3',
    table_id: '1',
    sub_owner_id: '3',
    can_get: true,
    can_put: true,
    can_post: true,
    can_delete: true,
    profile: {
      email: 'mike.wilson@example.com',
      full_name: 'Mike Wilson'
    }
  }
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [subAccounts, setSubAccounts] = useState<SubOwnerPermission[]>([]);
  const [userRole, setUserRole] = useState<'owner' | 'sub_owner' | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchUserAndTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      // For testing purposes, show all logs for exp tables
      if (selectedTable.type === 'exp') {
        setActivityLogs(TEST_ACTIVITY_LOGS);
      } else {
        setActivityLogs([]);
      }
    } else {
      setActivityLogs([]);
    }
  }, [selectedTable]);

  const fetchUserAndTables = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Authentication error. Please try logging in again.');
        return;
      }
      
      if (!session) {
        setError('Not authenticated. Please log in.');
        return;
      }

      // Get user's role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        setError('Failed to fetch user profile. Please try logging in again.');
        return;
      }

      if (!profile) {
        setError('Profile not found. Please try logging in again.');
        return;
      }

      setUserRole(profile.role as 'owner' | 'sub_owner');

      if (profile.role === 'owner') {
        // Check if user is owner
        const { data: ownerData, error: ownerError } = await supabase
          .from('owners')
          .select('id')
          .eq('profile_id', session.user.id)
          .single();

        if (ownerError) {
          console.error('Owner error:', ownerError);
          setError('Failed to fetch owner data. Please try logging in again.');
          return;
        }

        if (!ownerData) {
          setError('Owner record not found. Please try logging in again.');
          return;
        }

        // Fetch tables for owner
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('owner_id', ownerData.id);

        if (tablesError) {
          console.error('Tables error:', tablesError);
          setError('Failed to fetch tables. Please try again.');
          return;
        }

        // Add full permissions for owner
        const tablesWithPermissions = tablesData.map(table => ({
          ...table,
          permissions: {
            can_get: true,
            can_put: true,
            can_post: true,
            can_delete: true
          }
        }));

        setTables(tablesWithPermissions);
      } else if (profile.role === 'sub_owner') {
        // Fetch tables and permissions for sub-owner
        const { data: subOwnerData, error: subOwnerError } = await supabase
          .from('sub_owners')
          .select('id')
          .eq('profile_id', session.user.id)
          .single();

        if (subOwnerError) {
          console.error('Sub-owner error:', subOwnerError);
          setError('Failed to fetch sub-owner data. Please try logging in again.');
          return;
        }

        if (!subOwnerData) {
          setError('Sub-owner record not found. Please try logging in again.');
          return;
        }

        const { data: permissionsData, error: permissionsError } = await supabase
          .from('sub_owner_permissions')
          .select(`
            *,
            table:tables(*)
          `)
          .eq('sub_owner_id', subOwnerData.id);

        if (permissionsError) {
          console.error('Permissions error:', permissionsError);
          setError('Failed to fetch table permissions. Please try again.');
          return;
        }

        const tablesWithPermissions = permissionsData.map(permission => ({
          ...permission.table,
          permissions: {
            can_get: permission.can_get,
            can_put: permission.can_put,
            can_post: permission.can_post,
            can_delete: permission.can_delete
          }
        }));

        setTables(tablesWithPermissions);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch tables. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubAccounts = async (tableId: string) => {
    try {
      const { data: permissions, error: permissionsError } = await supabase
        .from('sub_owner_permissions')
        .select(`
          *,
          profile:sub_owners(
            profiles(
              email,
              full_name
            )
          )
        `)
        .eq('table_id', tableId);

      if (permissionsError) throw permissionsError;
      setSubAccounts(permissions);
    } catch (err) {
      console.error('Error fetching sub accounts:', err);
    }
  };

  const handleManageSubAccounts = (table: Table) => {
    setSelectedTable(table);
    // For testing purposes, use TEST_SUB_ACCOUNTS directly
    setSubAccounts(TEST_SUB_ACCOUNTS);
    // Comment out the actual fetch for now since we're using test data
    // fetchSubAccounts(table.id);
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

  const toggleTablePermission = async (table: Table, permissionType: 'can_get' | 'can_put' | 'can_post' | 'can_delete') => {
    try {
      const updatedTables = tables.map(t => {
        if (t.id === table.id) {
          return {
            ...t,
            permissions: {
              can_get: t.permissions?.can_get || false,
              can_put: t.permissions?.can_put || false,
              can_post: t.permissions?.can_post || false,
              can_delete: t.permissions?.can_delete || false,
              [permissionType]: !t.permissions?.[permissionType]
            }
          };
        }
        return t;
      });
      setTables(updatedTables);

      // In a real application, you would update the database here
      // const { error } = await supabase
      //   .from('tables')
      //   .update({ [`permissions.${permissionType}`]: !table.permissions?.[permissionType] })
      //   .eq('id', table.id);
      
      // if (error) throw error;
    } catch (err) {
      console.error('Error updating table permission:', err);
      // Revert the change if the update fails
      setTables(tables);
    }
  };

  const toggleSubAccountPermission = async (account: SubOwnerPermission, permissionType: 'can_get' | 'can_put' | 'can_post' | 'can_delete') => {
    try {
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

      // In a real application, you would update the database here
      // const { error } = await supabase
      //   .from('sub_owner_permissions')
      //   .update({ [permissionType]: !account[permissionType] })
      //   .eq('id', account.id);
      
      // if (error) throw error;
    } catch (err) {
      console.error('Error updating permission:', err);
      // Revert the change if the update fails
      setSubAccounts(subAccounts);
    }
  };

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
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
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
                      {tables.map((table) => (
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
                                <Link href={`/tables/${table.name.toLowerCase().replace(/\s+/g, '-')}`} target="_blank">
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
                                    <DropdownMenuItem onClick={() => handleManageSubAccounts(table)}>
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
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Log</h2>
                </div>
                <div className="p-4">
                  {selectedTable ? (
                    activityLogs.length > 0 ? (
                      <div className="space-y-3">
                        {activityLogs.map((log) => (
                          <div 
                            key={log.id} 
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`
                                min-w-[60px] text-center px-2 py-1 rounded-full text-xs font-medium
                                ${log.action === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' : ''}
                                ${log.action === 'PUT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' : ''}
                                ${log.action === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400' : ''}
                              `}>
                                {log.action}
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">
                                {log.timestamp}
                              </p>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white mb-1">
                              {log.details}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by {log.user}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No activity logs found
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                          </div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-accounts management dialog */}
          {userRole === 'owner' && (
            <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    Manage Sub-Account Permissions - {selectedTable?.name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Permissions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {subAccounts.map((account) => (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {account.profile?.email}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
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
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
