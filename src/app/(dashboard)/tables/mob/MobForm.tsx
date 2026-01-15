import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MobFormData } from "./schema";
import { columns, mobSchema } from "./schema";

const mobTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic mob information",
        columns: ["szNameText", "szModel", "szILLust", "bValidity_Able", "bShow_Name"]
      }
    ]
  },
  {
    id: "stats",
    label: "Stats",
    sections: [
      {
        id: "base-stats",
        title: "Base Stats",
        description: "Base statistics",
        columns: []
      },
      {
        id: "combat-stats",
        title: "Combat Stats",
        description: "Combat statistics",
        columns: []
      },
      {
        id: "attributes",
        title: "Attributes",
        description: "Base attribute values",
        columns: ["wBasicStr", "wBasicCon", "wBasicFoc", "wBasicDex", "wBasicSol", "wBasicEng"]
      }
    ]
  },
  {
    id: "combat",
    label: "Combat",
    sections: [
      {
        id: "combat-settings",
        title: "Combat Settings",
        description: "Combat behavior configuration",
        columns: [
          "byBattle_Attribute",
          "wAttack_Speed_Rate",
          "byAttack_Type",
          "fAttack_Range",
          "wAttack_Rate",
          "wDodge_Rate",
          "wBlock_Rate",
          "wCurse_Success_Rate",
          "wCurse_Tolerance_Rate",
          "wBasic_Aggro_Point",
          "byAttack_Animation_Quantity",
          "wAttackCoolTime"
        ]
      }
    ]
  },
  {
    id: "movement",
    label: "Movement",
    sections: [
      {
        id: "movement-settings",
        title: "Movement Settings",
        description: "Movement speed and range",
        columns: [
          "fWalk_Speed_Origin",
          "fWalk_Speed",
          "fRun_Speed_Origin",
          "fRun_Speed",
          "fRadius_X",
          "fRadius_Z",
          "fRadius",
          "fFly_Height",
          "fScale"
        ]
      }
    ]
  },
  {
    id: "perception",
    label: "Perception",
    sections: [
      {
        id: "perception-settings",
        title: "Perception Settings",
        description: "Detection and sight configuration",
        columns: [
          "wSight_Range",
          "wScan_Range",
          "byVisible_Sight_Range",
          "wSightAngle",
          "szCamera_Bone_Name"
        ]
      }
    ]
  },
  {
    id: "defense",
    label: "Defense",
    sections: [
      {
        id: "defense-stats",
        title: "Defense Stats",
        description: "Defensive capabilities",
        columns: [
          "wStomachacheDefence",
          "wPoisonDefence",
          "wBleedDefence",
          "wBurnDefence",
          "dwImmunity_Bit_Flag"
        ]
      }
    ]
  },
  {
    id: "regen",
    label: "Regeneration",
    sections: [
      {
        id: "regen-settings",
        title: "Regeneration Settings",
        description: "Health and energy regeneration",
        columns: [
          "wLP_Regeneration",
          "wEP_Regeneration"
        ]
      }
    ]
  },
  {
    id: "drops",
    label: "Drops",
    sections: [
      {
        id: "drop-settings",
        title: "Drop Settings",
        description: "Item and currency drops",
        columns: [
          "dwDrop_Zenny",
          "fDrop_Zenny_Rate",
          "dwExp",
          "drop_Item_Tblidx",
          "dropQuestTblidx",
          "idxBigBag1",
          "byDropRate1",
          "byTryCount1",
          "idxBigBag2",
          "byDropRate2",
          "byTryCount2",
          "idxBigBag3",
          "byDropRate3",
          "byTryCount3",
          "bIsDragonBallDrop",
          "fRewardExpRate",
          "fRewardZennyRate"
        ]
      }
    ]
  },
  {
    id: "ai",
    label: "AI & Behavior",
    sections: [
      {
        id: "ai-settings",
        title: "AI & Behavior Settings",
        description: "AI behavior and mob properties",
        columns: [
          "dwAi_Bit_Flag",
          "bSpawn_Animation",
          "dwDialogGroup",
          "dwAllianceIdx",
          "wAggroMaxCount",
          "dwNpcAttributeFlag",
          "dwMobGroup",
          "wMob_Kind",
          "byMob_Type",
          "bSize",
          "wTMQPoint",
          "wMonsterClass",
          "wUseRace"
        ]
      }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    sections: [
      {
        id: "formula-settings",
        title: "Formula Settings",
        description: "Formula and rate multipliers",
        columns: [
          "dwFormulaOffset",
          "fSettingRate_LP",
          "fSettingRate_LPRegen",
          "fSettingRate_PhyOffence",
          "fSettingRate_EngOffence",
          "fSettingRate_PhyDefence",
          "fSettingRate_EngDefence",
          "fSettingRate_AttackRate",
          "fSettingRate_DodgeRate",
          "fSettingPhyOffenceRate",
          "fSettingEngOffenceRate",
          "fSettingRate_Defence_Role"
        ]
      }
    ]
  },
  {
    id: "skills1",
    label: "Skills 1-3",
    sections: Array.from({ length: 3 }, (_, i) => ({
      id: `skill-${i}`,
      title: `Skill ${i}`,
      description: `Configure skill ${i}`,
      columns: [
        `wuse_skill_time_${i}`,
        `use_skill_tblidx_${i}`,
        `byuse_skill_basis_${i}`,
        `wuse_skill_lp_${i}`
      ]
    }))
  },
  {
    id: "skills2",
    label: "Skills 4-7",
    sections: Array.from({ length: 4 }, (_, i) => ({
      id: `skill-${i + 3}`,
      title: `Skill ${i + 3}`,
      description: `Configure skill ${i + 3}`,
      columns: [
        `wuse_skill_time_${i + 3}`,
        `use_skill_tblidx_${i + 3}`,
        `byuse_skill_basis_${i + 3}`,
        `wuse_skill_lp_${i + 3}`
      ]
    }))
  },
  {
    id: "other",
    label: "Other",
    sections: [
      {
        id: "other-settings",
        title: "Other Settings",
        description: "Miscellaneous settings",
        columns: [
          "dwUnknown",
          "byUnknown",
          "byUnknown2"
        ]
      }
    ]
  }
];

const mobQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "Name", "wszNameText", "byLevel", "byGrade"]
  },
  {
    title: "Combat Stats",
    columns: ["wBasic_Physical_Offence", "wBasic_Energy_Offence", "wBasic_Physical_Defence", "wBasic_Energy_Defence"]
  },
  {
    title: "Base Stats",
    columns: ["dwBasic_LP", "wBasic_EP"]
  }
];

const mobQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Level', 
    column: 'byLevel',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Physical Attack', 
    column: 'wBasic_Physical_Offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'green'
  },
  { 
    label: 'Energy Attack', 
    column: 'wBasic_Energy_Offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'blue'
  },
  { 
    label: 'EXP', 
    column: 'dwExp',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'purple'
  },
];

interface MobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: MobFormData;
  onSubmit: (data: MobFormData) => void;
  tableId: string;
}

export function MobForm({
  initialData,
  onSubmit,
  mode,
  tableId,
  onOpenChange,
}: MobFormProps) {
  return (
    <ModularForm<MobFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={mobTabs}
      quickViewSections={mobQuickViewSections}
      quickStats={mobQuickStats}
      customSchema={mobSchema}
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
