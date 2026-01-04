import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { CharmTableFormData } from "./schema";
import { columns, charmTableSchema } from "./schema";

const charmTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this charm entry',
    columns: ['tblidx', 'wDrop_Rate', 'wEXP', 'wRP_Sharing']
  },
  {
    id: 'time-settings',
    title: 'Time Settings',
    description: 'Configure time-related settings',
    columns: ['wCool_Time', 'wKeep_Time', 'dwKeep_Time_In_Millisecs']
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Enter additional charm details',
    columns: ['dwNeed_Zenny', 'byDice_Min', 'byDice_Max', 'byCharm_Type_Bit_Flag']
  }
];

const charmQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wDrop_Rate', 'wEXP']
  }
];

const charmQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Drop Rate', column: 'wDrop_Rate', color: 'green' },
  { label: 'EXP', column: 'wEXP', color: 'blue' },
];

interface CharmFormProps {
  initialData?: Partial<CharmTableFormData>;
  onSubmit: (data: CharmTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function CharmForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: CharmFormProps) {
  return (
    <ModularForm<CharmTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={charmTableSections}
      quickViewSections={charmQuickViewSections}
      quickStats={charmQuickStats}
      customSchema={charmTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

