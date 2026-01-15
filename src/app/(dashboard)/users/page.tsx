'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Pencil, Trash2, Settings, Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { UsersPageSkeleton } from '@/components/ui/UsersPageSkeleton';

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  sub_owner_id?: string;
  bandwidth_used?: number;
  default_permissions?: {
    can_get: boolean;
    can_put: boolean;
    can_post: boolean;
    can_delete: boolean;
  };
  tables?: {
    id: string;
    name: string;
    permissions: {
      can_get: boolean;
      can_put: boolean;
      can_post: boolean;
      can_delete: boolean;
    };
  }[];
}

interface SubOwnerResponse {
  sub_owners: Array<{
    id: string;
    default_can_get: boolean;
    default_can_put: boolean;
    default_can_post: boolean;
    default_can_delete: boolean;
    profile: {
      id: string;
      email: string;
      full_name: string | null;
      created_at: string;
      current_month_bandwidth_used: number | null;
    };
    permissions: Array<{
      table: {
        id: string;
        name: string;
      };
      can_get: boolean;
      can_put: boolean;
      can_post: boolean;
      can_delete: boolean;
    }> | null;
  }>;
}

interface CachedUsers {
  data: User[];
  timestamp: number;
}

const formSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  password: z.string().min(6),
  default_can_get: z.boolean().optional(),
  default_can_put: z.boolean().optional(),
  default_can_post: z.boolean().optional(),
  default_can_delete: z.boolean().optional(),
});

const editFormSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
});

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [cachedUsers, setCachedUsers] = useState<CachedUsers | null>(null);
  const [defaultPermissionsDialogOpen, setDefaultPermissionsDialogOpen] = useState(false);
  const [selectedUserForDefaults, setSelectedUserForDefaults] = useState<User | null>(null);
  const [defaultPermissions, setDefaultPermissions] = useState({
    can_get: false,
    can_put: false,
    can_post: false,
    can_delete: false,
  });
  const [applyToExisting, setApplyToExisting] = useState(false);
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0 });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      default_can_get: false,
      default_can_put: false,
      default_can_post: false,
      default_can_delete: false,
    },
  });

  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      email: "",
      full_name: "",
    },
  });

  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      // Check cache first
      if (cachedUsers && Date.now() - cachedUsers.timestamp < CACHE_DURATION) {
        setUsers(cachedUsers.data);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all sub-owners and their data in a single query with nested selects
      const { data, error: subOwnersError } = await supabase
        .from('owners')
        .select(`
          sub_owners(
            id,
            default_can_get,
            default_can_put,
            default_can_post,
            default_can_delete,
            profile:profiles(
              id,
              email,
              full_name,
              created_at,
              current_month_bandwidth_used
            ),
            permissions:sub_owner_permissions(
              table:tables(
                id,
                name
              ),
              can_get,
              can_put,
              can_post,
              can_delete
            )
          )
        `)
        .eq('profile_id', user.id)
        .single();

      if (subOwnersError) throw subOwnersError;

      // Transform the data
      const formattedUsers = (data as unknown as SubOwnerResponse)?.sub_owners.map(so => ({
        id: so.profile.id,
        email: so.profile.email,
        full_name: so.profile.full_name || undefined,
        created_at: so.profile.created_at,
        bandwidth_used: so.profile.current_month_bandwidth_used || 0,
        sub_owner_id: so.id,
        default_permissions: {
          can_get: so.default_can_get,
          can_put: so.default_can_put,
          can_post: so.default_can_post,
          can_delete: so.default_can_delete,
        },
        tables: so.permissions?.map(p => ({
          id: p.table.id,
          name: p.table.name,
          permissions: {
            can_get: p.can_get,
            can_put: p.can_put,
            can_post: p.can_post,
            can_delete: p.can_delete,
          },
        })) || [],
      })) || [];

      // Update cache and state
      setCachedUsers({
        data: formattedUsers,
        timestamp: Date.now()
      });
      setUsers(formattedUsers);
      setLoading(false);
    } catch (err: object | unknown) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get owner's ID first
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (ownerError || !ownerData) throw ownerError || new Error('Owner not found');

      // Create user through our API endpoint
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          full_name: values.full_name,
          owner_id: ownerData.id,
          default_permissions: {
            can_get: values.default_can_get || false,
            can_put: values.default_can_put || false,
            can_post: values.default_can_post || false,
            can_delete: values.default_can_delete || false,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Clear form and close dialog
      form.reset();

      // Refresh the users list
      await fetchUsers();
      
      toast.success('User created successfully');
    } catch (err: object | unknown) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
      // Keep the dialog open when there's an error
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const supabase = createClient();
      
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state and cache
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      if (cachedUsers) {
        setCachedUsers({
          data: updatedUsers,
          timestamp: Date.now()
        });
      }
    } catch (err: object | unknown) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleEdit = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    editForm.reset({
      email: user.email,
      full_name: user.full_name || '',
    });
    setSelectedUserId(id);
  };

  const handleOpenDefaultPermissions = (user: User) => {
    setSelectedUserForDefaults(user);
    setDefaultPermissions(user.default_permissions || {
      can_get: false,
      can_put: false,
      can_post: false,
      can_delete: false,
    });
    setApplyToExisting(false);
    setDefaultPermissionsDialogOpen(true);
  };

  const handleSaveDefaultPermissions = async () => {
    if (!selectedUserForDefaults?.sub_owner_id) return;

    setIsSavingDefaults(true);
    setUpdateProgress({ current: 0, total: 0 });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update default permissions in sub_owners table
      const { error: updateError } = await supabase
        .from('sub_owners')
        .update({
          default_can_get: defaultPermissions.can_get,
          default_can_put: defaultPermissions.can_put,
          default_can_post: defaultPermissions.can_post,
          default_can_delete: defaultPermissions.can_delete,
        })
        .eq('id', selectedUserForDefaults.sub_owner_id);

      if (updateError) throw updateError;

      // If applyToExisting is true, update all existing table permissions
      if (applyToExisting && selectedUserForDefaults.tables && selectedUserForDefaults.tables.length > 0) {
        const totalTables = selectedUserForDefaults.tables.length;
        setUpdateProgress({ current: 0, total: totalTables });

        // Update each permission
        for (let i = 0; i < selectedUserForDefaults.tables.length; i++) {
          const table = selectedUserForDefaults.tables[i];
          
          // Get the permission ID for this table
          const { data: permissionData, error: permError } = await supabase
            .from('sub_owner_permissions')
            .select('id')
            .eq('sub_owner_id', selectedUserForDefaults.sub_owner_id)
            .eq('table_id', table.id)
            .single();

          if (!permError && permissionData) {
            await supabase
              .from('sub_owner_permissions')
              .update({
                can_get: defaultPermissions.can_get,
                can_put: defaultPermissions.can_put,
                can_post: defaultPermissions.can_post,
                can_delete: defaultPermissions.can_delete,
              })
              .eq('id', permissionData.id);
          }

          // Update progress
          setUpdateProgress({ current: i + 1, total: totalTables });
        }
      }

      // Update local state
      const updatedUsers = users.map(u => 
        u.id === selectedUserForDefaults.id
          ? {
              ...u,
              default_permissions: { ...defaultPermissions },
              ...(applyToExisting ? {
                tables: u.tables?.map(t => ({
                  ...t,
                  permissions: { ...defaultPermissions },
                })) || [],
              } : {}),
            }
          : u
      );
      setUsers(updatedUsers);
      if (cachedUsers) {
        setCachedUsers({
          data: updatedUsers,
          timestamp: Date.now()
        });
      }

      setDefaultPermissionsDialogOpen(false);
      setSelectedUserForDefaults(null);
      setUpdateProgress({ current: 0, total: 0 });
      toast.success('Default permissions updated successfully');
    } catch (err: object | unknown) {
      console.error('Error updating default permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to update default permissions');
      toast.error(err instanceof Error ? err.message : 'Failed to update default permissions');
    } finally {
      setIsSavingDefaults(false);
      setUpdateProgress({ current: 0, total: 0 });
    }
  };

  const handleEditSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (!selectedUserId) return;

    try {
      const supabase = createClient();
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
        })
        .eq('id', selectedUserId);

      if (profileError) throw profileError;

      // Update local state and cache
      const updatedUsers = users.map(user => 
        user.id === selectedUserId 
          ? { ...user, full_name: values.full_name || undefined }
          : user
      );
      setUsers(updatedUsers);
      if (cachedUsers) {
        setCachedUsers({
          data: updatedUsers,
          timestamp: Date.now()
        });
      }

      setSelectedUserId(null);
      editForm.reset();
    } catch (err: object | unknown) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  if (loading) {
    return <UsersPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Users
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with access to your tables.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <FormLabel className="text-base">Default Permissions</FormLabel>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            These permissions will be applied to all tables for this user. You can override them per table later.
                          </p>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="default_can_get"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">GET (Read)</FormLabel>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      View data
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="default_can_put"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">PUT (Update)</FormLabel>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Edit existing data
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="default_can_post"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">POST (Create)</FormLabel>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Add new data
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="default_can_delete"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">DELETE (Remove)</FormLabel>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Delete data
                                    </div>
                                  </div>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Add User</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {error && (
              <div className="m-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Bandwidth Used
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.full_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {(() => {
                          const formatBytes = (bytes: number): string => {
                            if (bytes < 1024) {
                              return `${bytes} B`;
                            } else if (bytes < 1024 * 1024) {
                              return `${(bytes / 1024).toFixed(1)} KB`;
                            } else if (bytes < 1024 * 1024 * 1024) {
                              return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                            } else {
                              return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                            }
                          };
                          return formatBytes(user.bandwidth_used || 0);
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDefaultPermissions(user)}
                            title="Set default permissions"
                          >
                            <Settings className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              handleEdit(user.id);
                            }}
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
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

      {/* Edit User Dialog */}
      <Dialog open={selectedUserId !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedUserId(null);
          editForm.reset();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user&apos;s information and settings.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedUserId(null);
                    editForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Default Permissions Dialog */}
      <Dialog open={defaultPermissionsDialogOpen} onOpenChange={(open) => {
        if (!open && !isSavingDefaults) {
          setDefaultPermissionsDialogOpen(false);
          setSelectedUserForDefaults(null);
          setDefaultPermissions({
            can_get: false,
            can_put: false,
            can_post: false,
            can_delete: false,
          });
          setApplyToExisting(false);
          setUpdateProgress({ current: 0, total: 0 });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Default Permissions</DialogTitle>
            <DialogDescription>
              Set default permissions for {selectedUserForDefaults?.email}. These will be applied to new tables automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="default-can-get"
                    checked={defaultPermissions.can_get}
                    onCheckedChange={(checked) =>
                      setDefaultPermissions({ ...defaultPermissions, can_get: checked === true })
                    }
                    disabled={isSavingDefaults}
                  />
                  <label
                    htmlFor="default-can-get"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    GET (Read)
                  </label>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">View data</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="default-can-put"
                    checked={defaultPermissions.can_put}
                    onCheckedChange={(checked) =>
                      setDefaultPermissions({ ...defaultPermissions, can_put: checked === true })
                    }
                    disabled={isSavingDefaults}
                  />
                  <label
                    htmlFor="default-can-put"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    PUT (Update)
                  </label>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Edit existing data</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="default-can-post"
                    checked={defaultPermissions.can_post}
                    onCheckedChange={(checked) =>
                      setDefaultPermissions({ ...defaultPermissions, can_post: checked === true })
                    }
                    disabled={isSavingDefaults}
                  />
                  <label
                    htmlFor="default-can-post"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    POST (Create)
                  </label>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Add new data</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="default-can-delete"
                    checked={defaultPermissions.can_delete}
                    onCheckedChange={(checked) =>
                      setDefaultPermissions({ ...defaultPermissions, can_delete: checked === true })
                    }
                    disabled={isSavingDefaults}
                  />
                  <label
                    htmlFor="default-can-delete"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    DELETE (Remove)
                  </label>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Delete data</span>
              </div>
            </div>
            {selectedUserForDefaults?.tables && selectedUserForDefaults.tables.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="apply-to-existing"
                    checked={applyToExisting}
                    onCheckedChange={(checked) => setApplyToExisting(checked === true)}
                    disabled={isSavingDefaults}
                  />
                  <label
                    htmlFor="apply-to-existing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Apply to all existing tables ({selectedUserForDefaults.tables.length} tables)
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  This will update permissions for all existing tables to match the default permissions above.
                </p>
              </div>
            )}
            {isSavingDefaults && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {updateProgress.total > 0
                        ? `Updating permissions... ${updateProgress.current} of ${updateProgress.total} tables`
                        : 'Saving default permissions...'}
                    </p>
                    {updateProgress.total > 0 && (
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(updateProgress.current / updateProgress.total) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isSavingDefaults) {
                  setDefaultPermissionsDialogOpen(false);
                  setSelectedUserForDefaults(null);
                }
              }}
              disabled={isSavingDefaults}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveDefaultPermissions}
              disabled={isSavingDefaults}
            >
              {isSavingDefaults ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Default Permissions'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 