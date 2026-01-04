-- Add default permissions columns to sub_owners table
-- These permissions will be used as defaults when creating permissions for new tables
-- and can be applied to existing tables when updated

ALTER TABLE public.sub_owners
ADD COLUMN IF NOT EXISTS default_can_get boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS default_can_put boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS default_can_post boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS default_can_delete boolean DEFAULT false NOT NULL;

-- Add comments to document the purpose of these columns
COMMENT ON COLUMN public.sub_owners.default_can_get IS 'Default GET permission for all tables. Used when creating permissions for new tables.';
COMMENT ON COLUMN public.sub_owners.default_can_put IS 'Default PUT permission for all tables. Used when creating permissions for new tables.';
COMMENT ON COLUMN public.sub_owners.default_can_post IS 'Default POST permission for all tables. Used when creating permissions for new tables.';
COMMENT ON COLUMN public.sub_owners.default_can_delete IS 'Default DELETE permission for all tables. Used when creating permissions for new tables.';

-- Create function to automatically apply default permissions when a new table is created
CREATE OR REPLACE FUNCTION public.apply_default_permissions_to_new_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert permissions for all sub-owners of the owner who created the table
  -- using their default permissions
  INSERT INTO public.sub_owner_permissions (
    sub_owner_id,
    table_id,
    can_get,
    can_put,
    can_post,
    can_delete
  )
  SELECT
    so.id,
    NEW.id,
    so.default_can_get,
    so.default_can_put,
    so.default_can_post,
    so.default_can_delete
  FROM public.sub_owners so
  WHERE so.owner_id = NEW.owner_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically apply default permissions when a table is created
DROP TRIGGER IF EXISTS trigger_apply_default_permissions_on_table_create ON public.tables;
CREATE TRIGGER trigger_apply_default_permissions_on_table_create
  AFTER INSERT ON public.tables
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_default_permissions_to_new_table();

