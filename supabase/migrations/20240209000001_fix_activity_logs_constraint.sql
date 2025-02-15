-- Drop the existing constraint
ALTER TABLE public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_action_check;

-- Add the constraint back with explicit case handling
ALTER TABLE public.activity_logs ADD CONSTRAINT activity_logs_action_check 
  CHECK (action = ANY (ARRAY['POST'::text, 'PUT'::text, 'DELETE'::text])); 