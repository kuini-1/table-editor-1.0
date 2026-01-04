import * as z from 'zod';

export const dwcTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  tblNameIndex: z.coerce.number().min(0, 'Must be a positive number'),
  byLevel_Min: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byLevel_Max: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wAdmission_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byAdmission_Num_Min: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byAdmission_Num_Max: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  prologueCinematicTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  prologueTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  worldTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aConditionTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_0: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_1: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_2: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_3: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_4: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_5: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_6: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_7: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_8: z.coerce.number().min(0, 'Must be a positive number'),
  aMissionTblidx_9: z.coerce.number().min(0, 'Must be a positive number'),
});

export type DwcTableFormData = z.infer<typeof dwcTableSchema>;

export interface DwcTableRow extends DwcTableFormData {
  id: string;
}

const conditionTblidxColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `aConditionTblidx_${i}` as const,
  label: `Condition Table ID ${i}`,
  type: 'number' as const,
  validation: dwcTableSchema.shape[`aConditionTblidx_${i}` as keyof typeof dwcTableSchema.shape] as any,
}));

const missionTblidxColumns = Array.from({ length: 10 }, (_, i) => ({
  key: `aMissionTblidx_${i}` as const,
  label: `Mission Table ID ${i}`,
  type: 'number' as const,
  validation: dwcTableSchema.shape[`aMissionTblidx_${i}` as keyof typeof dwcTableSchema.shape] as any,
}));

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: dwcTableSchema.shape.tblidx },
  { key: 'tblNameIndex', label: 'Name Index', type: 'number' as const, validation: dwcTableSchema.shape.tblNameIndex },
  { key: 'byLevel_Min', label: 'Level Min', type: 'number' as const, validation: dwcTableSchema.shape.byLevel_Min },
  { key: 'byLevel_Max', label: 'Level Max', type: 'number' as const, validation: dwcTableSchema.shape.byLevel_Max },
  { key: 'wAdmission_Bit_Flag', label: 'Admission Bit Flag', type: 'number' as const, validation: dwcTableSchema.shape.wAdmission_Bit_Flag },
  { key: 'byAdmission_Num_Min', label: 'Admission Num Min', type: 'number' as const, validation: dwcTableSchema.shape.byAdmission_Num_Min },
  { key: 'byAdmission_Num_Max', label: 'Admission Num Max', type: 'number' as const, validation: dwcTableSchema.shape.byAdmission_Num_Max },
  { key: 'prologueCinematicTblidx', label: 'Prologue Cinematic Table ID', type: 'number' as const, validation: dwcTableSchema.shape.prologueCinematicTblidx },
  { key: 'prologueTblidx', label: 'Prologue Table ID', type: 'number' as const, validation: dwcTableSchema.shape.prologueTblidx },
  { key: 'worldTblidx', label: 'World Table ID', type: 'number' as const, validation: dwcTableSchema.shape.worldTblidx },
  ...conditionTblidxColumns,
  ...missionTblidxColumns,
];

