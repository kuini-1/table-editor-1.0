import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DwcMissionTableFormData } from "./schema";
import { columns, dwcMissionTableSchema } from "./schema";

const generateRewardSections = (rewardIndex: number) => ({
  id: `reward-${rewardIndex}`,
  title: `Reward ${rewardIndex}`,
  description: `Configure reward ${rewardIndex} settings`,
  columns: [
    `asReward_${rewardIndex}_cardNameTblidx`,
    `asReward_${rewardIndex}_byRequireCount`,
    `asReward_${rewardIndex}_fAcquireRate`,
    `asReward_${rewardIndex}_asBasicReward_0_byType`,
    `asReward_${rewardIndex}_asBasicReward_0_tblidx`,
    `asReward_${rewardIndex}_asBasicReward_0_byValue`,
    `asReward_${rewardIndex}_asRepeatReward_0_byType`,
    `asReward_${rewardIndex}_asRepeatReward_0_tblidx`,
    `asReward_${rewardIndex}_asRepeatReward_0_byValue`,
    `asReward_${rewardIndex}_asBasicReward_1_byType`,
    `asReward_${rewardIndex}_asBasicReward_1_tblidx`,
    `asReward_${rewardIndex}_asBasicReward_1_byValue`,
    `asReward_${rewardIndex}_asRepeatReward_1_byType`,
    `asReward_${rewardIndex}_asRepeatReward_1_tblidx`,
    `asReward_${rewardIndex}_asRepeatReward_1_byValue`,
  ] as any[],
});

const dwcMissionTableTabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this DWC mission entry',
        columns: ['tblidx', 'tblNameIndex', 'szImageName', 'tblContainScenarioIndex', 'byCompleteMinNum', 'byCompleteMaxNum', 'byDifficulty', 'clearObjectTextTblidx', 'clearConditionTextTblidx']
      }
    ]
  },
  {
    id: 'rewards',
    label: 'Rewards',
    sections: [
      generateRewardSections(0),
      generateRewardSections(1),
      generateRewardSections(2),
      generateRewardSections(3),
      generateRewardSections(4),
    ]
  }
];

const dwcMissionQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'tblNameIndex', 'byDifficulty']
  }
];

const dwcMissionQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Index', column: 'tblNameIndex', color: 'blue' },
];

interface DwcMissionFormProps {
  initialData?: Partial<DwcMissionTableFormData>;
  onSubmit: (data: DwcMissionTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DwcMissionForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DwcMissionFormProps) {
  return (
    <ModularForm<DwcMissionTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={dwcMissionTableTabs}
      quickViewSections={dwcMissionQuickViewSections}
      quickStats={dwcMissionQuickStats}
      customSchema={dwcMissionTableSchema}
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

