/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const questDropTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  aQuestItemTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_0: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_4: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_5: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_6: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_7: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_8: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aQuestItemTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  aDropRate_9: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type QuestDropTableFormData = z.infer<typeof questDropTableSchema>;

export interface QuestDropTableRow extends QuestDropTableFormData {
  id: string;
}

const dropColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `aQuestItemTblidx_${i}` as const, label: `Quest Item ${i}`, type: 'number' as const, validation: questDropTableSchema.shape[`aQuestItemTblidx_${i}` as keyof typeof questDropTableSchema.shape] as any },
  { key: `aDropRate_${i}` as const, label: `Drop Rate ${i}`, type: 'number' as const, validation: questDropTableSchema.shape[`aDropRate_${i}` as keyof typeof questDropTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: questDropTableSchema.shape.tblidx },
  ...dropColumns,
];

