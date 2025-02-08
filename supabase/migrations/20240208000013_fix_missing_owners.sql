-- Insert owner records for existing owner profiles that don't have one
INSERT INTO public.owners (profile_id)
SELECT id
FROM public.profiles
WHERE role = 'owner'
AND id NOT IN (SELECT profile_id FROM public.owners)
ON CONFLICT (profile_id) DO NOTHING;

-- Create a trigger to automatically create owner record when a profile is created with role 'owner'
CREATE OR REPLACE FUNCTION public.create_owner_for_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'owner' THEN
        INSERT INTO public.owners (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_owner_after_profile_insert ON public.profiles;

CREATE TRIGGER create_owner_after_profile_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_owner_for_profile();

-- Add unique constraint on profile_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'owners_profile_id_key'
    ) THEN
        ALTER TABLE public.owners
        ADD CONSTRAINT owners_profile_id_key
        UNIQUE (profile_id);
    END IF;
END $$; 