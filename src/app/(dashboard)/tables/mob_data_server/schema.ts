import * as z from 'zod';

export const mobDataServerTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidity_Able: z.boolean(),
  dwServerBitFlag: z.coerce.number().min(0, 'Must be a positive number'),
});

export type MobDataServerTableFormData = z.infer<typeof mobDataServerTableSchema>;

export interface MobDataServerTableRow extends MobDataServerTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: mobDataServerTableSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: mobDataServerTableSchema.shape.bValidity_Able },
  { key: 'dwServerBitFlag', label: 'Server Bit Flag', type: 'number' as const, validation: mobDataServerTableSchema.shape.dwServerBitFlag },
];

