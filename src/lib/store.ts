import { create } from 'zustand'
import { persist, type StateStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string;
  role: 'owner' | 'sub_owner';
  sub_owners?: { id: string }[];
  owners?: { id: string }[];
  email?: string;
  full_name?: string;
}

interface TablePermissions {
  [tableId: string]: {
    can_get: boolean;
    can_put: boolean;
    can_post: boolean;
    can_delete: boolean;
  };
}

interface TableData {
  [tableId: string]: {
    data: any[];
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
          const { [tableId]: _, ...rest } = state.tableData;
          return { tableData: rest };
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

          // Cache permissions for sub-owners
          if (data.role === 'sub_owner' && data.sub_owners?.[0]?.permissions) {
            const permissions = data.sub_owners[0].permissions.reduce((acc: TablePermissions, perm: any) => {
              acc[perm.table_id] = {
                can_get: perm.can_get,
                can_put: perm.can_put,
                can_post: perm.can_post,
                can_delete: perm.can_delete,
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

        if (!profile) return;

        // Return cached permissions if still valid
        const cachedPermissions = state.permissions[tableId];
        if (cachedPermissions && (now - (state.userProfile?.timestamp || 0)) < CACHE_DURATION.PERMISSIONS) {
          return;
        }

        try {
          // For owners, return full permissions without API call
          if (profile.role === 'owner') {
            set((state) => ({
              permissions: {
                ...state.permissions,
                [tableId]: {
                  can_get: true,
                  can_put: true,
                  can_post: true,
                  can_delete: true,
                },
              },
            }));
            return;
          }

          // For sub-owners, permissions are already loaded in fetchUserProfile
          // No need for additional API call
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