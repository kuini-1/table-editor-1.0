import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { QuestRewardSelectTableFormData } from "./schema";
import { columns, questRewardSelectTableSchema } from "./schema";

const questRewardSelectTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this quest reward select entry',
    columns: ['tblidx', 'bySelect_Type']
  },
  {
    id: 'reward-sets-0-4',
    title: 'Reward Sets 0-4',
    description: 'Configure reward sets 0 through 4',
    columns: ['aRewardSet_0_byRewardType', 'aRewardSet_0_dwRewardIdx', 'aRewardSet_0_dwRewardVal', 'aRewardSet_1_byRewardType', 'aRewardSet_1_dwRewardIdx', 'aRewardSet_1_dwRewardVal', 'aRewardSet_2_byRewardType', 'aRewardSet_2_dwRewardIdx', 'aRewardSet_2_dwRewardVal', 'aRewardSet_3_byRewardType', 'aRewardSet_3_dwRewardIdx', 'aRewardSet_3_dwRewardVal', 'aRewardSet_4_byRewardType', 'aRewardSet_4_dwRewardIdx', 'aRewardSet_4_dwRewardVal']
  },
  {
    id: 'reward-sets-5-9',
    title: 'Reward Sets 5-9',
    description: 'Configure reward sets 5 through 9',
    columns: ['aRewardSet_5_byRewardType', 'aRewardSet_5_dwRewardIdx', 'aRewardSet_5_dwRewardVal', 'aRewardSet_6_byRewardType', 'aRewardSet_6_dwRewardIdx', 'aRewardSet_6_dwRewardVal', 'aRewardSet_7_byRewardType', 'aRewardSet_7_dwRewardIdx', 'aRewardSet_7_dwRewardVal', 'aRewardSet_8_byRewardType', 'aRewardSet_8_dwRewardIdx', 'aRewardSet_8_dwRewardVal', 'aRewardSet_9_byRewardType', 'aRewardSet_9_dwRewardIdx', 'aRewardSet_9_dwRewardVal']
  }
];

const questRewardSelectQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'bySelect_Type']
  }
];

const questRewardSelectQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Select Type', column: 'bySelect_Type', color: 'blue' },
];

interface QuestRewardSelectFormProps {
  initialData?: Partial<QuestRewardSelectTableFormData>;
  onSubmit: (data: QuestRewardSelectTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function QuestRewardSelectForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: QuestRewardSelectFormProps) {
  return (
    <ModularForm<QuestRewardSelectTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={questRewardSelectTableSections}
      quickViewSections={questRewardSelectQuickViewSections}
      quickStats={questRewardSelectQuickStats}
      customSchema={questRewardSelectTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

