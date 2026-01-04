import * as z from 'zod';

export const charmTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wDrop_Rate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wEXP: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wRP_Sharing: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wCool_Time: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wKeep_Time: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwKeep_Time_In_Millisecs: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Zenny: z.coerce.number().min(0, 'Must be a positive number'),
  byDice_Min: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byDice_Max: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byCharm_Type_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type CharmTableFormData = z.infer<typeof charmTableSchema>;

export interface CharmTableRow extends CharmTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: charmTableSchema.shape.tblidx },
  { key: 'wDrop_Rate', label: 'Drop Rate', type: 'number' as const, validation: charmTableSchema.shape.wDrop_Rate },
  { key: 'wEXP', label: 'EXP', type: 'number' as const, validation: charmTableSchema.shape.wEXP },
  { key: 'wRP_Sharing', label: 'RP Sharing', type: 'number' as const, validation: charmTableSchema.shape.wRP_Sharing },
  { key: 'wCool_Time', label: 'Cool Time', type: 'number' as const, validation: charmTableSchema.shape.wCool_Time },
  { key: 'wKeep_Time', label: 'Keep Time', type: 'number' as const, validation: charmTableSchema.shape.wKeep_Time },
  { key: 'dwKeep_Time_In_Millisecs', label: 'Keep Time (ms)', type: 'number' as const, validation: charmTableSchema.shape.dwKeep_Time_In_Millisecs },
  { key: 'dwNeed_Zenny', label: 'Need Zenny', type: 'number' as const, validation: charmTableSchema.shape.dwNeed_Zenny },
  { key: 'byDice_Min', label: 'Dice Min', type: 'number' as const, validation: charmTableSchema.shape.byDice_Min },
  { key: 'byDice_Max', label: 'Dice Max', type: 'number' as const, validation: charmTableSchema.shape.byDice_Max },
  { key: 'byCharm_Type_Bit_Flag', label: 'Charm Type Bit Flag', type: 'number' as const, validation: charmTableSchema.shape.byCharm_Type_Bit_Flag },
];

