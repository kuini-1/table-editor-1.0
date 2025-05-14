import { z } from "zod";

// Define the schema for the merchant table
export const merchantSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wsznametext: z.string().min(1, 'Name is required'),
  bysell_type: z.coerce.number().min(0, 'Must be a positive number'),
  tab_name: z.string().min(1, 'Tab name is required'),
  dwneedmileage: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 0
  aitem_tblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_0: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_0: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 1
  aitem_tblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_1: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_1: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 2
  aitem_tblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_2: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_2: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 3
  aitem_tblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_3: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_3: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 4
  aitem_tblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_4: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_4: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 5
  aitem_tblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_5: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_5: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 6
  aitem_tblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_6: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_6: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 7
  aitem_tblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_7: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_7: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 8
  aitem_tblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_8: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_8: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 9
  aitem_tblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  aneeditemtblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  abyneeditemstack_9: z.coerce.number().min(0, 'Must be a positive number'),
  adwneedzenny_9: z.coerce.number().min(0, 'Must be a positive number'),
});

export type MerchantFormData = z.infer<typeof merchantSchema>;

export interface MerchantRow extends MerchantFormData {
  id: string;
}

// Organize columns into logical groups
export const columns = [
  // Basic Information
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: merchantSchema.shape.tblidx },
  { key: 'wsznametext', label: 'Name', type: 'text' as const, validation: merchantSchema.shape.wsznametext },
  { key: 'bysell_type', label: 'Sell Type', type: 'number' as const, validation: merchantSchema.shape.bysell_type },
  { key: 'tab_name', label: 'Tab Name', type: 'text' as const, validation: merchantSchema.shape.tab_name },
  { key: 'dwneedmileage', label: 'Need Mileage', type: 'number' as const, validation: merchantSchema.shape.dwneedmileage },
  
  // Item 0
  { key: 'aitem_tblidx_0', label: 'Item 1 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_tblidx_0 },
  { key: 'aneeditemtblidx_0', label: 'Need Item 1 ID', type: 'number' as const, validation: merchantSchema.shape.aneeditemtblidx_0 },
  { key: 'abyneeditemstack_0', label: 'Need Item 1 Stack', type: 'number' as const, validation: merchantSchema.shape.abyneeditemstack_0 },
  { key: 'adwneedzenny_0', label: 'Need Zenny 1', type: 'number' as const, validation: merchantSchema.shape.adwneedzenny_0 },
  
  // Item 1
  { key: 'aitem_tblidx_1', label: 'Item 2 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_tblidx_1 },
  { key: 'aneeditemtblidx_1', label: 'Need Item 2 ID', type: 'number' as const, validation: merchantSchema.shape.aneeditemtblidx_1 },
  { key: 'abyneeditemstack_1', label: 'Need Item 2 Stack', type: 'number' as const, validation: merchantSchema.shape.abyneeditemstack_1 },
  { key: 'adwneedzenny_1', label: 'Need Zenny 2', type: 'number' as const, validation: merchantSchema.shape.adwneedzenny_1 },
  
  // Item 2
  { key: 'aitem_tblidx_2', label: 'Item 3 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_tblidx_2 },
  { key: 'aneeditemtblidx_2', label: 'Need Item 3 ID', type: 'number' as const, validation: merchantSchema.shape.aneeditemtblidx_2 },
  { key: 'abyneeditemstack_2', label: 'Need Item 3 Stack', type: 'number' as const, validation: merchantSchema.shape.abyneeditemstack_2 },
  { key: 'adwneedzenny_2', label: 'Need Zenny 3', type: 'number' as const, validation: merchantSchema.shape.adwneedzenny_2 },
  
  // Item 3
  { key: 'aitem_tblidx_3', label: 'Item 4 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_tblidx_3 },
  { key: 'aneeditemtblidx_3', label: 'Need Item 4 ID', type: 'number' as const, validation: merchantSchema.shape.aneeditemtblidx_3 },
  { key: 'abyneeditemstack_3', label: 'Need Item 4 Stack', type: 'number' as const, validation: merchantSchema.shape.abyneeditemstack_3 },
  { key: 'adwneedzenny_3', label: 'Need Zenny 4', type: 'number' as const, validation: merchantSchema.shape.adwneedzenny_3 },
]; 