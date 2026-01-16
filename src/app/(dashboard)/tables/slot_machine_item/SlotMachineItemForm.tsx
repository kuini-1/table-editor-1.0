import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SlotMachineItemFormData } from "./schema";
import { columns, slotMachineItemSchema } from "./schema";

const slotMachineItemTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic slot machine item information",
        columns: ["tblidx", "wszNameText", "bActive"]
      }
    ]
  },
  {
    id: "details",
    label: "Item Details",
    sections: [
      {
        id: "item-details",
        title: "Item Details",
        description: "Configure slot machine item details",
        columns: ["slotMachineTblidx", "cashItemTblidx", "byStackCount", "byPercent"]
      }
    ]
  }
];

const slotMachineItemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszNameText", "bActive"]
  },
  {
    title: "Item Details",
    columns: ["slotMachineTblidx", "cashItemTblidx", "byStackCount", "byPercent"]
  }
];

const slotMachineItemQuickStats = [
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
    label: 'Slot Machine ID', 
    column: 'slotMachineTblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Percent', 
    column: 'byPercent',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface SlotMachineItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: SlotMachineItemFormData;
  onSubmit: (data: SlotMachineItemFormData) => void;
  tableId: string;
}

export default function SlotMachineItemForm({
  mode,
  initialData,
  onSubmit,
  tableId,
  onOpenChange,
}: SlotMachineItemFormProps) {
  return (
    <ModularForm<SlotMachineItemFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={slotMachineItemTabs}
      quickViewSections={slotMachineItemQuickViewSections}
      quickStats={slotMachineItemQuickStats}
      customSchema={slotMachineItemSchema}
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
