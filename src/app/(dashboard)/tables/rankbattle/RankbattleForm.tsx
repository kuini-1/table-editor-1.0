import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { RankbattleTableFormData } from "./schema";
import { columns, rankbattleTableSchema } from "./schema";

const rankbattleTableTabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this rankbattle entry',
        columns: ['tblidx', 'byRuleType', 'byBattleMode', 'byMatchType', 'wszName', 'worldTblidx', 'needItemTblidx', 'dwZenny', 'byMinLevel', 'byMaxLevel', 'byBattleCount']
      }
    ]
  },
  {
    id: 'timing',
    label: 'Timing Settings',
    sections: [
      {
        id: 'timing',
        title: 'Timing Settings',
        description: 'Configure timing settings',
        columns: ['dwWaitTime', 'dwDirectionTime', 'dwMatchReadyTime', 'dwStageReadyTime', 'dwStageRunTime', 'dwStageFinishTime', 'dwMatchFinishTime', 'dwBossDirectionTime', 'dwBossKillTime', 'dwBossEndingTime', 'dwEndTime']
      }
    ]
  },
  {
    id: 'scores',
    label: 'Scores & Results',
    sections: [
      {
        id: 'scores',
        title: 'Score Settings',
        description: 'Configure score settings',
        columns: ['chScoreKO', 'chScoreOutOfArea', 'chScorePointWin', 'chScoreDraw', 'chScoreLose']
      },
      {
        id: 'results',
        title: 'Result Settings',
        description: 'Configure result settings',
        columns: ['chResultExcellent', 'chResultGreate', 'chResultGood', 'chResultDraw', 'chResultLose', 'chBonusPerfectWinner', 'chBonusNormalWinner']
      }
    ]
  },
  {
    id: 'other',
    label: 'Other Settings',
    sections: [
      {
        id: 'other',
        title: 'Other Settings',
        description: 'Configure other settings',
        columns: ['wszBGMName', 'byDayEntryNum', 'bOutSizeAble', 'szCameraName', 'dwInfoIndex', 'dwStateMinClearTime']
      }
    ]
  }
];

const rankbattleQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszName', 'byRuleType']
  }
];

const rankbattleQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name', column: 'wszName', color: 'blue' },
];

interface RankbattleFormProps {
  initialData?: Partial<RankbattleTableFormData>;
  onSubmit: (data: RankbattleTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function RankbattleForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: RankbattleFormProps) {
  return (
    <ModularForm<RankbattleTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={rankbattleTableTabs}
      quickViewSections={rankbattleQuickViewSections}
      quickStats={rankbattleQuickStats}
      customSchema={rankbattleTableSchema}
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

