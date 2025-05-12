import { z } from "zod";

// Define the schema for the item table
export const itemTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  name: z.string().min(1, 'Name is required'),
  wsznametext: z.string().min(1, 'Display name is required'),
  szicon_name: z.string().min(1, 'Icon name is required'),
  byitem_type: z.coerce.number().min(0, 'Must be a positive number'),
  byequip_type: z.coerce.number().min(0, 'Must be a positive number'),
  byrank: z.coerce.number().min(0, 'Must be a positive number'),
  dwcost: z.coerce.number().min(0, 'Must be a positive number'),
  dwsell_price: z.coerce.number().min(0, 'Must be a positive number'),
  bvalidity_able: z.boolean(),
  biscanhaveoption: z.boolean(),
  bcreatesuperiorable: z.boolean(),
  bcreateexcellentable: z.boolean(),
  bcreaterareable: z.boolean(),
  bcreatelegendaryable: z.boolean(),
  biscanrenewal: z.boolean(),
  // Additional fields with proper validation
  bymodel_type: z.coerce.number().min(0, 'Must be a positive number'),
  szmodel: z.string(),
  szsub_weapon_act_model: z.string(),
  dwequip_slot_type_bit_flag: z.coerce.number().min(0, 'Must be a positive number'),
  wfunction_bit_flag: z.coerce.number().min(0, 'Must be a positive number'),
  bymax_stack: z.coerce.number().min(0, 'Must be a positive number'),
  dwweight: z.coerce.number().min(0, 'Must be a positive number'),
  bydurability: z.coerce.number().min(0, 'Must be a positive number'),
  bydurability_count: z.coerce.number().min(0, 'Must be a positive number'),
  bybattle_attribute: z.coerce.number().min(0, 'Must be a positive number'),
  wphysical_offence: z.coerce.number().min(0, 'Must be a positive number'),
  wenergy_offence: z.coerce.number().min(0, 'Must be a positive number'),
  wphysical_defence: z.coerce.number().min(0, 'Must be a positive number'),
  wenergy_defence: z.coerce.number().min(0, 'Must be a positive number'),
  fattack_range_bonus: z.coerce.number(),
  wattack_speed_rate: z.coerce.number().min(0, 'Must be a positive number'),
  byneed_min_level: z.coerce.number().min(0, 'Must be a positive number'),
  byneed_max_level: z.coerce.number().min(0, 'Must be a positive number'),
  dwneed_class_bit_flag: z.coerce.number().min(0, 'Must be a positive number'),
  dwneed_gender_bit_flag: z.coerce.number().min(0, 'Must be a positive number'),
  byclass_special: z.coerce.number().min(0, 'Must be a positive number'),
  byrace_special: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_str: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_con: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_foc: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_dex: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_sol: z.coerce.number().min(0, 'Must be a positive number'),
  wneed_eng: z.coerce.number().min(0, 'Must be a positive number'),
  set_item_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  note: z.string(),
  bybag_size: z.coerce.number().min(0, 'Must be a positive number'),
  wscouter_watt: z.coerce.number().min(0, 'Must be a positive number'),
  dwscouter_maxpower: z.coerce.number().min(0, 'Must be a positive number'),
  byscouter_parts_type1: z.coerce.number().min(0, 'Must be a positive number'),
  byscouter_parts_type2: z.coerce.number().min(0, 'Must be a positive number'),
  byscouter_parts_type3: z.coerce.number().min(0, 'Must be a positive number'),
  byscouter_parts_type4: z.coerce.number().min(0, 'Must be a positive number'),
  use_item_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  item_option_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  byitemgroup: z.coerce.number().min(0, 'Must be a positive number'),
  charm_tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  wcostumehidebitflag: z.coerce.number().min(0, 'Must be a positive number'),
  needitemtblidx: z.coerce.number().min(0, 'Must be a positive number'),
  commonpoint: z.coerce.number().min(0, 'Must be a positive number'),
  bycommonpointtype: z.coerce.number().min(0, 'Must be a positive number'),
  byneedfunction: z.coerce.number().min(0, 'Must be a positive number'),
  dwusedurationmax: z.coerce.number().min(0, 'Must be a positive number'),
  bydurationtype: z.coerce.number().min(0, 'Must be a positive number'),
  contentstblidx: z.coerce.number().min(0, 'Must be a positive number'),
  dwdurationgroup: z.coerce.number().min(0, 'Must be a positive number'),
  bydroplevel: z.coerce.number().min(0, 'Must be a positive number'),
  enchantratetblidx: z.coerce.number().min(0, 'Must be a positive number'),
  excellenttblidx: z.coerce.number().min(0, 'Must be a positive number'),
  raretblidx: z.coerce.number().min(0, 'Must be a positive number'),
  legendarytblidx: z.coerce.number().min(0, 'Must be a positive number'),
  byrestricttype: z.coerce.number().min(0, 'Must be a positive number'),
  fattack_physical_revision: z.coerce.number(),
  fattack_energy_revision: z.coerce.number(),
  fdefence_physical_revision: z.coerce.number(),
  fdefence_energy_revision: z.coerce.number(),
  bytmptabtype: z.coerce.number().min(0, 'Must be a positive number'),
  wdisassemble_bit_flag: z.coerce.number().min(0, 'Must be a positive number'),
  bydisassemblenormalmin: z.coerce.number().min(0, 'Must be a positive number'),
  bydisassemblenormalmax: z.coerce.number().min(0, 'Must be a positive number'),
  bydisassembleuppermin: z.coerce.number().min(0, 'Must be a positive number'),
  bydisassembleuppermax: z.coerce.number().min(0, 'Must be a positive number'),
  bydropvisual: z.coerce.number().min(0, 'Must be a positive number'),
  byusedisassemble: z.coerce.number().min(0, 'Must be a positive number'),
});

