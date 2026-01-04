import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DynamicObjectTableFormData } from "./schema";
import { columns, dynamicObjectTableSchema } from "./schema";

const dynamicObjectTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this dynamic object entry',
    columns: ['tblidx', 'bValidityAble', 'byType', 'szModelName', 'byStateType']
  },
  {
    id: 'animations',
    title: 'Animation Settings',
    description: 'Configure animation settings',
    columns: ['spawnAnimation', 'idleAnimation', 'despawnAnimation', 'state1Animation', 'state2Animation']
  },
  {
    id: 'distance',
    title: 'Distance Settings',
    description: 'Configure distance settings',
    columns: ['byBoundaryDistance', 'byDespawnDistance']
  }
];

const dynamicObjectQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'szModelName', 'byType']
  }
];

const dynamicObjectQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Model Name', column: 'szModelName', color: 'blue' },
];

interface DynamicObjectFormProps {
  initialData?: Partial<DynamicObjectTableFormData>;
  onSubmit: (data: DynamicObjectTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DynamicObjectForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DynamicObjectFormProps) {
  return (
    <ModularForm<DynamicObjectTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={dynamicObjectTableSections}
      quickViewSections={dynamicObjectQuickViewSections}
      quickStats={dynamicObjectQuickStats}
      customSchema={dynamicObjectTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

