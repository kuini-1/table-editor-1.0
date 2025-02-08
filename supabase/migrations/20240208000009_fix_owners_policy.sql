-- Drop existing policies
DROP POLICY IF EXISTS "Owners can read own record" ON public.owners;
DROP POLICY IF EXISTS "Enable insert for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable read for owners" ON public.owners;

-- Create more permissive policies for owners table
CREATE POLICY "Enable insert for owners"
ON public.owners
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read for owners"
ON public.owners
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR
  id IN (
    SELECT owner_id FROM public.sub_owners
    WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Enable update for owners"
ON public.owners
FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Enable delete for owners"
ON public.owners
FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- Drop existing policies for sub_owners
DROP POLICY IF EXISTS "Owners can read their sub_owners" ON public.sub_owners;
DROP POLICY IF EXISTS "Enable insert for sub_owners" ON public.sub_owners;
DROP POLICY IF EXISTS "Enable select for sub_owners" ON public.sub_owners;
DROP POLICY IF EXISTS "Enable update for sub_owners" ON public.sub_owners;
DROP POLICY IF EXISTS "Enable delete for sub_owners" ON public.sub_owners;

-- Create more permissive policies for sub_owners table
CREATE POLICY "Enable insert for sub_owners"
ON public.sub_owners
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read for sub_owners"
ON public.sub_owners
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR
  owner_id IN (
    SELECT id FROM public.owners
    WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Enable update for sub_owners"
ON public.sub_owners
FOR UPDATE
TO authenticated
USING (
  owner_id IN (
    SELECT id FROM public.owners
    WHERE profile_id = auth.uid()
  )
);

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

-- Enable RLS
ALTER TABLE public.owners FORCE ROW LEVEL SECURITY;
ALTER TABLE public.sub_owners FORCE ROW LEVEL SECURITY; 