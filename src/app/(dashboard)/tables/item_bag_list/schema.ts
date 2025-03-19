import * as z from 'zod';

const baseItemBagListSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszname: z.string().nullable(),
  bylevel: z.number().nullable(),
  benchant_able: z.boolean().nullable(),
  dwitemcount: z.number().nullable(),
  dwtotalprob: z.number().nullable(),
  aitem_0: z.number().nullable(),
  adwprob_0: z.number().nullable(),
  aitem_1: z.number().nullable(),
  adwprob_1: z.number().nullable(),
  aitem_2: z.number().nullable(),
  adwprob_2: z.number().nullable(),
  aitem_3: z.number().nullable(),
  adwprob_3: z.number().nullable(),
  aitem_4: z.number().nullable(),
  adwprob_4: z.number().nullable(),
  aitem_5: z.number().nullable(),
  adwprob_5: z.number().nullable(),
  aitem_6: z.number().nullable(),
  adwprob_6: z.number().nullable(),
  aitem_7: z.number().nullable(),
  adwprob_7: z.number().nullable(),
  aitem_8: z.number().nullable(),
  adwprob_8: z.number().nullable(),
  aitem_9: z.number().nullable(),
  adwprob_9: z.number().nullable(),
  aitem_10: z.number().nullable(),
  adwprob_10: z.number().nullable(),
  aitem_11: z.number().nullable(),
  adwprob_11: z.number().nullable(),
  aitem_12: z.number().nullable(),
  adwprob_12: z.number().nullable(),
  aitem_13: z.number().nullable(),
  adwprob_13: z.number().nullable(),
  aitem_14: z.number().nullable(),
  adwprob_14: z.number().nullable(),
  aitem_15: z.number().nullable(),
  adwprob_15: z.number().nullable(),
  aitem_16: z.number().nullable(),
  adwprob_16: z.number().nullable(),
  aitem_17: z.number().nullable(),
  adwprob_17: z.number().nullable(),
  aitem_18: z.number().nullable(),
  adwprob_18: z.number().nullable(),
  aitem_19: z.number().nullable(),
  adwprob_19: z.number().nullable(),
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
  { key: 'wszname', label: 'Name', type: 'text' as const },
  { key: 'bylevel', label: 'Level', type: 'number' as const },
  { key: 'benchant_able', label: 'Enchant Able', type: 'boolean' as const },
  { key: 'dwitemcount', label: 'Item Count', type: 'number' as const },
  { key: 'dwtotalprob', label: 'Total Probability', type: 'number' as const },
  ...Array.from({ length: 20 }, (_, i) => [
    { key: `aitem_${i}`, label: `Item ${i}`, type: 'number' as const },
    { key: `adwprob_${i}`, label: `Probability ${i}`, type: 'number' as const },
  ]).flat(),
]; 