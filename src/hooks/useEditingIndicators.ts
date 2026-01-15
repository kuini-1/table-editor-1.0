import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useStore } from '@/lib/store';

export interface EditingSession {
  id: string;
  table_id: string;
  row_id: string | null;
  user_id: string;
  user_email: string;
  user_name: string | null;
  session_type: 'viewing' | 'editing';
  started_at: string;
  last_activity: string;
  expires_at: string;
}

interface UseEditingIndicatorsOptions {
  tableId: string;
  enabled?: boolean;
  hasPermission?: boolean | null;
}

interface EditingState {
  viewing: EditingSession[];
  editing: Map<string, EditingSession[]>; // row_id -> sessions
}

export function useEditingIndicators({ tableId, enabled = true, hasPermission: providedPermission }: UseEditingIndicatorsOptions) {
  const supabase = createClient();
  const { permissions } = useStore();
  const storePermissions = permissions[tableId];
  const [editingState, setEditingState] = useState<EditingState>({
    viewing: [],
    editing: new Map(),
  });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const permissionCheckedRef = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef<number>(Date.now());
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const [reconnectKey, setReconnectKey] = useState(0);
  const lastJWTErrorRef = useRef<number>(0);
  const consecutiveJWTErrorsRef = useRef(0);
  const jwtErrorSuppressionWindowRef = useRef(60000); // 60 seconds suppression window

  // Check if user has permission to see editing sessions
  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (!tableId) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user is owner or sub-owner with GET permission
      const { data, error } = await supabase.rpc('check_table_permission', {
        p_table_id: tableId,
        p_action: 'select',
      });

      if (error) {
        console.error('Error checking permission for editing indicators:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }, [tableId, supabase]);

  // Fetch initial editing sessions
  const fetchSessions = useCallback(async () => {
    if (!tableId || !hasPermission) {
      return;
    }

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('table_editing_sessions')
        .select('*')
        .eq('table_id', tableId)
        .gt('expires_at', now)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching editing sessions:', error);
        return;
      }

      if (data) {
        const viewing: EditingSession[] = [];
        const editing = new Map<string, EditingSession[]>();

        // Filter out expired sessions (double-check)
        const nowDate = new Date();
        data.forEach((session: EditingSession) => {
          const expiresAt = new Date(session.expires_at);
          if (expiresAt <= nowDate) {
            return;
          }
          
          if (session.session_type === 'viewing') {
            viewing.push(session);
          } else if (session.session_type === 'editing' && session.row_id) {
            const rowId = session.row_id;
            if (!editing.has(rowId)) {
              editing.set(rowId, []);
            }
            editing.get(rowId)!.push(session);
          }
        });

        setEditingState({ viewing, editing });
      } else {
        setEditingState({ viewing: [], editing: new Map() });
      }
    } catch (error) {
      console.error('Error in fetchSessions:', error);
    }
  }, [tableId, hasPermission, supabase]);

  // Helper function to detect JWT expiration errors
  const isJWTError = useCallback((error: unknown): boolean => {
    if (!error) return false;
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : typeof error === 'object' && 'message' in error
          ? String(error.message)
          : String(error);
    
    const jwtKeywords = [
      'InvalidJWTToken',
      'Token has expired',
      'JWT',
      'jwt',
      'token expired',
      'expired token',
      'authentication token'
    ];
    
    return jwtKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  }, []);

  // Helper function to check if JWT error should be suppressed
  const shouldSuppressJWTError = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastError = now - lastJWTErrorRef.current;
    
    // Suppress if error occurred within suppression window
    if (timeSinceLastError < jwtErrorSuppressionWindowRef.current) {
      return true;
    }
    
    // Update last error time
    lastJWTErrorRef.current = now;
    return false;
  }, []);

  // Helper function to refresh auth token
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Failed to refresh auth token:', error);
        return false;
      }
      
      if (data?.session) {
        consecutiveJWTErrorsRef.current = 0; // Reset consecutive errors on success
        return true;
      }
      
      console.warn('Token refresh returned no session');
      return false;
    } catch (error) {
      console.error('Error refreshing auth token:', error);
      return false;
    }
  }, [supabase]);

  // Reconnection function with exponential backoff and JWT error handling
  const scheduleReconnect = useCallback(async (error?: unknown) => {
    if (!enabled || !tableId || hasPermission !== true || isReconnectingRef.current) {
      return;
    }

    // Check if this is a JWT error
    const isJWT = error ? isJWTError(error) : false;
    
    // For JWT errors, check if we should suppress (prevent spam)
    if (isJWT && shouldSuppressJWTError()) {
      return;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // For JWT errors: refresh token first, then use longer delay
    if (isJWT) {
      consecutiveJWTErrorsRef.current += 1;
      
      // Refresh token before reconnecting
      const refreshSuccess = await refreshAuthToken();
      
      if (!refreshSuccess) {
        console.warn('Token refresh failed, will retry with longer delay');
      }
      
      // Use longer delay for JWT errors to allow token refresh to complete
      // Minimum 5 seconds, exponential backoff up to 60 seconds
      const baseDelay = 5000;
      const exponentialDelay = Math.min(
        baseDelay * Math.pow(2, Math.min(consecutiveJWTErrorsRef.current - 1, 3)),
        60000
      );
      const delay = exponentialDelay;
      
      reconnectAttemptsRef.current += 1;
      isReconnectingRef.current = true;

      reconnectTimeoutRef.current = setTimeout(async () => {
        if (!enabled || !tableId || hasPermission !== true) {
          isReconnectingRef.current = false;
          return;
        }
        
        // Remove old channel to force recreation
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        
        // Force re-initialization by updating reconnect key
        // This will cause the main subscription effect to re-run
        setReconnectKey(prev => prev + 1);
        
        // Also refetch to ensure we have latest data
        fetchSessions();
        
        isReconnectingRef.current = false;
      }, delay);
    } else {
      // For non-JWT errors: use standard exponential backoff
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
      reconnectAttemptsRef.current += 1;
      isReconnectingRef.current = true;

      reconnectTimeoutRef.current = setTimeout(() => {
        if (!enabled || !tableId || hasPermission !== true) {
          isReconnectingRef.current = false;
          return;
        }
        
        // Remove old channel to force recreation
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        
        // Force re-initialization by updating reconnect key
        // This will cause the main subscription effect to re-run
        setReconnectKey(prev => prev + 1);
        
        // Also refetch to ensure we have latest data
        fetchSessions();
        
        isReconnectingRef.current = false;
      }, delay);
    }
  }, [enabled, tableId, hasPermission, supabase, fetchSessions, isJWTError, shouldSuppressJWTError, refreshAuthToken]);

  // Health check: Monitor connection and refetch if no events received
  useEffect(() => {
    if (!enabled || !tableId || hasPermission !== true) return;

    // Check connection health every 30 seconds
    healthCheckIntervalRef.current = setInterval(() => {
      const timeSinceLastEvent = Date.now() - lastEventTimeRef.current;
      const channelState = channelRef.current?.state;
      
      // If no events for 2 minutes and channel is not subscribed, reconnect
      if (timeSinceLastEvent > 120000 && channelState !== 'joined') {
        console.warn('No real-time events received for 2 minutes, reconnecting...', {
          timeSinceLastEvent,
          channelState,
        });
        scheduleReconnect(); // No error passed for timeout scenarios
        // Also refetch to ensure we have latest data
        fetchSessions();
      } else if (timeSinceLastEvent > 60000) {
        // If no events for 1 minute, refetch to ensure consistency (silently)
        fetchSessions();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
    };
  }, [enabled, tableId, hasPermission, scheduleReconnect, fetchSessions]);

  // Set permission from store, props, or check if not provided
  useEffect(() => {
    if (!enabled || !tableId) return;

    // Priority 1: Use store permissions (most reliable, cached)
    if (storePermissions?.can_get !== undefined) {
      setHasPermission(storePermissions.can_get);
      permissionCheckedRef.current = true;
      return;
    }

    // Priority 2: If permission is provided as prop, use it directly
    if (providedPermission !== undefined && providedPermission !== null) {
      setHasPermission(providedPermission);
      permissionCheckedRef.current = true;
      return;
    }

    // Priority 3: Only check permission if not provided AND not already checked
    // This prevents duplicate calls when permission is being loaded at page level
    if (permissionCheckedRef.current) return;

    // Wait a bit to see if permission will be provided from parent or store
    // This prevents race conditions where the hook initializes before the page sets permission
    const timeoutId = setTimeout(() => {
      // Check again if permission was provided in the meantime
      if (storePermissions?.can_get === undefined && (providedPermission === undefined || providedPermission === null)) {
        const checkAndSetPermission = async () => {
          const hasAccess = await checkPermission();
          setHasPermission(hasAccess);
          permissionCheckedRef.current = true;
        };
        checkAndSetPermission();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [enabled, tableId, checkPermission, providedPermission, storePermissions]);

  // Fetch initial sessions when permission is confirmed
  useEffect(() => {
    if (hasPermission === true) {
      fetchSessions();
    }
  }, [hasPermission, fetchSessions]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enabled || !tableId || hasPermission !== true) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`editing-sessions-${tableId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'table_editing_sessions',
          filter: `table_id=eq.${tableId}`,
        },
        (payload) => {
          // Update last event time to track connection health
          lastEventTimeRef.current = Date.now();
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful event
          
          const newData = payload.new as EditingSession | null;
          const oldData = payload.old as EditingSession | null;
          
          // Handle INSERT events - immediately add new session
          if (payload.eventType === 'INSERT' && newData) {
            const newSession = newData;
            // Only add if session hasn't expired
            const expiresAt = new Date(newSession.expires_at || 0);
            if (expiresAt > new Date()) {
              setEditingState((prev) => {
                // Check if session already exists (avoid duplicates)
                const exists = prev.viewing.some(s => s.id === newSession.id) ||
                  (newSession.session_type === 'editing' && newSession.row_id &&
                    prev.editing.get(newSession.row_id)?.some(s => s.id === newSession.id));
                
                if (exists) {
                  return prev;
                }
                
                if (newSession.session_type === 'viewing') {
                  return {
                    viewing: [...prev.viewing, newSession],
                    editing: prev.editing,
                  };
                } else if (newSession.session_type === 'editing' && newSession.row_id) {
                  const rowId = newSession.row_id;
                  const existingRowSessions = prev.editing.get(rowId) || [];
                  return {
                    viewing: prev.viewing,
                    editing: new Map(prev.editing).set(rowId, [...existingRowSessions, newSession]),
                  };
                }
                
                return prev;
              });
            }
          }
          
          // Handle UPDATE events - update existing session
          if (payload.eventType === 'UPDATE' && newData) {
            const updatedSession = newData;
            const expiresAt = new Date(updatedSession.expires_at || 0);
            
            if (expiresAt > new Date()) {
              setEditingState((prev) => {
                if (updatedSession.session_type === 'viewing') {
                  const newViewing = prev.viewing.map(s => 
                    s.id === updatedSession.id ? updatedSession : s
                  );
                  return {
                    viewing: newViewing,
                    editing: prev.editing,
                  };
                } else if (updatedSession.session_type === 'editing' && updatedSession.row_id) {
                  const rowId = updatedSession.row_id;
                  const rowSessions = prev.editing.get(rowId) || [];
                  const updatedRowSessions = rowSessions.map(s =>
                    s.id === updatedSession.id ? updatedSession : s
                  );
                  return {
                    viewing: prev.viewing,
                    editing: new Map(prev.editing).set(rowId, updatedRowSessions),
                  };
                }
                return prev;
              });
            } else {
              // Session expired, remove it
              if (updatedSession.session_type === 'viewing') {
                setEditingState((prev) => ({
                  viewing: prev.viewing.filter(s => s.id !== updatedSession.id),
                  editing: prev.editing,
                }));
              } else if (updatedSession.session_type === 'editing' && updatedSession.row_id) {
                setEditingState((prev) => {
                  const newEditing = new Map(prev.editing);
                  const rowSessions = newEditing.get(updatedSession.row_id!) || [];
                  const filtered = rowSessions.filter(s => s.id !== updatedSession.id);
                  if (filtered.length === 0) {
                    newEditing.delete(updatedSession.row_id!);
                  } else {
                    newEditing.set(updatedSession.row_id!, filtered);
                  }
                  return {
                    viewing: prev.viewing,
                    editing: newEditing,
                  };
                });
              }
            }
          }
          
          // Handle DELETE events - immediately remove session
          if (payload.eventType === 'DELETE') {
            if (oldData) {
              const deletedSession = oldData;
              
              setEditingState((prev) => {
                const newViewing = prev.viewing.filter(
                  (s) => s.id !== deletedSession.id
                );
                const newEditing = new Map(prev.editing);
                
                // Remove from editing map if it's an editing session
                if (deletedSession.session_type === 'editing' && deletedSession.row_id) {
                  const rowSessions = newEditing.get(deletedSession.row_id) || [];
                  const filtered = rowSessions.filter((s) => s.id !== deletedSession.id);
                  if (filtered.length === 0) {
                    newEditing.delete(deletedSession.row_id);
                  } else {
                    newEditing.set(deletedSession.row_id, filtered);
                  }
                }
                
                return {
                  viewing: newViewing,
                  editing: newEditing,
                };
              });
            } else {
              // If DELETE event doesn't have old data (shouldn't happen with REPLICA IDENTITY FULL)
              // but we'll handle it gracefully by refetching
              console.warn('Real-time DELETE event received but payload.old is missing - refetching sessions');
              fetchSessions();
            }
          } else {
            // For INSERT and UPDATE, refetch after a short delay to ensure consistency
            // This handles edge cases where the immediate update might miss something
            setTimeout(() => {
              fetchSessions();
            }, 500);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          reconnectAttemptsRef.current = 0;
          consecutiveJWTErrorsRef.current = 0; // Reset JWT error counter on successful subscription
          isReconnectingRef.current = false;
          lastEventTimeRef.current = Date.now();
        } else if (status === 'CHANNEL_ERROR') {
          // Check if this is a JWT error
          const isJWT = err ? isJWTError(err) : false;
          
          if (isJWT) {
            // For JWT errors, only log if not suppressed
            if (!shouldSuppressJWTError()) {
              console.warn('JWT token expired - refreshing and reconnecting:', err?.message || err);
            }
          } else {
            // Only log if it's not a publication error (which is expected until migration is applied)
            if (err && !err.message?.includes('publication')) {
              console.warn('Error subscribing to editing sessions (will continue without real-time updates):', err?.message || err);
            }
          }
          
          // Try to reconnect on error, passing the error for JWT detection
          scheduleReconnect(err);
        } else if (status === 'TIMED_OUT') {
          console.warn('Subscription timed out for table:', tableId);
          scheduleReconnect();
        } else if (status === 'CLOSED') {
          scheduleReconnect();
        }
      });

    channelRef.current = channel;

    return () => {
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Clear health check interval
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
      
      // Remove channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
      // Reset state
      reconnectAttemptsRef.current = 0;
      isReconnectingRef.current = false;
    };
  }, [enabled, tableId, hasPermission, supabase, fetchSessions, reconnectKey, scheduleReconnect, isJWTError, shouldSuppressJWTError]);

  // Get editing sessions for a specific row
  const getRowEditingSessions = useCallback(
    (rowId: string): EditingSession[] => {
      return editingState.editing.get(rowId) || [];
    },
    [editingState.editing]
  );

  // Check if a row is being edited by someone else
  const isRowBeingEdited = useCallback(
    (rowId: string, currentUserId?: string): boolean => {
      const sessions = getRowEditingSessions(rowId);
      if (!currentUserId) {
        return sessions.length > 0;
      }
      return sessions.some((session) => session.user_id !== currentUserId);
    },
    [getRowEditingSessions]
  );

  // Get users editing a row (excluding current user)
  const getOtherUsersEditingRow = useCallback(
    (rowId: string, currentUserId?: string): EditingSession[] => {
      const sessions = getRowEditingSessions(rowId);
      if (!currentUserId) {
        return sessions;
      }
      return sessions.filter((session) => session.user_id !== currentUserId);
    },
    [getRowEditingSessions]
  );

  return {
    viewing: editingState.viewing,
    editing: editingState.editing,
    getRowEditingSessions,
    isRowBeingEdited,
    getOtherUsersEditingRow,
    hasPermission,
  };
}

