import { z } from "zod";

// Define the schema for the set_item table
export const setItemSchema = z.object({
  table_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  tblidx: z.number().optional(),
  bvalidity_able: z.boolean().optional(),
  semisetoption: z.number().optional(),
  fullsetoption: z.number().optional(),
  aitemtblidx_0: z.number().optional(),
  aitemtblidx_1: z.number().optional(),
  aitemtblidx_2: z.number().optional(),
});

export type SetItemFormData = z.infer<typeof setItemSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: setItemSchema.shape.tblidx },
  { key: 'bvalidity_able', label: 'Validity', type: 'boolean' as const, validation: setItemSchema.shape.bvalidity_able },
  { key: 'semisetoption', label: 'Semi Set Option', type: 'number' as const, validation: setItemSchema.shape.semisetoption },
  { key: 'fullsetoption', label: 'Full Set Option', type: 'number' as const, validation: setItemSchema.shape.fullsetoption },
  { key: 'aitemtblidx_0', label: 'Item 1 ID', type: 'number' as const, validation: setItemSchema.shape.aitemtblidx_0 },
  { key: 'aitemtblidx_1', label: 'Item 2 ID', type: 'number' as const, validation: setItemSchema.shape.aitemtblidx_1 },
  { key: 'aitemtblidx_2', label: 'Item 3 ID', type: 'number' as const, validation: setItemSchema.shape.aitemtblidx_2 },
]; 