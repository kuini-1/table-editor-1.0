-- Drop any existing check constraints that might be causing issues
DO $$ 
BEGIN
    -- Drop constraints if they exist
    EXECUTE (
        SELECT string_agg('ALTER TABLE public.exp_table DROP CONSTRAINT ' || quote_ident(constraint_name) || ';', ' ')
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'exp_table' 
        AND constraint_type = 'CHECK'
    );
END $$;

-- Add or update constraints with proper validation
ALTER TABLE public.exp_table
    ALTER COLUMN "tblidx" SET NOT NULL,
    ALTER COLUMN "table_id" SET NOT NULL,
    ALTER COLUMN "dwExp" SET DEFAULT 0,
    ALTER COLUMN "dwNeed_Exp" SET DEFAULT 0,
    ALTER COLUMN "wStageWinSolo" SET DEFAULT 0,
    ALTER COLUMN "wStageDrawSolo" SET DEFAULT 0,
    ALTER COLUMN "wStageLoseSolo" SET DEFAULT 0,
    ALTER COLUMN "wWinSolo" SET DEFAULT 0,
    ALTER COLUMN "wPerfectWinSolo" SET DEFAULT 0,
    ALTER COLUMN "wStageWinTeam" SET DEFAULT 0,
    ALTER COLUMN "wStageDrawTeam" SET DEFAULT 0,
    ALTER COLUMN "wStageLoseTeam" SET DEFAULT 0,
    ALTER COLUMN "wWinTeam" SET DEFAULT 0,
    ALTER COLUMN "wPerfectWinTeam" SET DEFAULT 0,
    ALTER COLUMN "wNormal_Race" SET DEFAULT 0,
    ALTER COLUMN "wSuperRace" SET DEFAULT 0,
    ALTER COLUMN "dwMobExp" SET DEFAULT 0,
    ALTER COLUMN "dwPhyDefenceRef" SET DEFAULT 0,
    ALTER COLUMN "dwEngDefenceRef" SET DEFAULT 0,
    ALTER COLUMN "dwMobZenny" SET DEFAULT 0;

-- Add check constraints to ensure non-negative values
ALTER TABLE public.exp_table
    ADD CONSTRAINT exp_table_tblidx_check CHECK ("tblidx" >= 0),
    ADD CONSTRAINT exp_table_dwexp_check CHECK ("dwExp" >= 0),
    ADD CONSTRAINT exp_table_dwneed_exp_check CHECK ("dwNeed_Exp" >= 0),
    ADD CONSTRAINT exp_table_wstagewin_solo_check CHECK ("wStageWinSolo" >= 0),
    ADD CONSTRAINT exp_table_wstagedraw_solo_check CHECK ("wStageDrawSolo" >= 0),
    ADD CONSTRAINT exp_table_wstagelose_solo_check CHECK ("wStageLoseSolo" >= 0),
    ADD CONSTRAINT exp_table_wwin_solo_check CHECK ("wWinSolo" >= 0),
    ADD CONSTRAINT exp_table_wperfectwin_solo_check CHECK ("wPerfectWinSolo" >= 0),
    ADD CONSTRAINT exp_table_wstagewin_team_check CHECK ("wStageWinTeam" >= 0),
    ADD CONSTRAINT exp_table_wstagedraw_team_check CHECK ("wStageDrawTeam" >= 0),
    ADD CONSTRAINT exp_table_wstagelose_team_check CHECK ("wStageLoseTeam" >= 0),
    ADD CONSTRAINT exp_table_wwin_team_check CHECK ("wWinTeam" >= 0),
    ADD CONSTRAINT exp_table_wperfectwin_team_check CHECK ("wPerfectWinTeam" >= 0),
    ADD CONSTRAINT exp_table_wnormal_race_check CHECK ("wNormal_Race" >= 0),
    ADD CONSTRAINT exp_table_wsuperrace_check CHECK ("wSuperRace" >= 0),
    ADD CONSTRAINT exp_table_dwmobexp_check CHECK ("dwMobExp" >= 0),
    ADD CONSTRAINT exp_table_dwphydefenceref_check CHECK ("dwPhyDefenceRef" >= 0),
    ADD CONSTRAINT exp_table_dwengdefenceref_check CHECK ("dwEngDefenceRef" >= 0),
    ADD CONSTRAINT exp_table_dwmobzenny_check CHECK ("dwMobZenny" >= 0);

-- Add unique constraint for tblidx within each table
ALTER TABLE public.exp_table
    ADD CONSTRAINT exp_table_tblidx_table_id_unique UNIQUE ("tblidx", "table_id"); 