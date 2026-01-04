import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { QuestRewardTableFormData } from "./schema";
import { columns, questRewardTableSchema } from "./schema";

const questRewardTableTabs = [
  {
    id: 'basic',
    label: 'Basic Rewards',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic reward details',
        columns: ['tblidx', 'dwDef_Reward_EXP', 'dwDef_Reward_Zeny']
      },
      {
        id: 'def-rewards-0-4',
        title: 'Default Rewards 0-4',
        description: 'Configure default rewards 0 through 4',
        columns: ['arsDefRwd_0_byRewardType', 'arsDefRwd_0_dwRewardIdx', 'arsDefRwd_0_dwRewardVal', 'arsDefRwd_1_byRewardType', 'arsDefRwd_1_dwRewardIdx', 'arsDefRwd_1_dwRewardVal', 'arsDefRwd_2_byRewardType', 'arsDefRwd_2_dwRewardIdx', 'arsDefRwd_2_dwRewardVal', 'arsDefRwd_3_byRewardType', 'arsDefRwd_3_dwRewardIdx', 'arsDefRwd_3_dwRewardVal', 'arsDefRwd_4_byRewardType', 'arsDefRwd_4_dwRewardIdx', 'arsDefRwd_4_dwRewardVal']
      },
      {
        id: 'def-rewards-5-9',
        title: 'Default Rewards 5-9',
        description: 'Configure default rewards 5 through 9',
        columns: ['arsDefRwd_5_byRewardType', 'arsDefRwd_5_dwRewardIdx', 'arsDefRwd_5_dwRewardVal', 'arsDefRwd_6_byRewardType', 'arsDefRwd_6_dwRewardIdx', 'arsDefRwd_6_dwRewardVal', 'arsDefRwd_7_byRewardType', 'arsDefRwd_7_dwRewardIdx', 'arsDefRwd_7_dwRewardVal', 'arsDefRwd_8_byRewardType', 'arsDefRwd_8_dwRewardIdx', 'arsDefRwd_8_dwRewardVal', 'arsDefRwd_9_byRewardType', 'arsDefRwd_9_dwRewardIdx', 'arsDefRwd_9_dwRewardVal']
      }
    ]
  },
  {
    id: 'select',
    label: 'Select Rewards',
    sections: [
      {
        id: 'sel-rewards-0-4',
        title: 'Select Rewards 0-4',
        description: 'Configure select rewards 0 through 4',
        columns: ['arsSelRwd_0_byRewardType', 'arsSelRwd_0_dwRewardIdx', 'arsSelRwd_0_dwRewardVal', 'arsSelRwd_1_byRewardType', 'arsSelRwd_1_dwRewardIdx', 'arsSelRwd_1_dwRewardVal', 'arsSelRwd_2_byRewardType', 'arsSelRwd_2_dwRewardIdx', 'arsSelRwd_2_dwRewardVal', 'arsSelRwd_3_byRewardType', 'arsSelRwd_3_dwRewardIdx', 'arsSelRwd_3_dwRewardVal', 'arsSelRwd_4_byRewardType', 'arsSelRwd_4_dwRewardIdx', 'arsSelRwd_4_dwRewardVal']
      },
      {
        id: 'sel-rewards-5-9',
        title: 'Select Rewards 5-9',
        description: 'Configure select rewards 5 through 9',
        columns: ['arsSelRwd_5_byRewardType', 'arsSelRwd_5_dwRewardIdx', 'arsSelRwd_5_dwRewardVal', 'arsSelRwd_6_byRewardType', 'arsSelRwd_6_dwRewardIdx', 'arsSelRwd_6_dwRewardVal', 'arsSelRwd_7_byRewardType', 'arsSelRwd_7_dwRewardIdx', 'arsSelRwd_7_dwRewardVal', 'arsSelRwd_8_byRewardType', 'arsSelRwd_8_dwRewardIdx', 'arsSelRwd_8_dwRewardVal', 'arsSelRwd_9_byRewardType', 'arsSelRwd_9_dwRewardIdx', 'arsSelRwd_9_dwRewardVal']
      }
    ]
  }
];

const questRewardQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwDef_Reward_EXP', 'dwDef_Reward_Zeny']
  }
];

const questRewardQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Def Reward EXP', column: 'dwDef_Reward_EXP', color: 'blue' },
];

interface QuestRewardFormProps {
  initialData?: Partial<QuestRewardTableFormData>;
  onSubmit: (data: QuestRewardTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function QuestRewardForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: QuestRewardFormProps) {
  return (
    <ModularForm<QuestRewardTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={questRewardTableTabs}
      quickViewSections={questRewardQuickViewSections}
      quickStats={questRewardQuickStats}
      customSchema={questRewardTableSchema}
      defaultTab="basic"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

