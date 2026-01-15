import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string;
  role: 'owner' | 'sub_owner';
  sub_owners?: { id: string }[];
  owners?: { id: string }[];
  email?: string;
  full_name?: string;
}

interface TablePermissionData {
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
  timestamp: number;
}

interface TablePermissions {
  [tableId: string]: TablePermissionData;
}

interface TableData {
  [tableId: string]: {
    data: Record<string, unknown>[];
    totalRows: number;
    lastFetched: number;
    filters: Record<string, unknown>;
    page: number;
    pageSize: number;
  };
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

type State = {
  userProfile: CachedData<UserProfile> | null;
  permissions: TablePermissions;
  tableData: TableData;
}

type Actions = {
  setUserProfile: (profile: UserProfile | null) => void;
  setTablePermissions: (tableId: string, permissions: TablePermissions[string]) => void;
  setTableData: (tableId: string, data: TableData[string]) => void;
  clearTableData: (tableId: string) => void;
  clearStore: () => void;
  fetchUserProfile: () => Promise<UserProfile | null>;
  fetchTablePermissions: (tableId: string) => Promise<void>;
}

// Cache duration in milliseconds
const CACHE_DURATION = {
  PROFILE: 60 * 60 * 1000, // 1 hour
  TABLE_DATA: 15 * 60 * 1000, // 15 minutes
  PERMISSIONS: 30 * 60 * 1000, // 30 minutes
};

// Create store with persistence
export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      userProfile: null,
      permissions: {},
      tableData: {},

      setUserProfile: (profile: UserProfile | null) => set({ 
        userProfile: profile ? {
          data: profile,
          timestamp: Date.now()
        } : null 
      }),
      
      setTablePermissions: (tableId: string, permissions: TablePermissions[string]) => 
        set((state) => ({
          permissions: {
            ...state.permissions,
            [tableId]: permissions,
          },
        })),

      setTableData: (tableId: string, data: TableData[string]) =>
        set((state) => ({
          tableData: {
            ...state.tableData,
            [tableId]: {
              ...data,
              lastFetched: Date.now(),
            },
          },
        })),

      clearTableData: (tableId: string) =>
        set((state) => {
          const newTableData = { ...state.tableData };
          delete newTableData[tableId];
          return { tableData: newTableData };
        }),

      clearStore: () => set({ userProfile: null, permissions: {}, tableData: {} }),

      fetchUserProfile: async () => {
        const state = get();
        const now = Date.now();

        // Return cached profile if still valid
        if (state.userProfile?.data && (now - state.userProfile.timestamp) < CACHE_DURATION.PROFILE) {
          return state.userProfile.data;
        }

        const supabase = createClient();
        try {
          // Batch fetch user, profile, and permissions in a single query
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          if (!user) return null;

          const { data, error } = await supabase
            .from('profiles')
            .select(`
              role,
              email,
              full_name,
              sub_owners!sub_owners_profile_id_fkey (
                id,
                permissions:sub_owner_permissions (
                  table_id,
                  can_get,
                  can_put,
                  can_post,
                  can_delete
                )
              ),
              owners!owners_profile_id_fkey (id)
            `)
            .eq('id', user.id)
            .single();

          if (error) throw error;
          if (!data) return null;

          const userProfile: UserProfile = {
            id: user.id,
            role: data.role as 'owner' | 'sub_owner',
            email: data.email,
            full_name: data.full_name,
            sub_owners: data.sub_owners,
            owners: data.owners,
          };

          // Cache permissions for sub-owners (with timestamps)
          if (data.role === 'sub_owner' && data.sub_owners?.[0]?.permissions) {
            const now = Date.now();
            const permissions = data.sub_owners[0].permissions.reduce((acc: TablePermissions, perm: Record<string, unknown>) => {
              acc[perm.table_id as string] = {
                can_get: perm.can_get as boolean,
                can_put: perm.can_put as boolean,
                can_post: perm.can_post as boolean,
                can_delete: perm.can_delete as boolean,
                timestamp: now,
              };
              return acc;
            }, {});

            set({ permissions });
          }

          set({ 
            userProfile: {
              data: userProfile,
              timestamp: now
            }
          });
          
          return userProfile;
        } catch (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }
      },

      fetchTablePermissions: async (tableId: string) => {
        const state = get();
        const profile = state.userProfile?.data;
        const now = Date.now();

        if (!profile) {
          console.warn('Cannot fetch table permissions: user profile not loaded');
          return;
        }

        // Check if permissions are already cached and valid
        const cachedPermissions = state.permissions[tableId];
        if (cachedPermissions && (now - cachedPermissions.timestamp) < CACHE_DURATION.PERMISSIONS) {
          return; // Use cached permissions
        }

        const supabase = createClient();
        try {
          // For owners, set all permissions to true without API call
          if (profile.role === 'owner') {
            set((state) => ({
              permissions: {
                ...state.permissions,
                [tableId]: {
                  can_get: true,
                  can_put: true,
                  can_post: true,
                  can_delete: true,
                  timestamp: now,
                },
              },
            }));
            return;
          }

          // For sub-owners, check if permissions are already loaded from fetchUserProfile
          // If available in sub_owners data, use those (no RPC call needed)
          const subOwner = profile.sub_owners?.[0] as { id: string; permissions?: Array<Record<string, unknown>> } | undefined;
          if (subOwner?.permissions) {
            const subOwnerPermissions = subOwner.permissions.find(
              (p: Record<string, unknown>) => p.table_id === tableId
            );
            
            if (subOwnerPermissions) {
              set((state) => ({
                permissions: {
                  ...state.permissions,
                  [tableId]: {
                    can_get: subOwnerPermissions.can_get as boolean,
                    can_put: subOwnerPermissions.can_put as boolean,
                    can_post: subOwnerPermissions.can_post as boolean,
                    can_delete: subOwnerPermissions.can_delete as boolean,
                    timestamp: now,
                  },
                },
              }));
              return;
            }
          }

          // If not found in sub_owners data, call RPC for all actions
          const actions = ['select', 'update', 'insert', 'delete'] as const;
          const actionResults = await Promise.all(
            actions.map(async (action) => {
              const { data, error } = await supabase.rpc('check_table_permission', {
                p_table_id: tableId,
                p_action: action,
              });
              
              if (error) {
                console.error(`Error checking ${action} permission:`, error);
                return false;
              }
              
              return !!data;
            })
          );

          // Map results to permission structure
          const permissions: TablePermissionData = {
            can_get: actionResults[0],
            can_put: actionResults[1],
            can_post: actionResults[2],
            can_delete: actionResults[3],
            timestamp: now,
          };

          set((state) => ({
            permissions: {
              ...state.permissions,
              [tableId]: permissions,
            },
          }));
        } catch (error) {
          console.error('Error fetching table permissions:', error);
        }
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        permissions: state.permissions,
      }),
    }
  )
); 