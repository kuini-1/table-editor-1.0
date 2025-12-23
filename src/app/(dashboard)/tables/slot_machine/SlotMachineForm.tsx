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
        columns: ["szfile_name", "wfirstwincoin"]
      }
    ]
  },
  {
    id: "items",
    label: "Items",
    sections: Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
      description: `Configure item ${i}`,
      columns: [
        `aitemtblidx_${i}`,
        `bystack_${i}`,
        `wquantity_${i}`
      ]
    }))
  }
];

const slotMachineQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "dwname", "wsznametext", "bycoin", "bonoff", "bytype"]
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
    column: 'dwname',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Coin', 
    column: 'bycoin',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'First Win Coin', 
    column: 'wfirstwincoin',
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
