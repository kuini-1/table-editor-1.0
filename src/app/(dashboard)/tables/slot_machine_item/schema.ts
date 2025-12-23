import * as z from "zod";

export const slotMachineItemSchema = z.object({
  table_id: z.string().uuid().nullable(),
  tblidx: z.coerce.number().nullable(),
  wsznametext: z.string().nullable(),
  bactive: z.coerce.boolean().nullable(),
  slotmachinetblidx: z.coerce.number().nullable(),
  cashitemtblidx: z.coerce.number().nullable(),
  bystackcount: z.coerce.number().nullable(),
  bypercent: z.coerce.number().nullable(),
});

export type SlotMachineItemFormData = z.infer<typeof slotMachineItemSchema>;

export const columns = [
  { key: 'tblidx', label: 'ID', type: 'number' as const, validation: slotMachineItemSchema.shape.tblidx },
  { key: 'wsznametext', label: 'Name', type: 'text' as const, validation: slotMachineItemSchema.shape.wsznametext },
  { key: 'bactive', label: 'Active', type: 'boolean' as const, validation: slotMachineItemSchema.shape.bactive },
  { key: 'slotmachinetblidx', label: 'Slot Machine ID', type: 'number' as const, validation: slotMachineItemSchema.shape.slotmachinetblidx },
  { key: 'cashitemtblidx', label: 'Cash Item ID', type: 'number' as const, validation: slotMachineItemSchema.shape.cashitemtblidx },
  { key: 'bystackcount', label: 'Stack Count', type: 'number' as const, validation: slotMachineItemSchema.shape.bystackcount },
  { key: 'bypercent', label: 'Percent', type: 'number' as const, validation: slotMachineItemSchema.shape.bypercent },
]; 