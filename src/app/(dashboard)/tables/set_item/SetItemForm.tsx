import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SetItemFormData } from "./schema";
import { columns, setItemSchema } from "./schema";

const setItemTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: []
  },
  {
    id: "options",
    label: "Set Options",
    sections: []
  },
  {
    id: "items",
    label: "Set Items",
    sections: [
      {
        id: "set-items",
        title: "Set Items",
        description: "Configure set items",
        columns: ["aitemtblidx_0", "aitemtblidx_1", "aitemtblidx_2"]
      }
    ]
  }
];

const setItemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "bvalidity_able"]
  },
  {
    title: "Set Options",
    columns: ["semisetoption", "fullsetoption"]
  }
];

const setItemQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Semi Set Option', 
    column: 'semisetoption',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Full Set Option', 
    column: 'fullsetoption',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface SetItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: SetItemFormData;
  onSubmit: (data: SetItemFormData) => void;
  tableId: string;
}

export default function SetItemForm({
  mode,
  initialData,
  onSubmit,
  tableId,
  onOpenChange,
}: SetItemFormProps) {
  return (
    <ModularForm<SetItemFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={setItemTabs}
      quickViewSections={setItemQuickViewSections}
      quickStats={setItemQuickStats}
      customSchema={setItemSchema}
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
