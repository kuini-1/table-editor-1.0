import * as z from "zod";

export const useItemSchema = z.object({
  table_id: z.string().uuid().nullable(),
  tblidx: z.coerce.number().nullable(),
  byuse_item_active_type: z.coerce.number().nullable(),
  bybuff_group: z.coerce.number().nullable(),
  bybuffkeeptype: z.coerce.number().nullable(),
  dwcool_time_bit_flag: z.coerce.number().nullable(),
  wfunction_bit_flag: z.coerce.number().nullable(),
  dwuse_restriction_rule_bit_flag: z.coerce.number().nullable(),
  dwuse_allow_rule_bit_flag: z.coerce.number().nullable(),
  byappoint_target: z.coerce.number().nullable(),
  byapply_target: z.coerce.number().nullable(),
  dwapply_target_index: z.coerce.number().nullable(),
  byapply_target_max: z.coerce.number().nullable(),
  byapply_range: z.coerce.number().nullable(),
  byapply_area_size_1: z.coerce.number().nullable(),
  byapply_area_size_2: z.coerce.number().nullable(),
  wneed_state_bit_flag: z.coerce.number().nullable(),
  dwrequire_lp: z.coerce.number().nullable(),
  wrequire_ep: z.coerce.number().nullable(),
  byrequire_rp_ball: z.coerce.number().nullable(),
  fcasting_time: z.coerce.number().nullable(),
  dwcastingtimeinmillisecs: z.coerce.number().nullable(),
  dwcool_time: z.coerce.number().nullable(),
  dwcooltimeinmillisecs: z.coerce.number().nullable(),
  dwkeep_time: z.coerce.number().nullable(),
  dwkeeptimeinmillisecs: z.coerce.number().nullable(),
  bkeep_effect: z.coerce.number().nullable(),
  byuse_range_min: z.coerce.number().nullable(),
  fuse_range_min: z.coerce.number().nullable(),
  byuse_range_max: z.coerce.number().nullable(),
  fuse_range_max: z.coerce.number().nullable(),
  use_info_text: z.string().nullable(),
  szcasting_effect: z.string().nullable(),
  szaction_effect: z.string().nullable(),
  wcasting_animation_start: z.coerce.number().nullable(),
  wcasting_animation_loop: z.coerce.number().nullable(),
  waction_animation_index: z.coerce.number().nullable(),
  waction_loop_animation_index: z.coerce.number().nullable(),
  waction_end_animation_index: z.coerce.number().nullable(),
  bycastingeffectposition: z.coerce.number().nullable(),
  byactioneffectposition: z.coerce.number().nullable(),
  useworldtblidx: z.coerce.number().nullable(),
  fuseloc_x: z.coerce.number().nullable(),
  fuseloc_z: z.coerce.number().nullable(),
  fuseloc_radius: z.coerce.number().nullable(),
  requiredquestid: z.coerce.number().nullable(),
  asystem_effect_0: z.coerce.number().nullable(),
  abysystem_effect_type_0: z.coerce.number().nullable(),
  asystem_effect_value_0: z.coerce.number().nullable(),
  asystem_effect_1: z.coerce.number().nullable(),
  abysystem_effect_type_1: z.coerce.number().nullable(),
  asystem_effect_value_1: z.coerce.number().nullable(),
}); 