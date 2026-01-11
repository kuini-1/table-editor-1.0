/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

export const portalTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwPointName: z.coerce.number().min(0, 'Must be a positive number'),
  szPointNameText: z.string().max(64, 'Cannot exceed 64 characters'),
  dwUnknown: z.coerce.number().min(0, 'Must be a positive number'),
  worldId: z.coerce.number().min(0, 'Must be a positive number'),
  byGrade: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  vLoc_x: z.coerce.number(),
  vLoc_y: z.coerce.number(),
  vLoc_z: z.coerce.number(),
  vDir_x: z.coerce.number(),
  vDir_y: z.coerce.number(),
  vDir_z: z.coerce.number(),
  vMap_x: z.coerce.number(),
  vMap_y: z.coerce.number(),
  vMap_z: z.coerce.number(),
  aPoint_0: z.coerce.number().min(0, 'Must be a positive number'),
  adwPointZenny_0: z.coerce.number().min(0, 'Must be a positive number'),
  aPoint_1: z.coerce.number().min(0, 'Must be a positive number'),
  adwPointZenny_1: z.coerce.number().min(0, 'Must be a positive number'),
  aPoint_2: z.coerce.number().min(0, 'Must be a positive number'),
  adwPointZenny_2: z.coerce.number().min(0, 'Must be a positive number'),
  aPoint_3: z.coerce.number().min(0, 'Must be a positive number'),
  adwPointZenny_3: z.coerce.number().min(0, 'Must be a positive number'),
});

export type PortalTableFormData = z.infer<typeof portalTableSchema>;

export interface PortalTableRow extends PortalTableFormData {
  id: string;
}

const pointColumns = Array.from({ length: 4 }, (_, i) => [
  { key: `aPoint_${i}` as const, label: `Point ${i}`, type: 'number' as const, validation: portalTableSchema.shape[`aPoint_${i}` as keyof typeof portalTableSchema.shape] as any },
  { key: `adwPointZenny_${i}` as const, label: `Point ${i} Zenny`, type: 'number' as const, validation: portalTableSchema.shape[`adwPointZenny_${i}` as keyof typeof portalTableSchema.shape] as any },
]).flat();

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: portalTableSchema.shape.tblidx },
  { key: 'dwPointName', label: 'Point Name', type: 'number' as const, validation: portalTableSchema.shape.dwPointName },
  { key: 'szPointNameText', label: 'Point Name Text', type: 'text' as const, validation: portalTableSchema.shape.szPointNameText },
  { key: 'dwUnknown', label: 'Unknown', type: 'number' as const, validation: portalTableSchema.shape.dwUnknown },
  { key: 'worldId', label: 'World ID', type: 'number' as const, validation: portalTableSchema.shape.worldId },
  { key: 'byGrade', label: 'Grade', type: 'number' as const, validation: portalTableSchema.shape.byGrade },
  { key: 'vLoc_x', label: 'Location X', type: 'number' as const, validation: portalTableSchema.shape.vLoc_x },
  { key: 'vLoc_y', label: 'Location Y', type: 'number' as const, validation: portalTableSchema.shape.vLoc_y },
  { key: 'vLoc_z', label: 'Location Z', type: 'number' as const, validation: portalTableSchema.shape.vLoc_z },
  { key: 'vDir_x', label: 'Direction X', type: 'number' as const, validation: portalTableSchema.shape.vDir_x },
  { key: 'vDir_y', label: 'Direction Y', type: 'number' as const, validation: portalTableSchema.shape.vDir_y },
  { key: 'vDir_z', label: 'Direction Z', type: 'number' as const, validation: portalTableSchema.shape.vDir_z },
  { key: 'vMap_x', label: 'Map X', type: 'number' as const, validation: portalTableSchema.shape.vMap_x },
  { key: 'vMap_y', label: 'Map Y', type: 'number' as const, validation: portalTableSchema.shape.vMap_y },
  { key: 'vMap_z', label: 'Map Z', type: 'number' as const, validation: portalTableSchema.shape.vMap_z },
  ...pointColumns,
];

