import * as z from 'zod';

// Helper function to create probability fields schema
const createProbabilityFields = (index: number) => ({
  [`bytype_probability_${index}`]: z.number().nullable(),
  [`tblidx_probability_${index}`]: z.number().nullable(),
  [`dwminvalue_probability_${index}`]: z.number().nullable(),
  [`dwmaxvalue_probability_${index}`]: z.number().nullable(),
  [`dwrate_probability_${index}`]: z.number().nullable(),
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
  tblidx: z.number().nullable(),
  wszname: z.string().nullable(),
  wsznote: z.string().nullable(),
  eusetype: z.number().nullable(),
  byprobabilitytype: z.number().nullable(),
  ballowblank: z.boolean().nullable(),
  bycount: z.number().nullable(),
  ...probabilityFields,
});

type SchemaShape = typeof questProbabilitySchema.shape;

// Column definitions for the table
export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: questProbabilitySchema.shape.tblidx },
  { key: 'wszname', label: 'Name', type: 'text' as const, validation: questProbabilitySchema.shape.wszname },
  { key: 'wsznote', label: 'Note', type: 'text' as const, validation: questProbabilitySchema.shape.wsznote },
  { key: 'eusetype', label: 'Use Type', type: 'number' as const, validation: questProbabilitySchema.shape.eusetype },
  { key: 'byprobabilitytype', label: 'Probability Type', type: 'number' as const, validation: questProbabilitySchema.shape.byprobabilitytype },
  { key: 'ballowblank', label: 'Allow Blank', type: 'boolean' as const, validation: questProbabilitySchema.shape.ballowblank },
  { key: 'bycount', label: 'Count', type: 'number' as const, validation: questProbabilitySchema.shape.bycount },
  ...probabilityIndices.flatMap(index => [
    { key: `bytype_probability_${index}`, label: `Type ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`bytype_probability_${index}` as keyof SchemaShape] },
    { key: `tblidx_probability_${index}`, label: `TBLIDX ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`tblidx_probability_${index}` as keyof SchemaShape] },
    { key: `dwminvalue_probability_${index}`, label: `Min Value ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwminvalue_probability_${index}` as keyof SchemaShape] },
    { key: `dwmaxvalue_probability_${index}`, label: `Max Value ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwmaxvalue_probability_${index}` as keyof SchemaShape] },
    { key: `dwrate_probability_${index}`, label: `Rate ${index}`, type: 'number' as const, validation: questProbabilitySchema.shape[`dwrate_probability_${index}` as keyof SchemaShape] },
  ]),
];

export type QuestProbabilityFormData = z.infer<typeof questProbabilitySchema>; 