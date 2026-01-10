import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface EditingSessionOptions {
  tableId: string;
  rowId?: string | null;
  sessionType: 'viewing' | 'editing';
  enabled?: boolean;
}

const SESSION_EXPIRY_MINUTES = 5;
const ACTIVITY_REFRESH_INTERVAL = 30000; // 30 seconds

export function useEditingSession({ 
  tableId, 
  rowId, 
  sessionType, 
  enabled = true 
}: EditingSessionOptions) {
  const supabase = createClient();
  const sessionIdRef = useRef<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInfoRef = useRef<{ id: string; email: string; name?: string } | null>(null);
  const isVisibleRef = useRef(true);
  const isDeletingRef = useRef(false);
  const isUnmountingRef = useRef(false);
  const isCreatingRef = useRef(false);
  const componentMountedRef = useRef(true);
  const previousRowIdRef = useRef<string | null | undefined>(rowId);
  const previousSessionTypeRef = useRef<'viewing' | 'editing'>(sessionType);
  const sessionCreatedAtRef = useRef<number | null>(null);

  // Create or update session
  const createOrUpdateSession = useCallback(async () => {
    if (!enabled || !tableId || !userInfoRef.current || !isVisibleRef.current) {
      console.log('useEditingSession: Skipping session creation', {
        enabled,
        tableId,
        hasUserInfo: !!userInfoRef.current,
        isVisible: isVisibleRef.current,
      });
      return;
    }

    // Prevent multiple simultaneous creations
    if (isCreatingRef.current) {
      console.log('useEditingSession: Session creation already in progress, skipping');
      return;
    }

    isCreatingRef.current = true;

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_MINUTES * 60 * 1000);

      const sessionData = {
        table_id: tableId,
        row_id: rowId || null,
        user_id: userInfoRef.current.id,
        user_email: userInfoRef.current.email,
        user_name: userInfoRef.current.name || null,
        session_type: sessionType,
        last_activity: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      if (sessionIdRef.current) {
        // Update existing session
        console.log('useEditingSession: Updating existing session', sessionIdRef.current);
        const { error } = await supabase
          .from('table_editing_sessions')
          .update({
            last_activity: sessionData.last_activity,
            expires_at: sessionData.expires_at,
          })
          .eq('id', sessionIdRef.current);

        if (error) throw error;
      } else {
        // Create new session
        console.log('useEditingSession: Creating new session', {
          tableId,
          rowId: rowId || null,
          sessionType,
          userId: userInfoRef.current.id,
        });
        const { data, error } = await supabase
          .from('table_editing_sessions')
          .insert(sessionData)
          .select('id')
          .single();

        if (error) {
          // If unique constraint violation, try to get existing session
          if (error.code === '23505') {
            console.log('useEditingSession: Unique constraint violation, fetching existing session');
            const { data: existing } = await supabase
              .from('table_editing_sessions')
              .select('id')
              .eq('table_id', tableId)
              .eq('row_id', rowId || null)
              .eq('user_id', userInfoRef.current.id)
              .eq('session_type', sessionType)
              .single();

            if (existing) {
              sessionIdRef.current = existing.id;
              sessionCreatedAtRef.current = Date.now();
              console.log('useEditingSession: Found existing session', existing.id);
              // Update it
              await supabase
                .from('table_editing_sessions')
                .update({
                  last_activity: sessionData.last_activity,
                  expires_at: sessionData.expires_at,
                })
                .eq('id', existing.id);
            }
          } else {
            console.error('useEditingSession: Error creating session', error);
            throw error;
          }
        } else if (data) {
          sessionIdRef.current = data.id;
          sessionCreatedAtRef.current = Date.now();
          console.log('useEditingSession: Session created successfully', data.id);
        }
      }
    } catch (error) {
      console.error('Error creating/updating editing session:', error);
    } finally {
      isCreatingRef.current = false;
    }
  }, [enabled, tableId, rowId, sessionType, supabase]);

  // Delete session using API endpoint (for sendBeacon) or direct Supabase call
  const deleteSession = useCallback(async (useApiEndpoint = false) => {
    // Prevent duplicate deletions
    if (isDeletingRef.current) {
      console.log('useEditingSession: Deletion already in progress, skipping');
      return;
    }

    // Don't delete if component is still mounted and enabled (user is still on page)
    if (!useApiEndpoint && componentMountedRef.current && enabled && isVisibleRef.current) {
      console.log('useEditingSession: Skipping deletion - component still active', {
        enabled,
        isVisible: isVisibleRef.current,
        componentMounted: componentMountedRef.current,
      });
      return;
    }

    // Prevent deletion if session was just created (within last 3 seconds)
    // This prevents race conditions where cleanup effects fire immediately after creation
    if (sessionCreatedAtRef.current && Date.now() - sessionCreatedAtRef.current < 3000) {
      console.log('useEditingSession: Skipping deletion - session just created', {
        createdAgo: Date.now() - sessionCreatedAtRef.current,
        sessionId: sessionIdRef.current,
      });
      return;
    }

    if (!userInfoRef.current || !tableId) {
      console.log('useEditingSession: Cannot delete session - missing user info or tableId', {
        hasUserInfo: !!userInfoRef.current,
        tableId,
      });
      return;
    }

    isDeletingRef.current = true;

    try {
      // Always try to delete by sessionId first if available, then fallback to table/user/type
      const deletePayload = sessionIdRef.current
        ? { sessionId: sessionIdRef.current }
        : {
            tableId,
            userId: userInfoRef.current.id,
            sessionType,
            rowId: rowId || null,
          };

      if (useApiEndpoint) {
        // Use API endpoint for sendBeacon (synchronous, reliable on page unload)
        // sendBeacon doesn't support custom headers, so we use FormData
        const apiUrl = `${window.location.origin}/api/editing-sessions/delete`;
        const formData = new FormData();
        formData.append('data', JSON.stringify(deletePayload));
        
        // Also try to send individual fields as fallback
        if (sessionIdRef.current) {
          formData.append('sessionId', sessionIdRef.current);
        } else {
          formData.append('tableId', tableId);
          formData.append('userId', userInfoRef.current.id);
          formData.append('sessionType', sessionType);
          if (rowId !== undefined) {
            formData.append('rowId', rowId || '');
          }
        }
        
        const sent = navigator.sendBeacon(apiUrl, formData);
        console.log('useEditingSession: Sent delete via sendBeacon', { 
          sent, 
          sessionId: sessionIdRef.current,
          ...deletePayload 
        });
        if (sent) {
          sessionIdRef.current = null;
          sessionCreatedAtRef.current = null;
        } else {
          console.warn('useEditingSession: sendBeacon failed, session may not be deleted');
        }
      } else {
        // Use direct Supabase call (async, for normal cleanup)
        let deleted = false;
        
        if (sessionIdRef.current) {
          console.log('useEditingSession: Deleting session by ID', sessionIdRef.current);
          const { error } = await supabase
            .from('table_editing_sessions')
            .delete()
            .eq('id', sessionIdRef.current);
          
          if (error) {
            console.error('useEditingSession: Error deleting by ID, trying fallback', error);
            // Fallback to delete by table/user/type
          } else {
            deleted = true;
            console.log('useEditingSession: Session deleted by ID');
          }
        }
        
        if (!deleted) {
          console.log('useEditingSession: Deleting session by table/user/type', {
            tableId,
            userId: userInfoRef.current.id,
            sessionType,
            rowId: rowId || null,
          });
          const { error } = await supabase
            .from('table_editing_sessions')
            .delete()
            .eq('table_id', tableId)
            .eq('user_id', userInfoRef.current.id)
            .eq('session_type', sessionType)
            .is('row_id', rowId || null);
          
          if (error) {
            console.error('useEditingSession: Error deleting session', error);
            throw error;
          }
          console.log('useEditingSession: Session deleted by table/user/type');
        }
        
        sessionIdRef.current = null;
        sessionCreatedAtRef.current = null;
        console.log('useEditingSession: Session deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting editing session:', error);
    } finally {
      // Reset flag after a delay to allow for retries if needed
      setTimeout(() => {
        isDeletingRef.current = false;
      }, 1000);
    }
  }, [supabase, tableId, rowId, sessionType]);

  // Fetch user info once
  useEffect(() => {
    if (!enabled || !tableId) return;

    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('useEditingSession: No user found');
          return;
        }

        // Get user profile for name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        userInfoRef.current = {
          id: user.id,
          email: user.email || profile?.email || 'Unknown',
          name: profile?.full_name || undefined,
        };

        console.log('useEditingSession: User info fetched', {
          tableId,
          sessionType,
          userId: userInfoRef.current.id,
          userEmail: userInfoRef.current.email,
        });

        // Trigger session creation after user info is loaded
        // Small delay to ensure everything is ready, but check if session already exists
        setTimeout(() => {
          if (componentMountedRef.current && enabled && !sessionIdRef.current) {
            console.log('useEditingSession: Triggering session creation after user info loaded');
            createOrUpdateSession();
          } else {
            console.log('useEditingSession: Skipping session creation after user info - already exists or component unmounted', {
              hasSessionId: !!sessionIdRef.current,
              componentMounted: componentMountedRef.current,
              enabled,
            });
          }
        }, 100);
      } catch (error) {
        console.error('Error fetching user info for editing session:', error);
      }
    };

    fetchUserInfo();
  }, [enabled, tableId, sessionType, supabase, createOrUpdateSession]);

  // Handle page visibility changes and navigation away
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isVisibleRef.current;
      const isNowVisible = !document.hidden;
      isVisibleRef.current = isNowVisible;
      
      // If page becomes hidden, delete the session immediately
      // But only if component is still mounted (not unmounting)
      if (wasVisible && !isNowVisible && componentMountedRef.current && !isUnmountingRef.current) {
        console.log('useEditingSession: Page hidden, deleting session');
        deleteSession(false); // Use async Supabase call for visibility change
      } else if (!wasVisible && isNowVisible && componentMountedRef.current && enabled) {
        // Page became visible again - recreate session if needed
        console.log('useEditingSession: Page visible again, recreating session if needed');
        if (!sessionIdRef.current && userInfoRef.current) {
          // Small delay to ensure everything is ready
          setTimeout(() => {
            if (componentMountedRef.current && enabled && !sessionIdRef.current) {
              createOrUpdateSession();
            }
          }, 500);
        }
      }
    };

    // Handle page unload (navigation away, tab close, etc.)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log('useEditingSession: Page unloading, deleting session via sendBeacon');
      // Use sendBeacon for reliable cleanup on page unload
      // This works even when the page is closing
      if (userInfoRef.current && tableId) {
        deleteSession(true); // Use API endpoint via sendBeacon
      }
    };

    // Handle pagehide (more reliable than beforeunload in some browsers)
    const handlePageHide = () => {
      console.log('useEditingSession: Page hiding, deleting session via sendBeacon');
      if (userInfoRef.current && tableId) {
        deleteSession(true); // Use API endpoint via sendBeacon
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      // Also delete on cleanup (for Next.js client-side navigation)
      isUnmountingRef.current = true;
      deleteSession(false);
    };
  }, [deleteSession]);

  // Initial session creation
  useEffect(() => {
    console.log('useEditingSession: Initial session creation effect', {
      enabled,
      tableId,
      hasUserInfo: !!userInfoRef.current,
      rowId,
      sessionType,
      hasSessionId: !!sessionIdRef.current,
    });

    if (!enabled || !tableId || !userInfoRef.current) {
      console.log('useEditingSession: Skipping initial session creation - conditions not met');
      return;
    }

    // If session already exists, just update it instead of creating new one
    if (sessionIdRef.current) {
      console.log('useEditingSession: Session already exists, updating instead of creating');
      createOrUpdateSession();
      return;
    }

    // Small delay to ensure user info is loaded and prevent race conditions
    const timeoutId = setTimeout(() => {
      // Double-check conditions before creating
      if (componentMountedRef.current && enabled && tableId && userInfoRef.current && !sessionIdRef.current) {
        console.log('useEditingSession: Calling createOrUpdateSession after delay');
        createOrUpdateSession();
      } else {
        console.log('useEditingSession: Skipping session creation - conditions changed', {
          componentMounted: componentMountedRef.current,
          enabled,
          tableId,
          hasUserInfo: !!userInfoRef.current,
          hasSessionId: !!sessionIdRef.current,
        });
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [enabled, tableId, rowId, sessionType, createOrUpdateSession]);

  // Auto-refresh session activity
  useEffect(() => {
    if (!enabled || !sessionIdRef.current) return;

    refreshIntervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        createOrUpdateSession();
      }
    }, ACTIVITY_REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [enabled, createOrUpdateSession]);

  // Cleanup when disabled or on unmount
  useEffect(() => {
    if (!enabled && sessionIdRef.current && !isUnmountingRef.current) {
      console.log('useEditingSession: Disabled, cleaning up session');
      deleteSession(false);
    }
    
    return () => {
      console.log('useEditingSession: Component unmounting, cleaning up session');
      componentMountedRef.current = false;
      isUnmountingRef.current = true;
      
      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      
      // Delete session on unmount (for Next.js client-side navigation)
      // Use async call since we're in cleanup
      deleteSession(false);
    };
  }, [enabled, deleteSession]);

  // Mark component as mounted when it mounts
  useEffect(() => {
    componentMountedRef.current = true;
    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  // Cleanup when rowId or sessionType changes (for editing sessions)
  // Only cleanup if we're actually changing to a different session type/row
  useEffect(() => {
    // Check if values actually changed
    const rowIdChanged = previousRowIdRef.current !== rowId;
    const sessionTypeChanged = previousSessionTypeRef.current !== sessionType;
    
    // Update refs for next comparison
    previousRowIdRef.current = rowId;
    previousSessionTypeRef.current = sessionType;
    
    // Only cleanup old session if values changed and we have an active session
    // But skip on initial mount (when refs match current values)
    if ((rowIdChanged || sessionTypeChanged) && sessionIdRef.current && !isUnmountingRef.current && componentMountedRef.current) {
      console.log('useEditingSession: RowId or sessionType changed, cleaning up old session', {
        previousRowId: previousRowIdRef.current,
        newRowId: rowId,
        previousSessionType: previousSessionTypeRef.current,
        newSessionType: sessionType,
      });
      // Delete old session - new session will be created by the initial session creation effect
      deleteSession(false);
    }
  }, [rowId, sessionType, deleteSession, enabled, createOrUpdateSession]);

  return {
    sessionId: sessionIdRef.current,
    deleteSession,
  };
}

