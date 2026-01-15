import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemMixExpFormData } from "./schema";
import { columns, itemMixExpSchema } from "./schema";

const itemMixExpSections = [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this item mix experience entry',
        columns: ['tblidx', 'dwNeedEXP', 'byUnknown']
      }
];

const itemMixExpQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwNeedEXP', 'byUnknown']
  }
];

const itemMixExpQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Need EXP', column: 'dwNeedEXP', color: 'blue' },
];

interface ItemMixExpFormProps {
  initialData?: ItemMixExpFormData;
  onSubmit: (data: ItemMixExpFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function ItemMixExpForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemMixExpFormProps) {
  return (
    <ModularForm<ItemMixExpFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={itemMixExpSections}
      quickViewSections={itemMixExpQuickViewSections}
      quickStats={itemMixExpQuickStats}
      customSchema={itemMixExpSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
} 