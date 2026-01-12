import * as z from 'zod';

// Helper function to create probability fields schema
const createProbabilityFields = (index: number) => ({
  [`byType_probability_${index}`]: z.coerce.number().nullable(),
  [`tblidx_probability_${index}`]: z.coerce.number().nullable(),
  [`dwMinValue_probability_${index}`]: z.coerce.number().nullable(),
  [`dwMaxValue_probability_${index}`]: z.coerce.number().nullable(),
  [`dwRate_probability_${index}`]: z.coerce.number().nullable(),
});

// Create an array of indices from 0 to 49
const probabilityIndices = Array.from({ length: 50 }, (_, i) => i);

// Generate all probability fields
const probabilityFields = probabilityIndices.reduce((acc, index) => ({
  ...acc,
  ...createProbabilityFields(index),
}), {});

// Main schema definition
export const questProbabilitySchema = z.object({
  id: z.string().optional(),
  table_id: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.coerce.number().nullable(),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  wszNote: z.string().nullable().transform(e => e === null ? "" : e),
  eUseType: z.coerce.number().nullable(),
  byProbabilityType: z.coerce.number().nullable(),
  bAllowBlank: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  byCount: z.coerce.number().nullable(),
  ...probabilityFields,
});

type SchemaShape = typeof questProbabilitySchema.shape;

// Column definitions for the table
export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: questProbabilitySchema.shape.tblidx },
  { key: 'wszName', label: 'Name', type: 'text' as const, validation: questProbabilitySchema.shape.wszName },
  { key: 'wszNote', label: 'Note', type: 'text' as const, validation: questProbabilitySchema.shape.wszNote },
  { key: 'eUseType', label: 'Use Type', type: 'number' as const, validation: questProbabilitySchema.shape.eUseType },
  { key: 'byProbabilityType', label: 'Probability Type', type: 'number' as const, validation: questProbabilitySchema.shape.byProbabilityType },
  { key: 'bAllowBlank', label: 'Allow Blank', type: 'boolean' as const, validation: questProbabilitySchema.shape.bAllowBlank },
  { key: 'byCount', label: 'Count', type: 'number' as const, validation: questProbabilitySchema.shape.byCount },
  ...probabilityIndices.flatMap(index => [
    { key: `byType_probability_${index}`, label: `Type ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`byType_probability_${index}` as keyof SchemaShape] },
    { key: `tblidx_probability_${index}`, label: `TBLIDX ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`tblidx_probability_${index}` as keyof SchemaShape] },
    { key: `dwMinValue_probability_${index}`, label: `Min Value ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwMinValue_probability_${index}` as keyof SchemaShape] },
    { key: `dwMaxValue_probability_${index}`, label: `Max Value ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwMaxValue_probability_${index}` as keyof SchemaShape] },
    { key: `dwRate_probability_${index}`, label: `Rate ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwRate_probability_${index}` as keyof SchemaShape] },
  ]),
];

export type QuestProbabilityFormData = z.infer<typeof questProbabilitySchema>;
