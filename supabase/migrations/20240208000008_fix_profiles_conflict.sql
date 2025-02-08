-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for profiles" ON public.profiles;

-- Allow any authenticated user to insert their profile
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  AND 
  email = auth.jwt()->>'email'
);

-- Allow users to read their own profile
CREATE POLICY "Enable read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR
  id IN (
    SELECT profile_id FROM public.sub_owners
    WHERE owner_id IN (
      SELECT id FROM public.owners
      WHERE profile_id = auth.uid()
    )
  )
);

-- Allow users to update their own profile
CREATE POLICY "Enable update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Ensure email uniqueness is enforced
DROP INDEX IF EXISTS profiles_email_key;
CREATE UNIQUE INDEX profiles_email_key ON public.profiles(email);

-- Add ON CONFLICT handling for profiles
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_email_key;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_email_key 
UNIQUE (email); 