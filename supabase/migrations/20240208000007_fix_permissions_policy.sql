-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for permissions" ON public.sub_owner_permissions;
DROP POLICY IF EXISTS "Enable select for permissions" ON public.sub_owner_permissions;

-- Allow authenticated users to insert permissions
CREATE POLICY "Enable insert for permissions"
ON public.sub_owner_permissions
FOR INSERT
TO authenticated
WITH CHECK (
  sub_owner_id IN (
    SELECT id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
);

-- Allow owners to select permissions for their sub_owners
CREATE POLICY "Enable select for permissions"
ON public.sub_owner_permissions
FOR SELECT
TO authenticated
USING (
  sub_owner_id IN (
    SELECT id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
);

-- Allow owners to update permissions for their sub_owners
CREATE POLICY "Enable update for permissions"
ON public.sub_owner_permissions
FOR UPDATE
TO authenticated
USING (
  sub_owner_id IN (
    SELECT id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
)
WITH CHECK (
  sub_owner_id IN (
    SELECT id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
);

-- Allow owners to delete permissions for their sub_owners
CREATE POLICY "Enable delete for permissions"
ON public.sub_owner_permissions
FOR DELETE
TO authenticated
USING (
  sub_owner_id IN (
    SELECT id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
); 