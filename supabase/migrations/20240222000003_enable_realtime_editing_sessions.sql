-- Enable realtime for table_editing_sessions table
-- This allows real-time subscriptions to work for editing session changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_editing_sessions;

