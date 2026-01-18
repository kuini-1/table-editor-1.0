import * as z from 'zod';

export const eventSystemSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  bOnOff: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  byServerFarm: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max').nullable(),
  dwConnectionTime: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max').nullable(),
  tIndex: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  dwContentRestrictionBitFlag: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  fRate: z.coerce.number().nullable(),
  byAction: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max').nullable(),
  aIndex: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  byGroup: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max').nullable(),
  dwVolume: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  dwUnknown: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  adwSetting_0: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  adwSetting_1: z.coerce.number().min(0, 'Must be a positive number').nullable(),
  adwSetting_2: z.coerce.number().min(0, 'Must be a positive number').nullable(),
});

export type EventSystemFormData = z.infer<typeof eventSystemSchema>;

export interface EventSystemRow extends EventSystemFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: eventSystemSchema.shape.tblidx },
  { key: 'wszName', label: 'Name', type: 'text' as const, validation: eventSystemSchema.shape.wszName },
  { key: 'bOnOff', label: 'On/Off', type: 'boolean' as const, validation: eventSystemSchema.shape.bOnOff },
  { key: 'byServerFarm', label: 'Server Farm', type: 'number' as const, validation: eventSystemSchema.shape.byServerFarm },
  { key: 'dwConnectionTime', label: 'Connection Time', type: 'number' as const, validation: eventSystemSchema.shape.dwConnectionTime },
  { key: 'byType', label: 'Type', type: 'number' as const, validation: eventSystemSchema.shape.byType },
  { key: 'tIndex', label: 'T Index', type: 'number' as const, validation: eventSystemSchema.shape.tIndex },
  { key: 'dwContentRestrictionBitFlag', label: 'Content Restriction Bit Flag', type: 'number' as const, validation: eventSystemSchema.shape.dwContentRestrictionBitFlag },
  { key: 'fRate', label: 'Rate', type: 'number' as const, validation: eventSystemSchema.shape.fRate },
  { key: 'byAction', label: 'Action', type: 'number' as const, validation: eventSystemSchema.shape.byAction },
  { key: 'aIndex', label: 'A Index', type: 'number' as const, validation: eventSystemSchema.shape.aIndex },
  { key: 'byGroup', label: 'Group', type: 'number' as const, validation: eventSystemSchema.shape.byGroup },
  { key: 'dwVolume', label: 'Volume', type: 'number' as const, validation: eventSystemSchema.shape.dwVolume },
  { key: 'dwUnknown', label: 'Unknown', type: 'number' as const, validation: eventSystemSchema.shape.dwUnknown },
  { key: 'adwSetting_0', label: 'Setting 1', type: 'number' as const, validation: eventSystemSchema.shape.adwSetting_0 },
  { key: 'adwSetting_1', label: 'Setting 2', type: 'number' as const, validation: eventSystemSchema.shape.adwSetting_1 },
  { key: 'adwSetting_2', label: 'Setting 3', type: 'number' as const, validation: eventSystemSchema.shape.adwSetting_2 },
];
