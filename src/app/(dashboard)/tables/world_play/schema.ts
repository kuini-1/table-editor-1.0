import * as z from 'zod';

export const worldPlayTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwGroup: z.coerce.number().min(0, 'Must be a positive number'),
  byExecuterType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byShareType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwShareLimitTime: z.coerce.number().min(0, 'Must be a positive number'),
});

export type WorldPlayTableFormData = z.infer<typeof worldPlayTableSchema>;

export interface WorldPlayTableRow extends WorldPlayTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: worldPlayTableSchema.shape.tblidx },
  { key: 'dwGroup', label: 'Group', type: 'number' as const, validation: worldPlayTableSchema.shape.dwGroup },
  { key: 'byExecuterType', label: 'Executer Type', type: 'number' as const, validation: worldPlayTableSchema.shape.byExecuterType },
  { key: 'byShareType', label: 'Share Type', type: 'number' as const, validation: worldPlayTableSchema.shape.byShareType },
  { key: 'dwShareLimitTime', label: 'Share Limit Time', type: 'number' as const, validation: worldPlayTableSchema.shape.dwShareLimitTime },
];

