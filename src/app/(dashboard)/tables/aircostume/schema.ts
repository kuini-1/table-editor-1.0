import * as z from 'zod';

export const aircostumeTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wUnknown: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byUnknown2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byUnknown3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byUnknown4: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wUnknown5: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wUnknown6: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wUnknown7: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wszUnknown8: z.string(),
  byUnknown9: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wszUnknown10: z.string(),
  wszUnknown11: z.string(),
});

export type AircostumeTableFormData = z.infer<typeof aircostumeTableSchema>;

export interface AircostumeTableRow extends AircostumeTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: aircostumeTableSchema.shape.tblidx },
  { key: 'wUnknown', label: 'Unknown', type: 'number' as const, validation: aircostumeTableSchema.shape.wUnknown },
  { key: 'byUnknown2', label: 'Unknown 2', type: 'number' as const, validation: aircostumeTableSchema.shape.byUnknown2 },
  { key: 'byUnknown3', label: 'Unknown 3', type: 'number' as const, validation: aircostumeTableSchema.shape.byUnknown3 },
  { key: 'byUnknown4', label: 'Unknown 4', type: 'number' as const, validation: aircostumeTableSchema.shape.byUnknown4 },
  { key: 'wUnknown5', label: 'Unknown 5', type: 'number' as const, validation: aircostumeTableSchema.shape.wUnknown5 },
  { key: 'wUnknown6', label: 'Unknown 6', type: 'number' as const, validation: aircostumeTableSchema.shape.wUnknown6 },
  { key: 'wUnknown7', label: 'Unknown 7', type: 'number' as const, validation: aircostumeTableSchema.shape.wUnknown7 },
  { key: 'wszUnknown8', label: 'Unknown 8', type: 'text' as const, validation: aircostumeTableSchema.shape.wszUnknown8 },
  { key: 'byUnknown9', label: 'Unknown 9', type: 'number' as const, validation: aircostumeTableSchema.shape.byUnknown9 },
  { key: 'wszUnknown10', label: 'Unknown 10', type: 'text' as const, validation: aircostumeTableSchema.shape.wszUnknown10 },
  { key: 'wszUnknown11', label: 'Unknown 11', type: 'text' as const, validation: aircostumeTableSchema.shape.wszUnknown11 },
];

