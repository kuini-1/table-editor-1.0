import * as z from 'zod';

export const chartitleTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  tblNameIndex: z.coerce.number().min(0, 'Must be a positive number'),
  byContentsType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRepresentationType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wszBoneName: z.string().nullable().transform(e => e === null ? "" : e),
  wszEffectName: z.string().nullable().transform(e => e === null ? "" : e),
  wszEffectSound: z.string().nullable().transform(e => e === null ? "" : e),
  atblSystem_Effect_Index_0: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_0: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_0: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_1: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_2: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_3: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_4: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_4: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_4: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_5: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_5: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_5: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_6: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_6: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_6: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_7: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_7: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_7: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_8: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_8: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_8: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  atblSystem_Effect_Index_9: z.coerce.number().min(0, 'Must be a positive number'),
  abySystem_Effect_Type_9: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  abySystem_Effect_Value_9: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type ChartitleTableFormData = z.infer<typeof chartitleTableSchema>;

export interface ChartitleTableRow extends ChartitleTableFormData {
  id: string;
}

const systemEffectColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `atblSystem_Effect_Index_${i}` as const, label: `System Effect ${i} Index`, type: 'number' as const, validation: chartitleTableSchema.shape[`atblSystem_Effect_Index_${i}` as keyof typeof chartitleTableSchema.shape] as any },
  { key: `abySystem_Effect_Type_${i}` as const, label: `System Effect ${i} Type`, type: 'number' as const, validation: chartitleTableSchema.shape[`abySystem_Effect_Type_${i}` as keyof typeof chartitleTableSchema.shape] as any },
  { key: `abySystem_Effect_Value_${i}` as const, label: `System Effect ${i} Value`, type: 'number' as const, validation: chartitleTableSchema.shape[`abySystem_Effect_Value_${i}` as keyof typeof chartitleTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: chartitleTableSchema.shape.tblidx },
  { key: 'tblNameIndex', label: 'Name Index', type: 'number' as const, validation: chartitleTableSchema.shape.tblNameIndex },
  { key: 'byContentsType', label: 'Contents Type', type: 'number' as const, validation: chartitleTableSchema.shape.byContentsType },
  { key: 'byRepresentationType', label: 'Representation Type', type: 'number' as const, validation: chartitleTableSchema.shape.byRepresentationType },
  { key: 'wszBoneName', label: 'Bone Name', type: 'text' as const, validation: chartitleTableSchema.shape.wszBoneName },
  { key: 'wszEffectName', label: 'Effect Name', type: 'text' as const, validation: chartitleTableSchema.shape.wszEffectName },
  { key: 'wszEffectSound', label: 'Effect Sound', type: 'text' as const, validation: chartitleTableSchema.shape.wszEffectSound },
  ...systemEffectColumns,
];

