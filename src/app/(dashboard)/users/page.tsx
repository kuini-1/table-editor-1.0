'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface SubOwnerProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface TablePermission {
  table: {
    id: string;
    name: string;
  };
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
}

interface SubOwner {
  id: string;
  profile: SubOwnerProfile;
  permissions: TablePermission[];
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
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

const formSchema = z.object({
  email: z.string().email(),
  full_name: z.string().optional(),
  password: z.string().min(6),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
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
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get owner ID
      const { data: ownerData } = await supabase
        .from('owners')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!ownerData) throw new Error('Not an owner');

      // Get users
      const { data: subOwners, error: subOwnersError } = await supabase
        .from('sub_owners')
        .select(`
          id,
          profile:profiles(
            id,
            email,
            full_name,
            created_at
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
        `)
        .eq('owner_id', ownerData.id);

      if (subOwnersError) throw subOwnersError;

      // Transform the data
      const formattedUsers = (subOwners as unknown as SubOwner[]).map(so => ({
        id: so.profile.id,
        email: so.profile.email,
        full_name: so.profile.full_name || undefined,
        created_at: so.profile.created_at,
        tables: so.permissions.map(p => ({
          id: p.table.id,
          name: p.table.name,
          permissions: {
            can_get: p.can_get,
            can_put: p.can_put,
            can_post: p.can_post,
            can_delete: p.can_delete,
          },
        })),
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get owner ID
      const { data: ownerData } = await supabase
        .from('owners')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!ownerData) throw new Error('Not an owner');

      // Create new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile with upsert
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: values.email,
          full_name: values.full_name,
          role: 'sub_owner',
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (profileError) throw profileError;

      // Create sub_owner record
      const { error: subOwnerError } = await supabase
        .from('sub_owners')
        .insert({
          profile_id: authData.user.id,
          owner_id: ownerData.id,
        });

      if (subOwnerError) throw subOwnerError;

      // Reset form and refresh data
      form.reset();
      fetchUsers();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to delete user');
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

  const handleEditSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (!selectedUserId) return;

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
        })
        .eq('id', selectedUserId);

      if (profileError) throw profileError;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUserId 
          ? { ...user, full_name: values.full_name || undefined }
          : user
      ));

      // Close dialog and reset form
      setSelectedUserId(null);
      editForm.reset();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to update user');
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              handleEdit(user.id);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
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
              Update the user's information and settings.
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
    </div>
  );
} 