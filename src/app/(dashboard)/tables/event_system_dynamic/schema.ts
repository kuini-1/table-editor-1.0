import * as z from 'zod';

export const eventSystemDynamicTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wszName: z.string(),
  bOnOff: z.boolean(),
  byServerFarm: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwConnectionTime: z.coerce.number().min(0, 'Must be a positive number'),
  byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  tIndex: z.coerce.number().min(0, 'Must be a positive number'),
  dwContentRestrictionBitFlag: z.coerce.number().min(0, 'Must be a positive number'),
  adwSetting_0: z.coerce.number().min(0, 'Must be a positive number'),
  adwSetting_1: z.coerce.number().min(0, 'Must be a positive number'),
  adwSetting_2: z.coerce.number().min(0, 'Must be a positive number'),
  fRate: z.coerce.number(),
  byAction: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aIndex: z.coerce.number().min(0, 'Must be a positive number'),
  byGroup: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwVolume: z.coerce.number().min(0, 'Must be a positive number'),
});

export type EventSystemDynamicTableFormData = z.infer<typeof eventSystemDynamicTableSchema>;

export interface EventSystemDynamicTableRow extends EventSystemDynamicTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.tblidx },
  { key: 'wszName', label: 'Name', type: 'text' as const, validation: eventSystemDynamicTableSchema.shape.wszName },
  { key: 'bOnOff', label: 'On Off', type: 'boolean' as const, validation: eventSystemDynamicTableSchema.shape.bOnOff },
  { key: 'byServerFarm', label: 'Server Farm', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.byServerFarm },
  { key: 'dwConnectionTime', label: 'Connection Time', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.dwConnectionTime },
  { key: 'byType', label: 'Type', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.byType },
  { key: 'tIndex', label: 'Index', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.tIndex },
  { key: 'dwContentRestrictionBitFlag', label: 'Content Restriction Bit Flag', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.dwContentRestrictionBitFlag },
  { key: 'adwSetting_0', label: 'Setting 0', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.adwSetting_0 },
  { key: 'adwSetting_1', label: 'Setting 1', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.adwSetting_1 },
  { key: 'adwSetting_2', label: 'Setting 2', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.adwSetting_2 },
  { key: 'fRate', label: 'Rate', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.fRate },
  { key: 'byAction', label: 'Action', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.byAction },
  { key: 'aIndex', label: 'Index', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.aIndex },
  { key: 'byGroup', label: 'Group', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.byGroup },
  { key: 'dwVolume', label: 'Volume', type: 'number' as const, validation: eventSystemDynamicTableSchema.shape.dwVolume },
];

