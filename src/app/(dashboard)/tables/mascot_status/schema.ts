import * as z from 'zod';

export const mascotStatusTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  Name: z.coerce.number().min(0, 'Must be a positive number'),
  wszNameText: z.string().nullable().transform(e => e === null ? "" : e),
  bValidity_Able: z.coerce.boolean().transform(val => val ? 1 : 0),
  szModel: z.string().max(64, 'Cannot exceed 64 characters').nullable().transform(e => e === null ? "" : e),
  byRank: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  bySlot_Num: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wVpUpMin: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wVpUpMax: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  trash1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wSkillGrade1: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wSkillGrade2: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wSkillGrade3: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wVpRegen: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wSkillGradeMax: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  nextMascotTblidx: z.coerce.number().min(0, 'Must be a positive number'),
  sealItemIndex: z.coerce.number().min(0, 'Must be a positive number'),
});

export type MascotStatusTableFormData = z.infer<typeof mascotStatusTableSchema>;

export interface MascotStatusTableRow extends MascotStatusTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: mascotStatusTableSchema.shape.tblidx },
  { key: 'Name', label: 'Name', type: 'number' as const, validation: mascotStatusTableSchema.shape.Name },
  { key: 'wszNameText', label: 'Name Text', type: 'text' as const, validation: mascotStatusTableSchema.shape.wszNameText },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: mascotStatusTableSchema.shape.bValidity_Able },
  { key: 'szModel', label: 'Model', type: 'text' as const, validation: mascotStatusTableSchema.shape.szModel },
  { key: 'byRank', label: 'Rank', type: 'number' as const, validation: mascotStatusTableSchema.shape.byRank },
  { key: 'bySlot_Num', label: 'Slot Number', type: 'number' as const, validation: mascotStatusTableSchema.shape.bySlot_Num },
  { key: 'wVpUpMin', label: 'VP Up Min', type: 'number' as const, validation: mascotStatusTableSchema.shape.wVpUpMin },
  { key: 'wVpUpMax', label: 'VP Up Max', type: 'number' as const, validation: mascotStatusTableSchema.shape.wVpUpMax },
  { key: 'trash1', label: 'Trash 1', type: 'number' as const, validation: mascotStatusTableSchema.shape.trash1 },
  { key: 'wSkillGrade1', label: 'Skill Grade 1', type: 'number' as const, validation: mascotStatusTableSchema.shape.wSkillGrade1 },
  { key: 'wSkillGrade2', label: 'Skill Grade 2', type: 'number' as const, validation: mascotStatusTableSchema.shape.wSkillGrade2 },
  { key: 'wSkillGrade3', label: 'Skill Grade 3', type: 'number' as const, validation: mascotStatusTableSchema.shape.wSkillGrade3 },
  { key: 'wVpRegen', label: 'VP Regen', type: 'number' as const, validation: mascotStatusTableSchema.shape.wVpRegen },
  { key: 'wSkillGradeMax', label: 'Skill Grade Max', type: 'number' as const, validation: mascotStatusTableSchema.shape.wSkillGradeMax },
  { key: 'nextMascotTblidx', label: 'Next Mascot Table ID', type: 'number' as const, validation: mascotStatusTableSchema.shape.nextMascotTblidx },
  { key: 'sealItemIndex', label: 'Seal Item Index', type: 'number' as const, validation: mascotStatusTableSchema.shape.sealItemIndex },
];
