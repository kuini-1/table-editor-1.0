-- Rename tables to use _table suffix instead of _data
ALTER TABLE IF EXISTS public.exp_data RENAME TO exp_table;
ALTER TABLE IF EXISTS public.merchant_data RENAME TO merchant_table;
ALTER TABLE IF EXISTS public.item_data RENAME TO item_table;

-- Drop the data column from exp_table and add new columns in the exact order
ALTER TABLE public.exp_table
DROP COLUMN IF EXISTS data,
ADD COLUMN IF NOT EXISTS tblidx INTEGER,
ADD COLUMN IF NOT EXISTS "dwExp" INTEGER,
ADD COLUMN IF NOT EXISTS "dwNeed_Exp" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageWin" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageDraw" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageLose" INTEGER,
ADD COLUMN IF NOT EXISTS "wWin" INTEGER,
ADD COLUMN IF NOT EXISTS "wPerfectWin" INTEGER,
ADD COLUMN IF NOT EXISTS "wNormal_Race" INTEGER,
ADD COLUMN IF NOT EXISTS "wSuperRace" INTEGER,
ADD COLUMN IF NOT EXISTS "dwMobExp" INTEGER,
ADD COLUMN IF NOT EXISTS "dwPhyDefenceRef" INTEGER,
ADD COLUMN IF NOT EXISTS "dwEngDefenceRef" INTEGER,
ADD COLUMN IF NOT EXISTS "dwMobZenny" INTEGER;

-- Add comments to document the purpose of each column
COMMENT ON COLUMN public.exp_table.tblidx IS 'Table index identifier';
COMMENT ON COLUMN public.exp_table."dwExp" IS 'Experience points';
COMMENT ON COLUMN public.exp_table."dwNeed_Exp" IS 'Required experience points';
COMMENT ON COLUMN public.exp_table."wStageWin" IS 'Stage wins count';
COMMENT ON COLUMN public.exp_table."wStageDraw" IS 'Stage draws count';
COMMENT ON COLUMN public.exp_table."wStageLose" IS 'Stage losses count';
COMMENT ON COLUMN public.exp_table."wWin" IS 'Total wins count';
COMMENT ON COLUMN public.exp_table."wPerfectWin" IS 'Perfect wins count';
COMMENT ON COLUMN public.exp_table."wNormal_Race" IS 'Normal race count';
COMMENT ON COLUMN public.exp_table."wSuperRace" IS 'Super race count';
COMMENT ON COLUMN public.exp_table."dwMobExp" IS 'Mob experience points';
COMMENT ON COLUMN public.exp_table."dwPhyDefenceRef" IS 'Physical defence reference';
COMMENT ON COLUMN public.exp_table."dwEngDefenceRef" IS 'Energy defence reference';
COMMENT ON COLUMN public.exp_table."dwMobZenny" IS 'Mob zenny currency';

-- Add a unique constraint on tblidx
ALTER TABLE public.exp_table
ADD CONSTRAINT exp_table_tblidx_key UNIQUE (tblidx);

-- Update references in RLS policies
DROP POLICY IF EXISTS "Enable read for exp_data" ON public.exp_table;
CREATE POLICY "Enable read for exp_table"
ON public.exp_table
FOR SELECT
TO authenticated
USING (
    table_id IN (
        SELECT id FROM public.tables
        WHERE owner_id IN (
            SELECT id FROM public.owners
            WHERE profile_id = auth.uid()
        )
    )
    OR
    table_id IN (
        SELECT table_id FROM public.sub_owner_permissions
        WHERE sub_owner_id IN (
            SELECT id FROM public.sub_owners
            WHERE profile_id = auth.uid()
        )
        AND can_get = true
    )
);

-- Update foreign key references
ALTER TABLE public.exp_table
DROP CONSTRAINT IF EXISTS exp_data_table_id_fkey,
ADD CONSTRAINT exp_table_table_id_fkey
FOREIGN KEY (table_id)
REFERENCES public.tables(id)
ON DELETE CASCADE; 