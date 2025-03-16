import * as z from 'zod';
import type { Column } from '@/components/table/ModularForm';

// Form schema for validation
export const hlsItemSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits').optional(),
  wszname: z.string().optional(),
  wszcjiproductid: z.string().optional(),
  szicon_name: z.string().optional(),
  whlsitemtype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byhlsdurationtype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwhlsdurationtime: z.coerce.number().min(0, 'Must be a positive number').optional(),
  idxnametext: z.coerce.number().min(0, 'Must be a positive number').optional(),
  idxnotetext: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bonsale: z.boolean().optional().transform(val => val ? 1 : 0),
  byselltype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwcash: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bydiscount: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount: z.coerce.number().min(0, 'Must be a positive number').optional(),
  wdisplaybitflag: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byquicklink: z.coerce.number().min(0, 'Must be a positive number').optional(),
  dwpriority: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bydisplayconsumetype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  byyadrattype: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_0: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_0: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_1: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_1: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_2: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_2: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_3: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_3: z.coerce.number().min(0, 'Must be a positive number').optional(),
  itemtblidx_4: z.coerce.number().min(0, 'Must be a positive number').optional(),
  bystackcount_4: z.coerce.number().min(0, 'Must be a positive number').optional(),
});

export type HlsItemFormData = z.infer<typeof hlsItemSchema>;

export interface HlsItemRow extends HlsItemFormData {
  id: string;
}

export const columns: Column[] = [
  { key: 'tblidx', label: 'Table ID', type: 'number' },
  { key: 'wszname', label: 'Name', type: 'text' },
  { key: 'wszcjiproductid', label: 'Product ID', type: 'text' },
  { key: 'szicon_name', label: 'Icon Name', type: 'text' },
  { key: 'whlsitemtype', label: 'Item Type', type: 'number' },
  { key: 'byhlsdurationtype', label: 'Duration Type', type: 'number' },
  { key: 'dwhlsdurationtime', label: 'Duration Time', type: 'number' },
  { key: 'idxnametext', label: 'Name Text Index', type: 'number' },
  { key: 'idxnotetext', label: 'Note Text Index', type: 'number' },
  { key: 'itemtblidx', label: 'Item Table Index', type: 'number' },
  { key: 'bonsale', label: 'On Sale', type: 'boolean' },
  { key: 'byselltype', label: 'Sell Type', type: 'number' },
  { key: 'dwcash', label: 'Cash', type: 'number' },
  { key: 'bydiscount', label: 'Discount', type: 'number' },
  { key: 'bystackcount', label: 'Stack Count', type: 'number' },
  { key: 'wdisplaybitflag', label: 'Display Bit Flag', type: 'number' },
  { key: 'byquicklink', label: 'Quick Link', type: 'number' },
  { key: 'dwpriority', label: 'Priority', type: 'number' },
  { key: 'bydisplayconsumetype', label: 'Display Consume Type', type: 'number' },
  { key: 'byyadrattype', label: 'Yadrat Type', type: 'number' },
  { key: 'itemtblidx_0', label: 'Item Table Index 0', type: 'number' },
  { key: 'bystackcount_0', label: 'Stack Count 0', type: 'number' },
  { key: 'itemtblidx_1', label: 'Item Table Index 1', type: 'number' },
  { key: 'bystackcount_1', label: 'Stack Count 1', type: 'number' },
  { key: 'itemtblidx_2', label: 'Item Table Index 2', type: 'number' },
  { key: 'bystackcount_2', label: 'Stack Count 2', type: 'number' },
  { key: 'itemtblidx_3', label: 'Item Table Index 3', type: 'number' },
  { key: 'bystackcount_3', label: 'Stack Count 3', type: 'number' },
  { key: 'itemtblidx_4', label: 'Item Table Index 4', type: 'number' },
  { key: 'bystackcount_4', label: 'Stack Count 4', type: 'number' },
]; 