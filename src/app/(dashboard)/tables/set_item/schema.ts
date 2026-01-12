import { z } from "zod";

// Define the schema for the set_item table
export const setItemSchema = z.object({
  table_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  tblidx: z.number().optional(),
  bValidity_Able: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  semiSetOption: z.coerce.number().nullable(),
  fullSetOption: z.coerce.number().nullable(),
  aItemTblidx_0: z.coerce.number().nullable(),
  aItemTblidx_1: z.coerce.number().nullable(),
  aItemTblidx_2: z.coerce.number().nullable(),
  aItemTblidx_3: z.coerce.number().nullable(),
  aItemTblidx_4: z.coerce.number().nullable(),
  aItemTblidx_5: z.coerce.number().nullable(),
  aItemTblidx_6: z.coerce.number().nullable(),
  aItemTblidx_7: z.coerce.number().nullable(),
  aItemTblidx_8: z.coerce.number().nullable(),
  aItemTblidx_9: z.coerce.number().nullable(),
});

export type SetItemFormData = z.infer<typeof setItemSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: setItemSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Validity', type: 'boolean' as const, validation: setItemSchema.shape.bValidity_Able },
  { key: 'semiSetOption', label: 'Semi Set Option', type: 'number' as const, validation: setItemSchema.shape.semiSetOption },
  { key: 'fullSetOption', label: 'Full Set Option', type: 'number' as const, validation: setItemSchema.shape.fullSetOption },
  ...Array.from({ length: 10 }, (_, i) => [
    { key: `aItemTblidx_${i}`, label: `Item ${i + 1} ID`, type: 'number' as const, validation: setItemSchema.shape[`aItemTblidx_${i}` as keyof typeof setItemSchema.shape] }
  ]).flat(),
];
