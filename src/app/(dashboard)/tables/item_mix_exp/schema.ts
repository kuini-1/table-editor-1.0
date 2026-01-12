import * as z from 'zod';

export const itemMixExpSchema = z.object({
  id: z.string().uuid().optional(),
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  dwNeedEXP: z.coerce.number().nullable(),
  byUnknown: z.coerce.number().nullable(),
});

export type ItemMixExpFormData = z.infer<typeof itemMixExpSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: itemMixExpSchema.shape.tblidx },
  { key: 'dwNeedEXP', label: 'Need EXP', type: 'number' as const, validation: itemMixExpSchema.shape.dwNeedEXP },
  { key: 'byUnknown', label: 'Unknown', type: 'number' as const, validation: itemMixExpSchema.shape.byUnknown },
];
