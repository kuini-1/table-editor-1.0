import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { NewItemBagListFormData } from "./schema";
import { columns, newItemBagListSchema } from "./schema";

const itemBagListTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: []
  },
  {
    id: "items",
    label: "Items",
    sections: Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
      description: `Configure item ${i} and its probability`,
      columns: [
        `aitem_${i}`,
        `adwprob_${i}`
      ]
    }))
  }
];

const itemBagListQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszName", "byLevel", "bEnchant_Able", "dwItemCount", "dwTotalProb"]
  }
];

const itemBagListQuickStats = [
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
    label: 'Level', 
    column: 'byLevel',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Item Count', 
    column: 'dwItemCount',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface ItemBagListFormProps {
  initialData?: NewItemBagListFormData;
  onSubmit: (data: NewItemBagListFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function ItemBagListForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemBagListFormProps) {
  return (
    <ModularForm<NewItemBagListFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tableType="item_bag_list"
      tabs={itemBagListTabs}
      quickViewSections={itemBagListQuickViewSections}
      quickStats={itemBagListQuickStats}
      customSchema={newItemBagListSchema}
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
