/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const dojoTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  zoneTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  mapName: z.coerce.number().min(0, 'Must be a positive number'),
  byReceiveHour: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byReceiveMinute: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRepeatType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRepeatTime: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wWeekBitFlag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byReceiveDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRejectDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byStandbyDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byInitialDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byReadyDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byBattleDuration: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwReceivePoint: z.coerce.number().min(0, 'Must be a positive number'),
  dwReceiveZenny: z.coerce.number().min(0, 'Must be a positive number'),
  controllerTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  dwBattlePointGoal: z.coerce.number().min(0, 'Must be a positive number'),
  dwBattlePointGet: z.coerce.number().min(0, 'Must be a positive number'),
  dwBattlePointCharge: z.coerce.number().min(0, 'Must be a positive number'),
  dwChargePointGoal: z.coerce.number().min(0, 'Must be a positive number'),
  dwChargeTime: z.coerce.number().min(0, 'Must be a positive number'),
  dwChageTimePoint: z.coerce.number().min(0, 'Must be a positive number'),
  rockTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  objectTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_0_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_0_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_1_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_1_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_2_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_2_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_3_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_3_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_4_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_4_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_5_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_5_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_6_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_6_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_7_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_7_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_8_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_8_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asRawrd_9_dwGetPoint: z.coerce.number().min(0, 'Must be a positive number'),
  asRawrd_9_byGetRock: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type DojoTableFormData = z.infer<typeof dojoTableSchema>;

export interface DojoTableRow extends DojoTableFormData {
  id: string;
}

const objectTblidxColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `objectTblidx_${i}` as const,
  label: `Object Table ID ${i}`,
  type: 'number' as const,
  validation: dojoTableSchema.shape[`objectTblidx_${i}` as keyof typeof dojoTableSchema.shape] as any,
}));

const rewardColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `asRawrd_${i}_dwGetPoint` as const, label: `Reward ${i} Get Point`, type: 'number' as const, validation: dojoTableSchema.shape[`asRawrd_${i}_dwGetPoint` as keyof typeof dojoTableSchema.shape] as any },
  { key: `asRawrd_${i}_byGetRock` as const, label: `Reward ${i} Get Rock`, type: 'number' as const, validation: dojoTableSchema.shape[`asRawrd_${i}_byGetRock` as keyof typeof dojoTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dojoTableSchema.shape.tblidx },
  { key: 'zoneTblidx', label: 'Zone Table ID', type: 'number' as const, validation: dojoTableSchema.shape.zoneTblidx },
  { key: 'mapName', label: 'Map Name', type: 'number' as const, validation: dojoTableSchema.shape.mapName },
  { key: 'byReceiveHour', label: 'Receive Hour', type: 'number' as const, validation: dojoTableSchema.shape.byReceiveHour },
  { key: 'byReceiveMinute', label: 'Receive Minute', type: 'number' as const, validation: dojoTableSchema.shape.byReceiveMinute },
  { key: 'byRepeatType', label: 'Repeat Type', type: 'number' as const, validation: dojoTableSchema.shape.byRepeatType },
  { key: 'byRepeatTime', label: 'Repeat Time', type: 'number' as const, validation: dojoTableSchema.shape.byRepeatTime },
  { key: 'wWeekBitFlag', label: 'Week Bit Flag', type: 'number' as const, validation: dojoTableSchema.shape.wWeekBitFlag },
  { key: 'byReceiveDuration', label: 'Receive Duration', type: 'number' as const, validation: dojoTableSchema.shape.byReceiveDuration },
  { key: 'byRejectDuration', label: 'Reject Duration', type: 'number' as const, validation: dojoTableSchema.shape.byRejectDuration },
  { key: 'byStandbyDuration', label: 'Standby Duration', type: 'number' as const, validation: dojoTableSchema.shape.byStandbyDuration },
  { key: 'byInitialDuration', label: 'Initial Duration', type: 'number' as const, validation: dojoTableSchema.shape.byInitialDuration },
  { key: 'byReadyDuration', label: 'Ready Duration', type: 'number' as const, validation: dojoTableSchema.shape.byReadyDuration },
  { key: 'byBattleDuration', label: 'Battle Duration', type: 'number' as const, validation: dojoTableSchema.shape.byBattleDuration },
  { key: 'dwReceivePoint', label: 'Receive Point', type: 'number' as const, validation: dojoTableSchema.shape.dwReceivePoint },
  { key: 'dwReceiveZenny', label: 'Receive Zenny', type: 'number' as const, validation: dojoTableSchema.shape.dwReceiveZenny },
  { key: 'controllerTblidx', label: 'Controller Table ID', type: 'number' as const, validation: dojoTableSchema.shape.controllerTblidx },
  { key: 'dwBattlePointGoal', label: 'Battle Point Goal', type: 'number' as const, validation: dojoTableSchema.shape.dwBattlePointGoal },
  { key: 'dwBattlePointGet', label: 'Battle Point Get', type: 'number' as const, validation: dojoTableSchema.shape.dwBattlePointGet },
  { key: 'dwBattlePointCharge', label: 'Battle Point Charge', type: 'number' as const, validation: dojoTableSchema.shape.dwBattlePointCharge },
  { key: 'dwChargePointGoal', label: 'Charge Point Goal', type: 'number' as const, validation: dojoTableSchema.shape.dwChargePointGoal },
  { key: 'dwChargeTime', label: 'Charge Time', type: 'number' as const, validation: dojoTableSchema.shape.dwChargeTime },
  { key: 'dwChageTimePoint', label: 'Charge Time Point', type: 'number' as const, validation: dojoTableSchema.shape.dwChageTimePoint },
  { key: 'rockTblidx', label: 'Rock Table ID', type: 'number' as const, validation: dojoTableSchema.shape.rockTblidx },
  ...objectTblidxColumns,
  ...rewardColumns,
];

