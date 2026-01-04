import * as z from 'zod';

export const chatCommandTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidity_Able: z.boolean(),
  wAction_Animation_Index: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aChat_Command_0: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_1: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_2: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_3: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_4: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_5: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_6: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_7: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_8: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_9: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_10: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_11: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_12: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_13: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_14: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_15: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_16: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_17: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_18: z.coerce.number().min(0, 'Must be a positive number'),
  aChat_Command_19: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ChatCommandTableFormData = z.infer<typeof chatCommandTableSchema>;

export interface ChatCommandTableRow extends ChatCommandTableFormData {
  id: string;
}

const chatCommandColumns = Array.from({ length: 20 }, (_, i) => ({
  key: `aChat_Command_${i}` as const,
  label: `Chat Command ${i}`,
  type: 'number' as const,
  validation: chatCommandTableSchema.shape[`aChat_Command_${i}` as keyof typeof chatCommandTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: chatCommandTableSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: chatCommandTableSchema.shape.bValidity_Able },
  { key: 'wAction_Animation_Index', label: 'Action Animation Index', type: 'number' as const, validation: chatCommandTableSchema.shape.wAction_Animation_Index },
  ...chatCommandColumns,
];

