-- Add performance indexes for commonly filtered columns
-- This migration improves query performance for large tables (70k+ rows)

-- Note: If you need trigram indexes for advanced text search, enable pg_trgm extension first:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- This may require admin privileges in Supabase. Regular B-tree indexes below are sufficient for most filtering needs.

-- Indexes for table_item_data (most commonly used table with many rows)
-- These indexes will significantly speed up filter queries

-- Index on name (text search) - B-tree index for equality and prefix matching
CREATE INDEX IF NOT EXISTS idx_item_table_name ON public.table_item_data(name);

-- Index on commonly filtered numeric columns
CREATE INDEX IF NOT EXISTS idx_item_table_tblidx ON public.table_item_data(tblidx);
CREATE INDEX IF NOT EXISTS idx_item_table_byitem_type ON public.table_item_data(byitem_type);
CREATE INDEX IF NOT EXISTS idx_item_table_byequip_type ON public.table_item_data(byequip_type);
CREATE INDEX IF NOT EXISTS idx_item_table_byrank ON public.table_item_data(byrank);
CREATE INDEX IF NOT EXISTS idx_item_table_dwcost ON public.table_item_data(dwcost);
CREATE INDEX IF NOT EXISTS idx_item_table_dwsell_price ON public.table_item_data(dwsell_price);

-- Composite index for common filter combinations (table_id + commonly filtered columns)
CREATE INDEX IF NOT EXISTS idx_item_table_id_tblidx ON public.table_item_data(table_id, tblidx);
CREATE INDEX IF NOT EXISTS idx_item_table_id_name ON public.table_item_data(table_id, name);
CREATE INDEX IF NOT EXISTS idx_item_table_id_type ON public.table_item_data(table_id, byitem_type);

-- Indexes for boolean columns (for filtering)
CREATE INDEX IF NOT EXISTS idx_item_table_bvalidity_able ON public.table_item_data(bvalidity_able);
CREATE INDEX IF NOT EXISTS idx_item_table_biscanhaveoption ON public.table_item_data(biscanhaveoption);

-- Add comment to document the purpose
COMMENT ON INDEX idx_item_table_name IS 'Index for fast text search on item names';
COMMENT ON INDEX idx_item_table_tblidx IS 'Index for filtering by table index';
COMMENT ON INDEX idx_item_table_byitem_type IS 'Index for filtering by item type';
COMMENT ON INDEX idx_item_table_byequip_type IS 'Index for filtering by equipment type';
COMMENT ON INDEX idx_item_table_byrank IS 'Index for filtering by rank';
COMMENT ON INDEX idx_item_table_dwcost IS 'Index for filtering by cost';
COMMENT ON INDEX idx_item_table_dwsell_price IS 'Index for filtering by sell price';
COMMENT ON INDEX idx_item_table_id_tblidx IS 'Composite index for filtering by table_id and tblidx';
COMMENT ON INDEX idx_item_table_id_name IS 'Composite index for filtering by table_id and name';
COMMENT ON INDEX idx_item_table_id_type IS 'Composite index for filtering by table_id and item type';

-- Similar indexes for other large tables
-- Add indexes for table_exp_data
CREATE INDEX IF NOT EXISTS idx_exp_data_tblidx ON public.table_exp_data(tblidx);
CREATE INDEX IF NOT EXISTS idx_exp_data_dwExp ON public.table_exp_data("dwExp");
CREATE INDEX IF NOT EXISTS idx_exp_data_id_tblidx ON public.table_exp_data(table_id, tblidx);

-- Add indexes for table_merchant_data
CREATE INDEX IF NOT EXISTS idx_merchant_data_tblidx ON public.table_merchant_data(tblidx);
CREATE INDEX IF NOT EXISTS idx_merchant_data_id_tblidx ON public.table_merchant_data(table_id, tblidx);

-- Note: These indexes will improve query performance significantly for filtered queries
-- The trade-off is slightly slower INSERT/UPDATE operations, but this is acceptable
-- for read-heavy workloads with large datasets

