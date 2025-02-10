-- Drop existing columns that need to be renamed
ALTER TABLE public.exp_table
DROP COLUMN IF EXISTS "wStageWin",
DROP COLUMN IF EXISTS "wStageDraw",
DROP COLUMN IF EXISTS "wStageLose",
DROP COLUMN IF EXISTS "wWin",
DROP COLUMN IF EXISTS "wPerfectWin";

-- Add new columns with updated names
ALTER TABLE public.exp_table
ADD COLUMN IF NOT EXISTS "wStageWinSolo" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageDrawSolo" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageLoseSolo" INTEGER,
ADD COLUMN IF NOT EXISTS "wWinSolo" INTEGER,
ADD COLUMN IF NOT EXISTS "wPerfectWinSolo" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageWinTeam" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageDrawTeam" INTEGER,
ADD COLUMN IF NOT EXISTS "wStageLoseTeam" INTEGER,
ADD COLUMN IF NOT EXISTS "wWinTeam" INTEGER,
ADD COLUMN IF NOT EXISTS "wPerfectWinTeam" INTEGER;

-- Add comments to document the new columns
COMMENT ON COLUMN public.exp_table."wStageWinSolo" IS 'Solo stage wins count';
COMMENT ON COLUMN public.exp_table."wStageDrawSolo" IS 'Solo stage draws count';
COMMENT ON COLUMN public.exp_table."wStageLoseSolo" IS 'Solo stage losses count';
COMMENT ON COLUMN public.exp_table."wWinSolo" IS 'Total solo wins count';
COMMENT ON COLUMN public.exp_table."wPerfectWinSolo" IS 'Perfect solo wins count';
COMMENT ON COLUMN public.exp_table."wStageWinTeam" IS 'Team stage wins count';
COMMENT ON COLUMN public.exp_table."wStageDrawTeam" IS 'Team stage draws count';
COMMENT ON COLUMN public.exp_table."wStageLoseTeam" IS 'Team stage losses count';
COMMENT ON COLUMN public.exp_table."wWinTeam" IS 'Total team wins count';
COMMENT ON COLUMN public.exp_table."wPerfectWinTeam" IS 'Perfect team wins count';

-- Update comments for existing columns to ensure consistency
COMMENT ON COLUMN public.exp_table.tblidx IS 'Table index identifier';
COMMENT ON COLUMN public.exp_table."dwExp" IS 'Experience points';
COMMENT ON COLUMN public.exp_table."dwNeed_Exp" IS 'Required experience points';
COMMENT ON COLUMN public.exp_table."wNormal_Race" IS 'Normal race count';
COMMENT ON COLUMN public.exp_table."wSuperRace" IS 'Super race count';
COMMENT ON COLUMN public.exp_table."dwMobExp" IS 'Mob experience points';
COMMENT ON COLUMN public.exp_table."dwPhyDefenceRef" IS 'Physical defence reference';
COMMENT ON COLUMN public.exp_table."dwEngDefenceRef" IS 'Energy defence reference';
COMMENT ON COLUMN public.exp_table."dwMobZenny" IS 'Mob zenny currency'; 