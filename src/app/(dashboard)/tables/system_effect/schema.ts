import * as z from 'zod';

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