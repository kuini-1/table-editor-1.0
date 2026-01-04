import * as z from 'zod';

export const itemUpgradeNewrateTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  byItem_Type: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byGrade: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  fAdditional_Ability: z.coerce.number(),
  fUpgrade_Destroy_Rate: z.coerce.number(),
  fUpgrade_Success_Basic_Value: z.coerce.number(),
  fUpgrade_Success_Stone_Value: z.coerce.number(),
  fUpgrade_RateStone_Value1: z.coerce.number(),
  fUpgrade_RateStone_Value2: z.coerce.number(),
});

export type ItemUpgradeNewrateTableFormData = z.infer<typeof itemUpgradeNewrateTableSchema>;

export interface ItemUpgradeNewrateTableRow extends ItemUpgradeNewrateTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.tblidx },
  { key: 'byItem_Type', label: 'Item Type', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.byItem_Type },
  { key: 'byGrade', label: 'Grade', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.byGrade },
  { key: 'fAdditional_Ability', label: 'Additional Ability', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fAdditional_Ability },
  { key: 'fUpgrade_Destroy_Rate', label: 'Upgrade Destroy Rate', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fUpgrade_Destroy_Rate },
  { key: 'fUpgrade_Success_Basic_Value', label: 'Upgrade Success Basic Value', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fUpgrade_Success_Basic_Value },
  { key: 'fUpgrade_Success_Stone_Value', label: 'Upgrade Success Stone Value', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fUpgrade_Success_Stone_Value },
  { key: 'fUpgrade_RateStone_Value1', label: 'Upgrade Rate Stone Value 1', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fUpgrade_RateStone_Value1 },
  { key: 'fUpgrade_RateStone_Value2', label: 'Upgrade Rate Stone Value 2', type: 'number' as const, validation: itemUpgradeNewrateTableSchema.shape.fUpgrade_RateStone_Value2 },
];

