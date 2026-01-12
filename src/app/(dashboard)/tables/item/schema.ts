import { z } from "zod";

// Define the schema for the item table
export const itemTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  Name: z.coerce.number().min(0, 'Must be a positive number'),
  wszNameText: z.string().min(1, 'Display name is required'),
  szIcon_Name: z.string().min(1, 'Icon name is required'),
  byModel_Type: z.coerce.number().min(0, 'Must be a positive number'),
  szModel: z.preprocess((val) => val === null || val === undefined ? '' : val, z.string()),
  szSub_Weapon_Act_Model: z.preprocess((val) => val === null || val === undefined ? '' : val, z.string()),
  byItem_Type: z.coerce.number().min(0, 'Must be a positive number'),
  byEquip_Type: z.coerce.number().min(0, 'Must be a positive number'),
  dwEquip_Slot_Type_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  wFunction_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  byMax_Stack: z.coerce.number().min(0, 'Must be a positive number'),
  byRank: z.coerce.number().min(0, 'Must be a positive number'),
  dwWeight: z.coerce.number().min(0, 'Must be a positive number'),
  dwCost: z.coerce.number().min(0, 'Must be a positive number'),
  dwSell_Price: z.coerce.number().min(0, 'Must be a positive number'),
  byDurability: z.coerce.number().min(0, 'Must be a positive number'),
  byDurability_Count: z.coerce.number().min(0, 'Must be a positive number'),
  byBattle_Attribute: z.coerce.number().min(0, 'Must be a positive number'),
  wPhysical_Offence: z.coerce.number().min(0, 'Must be a positive number'),
  wEnergy_Offence: z.coerce.number().min(0, 'Must be a positive number'),
  wPhysical_Defence: z.coerce.number().min(0, 'Must be a positive number'),
  wEnergy_Defence: z.coerce.number().min(0, 'Must be a positive number'),
  fAttack_Range_Bonus: z.coerce.number(),
  wAttack_Speed_Rate: z.coerce.number().min(0, 'Must be a positive number'),
  byNeed_Min_Level: z.coerce.number().min(0, 'Must be a positive number'),
  byNeed_Max_Level: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Class_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Gender_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  byClass_Special: z.coerce.number().min(0, 'Must be a positive number'),
  byRace_Special: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Str: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Con: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Foc: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Dex: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Sol: z.coerce.number().min(0, 'Must be a positive number'),
  wNeed_Eng: z.coerce.number().min(0, 'Must be a positive number'),
  set_Item_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  Note: z.coerce.number().min(0, 'Must be a positive number'),
  byBag_Size: z.coerce.number().min(0, 'Must be a positive number'),
  wScouter_Watt: z.coerce.number().min(0, 'Must be a positive number'),
  dwScouter_MaxPower: z.coerce.number().min(0, 'Must be a positive number'),
  byScouter_Parts_Type1: z.coerce.number().min(0, 'Must be a positive number'),
  byScouter_Parts_Type2: z.coerce.number().min(0, 'Must be a positive number'),
  byScouter_Parts_Type3: z.coerce.number().min(0, 'Must be a positive number'),
  byScouter_Parts_Type4: z.coerce.number().min(0, 'Must be a positive number'),
  Use_Item_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  bIsCanHaveOption: z.coerce.boolean().transform(val => val ? 1 : 0),
  Item_Option_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  byItemGroup: z.coerce.number().min(0, 'Must be a positive number'),
  Charm_Tblidx: z.coerce.number().min(0, 'Must be a positive number'),
  wCostumeHideBitFlag: z.coerce.number().min(0, 'Must be a positive number'),
  NeedItemTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  CommonPoint: z.coerce.number().min(0, 'Must be a positive number'),
  byCommonPointType: z.coerce.number().min(0, 'Must be a positive number'),
  byNeedFunction: z.coerce.number().min(0, 'Must be a positive number'),
  dwUseDurationMax: z.coerce.number().min(0, 'Must be a positive number'),
  byDurationType: z.coerce.number().min(0, 'Must be a positive number'),
  contentsTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  dwDurationGroup: z.coerce.number().min(0, 'Must be a positive number'),
  byDropLevel: z.coerce.number().min(0, 'Must be a positive number'),
  enchantRateTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  excellentTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  rareTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  legendaryTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  bCreateSuperiorAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  bCreateExcellentAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  bCreateRareAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  bCreateLegendaryAble: z.coerce.boolean().transform(val => val ? 1 : 0),
  byRestrictType: z.coerce.number().min(0, 'Must be a positive number'),
  fAttack_Physical_Revision: z.coerce.number(),
  fAttack_Energy_Revision: z.coerce.number(),
  fDefence_Physical_Revision: z.coerce.number(),
  fDefence_Energy_Revision: z.coerce.number(),
  byTmpTabType: z.coerce.number().min(0, 'Must be a positive number'),
  bIsCanRenewal: z.coerce.boolean().transform(val => val ? 1 : 0),
  wDisassemble_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  byDisassembleNormalMin: z.coerce.number().min(0, 'Must be a positive number'),
  byDisassembleNormalMax: z.coerce.number().min(0, 'Must be a positive number'),
  byDisassembleUpperMin: z.coerce.number().min(0, 'Must be a positive number'),
  byDisassembleUpperMax: z.coerce.number().min(0, 'Must be a positive number'),
  byDropVisual: z.coerce.number().min(0, 'Must be a positive number'),
  byUseDisassemble: z.coerce.number().min(0, 'Must be a positive number'),
  bValidity_Able: z.coerce.boolean().transform(val => val ? 1 : 0),
});

