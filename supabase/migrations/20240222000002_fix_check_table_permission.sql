-- Fix check_table_permission function to ensure it works correctly for sub-owners
-- The function uses SECURITY DEFINER but we need to ensure it can access all necessary data

CREATE OR REPLACE FUNCTION public.check_table_permission(
    p_table_id uuid,
    p_action text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_is_owner boolean;
    v_has_permission boolean;
BEGIN
    -- Check if user is the owner
    SELECT EXISTS (
        SELECT 1 
        FROM public.tables t
        JOIN public.owners o ON t.owner_id = o.id
        WHERE t.id = p_table_id
        AND o.profile_id = auth.uid()
    ) INTO v_is_owner;
    
    IF v_is_owner THEN
        RETURN true;
    END IF;

    -- Check if user is a sub_owner with appropriate permission
    SELECT EXISTS (
        SELECT 1 
        FROM public.sub_owner_permissions p
        JOIN public.sub_owners so ON p.sub_owner_id = so.id
        WHERE p.table_id = p_table_id
        AND so.profile_id = auth.uid()
        AND (
            (p_action = 'select' AND p.can_get = true) OR
            (p_action = 'update' AND p.can_put = true) OR
            (p_action = 'insert' AND p.can_post = true) OR
            (p_action = 'delete' AND p.can_delete = true)
        )
    ) INTO v_has_permission;
    
    RETURN COALESCE(v_has_permission, false);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_table_permission(uuid, text) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.check_table_permission IS 'Checks if the current user has permission to perform an action on a table. Returns true for owners, or for sub-owners with the appropriate permission flag set.';

