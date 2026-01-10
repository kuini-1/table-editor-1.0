import { z } from "zod";

// Define the schema for the item option table
export const itemOptionSchema = z.object({
  table_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  tblidx: z.number().optional(),
  wszoption_name: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  bvalidity_able: z.number().optional(),
  byoption_rank: z.number().optional(),
  byitem_group: z.number().optional(),
  bymaxquality: z.number().optional(),
  byquality: z.number().optional(),
  byqualityindex: z.number().optional(),
  dwcost: z.number().optional(),
  bylevel: z.number().optional(),
  activeeffect: z.number().optional(),
  factiverate: z.number().optional(),
  sznote: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  system_effect_0: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  bappliedinpercent_0: z.boolean().optional(),
  nvalue_0: z.number().optional(),
  byscouterinfo_0: z.number().optional(),
  system_effect_1: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  bappliedinpercent_1: z.boolean().optional(),
  nvalue_1: z.number().optional(),
  byscouterinfo_1: z.number().optional(),
  system_effect_2: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  bappliedinpercent_2: z.boolean().optional(),
  nvalue_2: z.number().optional(),
  byscouterinfo_2: z.number().optional(),
  system_effect_3: z.string().nullable().transform(e => e === null ? "" : e).optional(),
  bappliedinpercent_3: z.boolean().optional(),
  nvalue_3: z.number().optional(),
  byscouterinfo_3: z.number().optional(),
});

export type ItemOptionFormData = z.infer<typeof itemOptionSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: itemOptionSchema.shape.tblidx },
  { key: 'wszoption_name', label: 'Option Name', type: 'text' as const, validation: itemOptionSchema.shape.wszoption_name },
  { key: 'bvalidity_able', label: 'Validity', type: 'number' as const, validation: itemOptionSchema.shape.bvalidity_able },
  { key: 'byoption_rank', label: 'Option Rank', type: 'number' as const, validation: itemOptionSchema.shape.byoption_rank },
  { key: 'byitem_group', label: 'Item Group', type: 'number' as const, validation: itemOptionSchema.shape.byitem_group },
  { key: 'bymaxquality', label: 'Max Quality', type: 'number' as const, validation: itemOptionSchema.shape.bymaxquality },
  { key: 'byquality', label: 'Quality', type: 'number' as const, validation: itemOptionSchema.shape.byquality },
  { key: 'byqualityindex', label: 'Quality Index', type: 'number' as const, validation: itemOptionSchema.shape.byqualityindex },
  { key: 'dwcost', label: 'Cost', type: 'number' as const, validation: itemOptionSchema.shape.dwcost },
  { key: 'bylevel', label: 'Level', type: 'number' as const, validation: itemOptionSchema.shape.bylevel },
  { key: 'activeeffect', label: 'Active Effect', type: 'number' as const, validation: itemOptionSchema.shape.activeeffect },
  { key: 'factiverate', label: 'Active Rate', type: 'number' as const, validation: itemOptionSchema.shape.factiverate },
  { key: 'sznote', label: 'Note', type: 'text' as const, validation: itemOptionSchema.shape.sznote },
  ...Array.from({ length: 4 }, (_, i) => [
    { key: `system_effect_${i}`, label: `System Effect ${i}`, type: 'text' as const, validation: itemOptionSchema.shape[`system_effect_${i}` as keyof typeof itemOptionSchema.shape] },
    { key: `bappliedinpercent_${i}`, label: `Applied in Percent ${i}`, type: 'boolean' as const, validation: itemOptionSchema.shape[`bappliedinpercent_${i}` as keyof typeof itemOptionSchema.shape] },
    { key: `nvalue_${i}`, label: `Value ${i}`, type: 'number' as const, validation: itemOptionSchema.shape[`nvalue_${i}` as keyof typeof itemOptionSchema.shape] },
    { key: `byscouterinfo_${i}`, label: `Scouter Info ${i}`, type: 'number' as const, validation: itemOptionSchema.shape[`byscouterinfo_${i}` as keyof typeof itemOptionSchema.shape] }
  ]).flat(),
]; 