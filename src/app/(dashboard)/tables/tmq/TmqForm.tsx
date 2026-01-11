import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { TmqTableFormData } from "./schema";
import { columns, tmqTableSchema } from "./schema";

const generateTimeQuestDatasetSection = (datasetIndex: number) => ({
  id: `time-quest-dataset-${datasetIndex}`,
  title: `Time Quest Dataset ${datasetIndex}`,
  description: `Configure time quest dataset ${datasetIndex} settings`,
  columns: [
    `sTimeQuestDataset_${datasetIndex}_nameTblidx`,
    `sTimeQuestDataset_${datasetIndex}_questStringTblidx`,
    `sTimeQuestDataset_${datasetIndex}_worldTblidx`,
    `sTimeQuestDataset_${datasetIndex}_scriptTblidx`,
    `sTimeQuestDataset_${datasetIndex}_byMinMemberCount`,
    `sTimeQuestDataset_${datasetIndex}_byMaxMemberCount`,
    `sTimeQuestDataset_${datasetIndex}_byMinMemberLevel`,
    `sTimeQuestDataset_${datasetIndex}_byMaxMemberLevel`,
    `sTimeQuestDataset_${datasetIndex}_dwLimitTime`,
    `sTimeQuestDataset_${datasetIndex}_dwNeedZenny`,
    `sTimeQuestDataset_${datasetIndex}_needItemTblidx`,
    `sTimeQuestDataset_${datasetIndex}_byNeedLimitCount`,
    `sTimeQuestDataset_${datasetIndex}_byWorldCount`,
    `sTimeQuestDataset_${datasetIndex}_dayRecordRewardTblidx`,
    `sTimeQuestDataset_${datasetIndex}_bestRecordRewardTblidx`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any[],
});

const tmqTableTabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this TMQ entry',
        columns: ['tblidx', 'byTimeQuestType', 'byDifficultyFlag', 'dwStartTime', 'byResetTime', 'wszPrologueDirection', 'openCine', 'Note']
      },
      {
        id: 'triggers',
        title: 'Trigger Settings',
        description: 'Configure trigger settings',
        columns: ['startCharacterDirection', 'startObjectIndex', 'startTriggerId', 'arriveCharacterDirection', 'arriveObjectIndex', 'arriveTriggerId', 'leaveCharacterDirection', 'leaveObjectIndex', 'leaveTriggerId']
      },
      {
        id: 'start-trigger-states',
        title: 'Start Trigger Direction States',
        description: 'Configure start trigger direction states',
        columns: ['abyStartTriggerDirectionState_0', 'abyStartTriggerDirectionState_1', 'abyStartTriggerDirectionState_2', 'abyStartTriggerDirectionState_3', 'abyStartTriggerDirectionState_4', 'abyStartTriggerDirectionState_5', 'abyStartTriggerDirectionState_6', 'abyStartTriggerDirectionState_7', 'abyStartTriggerDirectionState_8', 'abyStartTriggerDirectionState_9']
      },
      {
        id: 'mail-rewards',
        title: 'Mail Rewards',
        description: 'Configure mail rewards',
        columns: ['dayRecordMailTblidx', 'bestRecordMailTblidx']
      },
      {
        id: 'bgm',
        title: 'BGM Settings',
        description: 'Configure BGM settings',
        columns: ['wszStageBgm1', 'wszStageBgm2', 'wszLastBgm']
      }
    ]
  },
  {
    id: 'datasets',
    label: 'Time Quest Datasets',
    sections: [
      generateTimeQuestDatasetSection(0),
      generateTimeQuestDatasetSection(1),
      generateTimeQuestDatasetSection(2),
    ]
  }
];

const tmqQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byTimeQuestType', 'byDifficultyFlag']
  }
];

const tmqQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Time Quest Type', column: 'byTimeQuestType', color: 'blue' },
];

interface TmqFormProps {
  initialData?: Partial<TmqTableFormData>;
  onSubmit: (data: TmqTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function TmqForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: TmqFormProps) {
  return (
    <ModularForm<TmqTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={tmqTableTabs}
      quickViewSections={tmqQuickViewSections}
      quickStats={tmqQuickStats}
      customSchema={tmqTableSchema}
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

