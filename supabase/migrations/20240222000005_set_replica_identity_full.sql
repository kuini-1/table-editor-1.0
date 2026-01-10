-- Set REPLICA IDENTITY FULL for table_editing_sessions
-- This is required for Supabase real-time to emit DELETE events with the old row data
-- Without this, DELETE events won't include payload.old, making it impossible to identify which session was deleted

ALTER TABLE public.table_editing_sessions REPLICA IDENTITY FULL;

COMMENT ON TABLE public.table_editing_sessions IS 'Tracks active viewing and editing sessions for tables/rows. Used for real-time collaboration indicators. REPLICA IDENTITY FULL is set to enable DELETE events in real-time subscriptions.';

