import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MerchantFormData } from "./schema";
import { columns, merchantSchema } from "./schema";

const merchantTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic merchant information",
        columns: ["tblidx", "wszNameText", "bySell_Type", "Tab_Name", "dwNeedMileage"]
      }
    ]
  },
    {
      id: "items",
      label: "Item Bundles",
      sections: Array.from({ length: 36 }, (_, i) => ({
        id: `item-bundle-${i}`,
        title: `Item Bundle ${i + 1}`,
        description: `Configure item bundle ${i + 1}`,
        columns: [
          `aitem_Tblidx_${i}`,
          `aNeedItemTblidx_${i}`,
          `abyNeedItemStack_${i}`,
          `adwNeedZenny_${i}`
        ]
      }))
    }
];

const merchantQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszNameText", "bySell_Type", "Tab_Name", "dwNeedMileage"]
  }
];

const merchantQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'wszNameText',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Sell Type', 
    column: 'bySell_Type',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
];

interface MerchantFormProps {
  initialData?: MerchantFormData;
  onSubmit: (data: MerchantFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export default function MerchantForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MerchantFormProps) {
  return (
    <ModularForm<MerchantFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={merchantTabs}
      quickViewSections={merchantQuickViewSections}
      quickStats={merchantQuickStats}
      customSchema={merchantSchema}
      defaultTab="basic"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Merchant';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Merchant';
      }}
    />
  );
}
