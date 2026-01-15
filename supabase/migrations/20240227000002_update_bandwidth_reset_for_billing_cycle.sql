-- Update reset_monthly_bandwidth function to reset based on billing cycle start day
-- This ensures each owner's bandwidth resets on their subscription billing cycle date
-- Also resets all sub owners when their owner's billing cycle resets

CREATE OR REPLACE FUNCTION public.reset_monthly_bandwidth()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_day INTEGER;
BEGIN
  -- Get today's day of month (1-31)
  today_day := EXTRACT(DAY FROM now())::INTEGER;
  
  -- Reset sub owners first (based on their owner's billing cycle day)
  -- This must happen before updating owner timestamps to avoid race condition
  UPDATE public.profiles
  SET 
    current_month_bandwidth_used = 0,
    last_bandwidth_reset = now()
  WHERE id IN (
    SELECT so.profile_id 
    FROM sub_owners so
    JOIN owners o ON so.owner_id = o.id
    JOIN profiles p ON o.profile_id = p.id
    WHERE p.billing_cycle_start_day = today_day
      AND p.role = 'owner'
      AND (
        -- Only reset if last reset was before this billing cycle
        p.last_bandwidth_reset IS NULL 
        OR EXTRACT(DAY FROM p.last_bandwidth_reset) != today_day
        OR p.last_bandwidth_reset < date_trunc('day', now())
      )
  );
  
  -- Then reset owners whose billing cycle day matches today
  UPDATE public.profiles
  SET 
    current_month_bandwidth_used = 0,
    last_bandwidth_reset = now()
  WHERE billing_cycle_start_day = today_day
    AND role = 'owner'
    AND (
      -- Only reset if last reset was before today or on a different day
      last_bandwidth_reset IS NULL 
      OR EXTRACT(DAY FROM last_bandwidth_reset) != today_day
      OR last_bandwidth_reset < date_trunc('day', now())
    );
END;
$$;

-- Update cron job schedule from monthly to daily
-- First, unschedule the old monthly job if it exists
SELECT cron.unschedule('reset-monthly-bandwidth') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'reset-monthly-bandwidth'
);

-- Schedule new daily job to check billing cycles
-- Runs every day at midnight to check if any owner's billing cycle has reset
SELECT cron.schedule(
  'reset-monthly-bandwidth',
  '0 0 * * *', -- Run every day at midnight
  $$SELECT public.reset_monthly_bandwidth()$$
);
