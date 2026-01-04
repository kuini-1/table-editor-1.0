import * as z from 'zod';

export const itemRecipeTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidityAble: z.boolean(),
  dwName: z.coerce.number().min(0, 'Must be a positive number'),
  byRecipeType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byNeedMixLevel: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwNeedMixZenny: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_0_itemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_0_itemRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asCreateItemTblidx_1_itemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_1_itemRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asCreateItemTblidx_2_itemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_2_itemRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asCreateItemTblidx_3_itemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_3_itemRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asCreateItemTblidx_4_itemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asCreateItemTblidx_4_itemRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_0_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_0_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_1_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_1_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_2_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_2_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_3_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_3_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_4_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_4_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_5_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_5_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_6_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_6_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_7_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_7_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_8_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_8_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  asMaterial_9_materialTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  asMaterial_9_byMaterialCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type ItemRecipeTableFormData = z.infer<typeof itemRecipeTableSchema>;

export interface ItemRecipeTableRow extends ItemRecipeTableFormData {
  id: string;
}

const createItemColumns = Array.from({ length: 5 }, (_, i) => [
  { key: `asCreateItemTblidx_${i}_itemTblidx` as const, label: `Create Item ${i} Table ID`, type: 'number' as const, validation: itemRecipeTableSchema.shape[`asCreateItemTblidx_${i}_itemTblidx` as keyof typeof itemRecipeTableSchema.shape] as any },
  { key: `asCreateItemTblidx_${i}_itemRate` as const, label: `Create Item ${i} Rate`, type: 'number' as const, validation: itemRecipeTableSchema.shape[`asCreateItemTblidx_${i}_itemRate` as keyof typeof itemRecipeTableSchema.shape] as any },
]).flat();

const materialColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `asMaterial_${i}_materialTblidx` as const, label: `Material ${i} Table ID`, type: 'number' as const, validation: itemRecipeTableSchema.shape[`asMaterial_${i}_materialTblidx` as keyof typeof itemRecipeTableSchema.shape] as any },
  { key: `asMaterial_${i}_byMaterialCount` as const, label: `Material ${i} Count`, type: 'number' as const, validation: itemRecipeTableSchema.shape[`asMaterial_${i}_byMaterialCount` as keyof typeof itemRecipeTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: itemRecipeTableSchema.shape.tblidx },
  { key: 'bValidityAble', label: 'Validity Able', type: 'boolean' as const, validation: itemRecipeTableSchema.shape.bValidityAble },
  { key: 'dwName', label: 'Name', type: 'number' as const, validation: itemRecipeTableSchema.shape.dwName },
  { key: 'byRecipeType', label: 'Recipe Type', type: 'number' as const, validation: itemRecipeTableSchema.shape.byRecipeType },
  { key: 'byNeedMixLevel', label: 'Need Mix Level', type: 'number' as const, validation: itemRecipeTableSchema.shape.byNeedMixLevel },
  { key: 'dwNeedMixZenny', label: 'Need Mix Zenny', type: 'number' as const, validation: itemRecipeTableSchema.shape.dwNeedMixZenny },
  ...createItemColumns,
  ...materialColumns,
];

