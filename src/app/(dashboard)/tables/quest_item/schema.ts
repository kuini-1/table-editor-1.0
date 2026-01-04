import * as z from 'zod';

export const questItemTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  ItemName: z.coerce.number().min(0, 'Must be a positive number'),
  szIconName: z.string().max(32, 'Cannot exceed 32 characters'),
  Note: z.coerce.number().min(0, 'Must be a positive number'),
  byFunctionBitFlag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type QuestItemTableFormData = z.infer<typeof questItemTableSchema>;

export interface QuestItemTableRow extends QuestItemTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: questItemTableSchema.shape.tblidx },
  { key: 'ItemName', label: 'Item Name', type: 'number' as const, validation: questItemTableSchema.shape.ItemName },
  { key: 'szIconName', label: 'Icon Name', type: 'text' as const, validation: questItemTableSchema.shape.szIconName },
  { key: 'Note', label: 'Note', type: 'number' as const, validation: questItemTableSchema.shape.Note },
  { key: 'byFunctionBitFlag', label: 'Function Bit Flag', type: 'number' as const, validation: questItemTableSchema.shape.byFunctionBitFlag },
];