export type ItemTableFormData = z.infer<typeof itemTableSchema>;

export interface ItemTableRow extends ItemTableFormData {
  id: string;
}

// Organize columns into logical groups
export const columns = [
  // Basic Information
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: itemTableSchema.shape.tblidx },
  { key: 'Name', label: 'Name', type: 'number' as const, validation: itemTableSchema.shape.Name },
  { key: 'wszNameText', label: 'Display Name', type: 'text' as const, validation: itemTableSchema.shape.wszNameText },
  { key: 'szIcon_Name', label: 'Icon Name', type: 'text' as const, validation: itemTableSchema.shape.szIcon_Name },
  { key: 'byItem_Type', label: 'Item Type', type: 'number' as const, validation: itemTableSchema.shape.byItem_Type },
  { key: 'byEquip_Type', label: 'Equip Type', type: 'number' as const, validation: itemTableSchema.shape.byEquip_Type },
  { key: 'byRank', label: 'Rank', type: 'number' as const, validation: itemTableSchema.shape.byRank },
  { key: 'dwCost', label: 'Cost', type: 'number' as const, validation: itemTableSchema.shape.dwCost },
  { key: 'dwSell_Price', label: 'Sell Price', type: 'number' as const, validation: itemTableSchema.shape.dwSell_Price },
  
  // Boolean Flags
  { key: 'bValidity_Able', label: 'Valid', type: 'boolean' as const, validation: itemTableSchema.shape.bValidity_Able },
  { key: 'bIsCanHaveOption', label: 'Can Have Option', type: 'boolean' as const, validation: itemTableSchema.shape.bIsCanHaveOption },
  { key: 'bCreateSuperiorAble', label: 'Can Create Superior', type: 'boolean' as const, validation: itemTableSchema.shape.bCreateSuperiorAble },
  { key: 'bCreateExcellentAble', label: 'Can Create Excellent', type: 'boolean' as const, validation: itemTableSchema.shape.bCreateExcellentAble },
  { key: 'bCreateRareAble', label: 'Can Create Rare', type: 'boolean' as const, validation: itemTableSchema.shape.bCreateRareAble },
  { key: 'bCreateLegendaryAble', label: 'Can Create Legendary', type: 'boolean' as const, validation: itemTableSchema.shape.bCreateLegendaryAble },
  { key: 'bIsCanRenewal', label: 'Can Renewal', type: 'boolean' as const, validation: itemTableSchema.shape.bIsCanRenewal },
  
  // Model Information
  { key: 'byModel_Type', label: 'Model Type', type: 'number' as const, validation: itemTableSchema.shape.byModel_Type },
  { key: 'szModel', label: 'Model', type: 'text' as const, validation: itemTableSchema.shape.szModel },
  { key: 'szSub_Weapon_Act_Model', label: 'Sub Weapon Model', type: 'text' as const, validation: itemTableSchema.shape.szSub_Weapon_Act_Model },
  
  // Equipment Properties
  { key: 'dwEquip_Slot_Type_Bit_Flag', label: 'Equip Slot Type', type: 'number' as const, validation: itemTableSchema.shape.dwEquip_Slot_Type_Bit_Flag },
  { key: 'wFunction_Bit_Flag', label: 'Function Flag', type: 'number' as const, validation: itemTableSchema.shape.wFunction_Bit_Flag },
  { key: 'byMax_Stack', label: 'Max Stack', type: 'number' as const, validation: itemTableSchema.shape.byMax_Stack },
  { key: 'dwWeight', label: 'Weight', type: 'number' as const, validation: itemTableSchema.shape.dwWeight },
  { key: 'byDurability', label: 'Durability', type: 'number' as const, validation: itemTableSchema.shape.byDurability },
  { key: 'byDurability_Count', label: 'Durability Count', type: 'number' as const, validation: itemTableSchema.shape.byDurability_Count },
  
  // Battle Attributes
  { key: 'byBattle_Attribute', label: 'Battle Attribute', type: 'number' as const, validation: itemTableSchema.shape.byBattle_Attribute },
  { key: 'wPhysical_Offence', label: 'Physical Offence', type: 'number' as const, validation: itemTableSchema.shape.wPhysical_Offence },
  { key: 'wEnergy_Offence', label: 'Energy Offence', type: 'number' as const, validation: itemTableSchema.shape.wEnergy_Offence },
  { key: 'wPhysical_Defence', label: 'Physical Defence', type: 'number' as const, validation: itemTableSchema.shape.wPhysical_Defence },
  { key: 'wEnergy_Defence', label: 'Energy Defence', type: 'number' as const, validation: itemTableSchema.shape.wEnergy_Defence },
  { key: 'fAttack_Range_Bonus', label: 'Attack Range Bonus', type: 'number' as const, validation: itemTableSchema.shape.fAttack_Range_Bonus },
  { key: 'wAttack_Speed_Rate', label: 'Attack Speed Rate', type: 'number' as const, validation: itemTableSchema.shape.wAttack_Speed_Rate },
  
  // Requirements
  { key: 'byNeed_Min_Level', label: 'Min Level', type: 'number' as const, validation: itemTableSchema.shape.byNeed_Min_Level },
  { key: 'byNeed_Max_Level', label: 'Max Level', type: 'number' as const, validation: itemTableSchema.shape.byNeed_Max_Level },
  { key: 'dwNeed_Class_Bit_Flag', label: 'Class Requirement', type: 'number' as const, validation: itemTableSchema.shape.dwNeed_Class_Bit_Flag },
  { key: 'dwNeed_Gender_Bit_Flag', label: 'Gender Requirement', type: 'number' as const, validation: itemTableSchema.shape.dwNeed_Gender_Bit_Flag },
  { key: 'byClass_Special', label: 'Class Special', type: 'number' as const, validation: itemTableSchema.shape.byClass_Special },
  { key: 'byRace_Special', label: 'Race Special', type: 'number' as const, validation: itemTableSchema.shape.byRace_Special },
  { key: 'wNeed_Str', label: 'STR Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Str },
  { key: 'wNeed_Con', label: 'CON Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Con },
  { key: 'wNeed_Foc', label: 'FOC Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Foc },
  { key: 'wNeed_Dex', label: 'DEX Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Dex },
  { key: 'wNeed_Sol', label: 'SOL Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Sol },
  { key: 'wNeed_Eng', label: 'ENG Requirement', type: 'number' as const, validation: itemTableSchema.shape.wNeed_Eng },
  
  // Additional Properties
  { key: 'set_Item_Tblidx', label: 'Set Item ID', type: 'number' as const, validation: itemTableSchema.shape.set_Item_Tblidx },
  { key: 'Note', label: 'Note', type: 'number' as const, validation: itemTableSchema.shape.Note },
  { key: 'byBag_Size', label: 'Bag Size', type: 'number' as const, validation: itemTableSchema.shape.byBag_Size },
  
  // Scouter Properties
  { key: 'wScouter_Watt', label: 'Scouter Watt', type: 'number' as const, validation: itemTableSchema.shape.wScouter_Watt },
  { key: 'dwScouter_MaxPower', label: 'Scouter Max Power', type: 'number' as const, validation: itemTableSchema.shape.dwScouter_MaxPower },
  { key: 'byScouter_Parts_Type1', label: 'Scouter Part 1', type: 'number' as const, validation: itemTableSchema.shape.byScouter_Parts_Type1 },
  { key: 'byScouter_Parts_Type2', label: 'Scouter Part 2', type: 'number' as const, validation: itemTableSchema.shape.byScouter_Parts_Type2 },
  { key: 'byScouter_Parts_Type3', label: 'Scouter Part 3', type: 'number' as const, validation: itemTableSchema.shape.byScouter_Parts_Type3 },
  { key: 'byScouter_Parts_Type4', label: 'Scouter Part 4', type: 'number' as const, validation: itemTableSchema.shape.byScouter_Parts_Type4 },
  
  // Item References
  { key: 'Use_Item_Tblidx', label: 'Use Item ID', type: 'number' as const, validation: itemTableSchema.shape.Use_Item_Tblidx },
  { key: 'Item_Option_Tblidx', label: 'Item Option ID', type: 'number' as const, validation: itemTableSchema.shape.Item_Option_Tblidx },
  { key: 'byItemGroup', label: 'Item Group', type: 'number' as const, validation: itemTableSchema.shape.byItemGroup },
  { key: 'Charm_Tblidx', label: 'Charm ID', type: 'number' as const, validation: itemTableSchema.shape.Charm_Tblidx },
  { key: 'wCostumeHideBitFlag', label: 'Costume Hide Flag', type: 'number' as const, validation: itemTableSchema.shape.wCostumeHideBitFlag },
  { key: 'NeedItemTblidx', label: 'Required Item ID', type: 'number' as const, validation: itemTableSchema.shape.NeedItemTblidx },
  
  // Points and Function
  { key: 'CommonPoint', label: 'Common Point', type: 'number' as const, validation: itemTableSchema.shape.CommonPoint },
  { key: 'byCommonPointType', label: 'Common Point Type', type: 'number' as const, validation: itemTableSchema.shape.byCommonPointType },
  { key: 'byNeedFunction', label: 'Required Function', type: 'number' as const, validation: itemTableSchema.shape.byNeedFunction },
  
  // Duration and Content
  { key: 'dwUseDurationMax', label: 'Use Duration Max', type: 'number' as const, validation: itemTableSchema.shape.dwUseDurationMax },
  { key: 'byDurationType', label: 'Duration Type', type: 'number' as const, validation: itemTableSchema.shape.byDurationType },
  { key: 'contentsTblidx', label: 'Contents ID', type: 'number' as const, validation: itemTableSchema.shape.contentsTblidx },
  { key: 'dwDurationGroup', label: 'Duration Group', type: 'number' as const, validation: itemTableSchema.shape.dwDurationGroup },
  
  // Drop and Enchant
  { key: 'byDropLevel', label: 'Drop Level', type: 'number' as const, validation: itemTableSchema.shape.byDropLevel },
  { key: 'enchantRateTblidx', label: 'Enchant Rate ID', type: 'number' as const, validation: itemTableSchema.shape.enchantRateTblidx },
  { key: 'excellentTblidx', label: 'Excellent ID', type: 'number' as const, validation: itemTableSchema.shape.excellentTblidx },
  { key: 'rareTblidx', label: 'Rare ID', type: 'number' as const, validation: itemTableSchema.shape.rareTblidx },
  { key: 'legendaryTblidx', label: 'Legendary ID', type: 'number' as const, validation: itemTableSchema.shape.legendaryTblidx },
  
  // Restrictions and Revisions
  { key: 'byRestrictType', label: 'Restrict Type', type: 'number' as const, validation: itemTableSchema.shape.byRestrictType },
  { key: 'fAttack_Physical_Revision', label: 'Physical Attack Revision', type: 'number' as const, validation: itemTableSchema.shape.fAttack_Physical_Revision },
  { key: 'fAttack_Energy_Revision', label: 'Energy Attack Revision', type: 'number' as const, validation: itemTableSchema.shape.fAttack_Energy_Revision },
  { key: 'fDefence_Physical_Revision', label: 'Physical Defence Revision', type: 'number' as const, validation: itemTableSchema.shape.fDefence_Physical_Revision },
  { key: 'fDefence_Energy_Revision', label: 'Energy Defence Revision', type: 'number' as const, validation: itemTableSchema.shape.fDefence_Energy_Revision },
  
  // Misc Properties
  { key: 'byTmpTabType', label: 'Temp Tab Type', type: 'number' as const, validation: itemTableSchema.shape.byTmpTabType },
  { key: 'wDisassemble_Bit_Flag', label: 'Disassemble Flag', type: 'number' as const, validation: itemTableSchema.shape.wDisassemble_Bit_Flag },
  { key: 'byDisassembleNormalMin', label: 'Normal Disassemble Min', type: 'number' as const, validation: itemTableSchema.shape.byDisassembleNormalMin },
  { key: 'byDisassembleNormalMax', label: 'Normal Disassemble Max', type: 'number' as const, validation: itemTableSchema.shape.byDisassembleNormalMax },
  { key: 'byDisassembleUpperMin', label: 'Upper Disassemble Min', type: 'number' as const, validation: itemTableSchema.shape.byDisassembleUpperMin },
  { key: 'byDisassembleUpperMax', label: 'Upper Disassemble Max', type: 'number' as const, validation: itemTableSchema.shape.byDisassembleUpperMax },
  { key: 'byDropVisual', label: 'Drop Visual', type: 'number' as const, validation: itemTableSchema.shape.byDropVisual },
  { key: 'byUseDisassemble', label: 'Use Disassemble', type: 'number' as const, validation: itemTableSchema.shape.byUseDisassemble },
];
