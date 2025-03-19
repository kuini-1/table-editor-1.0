import { z } from 'zod';

export const itemEnchantSchema = z.object({
  id: z.string(),
  table_id: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  wszname: z.string().nullable(),
  setblidx: z.number().nullable(),
  bsetype: z.boolean().nullable(),
  byrvtype: z.number().nullable(),
  byexclidx: z.number().nullable(),
  byminlevel: z.number().nullable(),
  bymaxlevel: z.number().nullable(),
  byfrequency: z.number().nullable(),
  wenchant_value: z.number().nullable(),
  bykind: z.number().nullable(),
  dwequip: z.number().nullable(),
  bygroupno: z.number().nullable(),
  wmaxvalue: z.number().nullable(),
  bissuperior: z.boolean().nullable(),
  bisexcellent: z.boolean().nullable(),
  bisrare: z.boolean().nullable(),
  bislegendary: z.boolean().nullable(),
});

export type ItemEnchantFormData = z.infer<typeof itemEnchantSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const },
  { key: 'wszname', label: 'Name', type: 'text' as const },
  { key: 'setblidx', label: 'Set Table IDX', type: 'number' as const },
  { key: 'bsetype', label: 'Set Type', type: 'boolean' as const },
  { key: 'byrvtype', label: 'RV Type', type: 'number' as const },
  { key: 'byexclidx', label: 'Exclusive IDX', type: 'number' as const },
  { key: 'byminlevel', label: 'Min Level', type: 'number' as const },
  { key: 'bymaxlevel', label: 'Max Level', type: 'number' as const },
  { key: 'byfrequency', label: 'Frequency', type: 'number' as const },
  { key: 'wenchant_value', label: 'Enchant Value', type: 'number' as const },
  { key: 'bykind', label: 'Kind', type: 'number' as const },
  { key: 'dwequip', label: 'Equipment', type: 'number' as const },
  { key: 'bygroupno', label: 'Group No', type: 'number' as const },
  { key: 'wmaxvalue', label: 'Max Value', type: 'number' as const },
  { key: 'bissuperior', label: 'Is Superior', type: 'boolean' as const },
  { key: 'bisexcellent', label: 'Is Excellent', type: 'boolean' as const },
  { key: 'bisrare', label: 'Is Rare', type: 'boolean' as const },
  { key: 'bislegendary', label: 'Is Legendary', type: 'boolean' as const },
]; 