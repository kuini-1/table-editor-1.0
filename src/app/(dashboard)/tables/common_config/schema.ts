import * as z from 'zod';

export const commonConfigTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wstrName: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_0: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_1: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_2: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_3: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_4: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_5: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_6: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_7: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_8: z.string().nullable().transform(e => e === null ? "" : e),
  wstrValue_9: z.string().nullable().transform(e => e === null ? "" : e),
});

export type CommonConfigTableFormData = z.infer<typeof commonConfigTableSchema>;

export interface CommonConfigTableRow extends CommonConfigTableFormData {
  id: string;
}

const valueColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `wstrValue_${i}` as const,
  label: `Value ${i}`,
  type: 'text' as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validation: commonConfigTableSchema.shape[`wstrValue_${i}` as keyof typeof commonConfigTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: commonConfigTableSchema.shape.tblidx },
  { key: 'wstrName', label: 'Name', type: 'text' as const, validation: commonConfigTableSchema.shape.wstrName },
  ...valueColumns,
];

