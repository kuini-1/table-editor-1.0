import * as z from 'zod';

export const questRewardTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwDef_Reward_EXP: z.coerce.number().min(0, 'Must be a positive number'),
  dwDef_Reward_Zeny: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_0_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_0_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_0_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_1_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_1_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_1_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_2_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_2_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_2_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_3_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_3_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_3_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_4_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_4_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_4_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_5_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_5_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_5_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_6_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_6_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_6_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_7_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_7_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_7_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_8_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_8_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_8_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_9_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsDefRwd_9_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsDefRwd_9_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_0_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_0_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_0_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_1_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_1_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_1_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_2_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_2_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_2_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_3_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_3_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_3_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_4_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_4_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_4_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_5_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_5_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_5_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_6_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_6_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_6_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_7_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_7_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_7_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_8_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_8_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_8_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_9_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  arsSelRwd_9_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  arsSelRwd_9_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
});

export type QuestRewardTableFormData = z.infer<typeof questRewardTableSchema>;

export interface QuestRewardTableRow extends QuestRewardTableFormData {
  id: string;
}

const defRewardColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `arsDefRwd_${i}_byRewardType` as const, label: `Def Reward ${i} Type`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsDefRwd_${i}_byRewardType` as keyof typeof questRewardTableSchema.shape] as any },
  { key: `arsDefRwd_${i}_dwRewardIdx` as const, label: `Def Reward ${i} Idx`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsDefRwd_${i}_dwRewardIdx` as keyof typeof questRewardTableSchema.shape] as any },
  { key: `arsDefRwd_${i}_dwRewardVal` as const, label: `Def Reward ${i} Val`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsDefRwd_${i}_dwRewardVal` as keyof typeof questRewardTableSchema.shape] as any },
]).flat();

const selRewardColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `arsSelRwd_${i}_byRewardType` as const, label: `Sel Reward ${i} Type`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsSelRwd_${i}_byRewardType` as keyof typeof questRewardTableSchema.shape] as any },
  { key: `arsSelRwd_${i}_dwRewardIdx` as const, label: `Sel Reward ${i} Idx`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsSelRwd_${i}_dwRewardIdx` as keyof typeof questRewardTableSchema.shape] as any },
  { key: `arsSelRwd_${i}_dwRewardVal` as const, label: `Sel Reward ${i} Val`, type: 'number' as const, validation: questRewardTableSchema.shape[`arsSelRwd_${i}_dwRewardVal` as keyof typeof questRewardTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: questRewardTableSchema.shape.tblidx },
  { key: 'dwDef_Reward_EXP', label: 'Def Reward EXP', type: 'number' as const, validation: questRewardTableSchema.shape.dwDef_Reward_EXP },
  { key: 'dwDef_Reward_Zeny', label: 'Def Reward Zeny', type: 'number' as const, validation: questRewardTableSchema.shape.dwDef_Reward_Zeny },
  ...defRewardColumns,
  ...selRewardColumns,
];
