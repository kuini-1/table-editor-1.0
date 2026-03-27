import * as z from 'zod';

export const itemMixMachineTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidityAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  name: z.coerce.number().min(0, 'Must be a positive number'),
  byMachineType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wFunctionBitFlag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byMixZennyDiscountRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dynamicObjectTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aBuiltInRecipeTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ItemMixMachineTableFormData = z.infer<typeof itemMixMachineTableSchema>;

export interface ItemMixMachineTableRow extends ItemMixMachineTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: itemMixMachineTableSchema.shape.tblidx },
  { key: 'bValidityAble', label: 'Validity', type: 'boolean' as const, validation: itemMixMachineTableSchema.shape.bValidityAble },
  { key: 'name', label: 'Name', type: 'number' as const, validation: itemMixMachineTableSchema.shape.name },
  { key: 'byMachineType', label: 'Machine Type', type: 'number' as const, validation: itemMixMachineTableSchema.shape.byMachineType },
  { key: 'wFunctionBitFlag', label: 'Function Bit Flag', type: 'number' as const, validation: itemMixMachineTableSchema.shape.wFunctionBitFlag },
  { key: 'byMixZennyDiscountRate', label: 'Mix Zenny Discount Rate', type: 'number' as const, validation: itemMixMachineTableSchema.shape.byMixZennyDiscountRate },
  { key: 'dynamicObjectTblidx', label: 'Dynamic Object ID', type: 'number' as const, validation: itemMixMachineTableSchema.shape.dynamicObjectTblidx },
  ...Array.from({ length: 10 }, (_, i) => [
    { key: `aBuiltInRecipeTblidx_${i}`, label: `Built-in Recipe ${i}`, type: 'number' as const, validation: itemMixMachineTableSchema.shape[`aBuiltInRecipeTblidx_${i}` as keyof typeof itemMixMachineTableSchema.shape] }
  ]).flat(),
];
