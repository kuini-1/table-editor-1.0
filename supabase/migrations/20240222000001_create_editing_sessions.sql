-- Create table_editing_sessions table to track active viewing/editing sessions
CREATE TABLE IF NOT EXISTS public.table_editing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  row_id UUID, -- NULL for table-level viewing, UUID for row-level editing
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  session_type TEXT NOT NULL CHECK (session_type IN ('viewing', 'editing')),
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- Auto-cleanup after 5 minutes of inactivity
  
  -- Unique constraint: one session per user per table/row
  UNIQUE(table_id, row_id, user_id, session_type)
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_editing_sessions_table ON public.table_editing_sessions(table_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_editing_sessions_row ON public.table_editing_sessions(table_id, row_id, expires_at) WHERE row_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.table_editing_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see sessions for tables they have access to (owners and sub-owners with GET permission)
CREATE POLICY "View sessions for accessible tables" 
ON public.table_editing_sessions FOR SELECT
USING (
  -- Owner can see all sessions for their tables
  table_id IN (
    SELECT id FROM public.tables
    WHERE owner_id IN (
      SELECT id FROM public.owners WHERE profile_id = auth.uid()
    )
  )
  OR
  -- Sub-owner can see sessions if they have GET permission
  table_id IN (
    SELECT table_id FROM public.sub_owner_permissions
    WHERE sub_owner_id IN (
      SELECT id FROM public.sub_owners WHERE profile_id = auth.uid()
    )
    AND can_get = true
  )
);

-- Policy: Users can insert their own sessions
CREATE POLICY "Insert own sessions"
ON public.table_editing_sessions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own sessions
CREATE POLICY "Update own sessions"
ON public.table_editing_sessions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own sessions
CREATE POLICY "Delete own sessions"
ON public.table_editing_sessions FOR DELETE
USING (user_id = auth.uid());

-- Cleanup function to remove expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.table_editing_sessions
  WHERE expires_at < now();
END;
$$;

-- Add comment to document the table's purpose
COMMENT ON TABLE public.table_editing_sessions IS 'Tracks active viewing and editing sessions for tables/rows. Used for real-time collaboration indicators.';

-- Enable realtime for editing sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_editing_sessions;

