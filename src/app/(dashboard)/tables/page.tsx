'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

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
  type: string;
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
  profile: {
    email: string;
    full_name: string;
  };
}

interface SubOwnerPermissionWithTable {
  id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  table: {
    id: string;
    name: string;
    type: string;
    owner_id: string;
  };
}

type DatabaseSubOwnerPermission = {
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  table: {
    id: string;
    name: string;
    type: string;
    owner_id: string;
  };
}

interface OwnerTableResponse {
  id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  table: {
    id: string;
    name: string;
    type: string;
    owner_id: string;
  } | null;
}

interface PermissionResponse {
  id: string;
  table_id: string;
  sub_owner_id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  sub_owner: {
    profile: {
      email: string;
      full_name: string | null;
    };
  };
}

interface DatabaseTable {
  id: string;
  name: string;
  type: string;
  owner_id: string;
}

interface DatabasePermission {
  id: string;
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  table: DatabaseTable;
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
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [subAccounts, setSubAccounts] = useState<SubOwnerPermission[]>([]);
  const [userRole, setUserRole] = useState<'owner' | 'sub_owner' | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const router = useRouter();

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
    const supabase = createClient();
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('No profile found');

      setUserRole(profile.role);

      if (profile.role === 'owner') {
        const { data: ownerData, error: ownerError } = await supabase
          .from('owners')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (ownerError) throw ownerError;
        if (!ownerData) throw new Error('No owner data found');

        const { data: ownerTables, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('owner_id', ownerData.id) as { data: DatabaseTable[] | null, error: any };

        if (tablesError) throw tablesError;
        if (!ownerTables) throw new Error('No tables found');

        const formattedTables = ownerTables.map(table => ({
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

        setTables(formattedTables);
      } else {
        const { data: subOwnerData, error: subOwnerError } = await supabase
          .from('sub_owners')
          .select('id, owner_id')
          .eq('profile_id', user.id)
          .single();

        if (subOwnerError) throw subOwnerError;
        if (!subOwnerData) throw new Error('No sub-owner data found');

        // Log sub-owner data for debugging
        console.log('Sub-owner data:', subOwnerData);

        // Get all tables for the owner first
        const { data: ownerTables, error: ownerTablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('owner_id', subOwnerData.owner_id);

        if (ownerTablesError) throw ownerTablesError;
        console.log('Owner tables:', ownerTables);

        // Then get permissions for these tables
        const { data: permissions, error: permissionsError } = await supabase
          .from('sub_owner_permissions')
          .select('*')
          .eq('sub_owner_id', subOwnerData.id);

        if (permissionsError) throw permissionsError;
        console.log('Permissions:', permissions);

        // Combine the data
        const formattedTables = ownerTables.map(table => {
          const permission = permissions?.find(p => p.table_id === table.id);
          return {
            id: table.id,
            name: table.name,
            type: table.type,
            owner_id: table.owner_id,
            permissions: {
              can_get: permission?.can_get || false,
              can_put: permission?.can_put || false,
              can_post: permission?.can_post || false,
              can_delete: permission?.can_delete || false
            }
          };
        });

        console.log('Formatted tables:', formattedTables);
        setTables(formattedTables);
      }
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(err.message || 'Failed to fetch tables');
      if (err.message?.includes('auth') || err.message?.includes('JWT')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubAccounts = async (tableId: string) => {
    const supabase = createClient();
    try {
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
        .eq('table_id', tableId) as { data: PermissionResponse[] | null, error: any };

      if (permissionsError) throw permissionsError;
      
      console.log('Raw permissions data:', JSON.stringify(permissions, null, 2));

      const formattedPermissions = permissions?.map(p => {
        console.log('Processing permission:', p);
        return {
          id: p.id,
          table_id: p.table_id,
          sub_owner_id: p.sub_owner_id,
          can_get: p.can_get,
          can_put: p.can_put,
          can_post: p.can_post,
          can_delete: p.can_delete,
          profile: {
            email: p.sub_owner?.profile?.email || '',
            full_name: p.sub_owner?.profile?.full_name || ''
          }
        };
      }) || [];

      console.log('Formatted permissions:', JSON.stringify(formattedPermissions, null, 2));
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
      // const { error } = await createClient
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