export type ItemTableFormData = z.infer<typeof itemTableSchema>;

export interface ItemTableRow extends ItemTableFormData {
  id: string;
}

// Organize columns into logical groups
export const columns = [
  // Basic Information
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: itemTableSchema.shape.tblidx },
  { key: 'name', label: 'Name', type: 'text' as const, validation: itemTableSchema.shape.name },
  { key: 'wsznametext', label: 'Display Name', type: 'text' as const, validation: itemTableSchema.shape.wsznametext },
  { key: 'szicon_name', label: 'Icon Name', type: 'text' as const, validation: itemTableSchema.shape.szicon_name },
  { key: 'byitem_type', label: 'Item Type', type: 'number' as const, validation: itemTableSchema.shape.byitem_type },
  { key: 'byequip_type', label: 'Equip Type', type: 'number' as const, validation: itemTableSchema.shape.byequip_type },
  { key: 'byrank', label: 'Rank', type: 'number' as const, validation: itemTableSchema.shape.byrank },
  { key: 'dwcost', label: 'Cost', type: 'number' as const, validation: itemTableSchema.shape.dwcost },
  { key: 'dwsell_price', label: 'Sell Price', type: 'number' as const, validation: itemTableSchema.shape.dwsell_price },
  
  // Boolean Flags
  { key: 'bvalidity_able', label: 'Valid', type: 'boolean' as const, validation: itemTableSchema.shape.bvalidity_able },
  { key: 'biscanhaveoption', label: 'Can Have Option', type: 'boolean' as const, validation: itemTableSchema.shape.biscanhaveoption },
  { key: 'bcreatesuperiorable', label: 'Can Create Superior', type: 'boolean' as const, validation: itemTableSchema.shape.bcreatesuperiorable },
  { key: 'bcreateexcellentable', label: 'Can Create Excellent', type: 'boolean' as const, validation: itemTableSchema.shape.bcreateexcellentable },
  { key: 'bcreaterareable', label: 'Can Create Rare', type: 'boolean' as const, validation: itemTableSchema.shape.bcreaterareable },
  { key: 'bcreatelegendaryable', label: 'Can Create Legendary', type: 'boolean' as const, validation: itemTableSchema.shape.bcreatelegendaryable },
  { key: 'biscanrenewal', label: 'Can Renewal', type: 'boolean' as const, validation: itemTableSchema.shape.biscanrenewal },
  
  // Model Information
  { key: 'bymodel_type', label: 'Model Type', type: 'number' as const, validation: itemTableSchema.shape.bymodel_type },
  { key: 'szmodel', label: 'Model', type: 'text' as const, validation: itemTableSchema.shape.szmodel },
  { key: 'szsub_weapon_act_model', label: 'Sub Weapon Model', type: 'text' as const, validation: itemTableSchema.shape.szsub_weapon_act_model },
  
  // Equipment Properties
  { key: 'dwequip_slot_type_bit_flag', label: 'Equip Slot Type', type: 'number' as const, validation: itemTableSchema.shape.dwequip_slot_type_bit_flag },
  { key: 'wfunction_bit_flag', label: 'Function Flag', type: 'number' as const, validation: itemTableSchema.shape.wfunction_bit_flag },
  { key: 'bymax_stack', label: 'Max Stack', type: 'number' as const, validation: itemTableSchema.shape.bymax_stack },
  { key: 'dwweight', label: 'Weight', type: 'number' as const, validation: itemTableSchema.shape.dwweight },
  { key: 'bydurability', label: 'Durability', type: 'number' as const, validation: itemTableSchema.shape.bydurability },
  { key: 'bydurability_count', label: 'Durability Count', type: 'number' as const, validation: itemTableSchema.shape.bydurability_count },
  
  // Battle Attributes
  { key: 'bybattle_attribute', label: 'Battle Attribute', type: 'number' as const, validation: itemTableSchema.shape.bybattle_attribute },
  { key: 'wphysical_offence', label: 'Physical Offence', type: 'number' as const, validation: itemTableSchema.shape.wphysical_offence },
  { key: 'wenergy_offence', label: 'Energy Offence', type: 'number' as const, validation: itemTableSchema.shape.wenergy_offence },
  { key: 'wphysical_defence', label: 'Physical Defence', type: 'number' as const, validation: itemTableSchema.shape.wphysical_defence },
  { key: 'wenergy_defence', label: 'Energy Defence', type: 'number' as const, validation: itemTableSchema.shape.wenergy_defence },
  { key: 'fattack_range_bonus', label: 'Attack Range Bonus', type: 'number' as const, validation: itemTableSchema.shape.fattack_range_bonus },
  { key: 'wattack_speed_rate', label: 'Attack Speed Rate', type: 'number' as const, validation: itemTableSchema.shape.wattack_speed_rate },
  
  // Requirements
  { key: 'byneed_min_level', label: 'Min Level', type: 'number' as const, validation: itemTableSchema.shape.byneed_min_level },
  { key: 'byneed_max_level', label: 'Max Level', type: 'number' as const, validation: itemTableSchema.shape.byneed_max_level },
  { key: 'dwneed_class_bit_flag', label: 'Class Requirement', type: 'number' as const, validation: itemTableSchema.shape.dwneed_class_bit_flag },
  { key: 'dwneed_gender_bit_flag', label: 'Gender Requirement', type: 'number' as const, validation: itemTableSchema.shape.dwneed_gender_bit_flag },
  { key: 'byclass_special', label: 'Class Special', type: 'number' as const, validation: itemTableSchema.shape.byclass_special },
  { key: 'byrace_special', label: 'Race Special', type: 'number' as const, validation: itemTableSchema.shape.byrace_special },
  { key: 'wneed_str', label: 'STR Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_str },
  { key: 'wneed_con', label: 'CON Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_con },
  { key: 'wneed_foc', label: 'FOC Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_foc },
  { key: 'wneed_dex', label: 'DEX Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_dex },
  { key: 'wneed_sol', label: 'SOL Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_sol },
  { key: 'wneed_eng', label: 'ENG Requirement', type: 'number' as const, validation: itemTableSchema.shape.wneed_eng },
  
  // Additional Properties
  { key: 'set_item_tblidx', label: 'Set Item ID', type: 'number' as const, validation: itemTableSchema.shape.set_item_tblidx },
  { key: 'note', label: 'Note', type: 'text' as const, validation: itemTableSchema.shape.note },
  { key: 'bybag_size', label: 'Bag Size', type: 'number' as const, validation: itemTableSchema.shape.bybag_size },
  
  // Scouter Properties
  { key: 'wscouter_watt', label: 'Scouter Watt', type: 'number' as const, validation: itemTableSchema.shape.wscouter_watt },
  { key: 'dwscouter_maxpower', label: 'Scouter Max Power', type: 'number' as const, validation: itemTableSchema.shape.dwscouter_maxpower },
  { key: 'byscouter_parts_type1', label: 'Scouter Part 1', type: 'number' as const, validation: itemTableSchema.shape.byscouter_parts_type1 },
  { key: 'byscouter_parts_type2', label: 'Scouter Part 2', type: 'number' as const, validation: itemTableSchema.shape.byscouter_parts_type2 },
  { key: 'byscouter_parts_type3', label: 'Scouter Part 3', type: 'number' as const, validation: itemTableSchema.shape.byscouter_parts_type3 },
  { key: 'byscouter_parts_type4', label: 'Scouter Part 4', type: 'number' as const, validation: itemTableSchema.shape.byscouter_parts_type4 },
  
  // Item References
  { key: 'use_item_tblidx', label: 'Use Item ID', type: 'number' as const, validation: itemTableSchema.shape.use_item_tblidx },
  { key: 'item_option_tblidx', label: 'Item Option ID', type: 'number' as const, validation: itemTableSchema.shape.item_option_tblidx },
  { key: 'byitemgroup', label: 'Item Group', type: 'number' as const, validation: itemTableSchema.shape.byitemgroup },
  { key: 'charm_tblidx', label: 'Charm ID', type: 'number' as const, validation: itemTableSchema.shape.charm_tblidx },
  { key: 'wcostumehidebitflag', label: 'Costume Hide Flag', type: 'number' as const, validation: itemTableSchema.shape.wcostumehidebitflag },
  { key: 'needitemtblidx', label: 'Required Item ID', type: 'number' as const, validation: itemTableSchema.shape.needitemtblidx },
  
  // Points and Function
  { key: 'commonpoint', label: 'Common Point', type: 'number' as const, validation: itemTableSchema.shape.commonpoint },
  { key: 'bycommonpointtype', label: 'Common Point Type', type: 'number' as const, validation: itemTableSchema.shape.bycommonpointtype },
  { key: 'byneedfunction', label: 'Required Function', type: 'number' as const, validation: itemTableSchema.shape.byneedfunction },
  
  // Duration and Content
  { key: 'dwusedurationmax', label: 'Use Duration Max', type: 'number' as const, validation: itemTableSchema.shape.dwusedurationmax },
  { key: 'bydurationtype', label: 'Duration Type', type: 'number' as const, validation: itemTableSchema.shape.bydurationtype },
  { key: 'contentstblidx', label: 'Contents ID', type: 'number' as const, validation: itemTableSchema.shape.contentstblidx },
  { key: 'dwdurationgroup', label: 'Duration Group', type: 'number' as const, validation: itemTableSchema.shape.dwdurationgroup },
  
  // Drop and Enchant
  { key: 'bydroplevel', label: 'Drop Level', type: 'number' as const, validation: itemTableSchema.shape.bydroplevel },
  { key: 'enchantratetblidx', label: 'Enchant Rate ID', type: 'number' as const, validation: itemTableSchema.shape.enchantratetblidx },
  { key: 'excellenttblidx', label: 'Excellent ID', type: 'number' as const, validation: itemTableSchema.shape.excellenttblidx },
  { key: 'raretblidx', label: 'Rare ID', type: 'number' as const, validation: itemTableSchema.shape.raretblidx },
  { key: 'legendarytblidx', label: 'Legendary ID', type: 'number' as const, validation: itemTableSchema.shape.legendarytblidx },
  
  // Restrictions and Revisions
  { key: 'byrestricttype', label: 'Restrict Type', type: 'number' as const, validation: itemTableSchema.shape.byrestricttype },
  { key: 'fattack_physical_revision', label: 'Physical Attack Revision', type: 'number' as const, validation: itemTableSchema.shape.fattack_physical_revision },
  { key: 'fattack_energy_revision', label: 'Energy Attack Revision', type: 'number' as const, validation: itemTableSchema.shape.fattack_energy_revision },
  { key: 'fdefence_physical_revision', label: 'Physical Defence Revision', type: 'number' as const, validation: itemTableSchema.shape.fdefence_physical_revision },
  { key: 'fdefence_energy_revision', label: 'Energy Defence Revision', type: 'number' as const, validation: itemTableSchema.shape.fdefence_energy_revision },
  
  // Misc Properties
  { key: 'bytmptabtype', label: 'Temp Tab Type', type: 'number' as const, validation: itemTableSchema.shape.bytmptabtype },
  { key: 'wdisassemble_bit_flag', label: 'Disassemble Flag', type: 'number' as const, validation: itemTableSchema.shape.wdisassemble_bit_flag },
  { key: 'bydisassemblenormalmin', label: 'Normal Disassemble Min', type: 'number' as const, validation: itemTableSchema.shape.bydisassemblenormalmin },
  { key: 'bydisassemblenormalmax', label: 'Normal Disassemble Max', type: 'number' as const, validation: itemTableSchema.shape.bydisassemblenormalmax },
  { key: 'bydisassembleuppermin', label: 'Upper Disassemble Min', type: 'number' as const, validation: itemTableSchema.shape.bydisassembleuppermin },
  { key: 'bydisassembleuppermax', label: 'Upper Disassemble Max', type: 'number' as const, validation: itemTableSchema.shape.bydisassembleuppermax },
  { key: 'bydropvisual', label: 'Drop Visual', type: 'number' as const, validation: itemTableSchema.shape.bydropvisual },
  { key: 'byusedisassemble', label: 'Use Disassemble', type: 'number' as const, validation: itemTableSchema.shape.byusedisassemble },
]; 