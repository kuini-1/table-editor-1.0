/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const worldmapTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  World_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  Zone_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  Worldmap_Name: z.coerce.number().min(0, 'Must be a positive number'),
  wszNameText: z.string().nullable().transform(e => e === null ? "" : e),
  bValidityAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  byMapType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  vStandardLoc_x: z.coerce.number(),
  vStandardLoc_y: z.coerce.number(),
  vStandardLoc_z: z.coerce.number(),
  fWorldmapScale: z.coerce.number(),
  dwLinkMapIdx: z.coerce.number().min(0, 'Must be a positive number'),
  dwComboBoxType: z.coerce.number().min(0, 'Must be a positive number'),
  byRecomm_Min_Level: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRecomm_Max_Level: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  vUiModify_x: z.coerce.number(),
  vUiModify_y: z.coerce.number(),
  vUiModify_z: z.coerce.number(),
  wWarfog_0: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_4: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_5: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_6: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_7: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_8: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWarfog_9: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type WorldmapTableFormData = z.infer<typeof worldmapTableSchema>;

export interface WorldmapTableRow extends WorldmapTableFormData {
  id: string;
}

const warfogColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `wWarfog_${i}` as const,
  label: `Warfog ${i}`,
  type: 'number' as const,
  validation: worldmapTableSchema.shape[`wWarfog_${i}` as keyof typeof worldmapTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: worldmapTableSchema.shape.tblidx },
  { key: 'World_Tblidx', label: 'World Table ID', type: 'number' as const, validation: worldmapTableSchema.shape.World_Tblidx },
  { key: 'Zone_Tblidx', label: 'Zone Table ID', type: 'number' as const, validation: worldmapTableSchema.shape.Zone_Tblidx },
  { key: 'Worldmap_Name', label: 'Worldmap Name', type: 'number' as const, validation: worldmapTableSchema.shape.Worldmap_Name },
  { key: 'wszNameText', label: 'Name Text', type: 'text' as const, validation: worldmapTableSchema.shape.wszNameText },
  { key: 'bValidityAble', label: 'Validity Able', type: 'boolean' as const, validation: worldmapTableSchema.shape.bValidityAble },
  { key: 'byMapType', label: 'Map Type', type: 'number' as const, validation: worldmapTableSchema.shape.byMapType },
  { key: 'vStandardLoc_x', label: 'Standard Loc X', type: 'number' as const, validation: worldmapTableSchema.shape.vStandardLoc_x },
  { key: 'vStandardLoc_y', label: 'Standard Loc Y', type: 'number' as const, validation: worldmapTableSchema.shape.vStandardLoc_y },
  { key: 'vStandardLoc_z', label: 'Standard Loc Z', type: 'number' as const, validation: worldmapTableSchema.shape.vStandardLoc_z },
  { key: 'fWorldmapScale', label: 'Worldmap Scale', type: 'number' as const, validation: worldmapTableSchema.shape.fWorldmapScale },
  { key: 'dwLinkMapIdx', label: 'Link Map Index', type: 'number' as const, validation: worldmapTableSchema.shape.dwLinkMapIdx },
  { key: 'dwComboBoxType', label: 'Combo Box Type', type: 'number' as const, validation: worldmapTableSchema.shape.dwComboBoxType },
  { key: 'byRecomm_Min_Level', label: 'Recomm Min Level', type: 'number' as const, validation: worldmapTableSchema.shape.byRecomm_Min_Level },
  { key: 'byRecomm_Max_Level', label: 'Recomm Max Level', type: 'number' as const, validation: worldmapTableSchema.shape.byRecomm_Max_Level },
  { key: 'vUiModify_x', label: 'UI Modify X', type: 'number' as const, validation: worldmapTableSchema.shape.vUiModify_x },
  { key: 'vUiModify_y', label: 'UI Modify Y', type: 'number' as const, validation: worldmapTableSchema.shape.vUiModify_y },
  { key: 'vUiModify_z', label: 'UI Modify Z', type: 'number' as const, validation: worldmapTableSchema.shape.vUiModify_z },
  ...warfogColumns,
];

