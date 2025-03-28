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