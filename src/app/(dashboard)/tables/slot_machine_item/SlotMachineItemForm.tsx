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

const slotMachineItemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "dwname", "wsznametext", "bycoin", "bonoff", "bytype"]
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
