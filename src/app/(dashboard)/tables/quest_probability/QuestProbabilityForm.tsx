import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { QuestProbabilityFormData } from "./schema";
import { columns, questProbabilitySchema } from "./schema";

const questProbabilityTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic quest probability information",
        columns: ["tblidx", "wszname", "wsznote"]
      },
      {
        id: "settings",
        title: "Settings",
        description: "Configure quest probability settings",
        columns: ["eusetype", "byprobabilitytype", "ballowblank", "bycount"]
      }
    ]
  },
  {
    id: "probability",
    label: "Probability Sets",
    sections: Array.from({ length: 50 }, (_, index) => ({
      id: `probability-set-${index}`,
      title: `Probability Set ${index}`,
      description: `Configure probability set ${index}`,
      columns: [
        `bytype_probability_${index}`,
        `tblidx_probability_${index}`,
        `dwminvalue_probability_${index}`,
        `dwmaxvalue_probability_${index}`,
        `dwrate_probability_${index}`
      ]
    }))
  }
];

const questProbabilityQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszname", "wsznote"]
  },
  {
    title: "Settings",
    columns: ["eusetype", "byprobabilitytype", "ballowblank", "bycount"]
  }
];

const questProbabilityQuickStats = [
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
    label: 'Probability Type', 
    column: 'byprobabilitytype',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
];

interface QuestProbabilityFormProps {
  initialData?: QuestProbabilityFormData;
  onSubmit: (data: QuestProbabilityFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function QuestProbabilityForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: QuestProbabilityFormProps) {
  return (
    <ModularForm<QuestProbabilityFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={questProbabilityTabs}
      quickViewSections={questProbabilityQuickViewSections}
      quickStats={questProbabilityQuickStats}
      customSchema={questProbabilitySchema}
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
