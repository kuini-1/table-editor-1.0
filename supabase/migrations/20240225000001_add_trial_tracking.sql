-- Add trial_start_date to profiles table for tracking free trial period
-- If trial_start_date is null, we'll use created_at as the trial start date
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_start_date timestamptz;

-- Set trial_start_date to created_at for existing users who don't have a subscription
UPDATE public.profiles
SET trial_start_date = created_at
WHERE trial_start_date IS NULL 
  AND (stripe_subscription_id IS NULL OR subscription_status IS NULL OR subscription_status = 'inactive');

-- For new users, trial_start_date will default to created_at via trigger
CREATE OR REPLACE FUNCTION public.set_trial_start_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.trial_start_date IS NULL THEN
    NEW.trial_start_date := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set trial_start_date on insert
DROP TRIGGER IF EXISTS set_trial_start_date_trigger ON public.profiles;
CREATE TRIGGER set_trial_start_date_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_trial_start_date();

-- Add comment
COMMENT ON COLUMN public.profiles.trial_start_date IS 'Date when the free trial started. Used to calculate if trial is still active (3 days from this date).';

