import * as z from 'zod';

const baseFormulaSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  bValidity_Able: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  afRate_0: z.number().nullable(),
  afRate_1: z.number().nullable(),
  afRate_2: z.number().nullable(),
  afRate_3: z.number().nullable(),
  afRate_4: z.number().nullable(),
  afRate_5: z.number().nullable(),
  afRate_6: z.number().nullable(),
  afRate_7: z.number().nullable(),
  afRate_8: z.number().nullable(),
  afRate_9: z.number().nullable(),
});

export const formulaSchema = baseFormulaSchema.extend({
  id: z.string().uuid(),
});

export const newFormulaSchema = baseFormulaSchema.extend({
  id: z.string().uuid().optional(),
});

export type FormulaFormData = z.infer<typeof newFormulaSchema>;
export type FormulaRow = z.infer<typeof formulaSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: formulaSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Valid', type: 'boolean' as const, validation: formulaSchema.shape.bValidity_Able },
  { key: 'afRate_0', label: 'Rate 0', type: 'number' as const, validation: formulaSchema.shape.afRate_0 },
  { key: 'afRate_1', label: 'Rate 1', type: 'number' as const, validation: formulaSchema.shape.afRate_1 },
  { key: 'afRate_2', label: 'Rate 2', type: 'number' as const, validation: formulaSchema.shape.afRate_2 },
  { key: 'afRate_3', label: 'Rate 3', type: 'number' as const, validation: formulaSchema.shape.afRate_3 },
  { key: 'afRate_4', label: 'Rate 4', type: 'number' as const, validation: formulaSchema.shape.afRate_4 },
  { key: 'afRate_5', label: 'Rate 5', type: 'number' as const, validation: formulaSchema.shape.afRate_5 },
  { key: 'afRate_6', label: 'Rate 6', type: 'number' as const, validation: formulaSchema.shape.afRate_6 },
  { key: 'afRate_7', label: 'Rate 7', type: 'number' as const, validation: formulaSchema.shape.afRate_7 },
  { key: 'afRate_8', label: 'Rate 8', type: 'number' as const, validation: formulaSchema.shape.afRate_8 },
  { key: 'afRate_9', label: 'Rate 9', type: 'number' as const, validation: formulaSchema.shape.afRate_9 },
];
