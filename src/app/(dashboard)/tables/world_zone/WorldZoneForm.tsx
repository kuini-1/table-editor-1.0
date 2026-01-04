import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { WorldZoneTableFormData } from "./schema";
import { columns, worldZoneTableSchema } from "./schema";

const worldZoneTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this world zone entry',
    columns: ['tblidx', 'wFunctionBitFlag', 'worldTblidx', 'nameTblidx', 'wszName_Text', 'bForbidden_Vehicle']
  }
];

const worldZoneQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'worldTblidx', 'wszName_Text']
  }
];

const worldZoneQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'World Table ID', column: 'worldTblidx', color: 'blue' },
];

interface WorldZoneFormProps {
  initialData?: Partial<WorldZoneTableFormData>;
  onSubmit: (data: WorldZoneTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function WorldZoneForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: WorldZoneFormProps) {
  return (
    <ModularForm<WorldZoneTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={worldZoneTableSections}
      quickViewSections={worldZoneQuickViewSections}
      quickStats={worldZoneQuickStats}
      customSchema={worldZoneTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

