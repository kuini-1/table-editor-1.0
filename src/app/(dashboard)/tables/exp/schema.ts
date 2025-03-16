import * as z from 'zod';

export const expTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Exp: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wNormal_Race: z.coerce.number().min(0, 'Must be a positive number'),
  wSuperRace: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwPhyDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwEngDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobZenny: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ExpTableFormData = z.infer<typeof expTableSchema>;

export interface ExpTableRow extends ExpTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: expTableSchema.shape.tblidx },
  { key: 'dwExp', label: 'Experience', type: 'number' as const, validation: expTableSchema.shape.dwExp },
  { key: 'dwNeed_Exp', label: 'Required Exp', type: 'number' as const, validation: expTableSchema.shape.dwNeed_Exp },
  { key: 'wStageWinSolo', label: 'Stage Win Solo', type: 'number' as const, validation: expTableSchema.shape.wStageWinSolo },
  { key: 'wStageDrawSolo', label: 'Stage Draw Solo', type: 'number' as const, validation: expTableSchema.shape.wStageDrawSolo },
  { key: 'wStageLoseSolo', label: 'Stage Lose Solo', type: 'number' as const, validation: expTableSchema.shape.wStageLoseSolo },
  { key: 'wWinSolo', label: 'Win Solo', type: 'number' as const, validation: expTableSchema.shape.wWinSolo },
  { key: 'wPerfectWinSolo', label: 'Perfect Win Solo', type: 'number' as const, validation: expTableSchema.shape.wPerfectWinSolo },
  { key: 'wStageWinTeam', label: 'Stage Win Team', type: 'number' as const, validation: expTableSchema.shape.wStageWinTeam },
  { key: 'wStageDrawTeam', label: 'Stage Draw Team', type: 'number' as const, validation: expTableSchema.shape.wStageDrawTeam },
  { key: 'wStageLoseTeam', label: 'Stage Lose Team', type: 'number' as const, validation: expTableSchema.shape.wStageLoseTeam },
  { key: 'wWinTeam', label: 'Win Team', type: 'number' as const, validation: expTableSchema.shape.wWinTeam },
  { key: 'wPerfectWinTeam', label: 'Perfect Win Team', type: 'number' as const, validation: expTableSchema.shape.wPerfectWinTeam },
  { key: 'wNormal_Race', label: 'Normal Race', type: 'number' as const, validation: expTableSchema.shape.wNormal_Race },
  { key: 'wSuperRace', label: 'Super Race', type: 'number' as const, validation: expTableSchema.shape.wSuperRace },
  { key: 'dwMobExp', label: 'Mob Exp', type: 'number' as const, validation: expTableSchema.shape.dwMobExp },
  { key: 'dwPhyDefenceRef', label: 'Physical Defence', type: 'number' as const, validation: expTableSchema.shape.dwPhyDefenceRef },
  { key: 'dwEngDefenceRef', label: 'Energy Defence', type: 'number' as const, validation: expTableSchema.shape.dwEngDefenceRef },
  { key: 'dwMobZenny', label: 'Mob Zenny', type: 'number' as const, validation: expTableSchema.shape.dwMobZenny },
]; 