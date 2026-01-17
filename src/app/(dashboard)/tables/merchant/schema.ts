import { z } from "zod";

// Define the schema for the merchant table
export const merchantSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wszNameText: z.string().min(1, 'Name is required'),
  bySell_Type: z.coerce.number().min(0, 'Must be a positive number'),
  Tab_Name: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeedMileage: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 0
  aitem_Tblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_0: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_0: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 1
  aitem_Tblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_1: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_1: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 2
  aitem_Tblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_2: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_2: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 3
  aitem_Tblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_3: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_3: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 4
  aitem_Tblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_4: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_4: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 5
  aitem_Tblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_5: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_5: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 6
  aitem_Tblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_6: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_6: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 7
  aitem_Tblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_7: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_7: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 8
  aitem_Tblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_8: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_8: z.coerce.number().min(0, 'Must be a positive number'),
  // Item 9
  aitem_Tblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_9: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_9: z.coerce.number().min(0, 'Must be a positive number'),
  // Items 10-35
  aitem_Tblidx_10: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_10: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_10: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_10: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_11: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_11: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_11: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_11: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_12: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_12: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_12: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_12: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_13: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_13: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_13: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_13: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_14: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_14: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_14: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_14: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_15: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_15: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_15: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_15: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_16: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_16: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_16: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_16: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_17: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_17: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_17: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_17: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_18: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_18: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_18: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_18: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_19: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_19: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_19: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_19: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_20: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_20: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_20: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_20: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_21: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_21: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_21: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_21: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_22: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_22: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_22: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_22: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_23: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_23: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_23: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_23: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_24: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_24: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_24: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_24: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_25: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_25: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_25: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_25: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_26: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_26: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_26: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_26: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_27: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_27: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_27: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_27: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_28: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_28: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_28: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_28: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_29: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_29: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_29: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_29: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_30: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_30: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_30: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_30: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_31: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_31: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_31: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_31: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_32: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_32: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_32: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_32: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_33: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_33: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_33: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_33: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_34: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_34: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_34: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_34: z.coerce.number().min(0, 'Must be a positive number'),
  aitem_Tblidx_35: z.coerce.number().min(0, 'Must be a positive number'),
  aNeedItemTblidx_35: z.coerce.number().min(0, 'Must be a positive number'),
  abyNeedItemStack_35: z.coerce.number().min(0, 'Must be a positive number'),
  adwNeedZenny_35: z.coerce.number().min(0, 'Must be a positive number'),
});

export type MerchantFormData = z.infer<typeof merchantSchema>;

export interface MerchantRow extends MerchantFormData {
  id: string;
}

