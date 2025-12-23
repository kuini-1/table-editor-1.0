import * as z from "zod";

export const systemEffectSchema = z.object({
  table_id: z.string().uuid().nullable(),
  tblidx: z.coerce.number().nullable(),
  wszname: z.string().nullable(),
  byeffect_type: z.coerce.number().nullable(),
  byactive_effect_type: z.coerce.number().nullable(),
  effect_info_text: z.string().nullable(),
  keep_effect_name: z.string().nullable(),
  bytarget_effect_position: z.coerce.number().nullable(),
  szsuccess_effect_name: z.string().nullable(),
  bysuccess_projectile_type: z.coerce.number().nullable(),
  bysuccess_effect_position: z.coerce.number().nullable(),
  szsuccess_end_effect_name: z.string().nullable(),
  byend_effect_position: z.coerce.number().nullable(),
  wkeep_animation_index: z.coerce.number().nullable(),
});

export type SystemEffectFormData = z.infer<typeof systemEffectSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: systemEffectSchema.shape.tblidx },
  { key: 'wszname', label: 'Name', type: 'text' as const, validation: systemEffectSchema.shape.wszname },
  { key: 'byeffect_type', label: 'Effect Type', type: 'number' as const, validation: systemEffectSchema.shape.byeffect_type },
  { key: 'byactive_effect_type', label: 'Active Effect Type', type: 'number' as const, validation: systemEffectSchema.shape.byactive_effect_type },
  { key: 'effect_info_text', label: 'Effect Info', type: 'text' as const, validation: systemEffectSchema.shape.effect_info_text },
  { key: 'keep_effect_name', label: 'Keep Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.keep_effect_name },
  { key: 'bytarget_effect_position', label: 'Target Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.bytarget_effect_position },
  { key: 'wkeep_animation_index', label: 'Keep Animation Index', type: 'number' as const, validation: systemEffectSchema.shape.wkeep_animation_index },
  { key: 'szsuccess_effect_name', label: 'Success Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.szsuccess_effect_name },
  { key: 'bysuccess_projectile_type', label: 'Success Projectile Type', type: 'number' as const, validation: systemEffectSchema.shape.bysuccess_projectile_type },
  { key: 'bysuccess_effect_position', label: 'Success Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.bysuccess_effect_position },
  { key: 'szsuccess_end_effect_name', label: 'Success End Effect Name', type: 'text' as const, validation: systemEffectSchema.shape.szsuccess_end_effect_name },
  { key: 'byend_effect_position', label: 'End Effect Position', type: 'number' as const, validation: systemEffectSchema.shape.byend_effect_position },
]; 