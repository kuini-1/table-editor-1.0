import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemMixMachineTableFormData } from "./schema";
import { columns, itemMixMachineTableSchema } from "./schema";

const itemMixMachineTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this item mix machine entry',
    columns: ['tblidx', 'bValidityAble', 'name', 'byMachineType', 'wFunctionBitFlag', 'byMixZennyDiscountRate', 'dynamicObjectTblidx']
  },
  {
    id: 'recipes-0-4',
    title: 'Built In Recipes 0-4',
    description: 'Configure built in recipes 0 through 4',
    columns: ['aBuiltInRecipeTblidx_0', 'aBuiltInRecipeTblidx_1', 'aBuiltInRecipeTblidx_2', 'aBuiltInRecipeTblidx_3', 'aBuiltInRecipeTblidx_4']
  },
  {
    id: 'recipes-5-9',
    title: 'Built In Recipes 5-9',
    description: 'Configure built in recipes 5 through 9',
    columns: ['aBuiltInRecipeTblidx_5', 'aBuiltInRecipeTblidx_6', 'aBuiltInRecipeTblidx_7', 'aBuiltInRecipeTblidx_8', 'aBuiltInRecipeTblidx_9']
  }
];

const itemMixMachineQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'name', 'byMachineType']
  }
];

const itemMixMachineQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name', column: 'name', color: 'blue' },
];

interface ItemMixMachineFormProps {
  initialData?: Partial<ItemMixMachineTableFormData>;
  onSubmit: (data: ItemMixMachineTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ItemMixMachineForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemMixMachineFormProps) {
  return (
    <ModularForm<ItemMixMachineTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={itemMixMachineTableSections}
      quickViewSections={itemMixMachineQuickViewSections}
      quickStats={itemMixMachineQuickStats}
      customSchema={itemMixMachineTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

