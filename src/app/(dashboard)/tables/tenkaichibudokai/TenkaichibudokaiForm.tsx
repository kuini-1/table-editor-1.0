import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { TenkaichibudokaiTableFormData } from "./schema";
import { columns, tenkaichibudokaiTableSchema } from "./schema";

const tenkaichibudokaiTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this tenkaichibudokai entry',
    columns: ['tblidx', 'wstrName']
  },
  {
    id: 'values-0-4',
    title: 'Values 0-4',
    description: 'Configure values 0 through 4',
    columns: ['wstrValue_0', 'wstrValue_1', 'wstrValue_2', 'wstrValue_3', 'wstrValue_4']
  },
  {
    id: 'values-5-9',
    title: 'Values 5-9',
    description: 'Configure values 5 through 9',
    columns: ['wstrValue_5', 'wstrValue_6', 'wstrValue_7', 'wstrValue_8', 'wstrValue_9']
  }
];

const tenkaichibudokaiQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wstrName']
  }
];

const tenkaichibudokaiQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name', column: 'wstrName', color: 'blue' },
];

interface TenkaichibudokaiFormProps {
  initialData?: Partial<TenkaichibudokaiTableFormData>;
  onSubmit: (data: TenkaichibudokaiTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function TenkaichibudokaiForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: TenkaichibudokaiFormProps) {
  return (
    <ModularForm<TenkaichibudokaiTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={tenkaichibudokaiTableSections}
      quickViewSections={tenkaichibudokaiQuickViewSections}
      quickStats={tenkaichibudokaiQuickStats}
      customSchema={tenkaichibudokaiTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

