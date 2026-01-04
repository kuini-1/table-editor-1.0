import * as z from 'zod';

export const mascotGradeTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwNeedExp: z.coerce.number().min(0, 'Must be a positive number'),
  wBabyFusion: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wAdultFusion: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wLightFusion: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type MascotGradeTableFormData = z.infer<typeof mascotGradeTableSchema>;

export interface MascotGradeTableRow extends MascotGradeTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: mascotGradeTableSchema.shape.tblidx },
  { key: 'dwNeedExp', label: 'Need Exp', type: 'number' as const, validation: mascotGradeTableSchema.shape.dwNeedExp },
  { key: 'wBabyFusion', label: 'Baby Fusion', type: 'number' as const, validation: mascotGradeTableSchema.shape.wBabyFusion },
  { key: 'wAdultFusion', label: 'Adult Fusion', type: 'number' as const, validation: mascotGradeTableSchema.shape.wAdultFusion },
  { key: 'wLightFusion', label: 'Light Fusion', type: 'number' as const, validation: mascotGradeTableSchema.shape.wLightFusion },
];

