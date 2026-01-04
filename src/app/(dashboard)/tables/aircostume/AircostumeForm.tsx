import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { AircostumeTableFormData } from "./schema";
import { columns, aircostumeTableSchema } from "./schema";

const aircostumeTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this aircostume entry',
    columns: ['tblidx', 'wUnknown', 'byUnknown2', 'byUnknown3', 'byUnknown4']
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Enter additional aircostume details',
    columns: ['wUnknown5', 'wUnknown6', 'wUnknown7', 'wszUnknown8', 'byUnknown9', 'wszUnknown10', 'wszUnknown11']
  }
];

const aircostumeQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wUnknown', 'byUnknown2']
  }
];

const aircostumeQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Unknown', column: 'wUnknown', color: 'blue' },
];

interface AircostumeFormProps {
  initialData?: Partial<AircostumeTableFormData>;
  onSubmit: (data: AircostumeTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function AircostumeForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: AircostumeFormProps) {
  return (
    <ModularForm<AircostumeTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={aircostumeTableSections}
      quickViewSections={aircostumeQuickViewSections}
      quickStats={aircostumeQuickStats}
      customSchema={aircostumeTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

