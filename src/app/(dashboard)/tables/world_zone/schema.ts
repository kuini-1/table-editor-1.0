import * as z from 'zod';

export const worldZoneTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wFunctionBitFlag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  worldTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  nameTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  wszName_Text: z.string(),
  bForbidden_Vehicle: z.boolean(),
});

export type WorldZoneTableFormData = z.infer<typeof worldZoneTableSchema>;

export interface WorldZoneTableRow extends WorldZoneTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: worldZoneTableSchema.shape.tblidx },
  { key: 'wFunctionBitFlag', label: 'Function Bit Flag', type: 'number' as const, validation: worldZoneTableSchema.shape.wFunctionBitFlag },
  { key: 'worldTblidx', label: 'World Table ID', type: 'number' as const, validation: worldZoneTableSchema.shape.worldTblidx },
  { key: 'nameTblidx', label: 'Name Table ID', type: 'number' as const, validation: worldZoneTableSchema.shape.nameTblidx },
  { key: 'wszName_Text', label: 'Name Text', type: 'text' as const, validation: worldZoneTableSchema.shape.wszName_Text },
  { key: 'bForbidden_Vehicle', label: 'Forbidden Vehicle', type: 'boolean' as const, validation: worldZoneTableSchema.shape.bForbidden_Vehicle },
];

