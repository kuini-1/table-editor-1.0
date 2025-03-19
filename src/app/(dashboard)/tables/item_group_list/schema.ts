import * as z from 'zod';

// Helper function to create item bag fields
const createItemBagFields = (indices: number[]) => {
  const fields: Record<string, z.ZodType<any>> = {};
  indices.forEach((index) => {
    fields[`aitembag_${index}`] = z.number().nullable();
    fields[`adwprob_${index}`] = z.number().nullable();
  });
  return fields;
};

export const itemGroupListSchema = z.object({
  id: z.string().uuid().optional(),
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszname: z.string().nullable(),
  bylevel: z.number().nullable(),
  bytry_count: z.number().nullable(),
  mob_index: z.number().nullable(),
  dwmob_type: z.number().nullable(),
  dwworld_rule_type: z.number().nullable(),
  dwinterval: z.number().nullable(),
  dwsuperior: z.number().nullable(),
  dwexcellent: z.number().nullable(),
  dwrare: z.number().nullable(),
  dwlegendary: z.number().nullable(),
  dwno_drop: z.number().nullable(),
  dwzenny: z.number().nullable(),
  dwitembagcount: z.number().nullable(),
  dwtotalprob: z.number().nullable(),
  ...createItemBagFields([...Array(20).keys()]), // Creates fields for aitembag_0 to aitembag_19 and adwprob_0 to adwprob_19
});

export type ItemGroupListFormData = z.infer<typeof itemGroupListSchema>;

type SchemaShape = z.infer<typeof itemGroupListSchema>;

// Helper function to create item bag columns
const createItemBagColumns = (indices: number[]) => {
  return indices.flatMap((index) => [
    { 
      key: `aitembag_${index}` as keyof SchemaShape, 
      label: `Item Bag ${index}`, 
      type: 'number' as const, 
      validation: z.number().nullable()
    },
    { 
      key: `adwprob_${index}` as keyof SchemaShape, 
      label: `Probability ${index}`, 
      type: 'number' as const, 
      validation: z.number().nullable()
    },
  ]);
};

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: itemGroupListSchema.shape.tblidx },
  { key: 'wszname', label: 'Name', type: 'text' as const, validation: itemGroupListSchema.shape.wszname },
  { key: 'bylevel', label: 'Level', type: 'number' as const, validation: itemGroupListSchema.shape.bylevel },
  { key: 'bytry_count', label: 'Try Count', type: 'number' as const, validation: itemGroupListSchema.shape.bytry_count },
  { key: 'mob_index', label: 'Mob Index', type: 'number' as const, validation: itemGroupListSchema.shape.mob_index },
  { key: 'dwmob_type', label: 'Mob Type', type: 'number' as const, validation: itemGroupListSchema.shape.dwmob_type },
  { key: 'dwworld_rule_type', label: 'World Rule Type', type: 'number' as const, validation: itemGroupListSchema.shape.dwworld_rule_type },
  { key: 'dwinterval', label: 'Interval', type: 'number' as const, validation: itemGroupListSchema.shape.dwinterval },
  { key: 'dwsuperior', label: 'Superior', type: 'number' as const, validation: itemGroupListSchema.shape.dwsuperior },
  { key: 'dwexcellent', label: 'Excellent', type: 'number' as const, validation: itemGroupListSchema.shape.dwexcellent },
  { key: 'dwrare', label: 'Rare', type: 'number' as const, validation: itemGroupListSchema.shape.dwrare },
  { key: 'dwlegendary', label: 'Legendary', type: 'number' as const, validation: itemGroupListSchema.shape.dwlegendary },
  { key: 'dwno_drop', label: 'No Drop', type: 'number' as const, validation: itemGroupListSchema.shape.dwno_drop },
  { key: 'dwzenny', label: 'Zenny', type: 'number' as const, validation: itemGroupListSchema.shape.dwzenny },
  { key: 'dwitembagcount', label: 'Item Bag Count', type: 'number' as const, validation: itemGroupListSchema.shape.dwitembagcount },
  { key: 'dwtotalprob', label: 'Total Probability', type: 'number' as const, validation: itemGroupListSchema.shape.dwtotalprob },
  ...createItemBagColumns([...Array(20).keys()]),
]; 