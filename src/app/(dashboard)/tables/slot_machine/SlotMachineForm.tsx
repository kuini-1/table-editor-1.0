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
        columns: ["dwName", "wszNameText", "szFile_Name", "byCoin", "bOnOff", "byType", "wfirstWinCoin"]
      }
    ]
  },
  {
    id: "items",
    label: "Items",
    sections: Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i + 1}`,
      description: `Configure item ${i + 1} details`,
      columns: [
        `aItemTblidx_${i}`,
        `byStack_${i}`,
        `wQuantity_${i}`
      ]
    }))
  }
];

const slotMachineQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "dwName", "wszNameText", "byCoin", "bOnOff", "byType"]
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
    label: 'Coin', 
    column: 'byCoin',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'First Win Coin', 
    column: 'wfirstWinCoin',
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
