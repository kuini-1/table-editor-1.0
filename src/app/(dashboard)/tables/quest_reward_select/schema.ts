import * as z from 'zod';

export const questRewardSelectTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bySelect_Type: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_0_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_0_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_0_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_1_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_1_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_1_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_2_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_2_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_2_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_3_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_3_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_3_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_4_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_4_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_4_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_5_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_5_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_5_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_6_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_6_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_6_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_7_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_7_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_7_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_8_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_8_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_8_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_9_byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aRewardSet_9_dwRewardIdx: z.coerce.number().min(0, 'Must be a positive number'),
  aRewardSet_9_dwRewardVal: z.coerce.number().min(0, 'Must be a positive number'),
});

export type QuestRewardSelectTableFormData = z.infer<typeof questRewardSelectTableSchema>;

export interface QuestRewardSelectTableRow extends QuestRewardSelectTableFormData {
  id: string;
}

const rewardSetColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `aRewardSet_${i}_byRewardType` as const, label: `Reward Set ${i} Type`, type: 'number' as const, validation: questRewardSelectTableSchema.shape[`aRewardSet_${i}_byRewardType` as keyof typeof questRewardSelectTableSchema.shape] as any },
  { key: `aRewardSet_${i}_dwRewardIdx` as const, label: `Reward Set ${i} Idx`, type: 'number' as const, validation: questRewardSelectTableSchema.shape[`aRewardSet_${i}_dwRewardIdx` as keyof typeof questRewardSelectTableSchema.shape] as any },
  { key: `aRewardSet_${i}_dwRewardVal` as const, label: `Reward Set ${i} Val`, type: 'number' as const, validation: questRewardSelectTableSchema.shape[`aRewardSet_${i}_dwRewardVal` as keyof typeof questRewardSelectTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: questRewardSelectTableSchema.shape.tblidx },
  { key: 'bySelect_Type', label: 'Select Type', type: 'number' as const, validation: questRewardSelectTableSchema.shape.bySelect_Type },
  ...rewardSetColumns,
];

