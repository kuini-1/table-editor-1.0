import * as z from 'zod';

export const npcSpeechTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwDialogGroup: z.coerce.number().min(0, 'Must be a positive number'),
  szDialogType: z.string().max(32, 'Cannot exceed 32 characters'),
  byRate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  textIndex: z.coerce.number().min(0, 'Must be a positive number'),
  byBallonType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwDisplayTime: z.coerce.number().min(0, 'Must be a positive number'),
  szNote: z.string().max(64, 'Cannot exceed 64 characters'),
  bySpeechType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type NpcSpeechTableFormData = z.infer<typeof npcSpeechTableSchema>;

export interface NpcSpeechTableRow extends NpcSpeechTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: npcSpeechTableSchema.shape.tblidx },
  { key: 'dwDialogGroup', label: 'Dialog Group', type: 'number' as const, validation: npcSpeechTableSchema.shape.dwDialogGroup },
  { key: 'szDialogType', label: 'Dialog Type', type: 'text' as const, validation: npcSpeechTableSchema.shape.szDialogType },
  { key: 'byRate', label: 'Rate', type: 'number' as const, validation: npcSpeechTableSchema.shape.byRate },
  { key: 'textIndex', label: 'Text Index', type: 'number' as const, validation: npcSpeechTableSchema.shape.textIndex },
  { key: 'byBallonType', label: 'Balloon Type', type: 'number' as const, validation: npcSpeechTableSchema.shape.byBallonType },
  { key: 'dwDisplayTime', label: 'Display Time', type: 'number' as const, validation: npcSpeechTableSchema.shape.dwDisplayTime },
  { key: 'szNote', label: 'Note', type: 'text' as const, validation: npcSpeechTableSchema.shape.szNote },
  { key: 'bySpeechType', label: 'Speech Type', type: 'number' as const, validation: npcSpeechTableSchema.shape.bySpeechType },
];

