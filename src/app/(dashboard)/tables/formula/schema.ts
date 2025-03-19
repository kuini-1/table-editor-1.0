import * as z from 'zod';

const baseFormulaSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  bvalidity_able: z.boolean().nullable(),
  afrate_0: z.number().nullable(),
  afrate_1: z.number().nullable(),
  afrate_2: z.number().nullable(),
  afrate_3: z.number().nullable(),
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
  { key: 'bvalidity_able', label: 'Valid', type: 'boolean' as const, validation: formulaSchema.shape.bvalidity_able },
  { key: 'afrate_0', label: 'Rate 0', type: 'number' as const, validation: formulaSchema.shape.afrate_0 },
  { key: 'afrate_1', label: 'Rate 1', type: 'number' as const, validation: formulaSchema.shape.afrate_1 },
  { key: 'afrate_2', label: 'Rate 2', type: 'number' as const, validation: formulaSchema.shape.afrate_2 },
  { key: 'afrate_3', label: 'Rate 3', type: 'number' as const, validation: formulaSchema.shape.afrate_3 },
]; 