import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MobMovePatternTableFormData } from "./schema";
import { columns, mobMovePatternTableSchema } from "./schema";

const mobMovePatternTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this mob move pattern entry',
    columns: ['tblidx']
  },
  {
    id: 'patterns-0-9',
    title: 'Patterns 0-9',
    description: 'Configure movement patterns 0 through 9',
    columns: ['abyPattern_0', 'abyPattern_1', 'abyPattern_2', 'abyPattern_3', 'abyPattern_4', 'abyPattern_5', 'abyPattern_6', 'abyPattern_7', 'abyPattern_8', 'abyPattern_9']
  },
  {
    id: 'patterns-10-19',
    title: 'Patterns 10-19',
    description: 'Configure movement patterns 10 through 19',
    columns: ['abyPattern_10', 'abyPattern_11', 'abyPattern_12', 'abyPattern_13', 'abyPattern_14', 'abyPattern_15', 'abyPattern_16', 'abyPattern_17', 'abyPattern_18', 'abyPattern_19']
  }
];

const mobMovePatternQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'abyPattern_0', 'abyPattern_1', 'abyPattern_2']
  }
];

const mobMovePatternQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Pattern 0', column: 'abyPattern_0', color: 'blue' },
];

interface MobMovePatternFormProps {
  initialData?: Partial<MobMovePatternTableFormData>;
  onSubmit: (data: MobMovePatternTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function MobMovePatternForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MobMovePatternFormProps) {
  return (
    <ModularForm<MobMovePatternTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={mobMovePatternTableSections}
      quickViewSections={mobMovePatternQuickViewSections}
      quickStats={mobMovePatternQuickStats}
      customSchema={mobMovePatternTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

