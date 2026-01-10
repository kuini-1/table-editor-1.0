-- Schedule automatic cleanup of expired editing sessions
-- This ensures expired sessions are removed from the database periodically

-- Note: This requires the pg_cron extension to be enabled in Supabase
-- If pg_cron is not available, expired sessions will still be filtered out
-- by queries (using WHERE expires_at > now()), but won't be physically deleted

-- Remove existing job if it exists (ignore error if it doesn't exist)
DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-expired-sessions');
EXCEPTION
  WHEN OTHERS THEN
    -- Job doesn't exist, that's fine
    NULL;
END $$;

-- Schedule cleanup to run every minute
-- This will fail gracefully if pg_cron is not available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup-expired-sessions',
      '* * * * *', -- Every minute
      'SELECT public.cleanup_expired_sessions()'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If scheduling fails, that's okay - queries already filter expired sessions
    -- Expired sessions will be filtered by WHERE expires_at > now() in queries
    NULL;
END $$;

-- Add comment explaining the cleanup strategy
COMMENT ON FUNCTION public.cleanup_expired_sessions IS 'Removes expired editing sessions. Called automatically via pg_cron if available, otherwise expired sessions are filtered by queries.';

