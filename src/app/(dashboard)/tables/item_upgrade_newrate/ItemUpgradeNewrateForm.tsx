import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemUpgradeNewrateTableFormData } from "./schema";
import { columns, itemUpgradeNewrateTableSchema } from "./schema";

const itemUpgradeNewrateTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this item upgrade newrate entry',
    columns: ['tblidx', 'byItem_Type', 'byGrade']
  },
  {
    id: 'upgrade-rates',
    title: 'Upgrade Rates',
    description: 'Configure upgrade rates and values',
    columns: ['fAdditional_Ability', 'fUpgrade_Destroy_Rate', 'fUpgrade_Success_Basic_Value', 'fUpgrade_Success_Stone_Value', 'fUpgrade_RateStone_Value1', 'fUpgrade_RateStone_Value2']
  }
];

const itemUpgradeNewrateQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byItem_Type', 'byGrade']
  }
];

const itemUpgradeNewrateQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Item Type', column: 'byItem_Type', color: 'blue' },
];

interface ItemUpgradeNewrateFormProps {
  initialData?: Partial<ItemUpgradeNewrateTableFormData>;
  onSubmit: (data: ItemUpgradeNewrateTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ItemUpgradeNewrateForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemUpgradeNewrateFormProps) {
  return (
    <ModularForm<ItemUpgradeNewrateTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={itemUpgradeNewrateTableSections}
      quickViewSections={itemUpgradeNewrateQuickViewSections}
      quickStats={itemUpgradeNewrateQuickStats}
      customSchema={itemUpgradeNewrateTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

