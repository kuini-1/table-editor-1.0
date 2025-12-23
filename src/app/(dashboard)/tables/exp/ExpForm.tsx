import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ExpTableFormData } from "./schema";
import { columns, expTableSchema } from "./schema";

const expTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this experience entry',
    columns: ['tblidx', 'dwExp', 'dwNeed_Exp']
  }
];

const expQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwExp', 'dwNeed_Exp']
  }
];

const expQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Experience', column: 'dwExp', color: 'green' },
  { label: 'Required Exp', column: 'dwNeed_Exp', color: 'blue' },
];

const expTableTabs = [
  {
    id: 'solo',
    label: 'Solo Statistics',
    sections: [
      {
        id: 'solo-stats',
        title: 'Solo Statistics',
        description: 'Configure statistics for solo gameplay',
        columns: [
          'wStageWinSolo',
          'wStageDrawSolo',
          'wStageLoseSolo',
          'wWinSolo',
          'wPerfectWinSolo'
        ]
      }
    ]
  },
  {
    id: 'team',
    label: 'Team Statistics',
    sections: [
      {
        id: 'team-stats',
        title: 'Team Statistics',
        description: 'Configure statistics for team gameplay',
        columns: [
          'wStageWinTeam',
          'wStageDrawTeam',
          'wStageLoseTeam',
          'wWinTeam',
          'wPerfectWinTeam'
        ]
      }
    ]
  },
  {
    id: 'other',
    label: 'Other Statistics',
    sections: [
      {
        id: 'other-stats',
        title: 'Other Statistics',
        description: 'Configure additional game statistics',
        columns: [
          'wNormal_Race',
          'wSuperRace',
          'dwMobExp',
          'dwPhyDefenceRef',
          'dwEngDefenceRef',
          'dwMobZenny'
        ]
      }
    ]
  }
];

interface ExpFormProps {
  initialData?: Partial<ExpTableFormData>;
  onSubmit: (data: ExpTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ExpForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ExpFormProps) {
  return (
    <ModularForm<ExpTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={expTableSections}
      tabs={expTableTabs}
      quickViewSections={expQuickViewSections}
      quickStats={expQuickStats}
      customSchema={expTableSchema}
      defaultTab="solo"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
} 