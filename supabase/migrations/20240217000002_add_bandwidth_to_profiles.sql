-- Add bandwidth tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS monthly_bandwidth_limit bigint DEFAULT 5368709120, -- 5GB in bytes
ADD COLUMN IF NOT EXISTS current_month_bandwidth_used bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_bandwidth_reset timestamptz DEFAULT now();

-- Add comment to explain the columns
COMMENT ON COLUMN public.profiles.monthly_bandwidth_limit IS 'Monthly bandwidth limit in bytes';
COMMENT ON COLUMN public.profiles.current_month_bandwidth_used IS 'Current month bandwidth usage in bytes';
COMMENT ON COLUMN public.profiles.last_bandwidth_reset IS 'Timestamp of last bandwidth reset';

-- Create function to reset bandwidth usage
CREATE OR REPLACE FUNCTION public.reset_monthly_bandwidth()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    current_month_bandwidth_used = 0,
    last_bandwidth_reset = now()
  WHERE last_bandwidth_reset < date_trunc('month', now());
END;
$$;

-- Create a scheduled job to reset bandwidth monthly
SELECT cron.schedule(
  'reset-monthly-bandwidth',
  '0 0 1 * *', -- Run at midnight on the first day of each month
  $$SELECT public.reset_monthly_bandwidth()$$
); 