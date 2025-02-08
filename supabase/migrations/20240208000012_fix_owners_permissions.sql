-- First, disable RLS temporarily
ALTER TABLE public.owners DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies including the conflicting one
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.owners;
DROP POLICY IF EXISTS "Owners can read own record" ON public.owners;
DROP POLICY IF EXISTS "Enable insert for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable read for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable update for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable delete for owners" ON public.owners;
DROP POLICY IF EXISTS "owners_policy" ON public.owners;

-- Create the new permissive policy
CREATE POLICY "owners_policy"
ON public.owners
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.owners TO authenticated; 