// Organize columns into logical groups
export const columns = [
  // Basic Information
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: merchantSchema.shape.tblidx },
  { key: 'wszNameText', label: 'Name', type: 'text' as const, validation: merchantSchema.shape.wszNameText },
  { key: 'bySell_Type', label: 'Sell Type', type: 'number' as const, validation: merchantSchema.shape.bySell_Type },
  { key: 'Tab_Name', label: 'Tab Name', type: 'number' as const, validation: merchantSchema.shape.Tab_Name },
  { key: 'dwNeedMileage', label: 'Need Mileage', type: 'number' as const, validation: merchantSchema.shape.dwNeedMileage },
  
  // Item 0
  { key: 'aitem_Tblidx_0', label: 'Item 1 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_0 },
  { key: 'aNeedItemTblidx_0', label: 'Need Item 1 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_0 },
  { key: 'abyNeedItemStack_0', label: 'Need Item 1 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_0 },
  { key: 'adwNeedZenny_0', label: 'Need Zenny 1', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_0 },
  
  // Item 1
  { key: 'aitem_Tblidx_1', label: 'Item 2 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_1 },
  { key: 'aNeedItemTblidx_1', label: 'Need Item 2 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_1 },
  { key: 'abyNeedItemStack_1', label: 'Need Item 2 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_1 },
  { key: 'adwNeedZenny_1', label: 'Need Zenny 2', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_1 },
  
  // Item 2
  { key: 'aitem_Tblidx_2', label: 'Item 3 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_2 },
  { key: 'aNeedItemTblidx_2', label: 'Need Item 3 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_2 },
  { key: 'abyNeedItemStack_2', label: 'Need Item 3 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_2 },
  { key: 'adwNeedZenny_2', label: 'Need Zenny 3', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_2 },
  
  // Item 3
  { key: 'aitem_Tblidx_3', label: 'Item 4 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_3 },
  { key: 'aNeedItemTblidx_3', label: 'Need Item 4 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_3 },
  { key: 'abyNeedItemStack_3', label: 'Need Item 4 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_3 },
  { key: 'adwNeedZenny_3', label: 'Need Zenny 4', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_3 },
  
  // Item 4
  { key: 'aitem_Tblidx_4', label: 'Item 5 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_4 },
  { key: 'aNeedItemTblidx_4', label: 'Need Item 5 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_4 },
  { key: 'abyNeedItemStack_4', label: 'Need Item 5 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_4 },
  { key: 'adwNeedZenny_4', label: 'Need Zenny 5', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_4 },
  
  // Item 5
  { key: 'aitem_Tblidx_5', label: 'Item 6 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_5 },
  { key: 'aNeedItemTblidx_5', label: 'Need Item 6 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_5 },
  { key: 'abyNeedItemStack_5', label: 'Need Item 6 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_5 },
  { key: 'adwNeedZenny_5', label: 'Need Zenny 6', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_5 },
  
  // Item 6
  { key: 'aitem_Tblidx_6', label: 'Item 7 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_6 },
  { key: 'aNeedItemTblidx_6', label: 'Need Item 7 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_6 },
  { key: 'abyNeedItemStack_6', label: 'Need Item 7 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_6 },
  { key: 'adwNeedZenny_6', label: 'Need Zenny 7', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_6 },
  
  // Item 7
  { key: 'aitem_Tblidx_7', label: 'Item 8 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_7 },
  { key: 'aNeedItemTblidx_7', label: 'Need Item 8 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_7 },
  { key: 'abyNeedItemStack_7', label: 'Need Item 8 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_7 },
  { key: 'adwNeedZenny_7', label: 'Need Zenny 8', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_7 },
  
  // Item 8
  { key: 'aitem_Tblidx_8', label: 'Item 9 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_8 },
  { key: 'aNeedItemTblidx_8', label: 'Need Item 9 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_8 },
  { key: 'abyNeedItemStack_8', label: 'Need Item 9 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_8 },
  { key: 'adwNeedZenny_8', label: 'Need Zenny 9', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_8 },
  
  // Item 9
  { key: 'aitem_Tblidx_9', label: 'Item 10 ID', type: 'number' as const, validation: merchantSchema.shape.aitem_Tblidx_9 },
  { key: 'aNeedItemTblidx_9', label: 'Need Item 10 ID', type: 'number' as const, validation: merchantSchema.shape.aNeedItemTblidx_9 },
  { key: 'abyNeedItemStack_9', label: 'Need Item 10 Stack', type: 'number' as const, validation: merchantSchema.shape.abyNeedItemStack_9 },
  { key: 'adwNeedZenny_9', label: 'Need Zenny 10', type: 'number' as const, validation: merchantSchema.shape.adwNeedZenny_9 },
  
  // Items 10-35
  ...Array.from({ length: 26 }, (_, i) => {
    const itemIndex = i + 10;
    const displayNumber = itemIndex + 1;
    return [
      { key: `aitem_Tblidx_${itemIndex}`, label: `Item ${displayNumber} ID`, type: 'number' as const, validation: merchantSchema.shape[`aitem_Tblidx_${itemIndex}` as keyof typeof merchantSchema.shape] },
      { key: `aNeedItemTblidx_${itemIndex}`, label: `Need Item ${displayNumber} ID`, type: 'number' as const, validation: merchantSchema.shape[`aNeedItemTblidx_${itemIndex}` as keyof typeof merchantSchema.shape] },
      { key: `abyNeedItemStack_${itemIndex}`, label: `Need Item ${displayNumber} Stack`, type: 'number' as const, validation: merchantSchema.shape[`abyNeedItemStack_${itemIndex}` as keyof typeof merchantSchema.shape] },
      { key: `adwNeedZenny_${itemIndex}`, label: `Need Zenny ${displayNumber}`, type: 'number' as const, validation: merchantSchema.shape[`adwNeedZenny_${itemIndex}` as keyof typeof merchantSchema.shape] },
    ];
  }).flat(),
]; 