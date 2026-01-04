import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { WorldPlayTableFormData } from "./schema";
import { columns, worldPlayTableSchema } from "./schema";

const worldPlayTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this world play entry',
    columns: ['tblidx', 'dwGroup', 'byExecuterType', 'byShareType', 'dwShareLimitTime']
  }
];

const worldPlayQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwGroup', 'byExecuterType']
  }
];

const worldPlayQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Group', column: 'dwGroup', color: 'blue' },
];

interface WorldPlayFormProps {
  initialData?: Partial<WorldPlayTableFormData>;
  onSubmit: (data: WorldPlayTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function WorldPlayForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: WorldPlayFormProps) {
  return (
    <ModularForm<WorldPlayTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={worldPlayTableSections}
      quickViewSections={worldPlayQuickViewSections}
      quickStats={worldPlayQuickStats}
      customSchema={worldPlayTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

