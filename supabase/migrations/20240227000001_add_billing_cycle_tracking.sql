-- Add billing_cycle_start_day column to profiles table
-- This stores the day of month (1-31) when the owner's billing cycle starts
-- For example, if subscription started on the 15th, this will be 15
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_cycle_start_day INTEGER;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.billing_cycle_start_day IS 'Day of month (1-31) when the owner''s billing cycle starts. Used to reset bandwidth on the correct day each month. NULL for users without subscriptions.';
