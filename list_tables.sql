-- Query to list all tables in the public schema that match the pattern 'table_*_data' or 'td_*'
-- Run this in Supabase SQL editor to see all your data tables

SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND (
        table_name LIKE 'table_%_data' 
        OR table_name LIKE 'td_%'
        OR table_name LIKE '%_table'
    )
ORDER BY table_name;

-- Alternative: List all tables with their row counts (if you want to see which are large)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
    AND (
        tablename LIKE 'table_%_data' 
        OR tablename LIKE 'td_%'
        OR tablename LIKE '%_table'
    )
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

