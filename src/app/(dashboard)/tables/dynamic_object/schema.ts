import * as z from 'zod';

export const dynamicObjectTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidityAble: z.boolean(),
  byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  szModelName: z.string().max(64, 'Cannot exceed 64 characters'),
  byStateType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  spawnAnimation: z.coerce.number().min(0, 'Must be a positive number'),
  idleAnimation: z.coerce.number().min(0, 'Must be a positive number'),
  despawnAnimation: z.coerce.number().min(0, 'Must be a positive number'),
  state1Animation: z.coerce.number().min(0, 'Must be a positive number'),
  state2Animation: z.coerce.number().min(0, 'Must be a positive number'),
  byBoundaryDistance: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byDespawnDistance: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type DynamicObjectTableFormData = z.infer<typeof dynamicObjectTableSchema>;

export interface DynamicObjectTableRow extends DynamicObjectTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dynamicObjectTableSchema.shape.tblidx },
  { key: 'bValidityAble', label: 'Validity Able', type: 'boolean' as const, validation: dynamicObjectTableSchema.shape.bValidityAble },
  { key: 'byType', label: 'Type', type: 'number' as const, validation: dynamicObjectTableSchema.shape.byType },
  { key: 'szModelName', label: 'Model Name', type: 'text' as const, validation: dynamicObjectTableSchema.shape.szModelName },
  { key: 'byStateType', label: 'State Type', type: 'number' as const, validation: dynamicObjectTableSchema.shape.byStateType },
  { key: 'spawnAnimation', label: 'Spawn Animation', type: 'number' as const, validation: dynamicObjectTableSchema.shape.spawnAnimation },
  { key: 'idleAnimation', label: 'Idle Animation', type: 'number' as const, validation: dynamicObjectTableSchema.shape.idleAnimation },
  { key: 'despawnAnimation', label: 'Despawn Animation', type: 'number' as const, validation: dynamicObjectTableSchema.shape.despawnAnimation },
  { key: 'state1Animation', label: 'State 1 Animation', type: 'number' as const, validation: dynamicObjectTableSchema.shape.state1Animation },
  { key: 'state2Animation', label: 'State 2 Animation', type: 'number' as const, validation: dynamicObjectTableSchema.shape.state2Animation },
  { key: 'byBoundaryDistance', label: 'Boundary Distance', type: 'number' as const, validation: dynamicObjectTableSchema.shape.byBoundaryDistance },
  { key: 'byDespawnDistance', label: 'Despawn Distance', type: 'number' as const, validation: dynamicObjectTableSchema.shape.byDespawnDistance },
];

