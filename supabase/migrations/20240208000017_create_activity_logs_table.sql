-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('POST', 'PUT', 'DELETE')),
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    -- Add comment to explain the table's purpose
    COMMENT ON TABLE public.activity_logs IS 'Tracks user actions on tables like create, update, and delete operations'
);

-- Add RLS policies
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for owners" ON public.activity_logs;
DROP POLICY IF EXISTS "Enable insert for owners" ON public.activity_logs;

-- Policy to allow owners and sub-owners to view logs for their tables
CREATE POLICY "Enable read for owners and sub-owners" ON public.activity_logs
FOR SELECT TO authenticated
USING (
    table_id IN (
        SELECT id FROM public.tables
        WHERE owner_id IN (
            SELECT id FROM public.owners
            WHERE profile_id = auth.uid()
        )
    )
    OR
    table_id IN (
        SELECT table_id FROM public.sub_owner_permissions
        WHERE sub_owner_id IN (
            SELECT id FROM public.sub_owners
            WHERE profile_id = auth.uid()
        )
        AND can_get = true
    )
);

-- Policy to allow users to insert logs for tables they have access to
CREATE POLICY "Enable insert for users with access" ON public.activity_logs
FOR INSERT TO authenticated
WITH CHECK (
    -- Allow owners to insert logs for their tables
    (
        table_id IN (
            SELECT id FROM public.tables
            WHERE owner_id IN (
                SELECT id FROM public.owners
                WHERE profile_id = auth.uid()
            )
        )
    )
    OR
    -- Allow sub-owners to insert logs based on their permissions
    (
        table_id IN (
            SELECT table_id FROM public.sub_owner_permissions
            WHERE sub_owner_id IN (
                SELECT id FROM public.sub_owners
                WHERE profile_id = auth.uid()
            )
            AND (
                (action = 'POST' AND can_post = true) OR
                (action = 'PUT' AND can_put = true) OR
                (action = 'DELETE' AND can_delete = true)
            )
        )
    )
    -- Ensure users can only log actions as themselves
    AND user_id = auth.uid()
); 