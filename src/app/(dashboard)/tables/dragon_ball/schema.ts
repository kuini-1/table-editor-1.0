/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const dragonBallTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwAltarGroup: z.coerce.number().min(0, 'Must be a positive number'),
  byBallType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  ballDropTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  ballJunkTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  startDialog: z.coerce.number().min(0, 'Must be a positive number'),
  endDialog: z.coerce.number().min(0, 'Must be a positive number'),
  timeoverEndDialog: z.coerce.number().min(0, 'Must be a positive number'),
  hurryDialog: z.coerce.number().min(0, 'Must be a positive number'),
  timeoverDialog: z.coerce.number().min(0, 'Must be a positive number'),
  noRepeatDialog: z.coerce.number().min(0, 'Must be a positive number'),
  inventoryFullDialog: z.coerce.number().min(0, 'Must be a positive number'),
  skillOverlapDialog: z.coerce.number().min(0, 'Must be a positive number'),
  skillShortageOfLVDialog: z.coerce.number().min(0, 'Must be a positive number'),
  dragonNPCTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  defaultSummonChat: z.coerce.number().min(0, 'Must be a positive number'),
  fDir_x: z.coerce.number(),
  fDir_z: z.coerce.number(),
  aBallTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aBallTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
});

export type DragonBallTableFormData = z.infer<typeof dragonBallTableSchema>;

export interface DragonBallTableRow extends DragonBallTableFormData {
  id: string;
}

const ballTblidxColumns = Array.from({ length: 7 }, (_, i) => ({
  key: `aBallTblidx_${i}` as const,
  label: `Ball Table ID ${i}`,
  type: 'number' as const,
  validation: dragonBallTableSchema.shape[`aBallTblidx_${i}` as keyof typeof dragonBallTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dragonBallTableSchema.shape.tblidx },
  { key: 'dwAltarGroup', label: 'Altar Group', type: 'number' as const, validation: dragonBallTableSchema.shape.dwAltarGroup },
  { key: 'byBallType', label: 'Ball Type', type: 'number' as const, validation: dragonBallTableSchema.shape.byBallType },
  { key: 'ballDropTblidx', label: 'Ball Drop Table ID', type: 'number' as const, validation: dragonBallTableSchema.shape.ballDropTblidx },
  { key: 'ballJunkTblidx', label: 'Ball Junk Table ID', type: 'number' as const, validation: dragonBallTableSchema.shape.ballJunkTblidx },
  { key: 'startDialog', label: 'Start Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.startDialog },
  { key: 'endDialog', label: 'End Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.endDialog },
  { key: 'timeoverEndDialog', label: 'Timeover End Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.timeoverEndDialog },
  { key: 'hurryDialog', label: 'Hurry Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.hurryDialog },
  { key: 'timeoverDialog', label: 'Timeover Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.timeoverDialog },
  { key: 'noRepeatDialog', label: 'No Repeat Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.noRepeatDialog },
  { key: 'inventoryFullDialog', label: 'Inventory Full Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.inventoryFullDialog },
  { key: 'skillOverlapDialog', label: 'Skill Overlap Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.skillOverlapDialog },
  { key: 'skillShortageOfLVDialog', label: 'Skill Shortage Of LV Dialog', type: 'number' as const, validation: dragonBallTableSchema.shape.skillShortageOfLVDialog },
  { key: 'dragonNPCTblidx', label: 'Dragon NPC Table ID', type: 'number' as const, validation: dragonBallTableSchema.shape.dragonNPCTblidx },
  { key: 'defaultSummonChat', label: 'Default Summon Chat', type: 'number' as const, validation: dragonBallTableSchema.shape.defaultSummonChat },
  { key: 'fDir_x', label: 'Direction X', type: 'number' as const, validation: dragonBallTableSchema.shape.fDir_x },
  { key: 'fDir_z', label: 'Direction Z', type: 'number' as const, validation: dragonBallTableSchema.shape.fDir_z },
  ...ballTblidxColumns,
];

