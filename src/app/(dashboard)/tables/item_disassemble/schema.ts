import * as z from 'zod';

export const itemDisassembleTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  ByMat2Rate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  ByMat3Rate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  ItemTblidxResult_0: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_1: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_2: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_3: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_4: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_5: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_6: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_7: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_8: z.coerce.number().min(0, 'Must be a positive number'),
  ItemTblidxResult_9: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ItemDisassembleTableFormData = z.infer<typeof itemDisassembleTableSchema>;

export interface ItemDisassembleTableRow extends ItemDisassembleTableFormData {
  id: string;
}

const resultColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `ItemTblidxResult_${i}` as const,
  label: `Item Result ${i}`,
  type: 'number' as const,
  validation: itemDisassembleTableSchema.shape[`ItemTblidxResult_${i}` as keyof typeof itemDisassembleTableSchema.shape],
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: itemDisassembleTableSchema.shape.tblidx },
  { key: 'ByMat2Rate', label: 'Material 2 Rate', type: 'number' as const, validation: itemDisassembleTableSchema.shape.ByMat2Rate },
  { key: 'ByMat3Rate', label: 'Material 3 Rate', type: 'number' as const, validation: itemDisassembleTableSchema.shape.ByMat3Rate },
  ...resultColumns,
];

