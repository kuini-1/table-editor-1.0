import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DbReturnpointTableFormData } from "./schema";
import { columns, dbReturnpointTableSchema } from "./schema";

const dbReturnpointTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this return point entry',
    columns: ['tblidx', 'byScatterPoint', 'fField_X', 'fField_Y', 'fField_Z']
  }
];

const dbReturnpointQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byScatterPoint', 'fField_X', 'fField_Y', 'fField_Z']
  }
];

const dbReturnpointQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Scatter Point', column: 'byScatterPoint', color: 'blue' },
];

interface DbReturnpointFormProps {
  initialData?: Partial<DbReturnpointTableFormData>;
  onSubmit: (data: DbReturnpointTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DbReturnpointForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DbReturnpointFormProps) {
  return (
    <ModularForm<DbReturnpointTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={dbReturnpointTableSections}
      quickViewSections={dbReturnpointQuickViewSections}
      quickStats={dbReturnpointQuickStats}
      customSchema={dbReturnpointTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

