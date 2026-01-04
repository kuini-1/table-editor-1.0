import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MobDataServerTableFormData } from "./schema";
import { columns, mobDataServerTableSchema } from "./schema";

const mobDataServerTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this mob data server entry',
    columns: ['tblidx', 'bValidity_Able', 'dwServerBitFlag']
  }
];

const mobDataServerQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'bValidity_Able', 'dwServerBitFlag']
  }
];

const mobDataServerQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Validity', column: 'bValidity_Able', color: 'green' },
];

interface MobDataServerFormProps {
  initialData?: Partial<MobDataServerTableFormData>;
  onSubmit: (data: MobDataServerTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function MobDataServerForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MobDataServerFormProps) {
  return (
    <ModularForm<MobDataServerTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={mobDataServerTableSections}
      quickViewSections={mobDataServerQuickViewSections}
      quickStats={mobDataServerQuickStats}
      customSchema={mobDataServerTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

