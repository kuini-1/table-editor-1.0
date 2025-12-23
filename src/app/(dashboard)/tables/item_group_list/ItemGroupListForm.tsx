import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemGroupListFormData } from "./schema";
import { columns, itemGroupListSchema } from "./schema";

const itemGroupListTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "mob-settings",
        title: "Mob Settings",
        description: "Mob configuration",
        columns: ["mob_index", "dwmob_type", "dwworld_rule_type", "dwinterval"]
      },
      {
        id: "drop-settings",
        title: "Drop Settings",
        description: "Drop probability settings",
        columns: [
          "dwno_drop",
          "dwzenny"
        ]
      },
      {
        id: "item-bag-settings",
        title: "Item Bag Settings",
        description: "Item bag configuration",
        columns: ["dwitembagcount", "dwtotalprob"]
      }
    ]
  },
  {
    id: "items",
    label: "Item Bags",
    sections: Array.from({ length: 20 }, (_, i) => ({
      id: `item-bag-${i}`,
      title: `Item Bag ${i}`,
      description: `Configure item bag ${i} and its probability`,
      columns: [
        `aitembag_${i}`,
        `adwprob_${i}`
      ]
    }))
  }
];

const itemGroupListQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszname", "bylevel", "bytry_count"]
  },
  {
    title: "Drop Settings",
    columns: ["dwsuperior", "dwexcellent", "dwrare", "dwlegendary"]
  }
];

const itemGroupListQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'wszname',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Level', 
    column: 'bylevel',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Item Bag Count', 
    column: 'dwitembagcount',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface ItemGroupListFormProps {
  initialData?: ItemGroupListFormData;
  onSubmit: (data: ItemGroupListFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function ItemGroupListForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemGroupListFormProps) {
  return (
    <ModularForm<ItemGroupListFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={itemGroupListTabs}
      quickViewSections={itemGroupListQuickViewSections}
      quickStats={itemGroupListQuickStats}
      customSchema={itemGroupListSchema}
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
