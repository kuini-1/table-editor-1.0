import { z } from 'zod';

export const itemEnchantSchema = z.object({
  id: z.string(),
  table_id: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  seTblidx: z.coerce.number().nullable(),
  bSeType: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  byRvType: z.coerce.number().nullable(),
  byExclIdx: z.coerce.number().nullable(),
  byMinLevel: z.coerce.number().nullable(),
  byMaxLevel: z.coerce.number().nullable(),
  byFrequency: z.coerce.number().nullable(),
  wEnchant_Value: z.coerce.number().nullable(),
  byKind: z.coerce.number().nullable(),
  dwEquip: z.coerce.number().nullable(),
  byGroupNo: z.coerce.number().nullable(),
  wMaxValue: z.coerce.number().nullable(),
  bIsSuperior: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  bIsExcellent: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  bIsRare: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  bIsLegendary: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
});

export type ItemEnchantFormData = z.infer<typeof itemEnchantSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const },
  { key: 'wszName', label: 'Name', type: 'text' as const },
  { key: 'seTblidx', label: 'Set Table IDX', type: 'number' as const },
  { key: 'bSeType', label: 'Set Type', type: 'boolean' as const },
  { key: 'byRvType', label: 'RV Type', type: 'number' as const },
  { key: 'byExclIdx', label: 'Exclusive IDX', type: 'number' as const },
  { key: 'byMinLevel', label: 'Min Level', type: 'number' as const },
  { key: 'byMaxLevel', label: 'Max Level', type: 'number' as const },
  { key: 'byFrequency', label: 'Frequency', type: 'number' as const },
  { key: 'wEnchant_Value', label: 'Enchant Value', type: 'number' as const },
  { key: 'byKind', label: 'Kind', type: 'number' as const },
  { key: 'dwEquip', label: 'Equipment', type: 'number' as const },
  { key: 'byGroupNo', label: 'Group No', type: 'number' as const },
  { key: 'wMaxValue', label: 'Max Value', type: 'number' as const },
  { key: 'bIsSuperior', label: 'Is Superior', type: 'boolean' as const },
  { key: 'bIsExcellent', label: 'Is Excellent', type: 'boolean' as const },
  { key: 'bIsRare', label: 'Is Rare', type: 'boolean' as const },
  { key: 'bIsLegendary', label: 'Is Legendary', type: 'boolean' as const },
];
