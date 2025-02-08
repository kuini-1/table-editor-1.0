-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for sub_owners" ON public.sub_owners;
DROP POLICY IF EXISTS "Enable select for sub_owners" ON public.sub_owners;

-- Allow authenticated users to insert into sub_owners table
CREATE POLICY "Enable insert for sub_owners"
ON public.sub_owners
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow owners to select their sub_owners
CREATE POLICY "Enable select for sub_owners"
ON public.sub_owners
FOR SELECT
TO authenticated
USING (
  owner_id IN (
    SELECT id FROM public.owners 
    WHERE profile_id = auth.uid()
  )
);

-- Allow owners to update their sub_owners
CREATE POLICY "Enable update for sub_owners"
ON public.sub_owners
FOR UPDATE
TO authenticated
USING (
  owner_id IN (
    SELECT id FROM public.owners 
    WHERE profile_id = auth.uid()
  )
)
WITH CHECK (
  owner_id IN (
    SELECT id FROM public.owners 
    WHERE profile_id = auth.uid()
  )
);

-- Allow owners to delete their sub_owners
CREATE POLICY "Enable delete for sub_owners"
ON public.sub_owners
FOR DELETE
TO authenticated
USING (
  owner_id IN (
    SELECT id FROM public.owners 
    WHERE profile_id = auth.uid()
  )
); 