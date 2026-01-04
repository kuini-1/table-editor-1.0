import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { PcTableFormData } from "./schema";
import { columns, pcTableSchema } from "./schema";

const pcTableTabs = [
  {
    id: 'basic',
    label: 'Basic Stats',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this PC entry',
        columns: ['tblidx', 'byRace', 'byGender', 'byClass', 'prior_Class_Tblidx', 'dwClass_Bit_Flag', 'szModel_Child', 'szModel_Adult']
      },
      {
        id: 'basic-stats',
        title: 'Basic Stats',
        description: 'Configure basic stats',
        columns: ['dwBasic_LP', 'wBasic_EP', 'wBasic_RP', 'wBasic_Physical_Defence', 'wBasic_Energy_Defence', 'wBasic_Physical_Offence', 'wBasic_Energy_Offence', 'dwWeightLimit']
      },
      {
        id: 'attributes',
        title: 'Basic Attributes',
        description: 'Configure basic attributes',
        columns: ['wBasicStr', 'wBasicCon', 'wBasicFoc', 'wBasicDex', 'wBasicSol', 'wBasicEng']
      }
    ]
  },
  {
    id: 'combat',
    label: 'Combat Stats',
    sections: [
      {
        id: 'combat',
        title: 'Combat Statistics',
        description: 'Configure combat statistics',
        columns: ['fScale', 'wAttack_Speed_Rate', 'byAttack_Type', 'fAttack_Range', 'wAttack_Rate', 'wDodge_Rate', 'wBlock_Rate', 'wCurse_Success_Rate', 'wCurse_Tolerance_Rate', 'fRadius', 'wBasic_Aggro_Point']
      }
    ]
  },
  {
    id: 'speed',
    label: 'Speed Settings',
    sections: [
      {
        id: 'child-speed',
        title: 'Child Speed Settings',
        description: 'Configure child speed settings',
        columns: ['fChild_Run_Speed_Origin', 'fChild_Run_Speed', 'fChild_Fly_Speed_Origin', 'fChild_Fly_Speed', 'fChild_Dash_Speed_Origin', 'fChild_Dash_Speed', 'fChild_Accel_Speed_Origin', 'fChild_Accel_Speed']
      },
      {
        id: 'adult-speed',
        title: 'Adult Speed Settings',
        description: 'Configure adult speed settings',
        columns: ['fAdult_Run_Speed_Origin', 'fAdult_Run_Speed', 'fAdult_Fly_Speed_Origin', 'fAdult_Fly_Speed', 'fAdult_Dash_Speed_Origin', 'fAdult_Dash_Speed', 'fAdult_Accel_Speed_Origin', 'fAdult_Accel_Speed']
      }
    ]
  },
  {
    id: 'level-up',
    label: 'Level Up Stats',
    sections: [
      {
        id: 'level-up-basic',
        title: 'Level Up Basic Stats',
        description: 'Configure level up basic stats',
        columns: ['byLevel_Up_LP', 'byLevel_Up_EP', 'byLevel_Up_RP', 'byLevel_Up_Physical_Offence', 'byLevel_Up_Physical_Defence', 'byLevel_Up_Energy_Offence', 'byLevel_Up_Energy_Defence']
      },
      {
        id: 'level-up-attributes',
        title: 'Level Up Attributes',
        description: 'Configure level up attributes',
        columns: ['fLevel_Up_Str', 'fLevel_Up_Con', 'fLevel_Up_Foc', 'fLevel_Up_Dex', 'fLevel_Up_Sol', 'fLevel_Up_Eng']
      }
    ]
  }
];

const pcQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byRace', 'byClass']
  }
];

const pcQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Race', column: 'byRace', color: 'blue' },
];

interface PcFormProps {
  initialData?: Partial<PcTableFormData>;
  onSubmit: (data: PcTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function PcForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: PcFormProps) {
  return (
    <ModularForm<PcTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={pcTableTabs}
      quickViewSections={pcQuickViewSections}
      quickStats={pcQuickStats}
      customSchema={pcTableSchema}
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

