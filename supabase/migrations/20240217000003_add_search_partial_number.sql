-- Create function for partial number search
CREATE OR REPLACE FUNCTION public.search_partial_number(
    table_name text,
    column_name text,
    search_value text
)
RETURNS TABLE (
    id uuid,
    table_id uuid,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    query text;
    column_exists boolean;
BEGIN
    -- Check if the column exists in the table
    EXECUTE format('
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = ''public''
            AND table_name = %L
            AND column_name = %L
        )', table_name, column_name)
    INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE EXCEPTION 'Column % does not exist in table %', column_name, table_name;
    END IF;

    -- Construct a dynamic query to search for partial number matches
    -- This converts the number to text and uses LIKE for pattern matching
    query := format(
        'SELECT id, table_id, created_at, updated_at FROM %I WHERE CAST(%I AS TEXT) LIKE ''%%'' || $1 || ''%%''',
        table_name,
        column_name
    );
    
    -- Return the query results
    RETURN QUERY EXECUTE query USING search_value;
END;
$$;

-- Add comment to document the function
COMMENT ON FUNCTION public.search_partial_number IS 'Function to search for partial number matches in numeric columns'; 