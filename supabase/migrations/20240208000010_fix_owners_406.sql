-- First, disable RLS temporarily to ensure we can modify the policies
ALTER TABLE public.owners DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for owners
DROP POLICY IF EXISTS "Owners can read own record" ON public.owners;
DROP POLICY IF EXISTS "Enable insert for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable read for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable update for owners" ON public.owners;
DROP POLICY IF EXISTS "Enable delete for owners" ON public.owners;

-- Create a single, very permissive policy for owners
CREATE POLICY "Enable all operations for authenticated users"
ON public.owners
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.owners TO authenticated;
GRANT USAGE ON SEQUENCE owners_id_seq TO authenticated; 