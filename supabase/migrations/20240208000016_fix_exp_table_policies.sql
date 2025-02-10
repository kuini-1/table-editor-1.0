-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for exp_table" ON public.exp_table;
DROP POLICY IF EXISTS "Enable insert for exp_table" ON public.exp_table;
DROP POLICY IF EXISTS "Enable update for exp_table" ON public.exp_table;
DROP POLICY IF EXISTS "Enable delete for exp_table" ON public.exp_table;

-- Create comprehensive policies for exp_table
CREATE POLICY "Enable read for exp_table"
ON public.exp_table
FOR SELECT
TO authenticated
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

CREATE POLICY "Enable insert for exp_table"
ON public.exp_table
FOR INSERT
TO authenticated
WITH CHECK (
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
        AND can_post = true
    )
);

CREATE POLICY "Enable update for exp_table"
ON public.exp_table
FOR UPDATE
TO authenticated
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
        AND can_put = true
    )
)
WITH CHECK (
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
        AND can_put = true
    )
);

CREATE POLICY "Enable delete for exp_table"
ON public.exp_table
FOR DELETE
TO authenticated
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
        AND can_delete = true
    )
);

-- Ensure RLS is enabled
ALTER TABLE public.exp_table FORCE ROW LEVEL SECURITY; 