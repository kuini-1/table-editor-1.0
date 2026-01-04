import * as z from 'zod';

export const vehicleTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  szModelName: z.string().max(64, 'Cannot exceed 64 characters'),
  bySRPType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  bySpeed: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byVehicleType: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  wRunHeight: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
  byPersonnel: z.coerce.number().min(0, 'Must be a positive number').max(32767, 'Cannot exceed SMALLINT max'),
});

export type VehicleTableFormData = z.infer<typeof vehicleTableSchema>;

export interface VehicleTableRow extends VehicleTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: vehicleTableSchema.shape.tblidx },
  { key: 'szModelName', label: 'Model Name', type: 'text' as const, validation: vehicleTableSchema.shape.szModelName },
  { key: 'bySRPType', label: 'SRP Type', type: 'number' as const, validation: vehicleTableSchema.shape.bySRPType },
  { key: 'bySpeed', label: 'Speed', type: 'number' as const, validation: vehicleTableSchema.shape.bySpeed },
  { key: 'byVehicleType', label: 'Vehicle Type', type: 'number' as const, validation: vehicleTableSchema.shape.byVehicleType },
  { key: 'wRunHeight', label: 'Run Height', type: 'number' as const, validation: vehicleTableSchema.shape.wRunHeight },
  { key: 'byPersonnel', label: 'Personnel', type: 'number' as const, validation: vehicleTableSchema.shape.byPersonnel },
];

