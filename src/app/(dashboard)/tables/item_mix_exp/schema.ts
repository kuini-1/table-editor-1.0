import * as z from 'zod';

export const itemMixExpSchema = z.object({
  id: z.string().uuid().optional(),
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  dwneedexp: z.number().nullable(),
  byunknown: z.number().nullable(),
});

export type ItemMixExpFormData = z.infer<typeof itemMixExpSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: itemMixExpSchema.shape.tblidx },
  { key: 'dwneedexp', label: 'Need EXP', type: 'number' as const, validation: itemMixExpSchema.shape.dwneedexp },
  { key: 'byunknown', label: 'Unknown', type: 'number' as const, validation: itemMixExpSchema.shape.byunknown },
]; 