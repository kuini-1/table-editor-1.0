import * as z from 'zod';

export const npcDataServerTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidity_Able: z.boolean(),
  dwServerBitFlag: z.coerce.number().min(0, 'Must be a positive number'),
});

export type NpcDataServerTableFormData = z.infer<typeof npcDataServerTableSchema>;

export interface NpcDataServerTableRow extends NpcDataServerTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: npcDataServerTableSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: npcDataServerTableSchema.shape.bValidity_Able },
  { key: 'dwServerBitFlag', label: 'Server Bit Flag', type: 'number' as const, validation: npcDataServerTableSchema.shape.dwServerBitFlag },
];

