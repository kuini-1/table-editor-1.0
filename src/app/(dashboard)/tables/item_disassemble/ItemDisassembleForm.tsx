import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemDisassembleTableFormData } from "./schema";
import { columns, itemDisassembleTableSchema } from "./schema";

const itemDisassembleTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this item disassemble entry',
    columns: ['tblidx', 'ByMat2Rate', 'ByMat3Rate']
  },
  {
    id: 'results-0-4',
    title: 'Item Results 0-4',
    description: 'Configure item results 0 through 4',
    columns: ['ItemTblidxResult_0', 'ItemTblidxResult_1', 'ItemTblidxResult_2', 'ItemTblidxResult_3', 'ItemTblidxResult_4']
  },
  {
    id: 'results-5-9',
    title: 'Item Results 5-9',
    description: 'Configure item results 5 through 9',
    columns: ['ItemTblidxResult_5', 'ItemTblidxResult_6', 'ItemTblidxResult_7', 'ItemTblidxResult_8', 'ItemTblidxResult_9']
  }
];

const itemDisassembleQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'ByMat2Rate', 'ByMat3Rate']
  }
];

const itemDisassembleQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Material 2 Rate', column: 'ByMat2Rate', color: 'blue' },
];

interface ItemDisassembleFormProps {
  initialData?: Partial<ItemDisassembleTableFormData>;
  onSubmit: (data: ItemDisassembleTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ItemDisassembleForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemDisassembleFormProps) {
  return (
    <ModularForm<ItemDisassembleTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={itemDisassembleTableSections}
      quickViewSections={itemDisassembleQuickViewSections}
      quickStats={itemDisassembleQuickStats}
      customSchema={itemDisassembleTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

