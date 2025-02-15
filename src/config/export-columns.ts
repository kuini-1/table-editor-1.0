export const EXPORT_COLUMNS = {
  exp_table: [
    'tblidx',
    'dwExp',
    'dwNeed_Exp',
    'wStageWinSolo',
    'wStageDrawSolo',
    'wStageLoseSolo',
    'wWinSolo',
    'wPerfectWinSolo',
    'wStageWinTeam',
    'wStageDrawTeam',
    'wStageLoseTeam',
    'wWinTeam',
    'wPerfectWinTeam',
    'wNormal_Race',
    'wSuperRace',
    'dwMobExp',
    'dwPhyDefenceRef',
    'dwEngDefenceRef',
    'dwMobZenny'
  ],
  merchant_table: [
    // Add merchant table columns here
    'tblidx',
    'name',
    'price',
    // ... other merchant columns
  ],
  item_table: [
    // Add item table columns here
    'tblidx',
    'name',
    'description',
    // ... other item columns
  ]
} as const;

export type TableName = keyof typeof EXPORT_COLUMNS; 