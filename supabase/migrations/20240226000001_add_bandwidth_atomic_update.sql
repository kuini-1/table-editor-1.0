-- Create atomic function for incrementing bandwidth usage
-- This ensures thread-safe bandwidth tracking when multiple requests occur concurrently
CREATE OR REPLACE FUNCTION public.increment_bandwidth_usage(
  p_user_id uuid,
  p_bytes bigint
) RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET current_month_bandwidth_used = current_month_bandwidth_used + p_bytes
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment to document the function
COMMENT ON FUNCTION public.increment_bandwidth_usage(uuid, bigint) IS 
'Atomically increments the bandwidth usage for a user. Used for thread-safe bandwidth tracking when multiple requests occur concurrently.';

