import { z } from 'zod';

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