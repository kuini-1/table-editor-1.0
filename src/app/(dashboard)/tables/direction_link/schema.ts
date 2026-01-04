import * as z from 'zod';

export const directionLinkTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  szFunctionName: z.string().max(64, 'Cannot exceed 64 characters'),
  szNote: z.string().max(64, 'Cannot exceed 64 characters'),
  byType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwAnimationID: z.coerce.number().min(0, 'Must be a positive number'),
  byFuncFlag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type DirectionLinkTableFormData = z.infer<typeof directionLinkTableSchema>;

export interface DirectionLinkTableRow extends DirectionLinkTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: directionLinkTableSchema.shape.tblidx },
  { key: 'szFunctionName', label: 'Function Name', type: 'text' as const, validation: directionLinkTableSchema.shape.szFunctionName },
  { key: 'szNote', label: 'Note', type: 'text' as const, validation: directionLinkTableSchema.shape.szNote },
  { key: 'byType', label: 'Type', type: 'number' as const, validation: directionLinkTableSchema.shape.byType },
  { key: 'dwAnimationID', label: 'Animation ID', type: 'number' as const, validation: directionLinkTableSchema.shape.dwAnimationID },
  { key: 'byFuncFlag', label: 'Func Flag', type: 'number' as const, validation: directionLinkTableSchema.shape.byFuncFlag },
];

