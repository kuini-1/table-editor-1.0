import { ModularForm } from '@/components/table/ModularForm';
import type { FormMode } from '@/components/table/ModularForm';
import { type HlsItemFormData, columns, hlsItemSchema } from './schema';

interface HlsFormProps {
  initialData?: Partial<HlsItemFormData>;
  onSubmit: (data: HlsItemFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

const hlsItemSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this HLS item',
    columns: ['tblidx', 'wszname', 'wszcjiproductid', 'szicon_name', 'whlsitemtype']
  }
];

const hlsQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszname', 'wszcjiproductid', 'szicon_name', 'whlsitemtype']
  },
  {
    title: 'Sale Settings',
    columns: ['bonsale', 'dwcash', 'bydiscount', 'bystackcount']
  }
];

const hlsQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Item Type', column: 'whlsitemtype' },
  { label: 'Cash', column: 'dwcash', color: 'purple' },
];

const hlsItemTabs = [
  {
    id: 'duration',
    label: 'Duration Settings',
    sections: [
      {
        id: 'duration-settings',
        title: 'Duration Settings',
        description: 'Configure duration settings for this item',
        columns: [
          'byhlsdurationtype',
          'dwhlsdurationtime'
        ]
      }
    ]
  },
  {
    id: 'text-indices',
    label: 'Text Indices',
    sections: [
      {
        id: 'text-indices',
        title: 'Text Indices',
        description: 'Configure text indices for this item',
        columns: [
          'idxnametext',
          'idxnotetext'
        ]
      }
    ]
  },
  {
    id: 'sale-settings',
    label: 'Sale Settings',
    sections: [
      {
        id: 'sale-settings',
        title: 'Sale Settings',
        description: 'Configure sale settings for this item',
        columns: [
          'bonsale',
          'byselltype',
          'dwcash',
          'bydiscount',
          'bystackcount'
        ]
      }
    ]
  },
  {
    id: 'display-settings',
    label: 'Display Settings',
    sections: [
      {
        id: 'display-settings',
        title: 'Display Settings',
        description: 'Configure display settings for this item',
        columns: [
          'wdisplaybitflag',
          'byquicklink',
          'dwpriority',
          'bydisplayconsumetype',
          'byyadrattype'
        ]
      }
    ]
  },
  {
    id: 'item-bundles',
    label: 'Item Bundles',
    sections: [
      {
        id: 'item-bundles',
        title: 'Item Bundles',
        description: 'Configure bundled items',
        columns: [
          'itemtblidx',
          'itemtblidx_0',
          'bystackcount_0',
          'itemtblidx_1',
          'bystackcount_1',
          'itemtblidx_2',
          'bystackcount_2',
          'itemtblidx_3',
          'bystackcount_3',
          'itemtblidx_4',
          'bystackcount_4'
        ]
      }
    ]
  }
];

export function HlsForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: HlsFormProps) {
  return (
    <ModularForm<HlsItemFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={hlsItemSections}
      tabs={hlsItemTabs}
      quickViewSections={hlsQuickViewSections}
      quickStats={hlsQuickStats}
      customSchema={hlsItemSchema}
      defaultTab="duration"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
} 