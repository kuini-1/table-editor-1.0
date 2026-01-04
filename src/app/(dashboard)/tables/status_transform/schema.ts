import * as z from 'zod';

export const statusTransformTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  fLP_Transform: z.coerce.number(),
  fEP_Transform: z.coerce.number(),
  fPhysical_Offence_Transform: z.coerce.number(),
  fEnergy_Offence_Transform: z.coerce.number(),
  fPhysical_Defence_Transform: z.coerce.number(),
  fEnergy_Defence_Transform: z.coerce.number(),
  fRun_Speed_Transform: z.coerce.number(),
  fAttack_Speed_Transform: z.coerce.number(),
  fAttack_Rate_Transform: z.coerce.number(),
  fDodge_Rate_Transform: z.coerce.number(),
  fBlock_Rate_Transform: z.coerce.number(),
  fCurse_Success_Transform: z.coerce.number(),
  fCurse_Tolerance_Transform: z.coerce.number(),
  fAttack_Range_Change: z.coerce.number(),
  fLP_Consume_Rate: z.coerce.number(),
  fEP_Consume_Rate: z.coerce.number(),
  dwDuration: z.coerce.number().min(0, 'Must be a positive number'),
  dwDurationInMilliSecs: z.coerce.number().min(0, 'Must be a positive number'),
});

export type StatusTransformTableFormData = z.infer<typeof statusTransformTableSchema>;

export interface StatusTransformTableRow extends StatusTransformTableFormData {
  id: string;
}

export const columns = [
  { key: 'tblidx', label: 'Table ID', type: 'number' as const, validation: statusTransformTableSchema.shape.tblidx },
  { key: 'fLP_Transform', label: 'LP Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fLP_Transform },
  { key: 'fEP_Transform', label: 'EP Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fEP_Transform },
  { key: 'fPhysical_Offence_Transform', label: 'Physical Offence Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fPhysical_Offence_Transform },
  { key: 'fEnergy_Offence_Transform', label: 'Energy Offence Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fEnergy_Offence_Transform },
  { key: 'fPhysical_Defence_Transform', label: 'Physical Defence Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fPhysical_Defence_Transform },
  { key: 'fEnergy_Defence_Transform', label: 'Energy Defence Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fEnergy_Defence_Transform },
  { key: 'fRun_Speed_Transform', label: 'Run Speed Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fRun_Speed_Transform },
  { key: 'fAttack_Speed_Transform', label: 'Attack Speed Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fAttack_Speed_Transform },
  { key: 'fAttack_Rate_Transform', label: 'Attack Rate Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fAttack_Rate_Transform },
  { key: 'fDodge_Rate_Transform', label: 'Dodge Rate Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fDodge_Rate_Transform },
  { key: 'fBlock_Rate_Transform', label: 'Block Rate Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fBlock_Rate_Transform },
  { key: 'fCurse_Success_Transform', label: 'Curse Success Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fCurse_Success_Transform },
  { key: 'fCurse_Tolerance_Transform', label: 'Curse Tolerance Transform', type: 'number' as const, validation: statusTransformTableSchema.shape.fCurse_Tolerance_Transform },
  { key: 'fAttack_Range_Change', label: 'Attack Range Change', type: 'number' as const, validation: statusTransformTableSchema.shape.fAttack_Range_Change },
  { key: 'fLP_Consume_Rate', label: 'LP Consume Rate', type: 'number' as const, validation: statusTransformTableSchema.shape.fLP_Consume_Rate },
  { key: 'fEP_Consume_Rate', label: 'EP Consume Rate', type: 'number' as const, validation: statusTransformTableSchema.shape.fEP_Consume_Rate },
  { key: 'dwDuration', label: 'Duration', type: 'number' as const, validation: statusTransformTableSchema.shape.dwDuration },
  { key: 'dwDurationInMilliSecs', label: 'Duration (ms)', type: 'number' as const, validation: statusTransformTableSchema.shape.dwDurationInMilliSecs },
];

