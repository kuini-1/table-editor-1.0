import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

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
}

interface EditingState {
  viewing: EditingSession[];
  editing: Map<string, EditingSession[]>; // row_id -> sessions
}

export function useEditingIndicators({ tableId, enabled = true }: UseEditingIndicatorsOptions) {
  const supabase = createClient();
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
      console.log('fetchSessions: Skipping - no tableId or permission', { tableId, hasPermission });
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
            console.log('fetchSessions: Skipping expired session', session.id);
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

        console.log('Fetched editing sessions:', { 
          tableId, 
          totalSessions: data.length, 
          viewingCount: viewing.length, 
          editingCount: editing.size,
          viewingSessions: viewing.map(s => ({ 
            user_email: s.user_email, 
            user_id: s.user_id,
            session_id: s.id,
            expires_at: s.expires_at,
          }))
        });

        setEditingState({ viewing, editing });
      } else {
        console.log('fetchSessions: No sessions found for table', tableId);
        setEditingState({ viewing: [], editing: new Map() });
      }
    } catch (error) {
      console.error('Error in fetchSessions:', error);
    }
  }, [tableId, hasPermission, supabase]);

  // Reconnection function with exponential backoff
  const scheduleReconnect = useCallback(() => {
    if (!enabled || !tableId || hasPermission !== true || isReconnectingRef.current) {
      return;
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    reconnectAttemptsRef.current += 1;
    isReconnectingRef.current = true;

    console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current} in ${delay}ms for table:`, tableId);

    reconnectTimeoutRef.current = setTimeout(() => {
      if (!enabled || !tableId || hasPermission !== true) {
        isReconnectingRef.current = false;
        return;
      }

      console.log('Attempting to reconnect to real-time subscription for table:', tableId);
      
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
  }, [enabled, tableId, hasPermission, supabase, fetchSessions]);

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
        scheduleReconnect();
        // Also refetch to ensure we have latest data
        fetchSessions();
      } else if (timeSinceLastEvent > 60000) {
        // If no events for 1 minute, refetch to ensure consistency
        console.log('No real-time events for 1 minute, refetching sessions for consistency');
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

  // Check permission on mount
  useEffect(() => {
    if (!enabled || !tableId || permissionCheckedRef.current) return;

    const checkAndSetPermission = async () => {
      const hasAccess = await checkPermission();
      setHasPermission(hasAccess);
      permissionCheckedRef.current = true;
    };

    checkAndSetPermission();
  }, [enabled, tableId, checkPermission]);

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
          
          console.log('Real-time event received for editing sessions:', {
            eventType: payload.eventType,
            table: payload.table,
            tableId: newData?.table_id || oldData?.table_id,
            sessionType: newData?.session_type || oldData?.session_type,
            userId: newData?.user_id || oldData?.user_id,
            sessionId: newData?.id || oldData?.id,
            hasOldData: !!oldData,
            hasNewData: !!newData,
          });
          
          // Handle INSERT events - immediately add new session
          if (payload.eventType === 'INSERT' && newData) {
            const newSession = newData;
            // Only add if session hasn't expired
            const expiresAt = new Date(newSession.expires_at || 0);
            if (expiresAt > new Date()) {
              console.log('Real-time INSERT event - immediately adding session', {
                sessionId: newSession.id,
                userId: newSession.user_id,
                sessionType: newSession.session_type,
                tableId: newSession.table_id,
              });
              
              setEditingState((prev) => {
                // Check if session already exists (avoid duplicates)
                const exists = prev.viewing.some(s => s.id === newSession.id) ||
                  (newSession.session_type === 'editing' && newSession.row_id &&
                    prev.editing.get(newSession.row_id)?.some(s => s.id === newSession.id));
                
                if (exists) {
                  console.log('Real-time INSERT: Session already exists, skipping');
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
            } else {
              console.log('Real-time INSERT: Session already expired, ignoring');
            }
          }
          
          // Handle UPDATE events - update existing session
          if (payload.eventType === 'UPDATE' && newData) {
            const updatedSession = newData;
            const expiresAt = new Date(updatedSession.expires_at || 0);
            
            if (expiresAt > new Date()) {
              console.log('Real-time UPDATE event - updating session', {
                sessionId: updatedSession.id,
                userId: updatedSession.user_id,
                sessionType: updatedSession.session_type,
              });
              
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
              console.log('Real-time UPDATE: Session expired, removing');
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
              console.log('Real-time DELETE event - immediately removing session', {
                sessionId: deletedSession.id,
                userId: deletedSession.user_id,
                sessionType: deletedSession.session_type,
                tableId: deletedSession.table_id,
              });
              
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
                
                console.log('Real-time DELETE: State updated', {
                  viewingBefore: prev.viewing.length,
                  viewingAfter: newViewing.length,
                });
                
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
          console.log('Subscribed to editing sessions for table:', tableId);
          reconnectAttemptsRef.current = 0;
          isReconnectingRef.current = false;
          lastEventTimeRef.current = Date.now();
        } else if (status === 'CHANNEL_ERROR') {
          // Only log if it's not a publication error (which is expected until migration is applied)
          if (err && !err.message?.includes('publication')) {
            console.warn('Error subscribing to editing sessions (will continue without real-time updates):', err?.message || err);
          }
          // Try to reconnect on error
          scheduleReconnect();
        } else if (status === 'TIMED_OUT') {
          console.warn('Subscription timed out for table:', tableId);
          scheduleReconnect();
        } else if (status === 'CLOSED') {
          console.log('Real-time channel closed for table:', tableId);
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
  }, [enabled, tableId, hasPermission, supabase, fetchSessions, reconnectKey, scheduleReconnect]);

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

