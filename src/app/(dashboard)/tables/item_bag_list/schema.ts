import * as z from 'zod';

const baseItemBagListSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  byLevel: z.coerce.number().nullable(),
  bEnchant_Able: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  dwItemCount: z.coerce.number().nullable(),
  dwTotalProb: z.coerce.number().nullable(),
  aItem_0: z.coerce.number().nullable(),
  adwProb_0: z.coerce.number().nullable(),
  aItem_1: z.coerce.number().nullable(),
  adwProb_1: z.coerce.number().nullable(),
  aItem_2: z.coerce.number().nullable(),
  adwProb_2: z.coerce.number().nullable(),
  aItem_3: z.coerce.number().nullable(),
  adwProb_3: z.coerce.number().nullable(),
  aItem_4: z.coerce.number().nullable(),
  adwProb_4: z.coerce.number().nullable(),
  aItem_5: z.coerce.number().nullable(),
  adwProb_5: z.coerce.number().nullable(),
  aItem_6: z.coerce.number().nullable(),
  adwProb_6: z.coerce.number().nullable(),
  aItem_7: z.coerce.number().nullable(),
  adwProb_7: z.coerce.number().nullable(),
  aItem_8: z.coerce.number().nullable(),
  adwProb_8: z.coerce.number().nullable(),
  aItem_9: z.coerce.number().nullable(),
  adwProb_9: z.coerce.number().nullable(),
});

export const itemBagListSchema = baseItemBagListSchema.extend({
  id: z.string().uuid(),
});

export const newItemBagListSchema = baseItemBagListSchema.extend({
  id: z.string().uuid().optional(),
});

export type ItemBagListFormData = z.infer<typeof itemBagListSchema>;
export type NewItemBagListFormData = z.infer<typeof newItemBagListSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const },
  { key: 'wszName', label: 'Name', type: 'text' as const },
  { key: 'byLevel', label: 'Level', type: 'number' as const },
  { key: 'bEnchant_Able', label: 'Enchant Able', type: 'boolean' as const },
  { key: 'dwItemCount', label: 'Item Count', type: 'number' as const },
  { key: 'dwTotalProb', label: 'Total Probability', type: 'number' as const },
  ...Array.from({ length: 10 }, (_, i) => [
    { key: `aItem_${i}`, label: `Item ${i}`, type: 'number' as const },
    { key: `adwProb_${i}`, label: `Probability ${i}`, type: 'number' as const },
  ]).flat(),
];
