import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SlotMachineFormData } from "./schema";
import { columns, slotMachineSchema } from "./schema";

const slotMachineTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic slot machine information",
        columns: ["wszNameText", "bActive"]
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

const slotMachineQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszNameText", "bActive"]
  },
  {
    title: "Item Details",
    columns: ["slotMachineTblidx", "cashItemTblidx", "byStackCount", "byPercent"]
  }
];

const slotMachineQuickStats = [
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

interface SlotMachineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: SlotMachineFormData;
  onSubmit: (data: SlotMachineFormData) => void;
  tableId: string;
}

export function SlotMachineForm({
  initialData,
  onSubmit,
  mode,
  tableId,
  onOpenChange,
}: SlotMachineFormProps) {
  return (
    <ModularForm<SlotMachineFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={slotMachineTabs}
      quickViewSections={slotMachineQuickViewSections}
      quickStats={slotMachineQuickStats}
      customSchema={slotMachineSchema}
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
