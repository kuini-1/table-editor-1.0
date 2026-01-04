import * as z from 'zod';

export const actionTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  bValidity_Able: z.boolean(),
  byAction_Type: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  Action_Name: z.coerce.number().min(0, 'Must be a positive number'),
  szIcon_Name: z.string().max(32, 'Cannot exceed 32 characters'),
  Note: z.coerce.number().min(0, 'Must be a positive number'),
  chat_Command_Index: z.coerce.number().min(0, 'Must be a positive number'),
  byETC_Action_Type: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type ActionTableFormData = z.infer<typeof actionTableSchema>;

export interface ActionTableRow extends ActionTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: actionTableSchema.shape.tblidx },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: actionTableSchema.shape.bValidity_Able },
  { key: 'byAction_Type', label: 'Action Type', type: 'number' as const, validation: actionTableSchema.shape.byAction_Type },
  { key: 'Action_Name', label: 'Action Name', type: 'number' as const, validation: actionTableSchema.shape.Action_Name },
  { key: 'szIcon_Name', label: 'Icon Name', type: 'text' as const, validation: actionTableSchema.shape.szIcon_Name },
  { key: 'Note', label: 'Note', type: 'number' as const, validation: actionTableSchema.shape.Note },
  { key: 'chat_Command_Index', label: 'Chat Command Index', type: 'number' as const, validation: actionTableSchema.shape.chat_Command_Index },
  { key: 'byETC_Action_Type', label: 'ETC Action Type', type: 'number' as const, validation: actionTableSchema.shape.byETC_Action_Type },
];

