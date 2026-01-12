import * as z from "zod";

export const slotMachineItemSchema = z.object({
  table_id: z.string().uuid().nullable(),
  tblidx: z.coerce.number().nullable(),
  wszNameText: z.string().nullable().transform(e => e === null ? "" : e),
  bActive: z.coerce.boolean().nullable().transform(val => val ? 1 : 0),
  slotMachineTblidx: z.coerce.number().nullable(),
  cashItemTblidx: z.coerce.number().nullable(),
  byStackCount: z.coerce.number().nullable(),
  byPercent: z.coerce.number().nullable(),
});

export type SlotMachineItemFormData = z.infer<typeof slotMachineItemSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: slotMachineItemSchema.shape.tblidx },
  { key: 'wszNameText', label: 'Name', type: 'text' as const, validation: slotMachineItemSchema.shape.wszNameText },
  { key: 'bActive', label: 'Active', type: 'boolean' as const, validation: slotMachineItemSchema.shape.bActive },
  { key: 'slotMachineTblidx', label: 'Slot Machine ID', type: 'number' as const, validation: slotMachineItemSchema.shape.slotMachineTblidx },
  { key: 'cashItemTblidx', label: 'Cash Item ID', type: 'number' as const, validation: slotMachineItemSchema.shape.cashItemTblidx },
  { key: 'byStackCount', label: 'Stack Count', type: 'number' as const, validation: slotMachineItemSchema.shape.byStackCount },
  { key: 'byPercent', label: 'Percent', type: 'number' as const, validation: slotMachineItemSchema.shape.byPercent },
];
