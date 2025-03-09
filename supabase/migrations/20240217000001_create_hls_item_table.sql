-- Create HLS Item Table
CREATE TABLE IF NOT EXISTS public.hls_item_table (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  tblidx bigint,
  wszname text,
  wszcjiproductid text,
  szicon_name text,
  whlsitemtype bigint,
  byhlsdurationtype bigint,
  dwhlsdurationtime bigint,
  idxnametext bigint,
  idxnotetext bigint,
  itemtblidx bigint,
  bonsale integer DEFAULT 0,
  byselltype bigint,
  dwcash bigint,
  bydiscount bigint,
  bystackcount bigint,
  wdisplaybitflag bigint,
  byquicklink bigint,
  dwpriority bigint,
  bydisplayconsumetype bigint,
  byyadrattype bigint,
  itemtblidx_0 bigint,
  bystackcount_0 bigint,
  itemtblidx_1 bigint,
  bystackcount_1 bigint,
  itemtblidx_2 bigint,
  bystackcount_2 bigint,
  itemtblidx_3 bigint,
  bystackcount_3 bigint,
  itemtblidx_4 bigint,
  bystackcount_4 bigint
);

-- Add comments to the table and columns
COMMENT ON TABLE public.hls_item_table IS 'Table for storing HLS item data';
COMMENT ON COLUMN public.hls_item_table.id IS 'Unique identifier for the HLS item entry';
COMMENT ON COLUMN public.hls_item_table.table_id IS 'Reference to the profile that owns this table';
COMMENT ON COLUMN public.hls_item_table.created_at IS 'Timestamp when the entry was created';
COMMENT ON COLUMN public.hls_item_table.updated_at IS 'Timestamp when the entry was last updated';
COMMENT ON COLUMN public.hls_item_table.tblidx IS 'Table index identifier';
COMMENT ON COLUMN public.hls_item_table.wszname IS 'Item name';
COMMENT ON COLUMN public.hls_item_table.wszcjiproductid IS 'Product ID';
COMMENT ON COLUMN public.hls_item_table.szicon_name IS 'Icon name';
COMMENT ON COLUMN public.hls_item_table.whlsitemtype IS 'Item type';
COMMENT ON COLUMN public.hls_item_table.byhlsdurationtype IS 'Duration type';
COMMENT ON COLUMN public.hls_item_table.dwhlsdurationtime IS 'Duration time';
COMMENT ON COLUMN public.hls_item_table.idxnametext IS 'Name text index';
COMMENT ON COLUMN public.hls_item_table.idxnotetext IS 'Note text index';
COMMENT ON COLUMN public.hls_item_table.itemtblidx IS 'Item table index';
COMMENT ON COLUMN public.hls_item_table.bonsale IS 'On sale flag (0 or 1)';
COMMENT ON COLUMN public.hls_item_table.byselltype IS 'Sell type';
COMMENT ON COLUMN public.hls_item_table.dwcash IS 'Cash value';
COMMENT ON COLUMN public.hls_item_table.bydiscount IS 'Discount value';
COMMENT ON COLUMN public.hls_item_table.bystackcount IS 'Stack count';
COMMENT ON COLUMN public.hls_item_table.wdisplaybitflag IS 'Display bit flag';
COMMENT ON COLUMN public.hls_item_table.byquicklink IS 'Quick link';
COMMENT ON COLUMN public.hls_item_table.dwpriority IS 'Priority';
COMMENT ON COLUMN public.hls_item_table.bydisplayconsumetype IS 'Display consume type';
COMMENT ON COLUMN public.hls_item_table.byyadrattype IS 'Yadrat type';
COMMENT ON COLUMN public.hls_item_table.itemtblidx_0 IS 'Item table index 0';
COMMENT ON COLUMN public.hls_item_table.bystackcount_0 IS 'Stack count 0';
COMMENT ON COLUMN public.hls_item_table.itemtblidx_1 IS 'Item table index 1';
COMMENT ON COLUMN public.hls_item_table.bystackcount_1 IS 'Stack count 1';
COMMENT ON COLUMN public.hls_item_table.itemtblidx_2 IS 'Item table index 2';
COMMENT ON COLUMN public.hls_item_table.bystackcount_2 IS 'Stack count 2';
COMMENT ON COLUMN public.hls_item_table.itemtblidx_3 IS 'Item table index 3';
COMMENT ON COLUMN public.hls_item_table.bystackcount_3 IS 'Stack count 3';
COMMENT ON COLUMN public.hls_item_table.itemtblidx_4 IS 'Item table index 4';
COMMENT ON COLUMN public.hls_item_table.bystackcount_4 IS 'Stack count 4';

-- Create indexes
CREATE INDEX IF NOT EXISTS hls_item_table_table_id_idx ON public.hls_item_table (table_id);
CREATE INDEX IF NOT EXISTS hls_item_table_tblidx_idx ON public.hls_item_table (tblidx);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_hls_item_table_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hls_item_table_updated_at
BEFORE UPDATE ON public.hls_item_table
FOR EACH ROW
EXECUTE FUNCTION public.update_hls_item_table_updated_at();

-- Set up RLS policies
ALTER TABLE public.hls_item_table ENABLE ROW LEVEL SECURITY;

-- Policy for owners
CREATE POLICY hls_item_table_owner_policy
ON public.hls_item_table
FOR ALL
TO authenticated
USING (
  table_id IN (
    SELECT id FROM public.profiles
    WHERE auth.uid() = user_id
  )
);

-- Policy for sub-owners with permissions
CREATE POLICY hls_item_table_sub_owner_select_policy
ON public.hls_item_table
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.profiles pr ON p.table_id = pr.id
    WHERE p.user_id = auth.uid()
      AND p.table_id = hls_item_table.table_id
      AND p.get = true
  )
);

CREATE POLICY hls_item_table_sub_owner_insert_policy
ON public.hls_item_table
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.profiles pr ON p.table_id = pr.id
    WHERE p.user_id = auth.uid()
      AND p.table_id = hls_item_table.table_id
      AND p.post = true
  )
);

CREATE POLICY hls_item_table_sub_owner_update_policy
ON public.hls_item_table
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.profiles pr ON p.table_id = pr.id
    WHERE p.user_id = auth.uid()
      AND p.table_id = hls_item_table.table_id
      AND p.put = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.profiles pr ON p.table_id = pr.id
    WHERE p.user_id = auth.uid()
      AND p.table_id = hls_item_table.table_id
      AND p.put = true
  )
);

CREATE POLICY hls_item_table_sub_owner_delete_policy
ON public.hls_item_table
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.permissions p
    JOIN public.profiles pr ON p.table_id = pr.id
    WHERE p.user_id = auth.uid()
      AND p.table_id = hls_item_table.table_id
      AND p.delete = true
  )
); 