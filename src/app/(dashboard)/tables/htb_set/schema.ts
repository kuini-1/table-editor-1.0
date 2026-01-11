/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const htbSetTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  wszNameText: z.string().nullable().transform(e => e === null ? "" : e),
  HTB_Skill_Name: z.coerce.number().min(0, 'Must be a positive number'),
  bValidity_Able: z.coerce.boolean().transform(val => val ? 1 : 0),
  dwPC_Class_Bit_Flag: z.coerce.number().min(0, 'Must be a positive number'),
  bySlot_Index: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  bySkill_Grade: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  szIcon_Name: z.string().max(32, 'Cannot exceed 32 characters').nullable().transform(e => e === null ? "" : e),
  wNeed_EP: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byRequire_Train_Level: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwRequire_Zenny: z.coerce.number().min(0, 'Must be a positive number'),
  wNext_Skill_Train_Exp: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wCool_Time: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  dwCoolTimeInMilliSecs: z.coerce.number().min(0, 'Must be a positive number'),
  Note: z.coerce.number().min(0, 'Must be a positive number'),
  bySetCount: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byStop_Point: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wRequireSP: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_0_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_0_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_1_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_1_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_2_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_2_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_3_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_3_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_4_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_4_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_5_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_5_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_6_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_6_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_7_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_7_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_8_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_8_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  aHTBAction_9_bySkillType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  aHTBAction_9_skillTblidx: z.coerce.number().min(0, 'Must be a positive number'),
});

export type HtbSetTableFormData = z.infer<typeof htbSetTableSchema>;

export interface HtbSetTableRow extends HtbSetTableFormData {
  id: string;
}

const htbActionColumns = Array.from({ length: 10 }, (_, i) => [
  { key: `aHTBAction_${i}_bySkillType` as const, label: `HTB Action ${i} Skill Type`, type: 'number' as const, validation: htbSetTableSchema.shape[`aHTBAction_${i}_bySkillType` as keyof typeof htbSetTableSchema.shape] as any },
  { key: `aHTBAction_${i}_skillTblidx` as const, label: `HTB Action ${i} Skill Table ID`, type: 'number' as const, validation: htbSetTableSchema.shape[`aHTBAction_${i}_skillTblidx` as keyof typeof htbSetTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: htbSetTableSchema.shape.tblidx },
  { key: 'wszNameText', label: 'Name Text', type: 'text' as const, validation: htbSetTableSchema.shape.wszNameText },
  { key: 'HTB_Skill_Name', label: 'HTB Skill Name', type: 'number' as const, validation: htbSetTableSchema.shape.HTB_Skill_Name },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: htbSetTableSchema.shape.bValidity_Able },
  { key: 'dwPC_Class_Bit_Flag', label: 'PC Class Bit Flag', type: 'number' as const, validation: htbSetTableSchema.shape.dwPC_Class_Bit_Flag },
  { key: 'bySlot_Index', label: 'Slot Index', type: 'number' as const, validation: htbSetTableSchema.shape.bySlot_Index },
  { key: 'bySkill_Grade', label: 'Skill Grade', type: 'number' as const, validation: htbSetTableSchema.shape.bySkill_Grade },
  { key: 'szIcon_Name', label: 'Icon Name', type: 'text' as const, validation: htbSetTableSchema.shape.szIcon_Name },
  { key: 'wNeed_EP', label: 'Need EP', type: 'number' as const, validation: htbSetTableSchema.shape.wNeed_EP },
  { key: 'byRequire_Train_Level', label: 'Require Train Level', type: 'number' as const, validation: htbSetTableSchema.shape.byRequire_Train_Level },
  { key: 'dwRequire_Zenny', label: 'Require Zenny', type: 'number' as const, validation: htbSetTableSchema.shape.dwRequire_Zenny },
  { key: 'wNext_Skill_Train_Exp', label: 'Next Skill Train Exp', type: 'number' as const, validation: htbSetTableSchema.shape.wNext_Skill_Train_Exp },
  { key: 'wCool_Time', label: 'Cool Time', type: 'number' as const, validation: htbSetTableSchema.shape.wCool_Time },
  { key: 'dwCoolTimeInMilliSecs', label: 'Cool Time (ms)', type: 'number' as const, validation: htbSetTableSchema.shape.dwCoolTimeInMilliSecs },
  { key: 'Note', label: 'Note', type: 'number' as const, validation: htbSetTableSchema.shape.Note },
  { key: 'bySetCount', label: 'Set Count', type: 'number' as const, validation: htbSetTableSchema.shape.bySetCount },
  { key: 'byStop_Point', label: 'Stop Point', type: 'number' as const, validation: htbSetTableSchema.shape.byStop_Point },
  { key: 'wRequireSP', label: 'Require SP', type: 'number' as const, validation: htbSetTableSchema.shape.wRequireSP },
  ...htbActionColumns,
];

