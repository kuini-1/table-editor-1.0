import * as z from 'zod';

const baseDungeonSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  byDungeonType: z.coerce.number().nullable(),
  byMaxMember: z.coerce.number().nullable(),
  linkWorld: z.coerce.number().nullable(),
  byMinLevel: z.coerce.number().nullable(),
  byMaxLevel: z.coerce.number().nullable(),
  needItemTblidx: z.coerce.number().nullable(),
  dwHonorPoint: z.coerce.number().nullable(),
  wpsTblidx: z.coerce.number().nullable(),
  openCine: z.coerce.number().nullable(),
  groupIdx: z.coerce.number().nullable(),
});

export const dungeonSchema = baseDungeonSchema.extend({
  id: z.string().uuid(),
});

export const newDungeonSchema = baseDungeonSchema.extend({
  id: z.string().uuid().optional(),
});

export type DungeonFormData = z.infer<typeof newDungeonSchema>;
export type DungeonRow = z.infer<typeof dungeonSchema>;

export const columns = [
  { key: 'tblidx', label: 'TBLIDX', type: 'number' as const, validation: dungeonSchema.shape.tblidx },
  { key: 'byDungeonType', label: 'Dungeon Type', type: 'number' as const, validation: dungeonSchema.shape.byDungeonType },
  { key: 'byMaxMember', label: 'Max Members', type: 'number' as const, validation: dungeonSchema.shape.byMaxMember },
  { key: 'linkWorld', label: 'Link World', type: 'number' as const, validation: dungeonSchema.shape.linkWorld },
  { key: 'byMinLevel', label: 'Min Level', type: 'number' as const, validation: dungeonSchema.shape.byMinLevel },
  { key: 'byMaxLevel', label: 'Max Level', type: 'number' as const, validation: dungeonSchema.shape.byMaxLevel },
  { key: 'needItemTblidx', label: 'Required Item', type: 'number' as const, validation: dungeonSchema.shape.needItemTblidx },
  { key: 'dwHonorPoint', label: 'Honor Points', type: 'number' as const, validation: dungeonSchema.shape.dwHonorPoint },
  { key: 'wpsTblidx', label: 'WPS ID', type: 'number' as const, validation: dungeonSchema.shape.wpsTblidx },
  { key: 'openCine', label: 'Open Cinematic', type: 'number' as const, validation: dungeonSchema.shape.openCine },
  { key: 'groupIdx', label: 'Group Index', type: 'number' as const, validation: dungeonSchema.shape.groupIdx },
];
