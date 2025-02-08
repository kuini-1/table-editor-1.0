-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.owners;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.tables;

-- Create a more permissive insert policy for profiles
CREATE POLICY "Enable insert for profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert into owners table
CREATE POLICY "Enable insert for owners"
ON public.owners
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert into tables table
CREATE POLICY "Enable insert for tables"
ON public.tables
FOR INSERT
TO authenticated
WITH CHECK (true); 