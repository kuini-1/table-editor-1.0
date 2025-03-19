import * as z from 'zod';

const baseDungeonSchema = z.object({
  table_id: z.string().uuid().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  tblidx: z.number().nullable(),
  bydungeontype: z.number().nullable(),
  bymaxmember: z.number().nullable(),
  linkworld: z.number().nullable(),
  byminlevel: z.number().nullable(),
  bymaxlevel: z.number().nullable(),
  needitemtblidx: z.number().nullable(),
  dwhonorpoint: z.number().nullable(),
  wpstblidx: z.number().nullable(),
  opencine: z.number().nullable(),
  groupidx: z.number().nullable(),
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
  { key: 'bydungeontype', label: 'Dungeon Type', type: 'number' as const, validation: dungeonSchema.shape.bydungeontype },
  { key: 'bymaxmember', label: 'Max Members', type: 'number' as const, validation: dungeonSchema.shape.bymaxmember },
  { key: 'linkworld', label: 'Link World', type: 'number' as const, validation: dungeonSchema.shape.linkworld },
  { key: 'byminlevel', label: 'Min Level', type: 'number' as const, validation: dungeonSchema.shape.byminlevel },
  { key: 'bymaxlevel', label: 'Max Level', type: 'number' as const, validation: dungeonSchema.shape.bymaxlevel },
  { key: 'needitemtblidx', label: 'Required Item', type: 'number' as const, validation: dungeonSchema.shape.needitemtblidx },
  { key: 'dwhonorpoint', label: 'Honor Points', type: 'number' as const, validation: dungeonSchema.shape.dwhonorpoint },
  { key: 'wpstblidx', label: 'WPS ID', type: 'number' as const, validation: dungeonSchema.shape.wpstblidx },
  { key: 'opencine', label: 'Open Cinematic', type: 'number' as const, validation: dungeonSchema.shape.opencine },
  { key: 'groupidx', label: 'Group Index', type: 'number' as const, validation: dungeonSchema.shape.groupidx },
]; 