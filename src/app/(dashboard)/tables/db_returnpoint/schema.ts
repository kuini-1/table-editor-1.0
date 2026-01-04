import * as z from 'zod';

export const dbReturnpointTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  byScatterPoint: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  fField_X: z.coerce.number(),
  fField_Y: z.coerce.number(),
  fField_Z: z.coerce.number(),
});

export type DbReturnpointTableFormData = z.infer<typeof dbReturnpointTableSchema>;

export interface DbReturnpointTableRow extends DbReturnpointTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dbReturnpointTableSchema.shape.tblidx },
  { key: 'byScatterPoint', label: 'Scatter Point', type: 'number' as const, validation: dbReturnpointTableSchema.shape.byScatterPoint },
  { key: 'fField_X', label: 'Field X', type: 'number' as const, validation: dbReturnpointTableSchema.shape.fField_X },
  { key: 'fField_Y', label: 'Field Y', type: 'number' as const, validation: dbReturnpointTableSchema.shape.fField_Y },
  { key: 'fField_Z', label: 'Field Z', type: 'number' as const, validation: dbReturnpointTableSchema.shape.fField_Z },
];

