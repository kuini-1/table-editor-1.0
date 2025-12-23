import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemOptionFormData } from "./schema";
import { columns, itemOptionSchema } from "./schema";

const itemOptionTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic item option information",
        columns: [
          "bvalidity_able",
          "byqualityindex",
          "activeeffect",
          "factiverate",
          "sznote"
        ]
      }
    ]
  },
  {
    id: "system_effects",
    label: "System Effects",
    sections: Array.from({ length: 4 }, (_, i) => ({
      id: `system-effect-${i}`,
      title: `System Effect ${i}`,
      description: `Configure system effect ${i}`,
      columns: [
        `system_effect_${i}`,
        `bappliedinpercent_${i}`,
        `nvalue_${i}`,
        `byscouterinfo_${i}`
      ]
    }))
  }
];

const itemOptionQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszoption_name", "byoption_rank", "byitem_group"]
  },
  {
    title: "Quality & Cost",
    columns: ["bymaxquality", "byquality", "dwcost", "bylevel"]
  }
];

const itemOptionQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Option Name', 
    column: 'wszoption_name',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Option Rank', 
    column: 'byoption_rank',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Cost', 
    column: 'dwcost',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface ItemOptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: ItemOptionFormData;
  onSubmit: (data: ItemOptionFormData) => void;
  tableId: string;
}

export function ItemOptionForm({
  initialData,
  onSubmit,
  mode,
  tableId,
  onOpenChange,
}: ItemOptionFormProps) {
  return (
    <ModularForm<ItemOptionFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={itemOptionTabs}
      quickViewSections={itemOptionQuickViewSections}
      quickStats={itemOptionQuickStats}
      customSchema={itemOptionSchema}
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
