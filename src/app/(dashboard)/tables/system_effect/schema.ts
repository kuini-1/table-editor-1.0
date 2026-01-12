import * as z from "zod";

export const systemEffectSchema = z.object({
  table_id: z.string().uuid().nullable(),
  tblidx: z.coerce.number().nullable(),
  wszName: z.string().nullable().transform(e => e === null ? "" : e),
  byEffect_Type: z.coerce.number().nullable(),
  byActive_Effect_Type: z.coerce.number().nullable(),
  Effect_Info_Text: z.string().nullable().transform(e => e === null ? "" : e),
  Keep_Effect_Name: z.string().nullable().transform(e => e === null ? "" : e),
  byTarget_Effect_Position: z.coerce.number().nullable(),
  szSuccess_Effect_Name: z.string().nullable().transform(e => e === null ? "" : e),
  bySuccess_Projectile_Type: z.coerce.number().nullable(),
  bySuccess_Effect_Position: z.coerce.number().nullable(),
  szSuccess_End_Effect_Name: z.string().nullable().transform(e => e === null ? "" : e),
  byEnd_Effect_Position: z.coerce.number().nullable(),
  wKeep_Animation_Index: z.coerce.number().nullable(),
});

export type SystemEffectFormData = z.infer<typeof systemEffectSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: systemEffectSchema.shape.tblidx },
  { key: 'wszName', label: 'Name', type: 'text' as const, validation: systemEffectSchema.shape.wszName },
  { key: 'byEffect_Type', label: 'Effect Type', type: 'number' as const, validation: systemEffectSchema.shape.byEffect_Type },
  { key: 'byActive_Effect_Type', label: 'Active Effect Type', type: 'number' as const, validation: systemEffectSchema.shape.byActive_Effect_Type },
  { key: 'Effect_Info_Text', label: 'Effect Info', type: 'text' as const, validation: systemEffectSchema.shape.Effect_Info_Text },
  { key: 'Keep_Effect_Name', label: 'Keep Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.Keep_Effect_Name },
  { key: 'byTarget_Effect_Position', label: 'Target Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.byTarget_Effect_Position },
  { key: 'szSuccess_Effect_Name', label: 'Success Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.szSuccess_Effect_Name },
  { key: 'bySuccess_Projectile_Type', label: 'Success Projectile Type', type: 'number' as const, validation: systemEffectSchema.shape.bySuccess_Projectile_Type },
  { key: 'bySuccess_Effect_Position', label: 'Success Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.bySuccess_Effect_Position },
  { key: 'szSuccess_End_Effect_Name', label: 'Success End Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.szSuccess_End_Effect_Name },
  { key: 'byEnd_Effect_Position', label: 'End Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.byEnd_Effect_Position },
  { key: 'wKeep_Animation_Index', label: 'Keep Animation Index', type: 'number' as const, validation: systemEffectSchema.shape.wKeep_Animation_Index },
];
