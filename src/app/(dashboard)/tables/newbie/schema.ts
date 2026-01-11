/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const newbieTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  byRace: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byClass: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  world_Id: z.coerce.number().min(0, 'Must be a positive number'),
  tutorialWorld: z.coerce.number().min(0, 'Must be a positive number'),
  vSpawn_Loc_x: z.coerce.number(),
  vSpawn_Loc_y: z.coerce.number(),
  vSpawn_Loc_z: z.coerce.number(),
  vSpawn_Dir_x: z.coerce.number(),
  vSpawn_Dir_y: z.coerce.number(),
  vSpawn_Dir_z: z.coerce.number(),
  vBind_Loc_x: z.coerce.number(),
  vBind_Loc_y: z.coerce.number(),
  vBind_Loc_z: z.coerce.number(),
  vBind_Dir_x: z.coerce.number(),
  vBind_Dir_y: z.coerce.number(),
  vBind_Dir_z: z.coerce.number(),
  mapNameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  qItemTblidx1: z.coerce.number().min(0, 'Must be a positive number'),
  byQPosition1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byQStackQuantity1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wMixLevelData: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_0_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_0_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_0_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_1_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_1_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_1_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_2_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_2_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_2_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_3_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_3_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_3_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_4_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_4_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_4_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_5_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_5_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_5_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_6_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_6_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_6_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_7_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_7_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_7_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_8_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_8_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_8_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asQuickData_9_bySlotType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_9_byQuickSlot: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asQuickData_9_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  defaultPortalId_0: z.coerce.number().min(0, 'Must be a positive number'),
  defaultPortalId_1: z.coerce.number().min(0, 'Must be a positive number'),
  defaultPortalId_2: z.coerce.number().min(0, 'Must be a positive number'),
});

export type NewbieTableFormData = z.infer<typeof newbieTableSchema>;

export interface NewbieTableRow extends NewbieTableFormData {
  id: string;
}

const quickDataColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `asQuickData_${i}_bySlotType` as const, label: `Quick Data ${i} Slot Type`, type: 'number' as const, validation: newbieTableSchema.shape[`asQuickData_${i}_bySlotType` as keyof typeof newbieTableSchema.shape] as any },
  { key: `asQuickData_${i}_byQuickSlot` as const, label: `Quick Data ${i} Quick Slot`, type: 'number' as const, validation: newbieTableSchema.shape[`asQuickData_${i}_byQuickSlot` as keyof typeof newbieTableSchema.shape] as any },
  { key: `asQuickData_${i}_tblidx` as const, label: `Quick Data ${i} Table ID`, type: 'number' as const, validation: newbieTableSchema.shape[`asQuickData_${i}_tblidx` as keyof typeof newbieTableSchema.shape] as any },
]).flat();

const portalIdColumns = Array.from({ length: 3 }, (_, i) => ({
  key: `defaultPortalId_${i}` as const,
  label: `Default Portal ID ${i}`,
  type: 'number' as const,
  validation: newbieTableSchema.shape[`defaultPortalId_${i}` as keyof typeof newbieTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: newbieTableSchema.shape.tblidx },
  { key: 'byRace', label: 'Race', type: 'number' as const, validation: newbieTableSchema.shape.byRace },
  { key: 'byClass', label: 'Class', type: 'number' as const, validation: newbieTableSchema.shape.byClass },
  { key: 'world_Id', label: 'World ID', type: 'number' as const, validation: newbieTableSchema.shape.world_Id },
  { key: 'tutorialWorld', label: 'Tutorial World', type: 'number' as const, validation: newbieTableSchema.shape.tutorialWorld },
  { key: 'vSpawn_Loc_x', label: 'Spawn Loc X', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Loc_x },
  { key: 'vSpawn_Loc_y', label: 'Spawn Loc Y', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Loc_y },
  { key: 'vSpawn_Loc_z', label: 'Spawn Loc Z', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Loc_z },
  { key: 'vSpawn_Dir_x', label: 'Spawn Dir X', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Dir_x },
  { key: 'vSpawn_Dir_y', label: 'Spawn Dir Y', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Dir_y },
  { key: 'vSpawn_Dir_z', label: 'Spawn Dir Z', type: 'number' as const, validation: newbieTableSchema.shape.vSpawn_Dir_z },
  { key: 'vBind_Loc_x', label: 'Bind Loc X', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Loc_x },
  { key: 'vBind_Loc_y', label: 'Bind Loc Y', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Loc_y },
  { key: 'vBind_Loc_z', label: 'Bind Loc Z', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Loc_z },
  { key: 'vBind_Dir_x', label: 'Bind Dir X', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Dir_x },
  { key: 'vBind_Dir_y', label: 'Bind Dir Y', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Dir_y },
  { key: 'vBind_Dir_z', label: 'Bind Dir Z', type: 'number' as const, validation: newbieTableSchema.shape.vBind_Dir_z },
  { key: 'mapNameTblidx', label: 'Map Name Table ID', type: 'number' as const, validation: newbieTableSchema.shape.mapNameTblidx },
  { key: 'qItemTblidx1', label: 'Item Table ID 1', type: 'number' as const, validation: newbieTableSchema.shape.qItemTblidx1 },
  { key: 'byQPosition1', label: 'Item Position 1', type: 'number' as const, validation: newbieTableSchema.shape.byQPosition1 },
  { key: 'byQStackQuantity1', label: 'Item Stack Quantity 1', type: 'number' as const, validation: newbieTableSchema.shape.byQStackQuantity1 },
  { key: 'wMixLevelData', label: 'Mix Level Data', type: 'number' as const, validation: newbieTableSchema.shape.wMixLevelData },
  ...quickDataColumns,
  ...portalIdColumns,
];

