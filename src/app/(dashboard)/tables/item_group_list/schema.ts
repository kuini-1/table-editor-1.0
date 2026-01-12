import * as z from 'zod';

// Helper function to create item bag fields
const createItemBagFields = (indices: number[]) => {
  const fields: Record<string, z.ZodType<number | null>> = {};
  indices.forEach((index) => {
    fields[`aItemBag_${index}`] = z.coerce.number().nullable();
    fields[`adwProb_${index}`] = z.coerce.number().nullable();
  });
  return fields;
};

export const itemGroupListSchema = z.object({
  id: z.string().uuid().optional(),
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  byLevel: z.coerce.number().nullable(),
  byTry_Count: z.coerce.number().nullable(),
  mob_Index: z.coerce.number().nullable(),
  dwMob_Type: z.coerce.number().nullable(),
  dwWorld_Rule_Type: z.coerce.number().nullable(),
  dwInterval: z.coerce.number().nullable(),
  dwSuperior: z.coerce.number().nullable(),
  dwExcellent: z.coerce.number().nullable(),
  dwRare: z.coerce.number().nullable(),
  dwLegendary: z.coerce.number().nullable(),
  dwNo_Drop: z.coerce.number().nullable(),
  dwZenny: z.coerce.number().nullable(),
  dwItemBagCount: z.coerce.number().nullable(),
  dwTotalProb: z.coerce.number().nullable(),
  ...createItemBagFields([...Array(10).keys()]), // Creates fields for aItemBag_0 to aItemBag_9 and adwProb_0 to adwProb_9
});

export type ItemGroupListFormData = z.infer<typeof itemGroupListSchema>;

type SchemaShape = z.infer<typeof itemGroupListSchema>;

// Helper function to create item bag columns
const createItemBagColumns = (indices: number[]) => {
  return indices.flatMap((index) => [
    { 
      key: `aItemBag_${index}` as keyof SchemaShape, 
      label: `Item Bag ${index}`, 
      type: 'number' as const, 
      validation: z.coerce.number().nullable()
    },
    { 
      key: `adwProb_${index}` as keyof SchemaShape, 
      label: `Probability ${index}`, 
      type: 'number' as const, 
      validation: z.coerce.number().nullable()
    },
  ]);
};

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: itemGroupListSchema.shape.tblidx },
  { key: 'wszName', label: 'Name', type: 'text' as const, validation: itemGroupListSchema.shape.wszName },
  { key: 'byLevel', label: 'Level', type: 'number' as const, validation: itemGroupListSchema.shape.byLevel },
  { key: 'byTry_Count', label: 'Try Count', type: 'number' as const, validation: itemGroupListSchema.shape.byTry_Count },
  { key: 'mob_Index', label: 'Mob Index', type: 'number' as const, validation: itemGroupListSchema.shape.mob_Index },
  { key: 'dwMob_Type', label: 'Mob Type', type: 'number' as const, validation: itemGroupListSchema.shape.dwMob_Type },
  { key: 'dwWorld_Rule_Type', label: 'World Rule Type', type: 'number' as const, validation: itemGroupListSchema.shape.dwWorld_Rule_Type },
  { key: 'dwInterval', label: 'Interval', type: 'number' as const, validation: itemGroupListSchema.shape.dwInterval },
  { key: 'dwSuperior', label: 'Superior', type: 'number' as const, validation: itemGroupListSchema.shape.dwSuperior },
  { key: 'dwExcellent', label: 'Excellent', type: 'number' as const, validation: itemGroupListSchema.shape.dwExcellent },
  { key: 'dwRare', label: 'Rare', type: 'number' as const, validation: itemGroupListSchema.shape.dwRare },
  { key: 'dwLegendary', label: 'Legendary', type: 'number' as const, validation: itemGroupListSchema.shape.dwLegendary },
  { key: 'dwNo_Drop', label: 'No Drop', type: 'number' as const, validation: itemGroupListSchema.shape.dwNo_Drop },
  { key: 'dwZenny', label: 'Zenny', type: 'number' as const, validation: itemGroupListSchema.shape.dwZenny },
  { key: 'dwItemBagCount', label: 'Item Bag Count', type: 'number' as const, validation: itemGroupListSchema.shape.dwItemBagCount },
  { key: 'dwTotalProb', label: 'Total Probability', type: 'number' as const, validation: itemGroupListSchema.shape.dwTotalProb },
  ...createItemBagColumns([...Array(10).keys()]),
];
