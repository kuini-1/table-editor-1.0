import * as z from 'zod';

export const mascotTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  Name: z.coerce.number().min(0, 'Must be a positive number'),
  wszNameText: z.string().nullable().transform(e => e === null ? "" : e),
  bValidity_Able: z.coerce.boolean().transform(val => val ? 1 : 0),
  byModel_Type: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  szModel: z.string().max(64, 'Cannot exceed 64 characters').nullable().transform(e => e === null ? "" : e),
  byRank: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  bySlot_Num: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wSP_Decrease_Rate: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wMax_SP: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type MascotTableFormData = z.infer<typeof mascotTableSchema>;

export interface MascotTableRow extends MascotTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: mascotTableSchema.shape.tblidx },
  { key: 'Name', label: 'Name', type: 'number' as const, validation: mascotTableSchema.shape.Name },
  { key: 'wszNameText', label: 'Name Text', type: 'text' as const, validation: mascotTableSchema.shape.wszNameText },
  { key: 'bValidity_Able', label: 'Validity Able', type: 'boolean' as const, validation: mascotTableSchema.shape.bValidity_Able },
  { key: 'byModel_Type', label: 'Model Type', type: 'number' as const, validation: mascotTableSchema.shape.byModel_Type },
  { key: 'szModel', label: 'Model', type: 'text' as const, validation: mascotTableSchema.shape.szModel },
  { key: 'byRank', label: 'Rank', type: 'number' as const, validation: mascotTableSchema.shape.byRank },
  { key: 'bySlot_Num', label: 'Slot Number', type: 'number' as const, validation: mascotTableSchema.shape.bySlot_Num },
  { key: 'wSP_Decrease_Rate', label: 'SP Decrease Rate', type: 'number' as const, validation: mascotTableSchema.shape.wSP_Decrease_Rate },
  { key: 'wMax_SP', label: 'Max SP', type: 'number' as const, validation: mascotTableSchema.shape.wMax_SP },
];

