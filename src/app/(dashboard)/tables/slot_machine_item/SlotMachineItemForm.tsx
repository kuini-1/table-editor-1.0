import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SlotMachineItemFormData } from "./schema";
import { columns, slotMachineItemSchema } from "./schema";

const slotMachineItemTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: []
  },
  {
    id: "details",
    label: "Item Details",
    sections: []
  }
];

const slotMachineItemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wsznametext", "bactive"]
  },
  {
    title: "Item Details",
    columns: ["slotmachinetblidx", "cashitemtblidx", "bystackcount", "bypercent"]
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
    column: 'wsznametext',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Slot Machine ID', 
    column: 'slotmachinetblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Percent', 
    column: 'bypercent',
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
