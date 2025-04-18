import { z } from "zod";

// Define the schema for the item table
export const itemTableSchema = z.object({
  table_id: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  tblidx: z.number().optional(),
  bvalidity_able: z.boolean().optional(),
  name: z.string().optional(),
  wsznametext: z.string().optional(),
  szicon_name: z.string().optional(),
  bymodel_type: z.number().optional(),
  szmodel: z.string().optional(),
  szsub_weapon_act_model: z.string().optional(),
  byitem_type: z.number().optional(),
  byequip_type: z.number().optional(),
  dwequip_slot_type_bit_flag: z.number().optional(),
  wfunction_bit_flag: z.number().optional(),
  bymax_stack: z.number().optional(),
  byrank: z.number().optional(),
  dwweight: z.number().optional(),
  dwcost: z.number().optional(),
  dwsell_price: z.number().optional(),
  bydurability: z.number().optional(),
  bydurability_count: z.number().optional(),
  bybattle_attribute: z.number().optional(),
  wphysical_offence: z.number().optional(),
  wenergy_offence: z.number().optional(),
  wphysical_defence: z.number().optional(),
  wenergy_defence: z.number().optional(),
  fattack_range_bonus: z.number().optional(),
  wattack_speed_rate: z.number().optional(),
  byneed_min_level: z.number().optional(),
  byneed_max_level: z.number().optional(),
  dwneed_class_bit_flag: z.number().optional(),
  dwneed_gender_bit_flag: z.number().optional(),
  byclass_special: z.number().optional(),
  byrace_special: z.number().optional(),
  wneed_str: z.number().optional(),
  wneed_con: z.number().optional(),
  wneed_foc: z.number().optional(),
  wneed_dex: z.number().optional(),
  wneed_sol: z.number().optional(),
  wneed_eng: z.number().optional(),
  set_item_tblidx: z.number().optional(),
  note: z.string().optional(),
  bybag_size: z.number().optional(),
  wscouter_watt: z.number().optional(),
  dwscouter_maxpower: z.number().optional(),
  byscouter_parts_type1: z.number().optional(),
  byscouter_parts_type2: z.number().optional(),
  byscouter_parts_type3: z.number().optional(),
  byscouter_parts_type4: z.number().optional(),
  use_item_tblidx: z.number().optional(),
  biscanhaveoption: z.boolean().optional(),
  item_option_tblidx: z.number().optional(),
  byitemgroup: z.number().optional(),
  charm_tblidx: z.number().optional(),
  wcostumehidebitflag: z.number().optional(),
  needitemtblidx: z.number().optional(),
  commonpoint: z.number().optional(),
  bycommonpointtype: z.number().optional(),
  byneedfunction: z.number().optional(),
  dwusedurationmax: z.number().optional(),
  bydurationtype: z.number().optional(),
  contentstblidx: z.number().optional(),
  dwdurationgroup: z.number().optional(),
  bydroplevel: z.number().optional(),
  enchantratetblidx: z.number().optional(),
  excellenttblidx: z.number().optional(),
  raretblidx: z.number().optional(),
  legendarytblidx: z.number().optional(),
  bcreatesuperiorable: z.boolean().optional(),
  bcreateexcellentable: z.boolean().optional(),
  bcreaterareable: z.boolean().optional(),
  bcreatelegendaryable: z.boolean().optional(),
  byrestricttype: z.number().optional(),
  fattack_physical_revision: z.number().optional(),
  fattack_energy_revision: z.number().optional(),
  fdefence_physical_revision: z.number().optional(),
  fdefence_energy_revision: z.number().optional(),
  bytmptabtype: z.number().optional(),
  biscanrenewal: z.boolean().optional(),
  wdisassemble_bit_flag: z.number().optional(),
  bydisassemblenormalmin: z.number().optional(),
  bydisassemblenormalmax: z.number().optional(),
  bydisassembleuppermin: z.number().optional(),
  bydisassembleuppermax: z.number().optional(),
  bydropvisual: z.number().optional(),
  byusedisassemble: z.number().optional(),
}); 