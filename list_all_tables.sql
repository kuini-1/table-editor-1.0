-- Query to list all tables in the public schema
-- Run this in Supabase SQL editor to see all your data tables

-- Option 1: List all tables matching the pattern 'table_*_data' or 'td_*'
SELECT 
    table_name,
    'table' as table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND (
        table_name LIKE 'table_%_data' 
        OR table_name LIKE 'td_%'
    )
ORDER BY table_name;

-- Option 2: List all tables with their row counts and sizes (more detailed)
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
    )
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Option 3: List ALL tables in public schema (including system tables)
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

