-- Drop the existing check constraint
ALTER TABLE public.tables DROP CONSTRAINT IF EXISTS tables_type_check;

-- Add the new check constraint with 'hls' type
ALTER TABLE public.tables ADD CONSTRAINT tables_type_check CHECK (type IN ('exp', 'merchant', 'item', 'hls')); 