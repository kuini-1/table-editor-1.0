import * as z from 'zod';

export const dbRewardTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  byBallType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRewardCategoryDepth: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  rewardCategoryName: z.coerce.number().min(0, 'Must be a positive number'),
  rewardCategoryDialog: z.coerce.number().min(0, 'Must be a positive number'),
  byRewardType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  rewardName: z.coerce.number().min(0, 'Must be a positive number'),
  rewardLinkTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  dwRewardZenny: z.coerce.number().min(0, 'Must be a positive number'),
  rewardDialog1: z.coerce.number().min(0, 'Must be a positive number'),
  rewardDialog2: z.coerce.number().min(0, 'Must be a positive number'),
  dwClassBit: z.coerce.number().min(0, 'Must be a positive number'),
});

export type DbRewardTableFormData = z.infer<typeof dbRewardTableSchema>;

export interface DbRewardTableRow extends DbRewardTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dbRewardTableSchema.shape.tblidx },
  { key: 'byBallType', label: 'Ball Type', type: 'number' as const, validation: dbRewardTableSchema.shape.byBallType },
  { key: 'byRewardCategoryDepth', label: 'Reward Category Depth', type: 'number' as const, validation: dbRewardTableSchema.shape.byRewardCategoryDepth },
  { key: 'rewardCategoryName', label: 'Reward Category Name', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardCategoryName },
  { key: 'rewardCategoryDialog', label: 'Reward Category Dialog', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardCategoryDialog },
  { key: 'byRewardType', label: 'Reward Type', type: 'number' as const, validation: dbRewardTableSchema.shape.byRewardType },
  { key: 'rewardName', label: 'Reward Name', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardName },
  { key: 'rewardLinkTblidx', label: 'Reward Link Table ID', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardLinkTblidx },
  { key: 'dwRewardZenny', label: 'Reward Zenny', type: 'number' as const, validation: dbRewardTableSchema.shape.dwRewardZenny },
  { key: 'rewardDialog1', label: 'Reward Dialog 1', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardDialog1 },
  { key: 'rewardDialog2', label: 'Reward Dialog 2', type: 'number' as const, validation: dbRewardTableSchema.shape.rewardDialog2 },
  { key: 'dwClassBit', label: 'Class Bit', type: 'number' as const, validation: dbRewardTableSchema.shape.dwClassBit },
];

