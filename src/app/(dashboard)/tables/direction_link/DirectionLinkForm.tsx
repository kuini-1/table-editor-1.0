import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DirectionLinkTableFormData } from "./schema";
import { columns, directionLinkTableSchema } from "./schema";

const directionLinkTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this direction link entry',
    columns: ['tblidx', 'szFunctionName', 'szNote', 'byType', 'dwAnimationID', 'byFuncFlag']
  }
];

const directionLinkQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'szFunctionName', 'byType']
  }
];

const directionLinkQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Function Name', column: 'szFunctionName', color: 'blue' },
];

interface DirectionLinkFormProps {
  initialData?: Partial<DirectionLinkTableFormData>;
  onSubmit: (data: DirectionLinkTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DirectionLinkForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DirectionLinkFormProps) {
  return (
    <ModularForm<DirectionLinkTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={directionLinkTableSections}
      quickViewSections={directionLinkQuickViewSections}
      quickStats={directionLinkQuickStats}
      customSchema={directionLinkTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

