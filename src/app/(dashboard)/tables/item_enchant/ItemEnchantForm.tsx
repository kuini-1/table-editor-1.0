import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemEnchantFormData } from "./schema";
import { columns, itemEnchantSchema } from "./schema";

const itemEnchantTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "level-type",
        title: "Level and Type Settings",
        description: "Level requirements and type configuration",
        columns: ["byRvType", "byExclIdx"]
      }
    ]
  },
  {
    id: "enchant",
    label: "Enchant Settings",
    sections: [
      {
        id: "enchant-config",
        title: "Enchant Configuration",
        description: "Enchant value and settings",
        columns: [
          "byfrequency",
          "bykind",
          "dwequip",
          "bygroupno"
        ]
      },
      {
        id: "item-flags",
        title: "Item Flags",
        description: "Item quality flags",
        columns: [
          "bIsSuperior",
          "bIsExcellent",
          "bIsRare",
          "bIsLegendary"
        ]
      }
    ]
  }
];

const itemEnchantQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszName", "seTblidx", "bSeType"]
  },
  {
    title: "Enchant Settings",
    columns: ["byMinLevel", "byMaxLevel", "wEnchant_Value", "wMaxValue"]
  }
];

const itemEnchantQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'wszName',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Enchant Value', 
    column: 'wEnchant_Value',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Max Value', 
    column: 'wMaxValue',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface ItemEnchantFormProps {
  initialData?: ItemEnchantFormData;
  onSubmit: (data: ItemEnchantFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function ItemEnchantForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemEnchantFormProps) {
  return (
    <ModularForm<ItemEnchantFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={itemEnchantTabs}
      quickViewSections={itemEnchantQuickViewSections}
      quickStats={itemEnchantQuickStats}
      customSchema={itemEnchantSchema}
      defaultTab="basic"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}
