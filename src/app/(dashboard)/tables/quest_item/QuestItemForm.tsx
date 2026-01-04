import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { QuestItemTableFormData } from "./schema";
import { columns, questItemTableSchema } from "./schema";

const questItemTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this quest item entry',
    columns: ['tblidx', 'ItemName', 'szIconName', 'Note', 'byFunctionBitFlag']
  }
];

const questItemQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'ItemName', 'szIconName']
  }
];

const questItemQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Item Name', column: 'ItemName', color: 'blue' },
];

interface QuestItemFormProps {
  initialData?: Partial<QuestItemTableFormData>;
  onSubmit: (data: QuestItemTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function QuestItemForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: QuestItemFormProps) {
  return (
    <ModularForm<QuestItemTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={questItemTableSections}
      quickViewSections={questItemQuickViewSections}
      quickStats={questItemQuickStats}
      customSchema={questItemTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

