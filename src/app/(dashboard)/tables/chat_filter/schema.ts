import * as z from 'zod';

export const chatFilterTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wszSlangText: z.string(),
  filteringTextIndex: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ChatFilterTableFormData = z.infer<typeof chatFilterTableSchema>;

export interface ChatFilterTableRow extends ChatFilterTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: chatFilterTableSchema.shape.tblidx },
  { key: 'wszSlangText', label: 'Slang Text', type: 'text' as const, validation: chatFilterTableSchema.shape.wszSlangText },
  { key: 'filteringTextIndex', label: 'Filtering Text Index', type: 'number' as const, validation: chatFilterTableSchema.shape.filteringTextIndex },
];

