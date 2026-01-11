/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const dwcMissionTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  tblNameIndex: z.coerce.number().min(0, 'Must be a positive number'),
  szImageName: z.string().max(64, 'Cannot exceed 64 characters'),
  tblContainScenarioIndex: z.coerce.number().min(0, 'Must be a positive number'),
  byCompleteMinNum: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byCompleteMaxNum: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byDifficulty: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  clearObjectTextTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  clearConditionTextTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_cardNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_byRequireCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_fAcquireRate: z.coerce.number(),
  asReward_0_asBasicReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asBasicReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_asBasicReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asRepeatReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asRepeatReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_asRepeatReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asBasicReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asBasicReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_asBasicReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asRepeatReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_0_asRepeatReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_0_asRepeatReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_cardNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_1_byRequireCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_fAcquireRate: z.coerce.number(),
  asReward_1_asBasicReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asBasicReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_1_asBasicReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asRepeatReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asRepeatReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_1_asRepeatReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asBasicReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asBasicReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_1_asBasicReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asRepeatReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_1_asRepeatReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_1_asRepeatReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_cardNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_2_byRequireCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_fAcquireRate: z.coerce.number(),
  asReward_2_asBasicReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asBasicReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_2_asBasicReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asRepeatReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asRepeatReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_2_asRepeatReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asBasicReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asBasicReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_2_asBasicReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asRepeatReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_2_asRepeatReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_2_asRepeatReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_cardNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_3_byRequireCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_fAcquireRate: z.coerce.number(),
  asReward_3_asBasicReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asBasicReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_3_asBasicReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asRepeatReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asRepeatReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_3_asRepeatReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asBasicReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asBasicReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_3_asBasicReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asRepeatReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_3_asRepeatReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_3_asRepeatReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_cardNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_4_byRequireCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_fAcquireRate: z.coerce.number(),
  asReward_4_asBasicReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asBasicReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_4_asBasicReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asRepeatReward_0_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asRepeatReward_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_4_asRepeatReward_0_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asBasicReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asBasicReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_4_asBasicReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asRepeatReward_1_byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asReward_4_asRepeatReward_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asReward_4_asRepeatReward_1_byValue: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type DwcMissionTableFormData = z.infer<typeof dwcMissionTableSchema>;

export interface DwcMissionTableRow extends DwcMissionTableFormData {
  id: string;
}

// Helper function to generate reward columns
const generateRewardColumns = (rewardIndex: number) => {
  const baseColumns = [
    { key: `asReward_${rewardIndex}_cardNameTblidx` as const, label: `Reward ${rewardIndex} Card Name`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_cardNameTblidx` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_byRequireCount` as const, label: `Reward ${rewardIndex} Require Count`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_byRequireCount` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_fAcquireRate` as const, label: `Reward ${rewardIndex} Acquire Rate`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_fAcquireRate` as keyof typeof dwcMissionTableSchema.shape] as any },
  ];
  
  const basicRewardColumns = Array.from({ length: 2 }, (_, i) => [
    { key: `asReward_${rewardIndex}_asBasicReward_${i}_byType` as const, label: `Reward ${rewardIndex} Basic ${i} Type`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asBasicReward_${i}_byType` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_asBasicReward_${i}_tblidx` as const, label: `Reward ${rewardIndex} Basic ${i} Table ID`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asBasicReward_${i}_tblidx` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_asBasicReward_${i}_byValue` as const, label: `Reward ${rewardIndex} Basic ${i} Value`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asBasicReward_${i}_byValue` as keyof typeof dwcMissionTableSchema.shape] as any },
  ]).flat();
  
  const repeatRewardColumns = Array.from({ length: 2 }, (_, i) => [
    { key: `asReward_${rewardIndex}_asRepeatReward_${i}_byType` as const, label: `Reward ${rewardIndex} Repeat ${i} Type`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asRepeatReward_${i}_byType` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_asRepeatReward_${i}_tblidx` as const, label: `Reward ${rewardIndex} Repeat ${i} Table ID`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asRepeatReward_${i}_tblidx` as keyof typeof dwcMissionTableSchema.shape] as any },
    { key: `asReward_${rewardIndex}_asRepeatReward_${i}_byValue` as const, label: `Reward ${rewardIndex} Repeat ${i} Value`, type: 'number' as const, validation: dwcMissionTableSchema.shape[`asReward_${rewardIndex}_asRepeatReward_${i}_byValue` as keyof typeof dwcMissionTableSchema.shape] as any },
  ]).flat();
  
  return [...baseColumns, ...basicRewardColumns, ...repeatRewardColumns];
};

const rewardColumns = Array.from({ length: 5 }, (_, i) => generateRewardColumns(i)).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dwcMissionTableSchema.shape.tblidx },
  { key: 'tblNameIndex', label: 'Name Index', type: 'number' as const, validation: dwcMissionTableSchema.shape.tblNameIndex },
  { key: 'szImageName', label: 'Image Name', type: 'text' as const, validation: dwcMissionTableSchema.shape.szImageName },
  { key: 'tblContainScenarioIndex', label: 'Contain Scenario Index', type: 'number' as const, validation: dwcMissionTableSchema.shape.tblContainScenarioIndex },
  { key: 'byCompleteMinNum', label: 'Complete Min Num', type: 'number' as const, validation: dwcMissionTableSchema.shape.byCompleteMinNum },
  { key: 'byCompleteMaxNum', label: 'Complete Max Num', type: 'number' as const, validation: dwcMissionTableSchema.shape.byCompleteMaxNum },
  { key: 'byDifficulty', label: 'Difficulty', type: 'number' as const, validation: dwcMissionTableSchema.shape.byDifficulty },
  { key: 'clearObjectTextTblidx', label: 'Clear Object Text Table ID', type: 'number' as const, validation: dwcMissionTableSchema.shape.clearObjectTextTblidx },
  { key: 'clearConditionTextTblidx', label: 'Clear Condition Text Table ID', type: 'number' as const, validation: dwcMissionTableSchema.shape.clearConditionTextTblidx },
  ...rewardColumns,
];

