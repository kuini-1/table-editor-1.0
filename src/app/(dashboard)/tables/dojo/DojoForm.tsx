import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DojoTableFormData } from "./schema";
import { columns, dojoTableSchema } from "./schema";

const dojoTableTabs = [
  {
    id: 'basic',
    label: 'Basic Settings',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this dojo entry',
        columns: ['tblidx', 'zoneTblidx', 'mapName', 'byReceiveHour', 'byReceiveMinute', 'byRepeatType', 'byRepeatTime', 'wWeekBitFlag']
      },
      {
        id: 'durations',
        title: 'Duration Settings',
        description: 'Configure duration settings',
        columns: ['byReceiveDuration', 'byRejectDuration', 'byStandbyDuration', 'byInitialDuration', 'byReadyDuration', 'byBattleDuration']
      },
      {
        id: 'points',
        title: 'Point Settings',
        description: 'Configure point settings',
        columns: ['dwReceivePoint', 'dwReceiveZenny', 'controllerTblidx', 'dwBattlePointGoal', 'dwBattlePointGet', 'dwBattlePointCharge', 'dwChargePointGoal', 'dwChargeTime', 'dwChageTimePoint', 'rockTblidx']
      }
    ]
  },
  {
    id: 'objects',
    label: 'Objects & Rewards',
    sections: [
      {
        id: 'objects',
        title: 'Object Table IDs',
        description: 'Configure object table IDs',
        columns: ['objectTblidx_0', 'objectTblidx_1', 'objectTblidx_2', 'objectTblidx_3', 'objectTblidx_4', 'objectTblidx_5', 'objectTblidx_6', 'objectTblidx_7', 'objectTblidx_8', 'objectTblidx_9']
      },
      {
        id: 'rewards-0-4',
        title: 'Rewards 0-4',
        description: 'Configure rewards 0 through 4',
        columns: ['asRawrd_0_dwGetPoint', 'asRawrd_0_byGetRock', 'asRawrd_1_dwGetPoint', 'asRawrd_1_byGetRock', 'asRawrd_2_dwGetPoint', 'asRawrd_2_byGetRock', 'asRawrd_3_dwGetPoint', 'asRawrd_3_byGetRock', 'asRawrd_4_dwGetPoint', 'asRawrd_4_byGetRock']
      },
      {
        id: 'rewards-5-9',
        title: 'Rewards 5-9',
        description: 'Configure rewards 5 through 9',
        columns: ['asRawrd_5_dwGetPoint', 'asRawrd_5_byGetRock', 'asRawrd_6_dwGetPoint', 'asRawrd_6_byGetRock', 'asRawrd_7_dwGetPoint', 'asRawrd_7_byGetRock', 'asRawrd_8_dwGetPoint', 'asRawrd_8_byGetRock', 'asRawrd_9_dwGetPoint', 'asRawrd_9_byGetRock']
      }
    ]
  }
];

const dojoQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'zoneTblidx', 'mapName']
  }
];

const dojoQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Zone Table ID', column: 'zoneTblidx', color: 'blue' },
];

interface DojoFormProps {
  initialData?: Partial<DojoTableFormData>;
  onSubmit: (data: DojoTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DojoForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DojoFormProps) {
  return (
    <ModularForm<DojoTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={dojoTableTabs}
      quickViewSections={dojoQuickViewSections}
      quickStats={dojoQuickStats}
      customSchema={dojoTableSchema}
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

