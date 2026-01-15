import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { NpcFormData } from "./schema";
import { columns, npcSchema } from "./schema";

const npcTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic NPC information",
        columns: ["tblidx", "bValidity_Able", "Name", "wszNameText", "szModel", "byLevel", "byGrade"]
      },
      {
        id: "display-settings",
        title: "Display Settings",
        description: "Configure display and visual settings",
        columns: ["szNameText", "bSpawn_Animation", "szILLust", "szCamera_Bone_Name", "fScale"]
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
        description: "Base health and energy statistics",
        columns: ["dwBasic_LP", "wBasic_EP", "wLP_Regeneration", "wEP_Regeneration"]
      },
      {
        id: "attributes",
        title: "Attributes",
        description: "Base attribute values",
        columns: ["wBasicStr", "wBasicCon", "wBasicFoc", "wBasicDex", "wBasicSol", "wBasicEng"]
      },
      {
        id: "defense-stats",
        title: "Defense Stats",
        description: "Defensive capabilities",
        columns: [
          "wBasic_Physical_Defence", "wBasic_Energy_Defence",
          "wStomachacheDefence", "wPoisonDefence", "wBleedDefence", "wBurnDefence"
        ]
      }
    ]
  },
  {
    id: "combat",
    label: "Combat",
    sections: [
      {
        id: "attack-settings",
        title: "Attack Settings",
        description: "Combat attack configuration",
        columns: [
          "wBasic_Physical_Offence", "wBasic_Energy_Offence",
          "byAttack_Type", "byAttack_Animation_Quantity",
          "wAttackCoolTime", "wAttack_Speed_Rate", "fAttack_Range"
        ]
      },
      {
        id: "combat-rates",
        title: "Combat Rates",
        description: "Combat success rates",
        columns: [
          "wAttack_Rate", "wDodge_Rate", "wBlock_Rate",
          "wCurse_Success_Rate", "wCurse_Tolerance_Rate"
        ]
      },
      {
        id: "battle-properties",
        title: "Battle Properties",
        description: "Battle behavior settings",
        columns: [
          "byBattle_Attribute", "wBasic_Aggro_Point", "wAggroMaxCount"
        ]
      }
    ]
  },
  {
    id: "movement",
    label: "Movement",
    sections: [
      {
        id: "speed-settings",
        title: "Speed Settings",
        description: "Movement speed configuration",
        columns: [
          "fWalk_Speed_Origin", "fWalk_Speed",
          "fRun_Speed_Origin", "fRun_Speed",
          "fFly_Height"
        ]
      },
      {
        id: "range-settings",
        title: "Range Settings",
        description: "Detection and range settings",
        columns: [
          "fRadius", "fRadius_X", "fRadius_Z",
          "wSight_Range", "wScan_Range", "byVisible_Sight_Range"
        ]
      }
    ]
  },
  {
    id: "skills",
    label: "Skills",
    sections: Array.from({ length: 7 }, (_, i) => ({
      id: `skill-${i}`,
      title: `Skill ${i}`,
      description: `Configure skill ${i} settings`,
      columns: [
        `wuse_skill_time_${i}`,
        `use_skill_tblidx_${i}`,
        `byuse_skill_basis_${i}`,
        `wuse_skill_lp_${i}`
      ]
    }))
  },
  {
    id: "merchant",
    label: "Merchant",
    sections: [
      {
        id: "merchant-indices",
        title: "Merchant Indices",
        description: "Merchant table references",
        columns: Array.from({ length: 6 }, (_, i) => `amerchant_tblidx_${i}`)
      }
    ]
  },
  {
    id: "flags",
    label: "Flags",
    sections: [
      {
        id: "system-flags",
        title: "System Flags",
        description: "System behavior flags",
        columns: [
          "dwAi_Bit_Flag",
          "dwNpcAttributeFlag",
          "dwFunc_Bit_Flag"
        ]
      },
      {
        id: "type-settings",
        title: "Type Settings",
        description: "NPC type and job configuration",
        columns: [
          "bynpctype",
          "byjob"
        ]
      }
    ]
  },
  {
    id: "other",
    label: "Other",
    sections: [
      {
        id: "dialog-settings",
        title: "Dialog Settings",
        description: "Dialog and interaction configuration",
        columns: [
          "dwDialogGroup",
          "dialog_Script_Index"
        ]
      },
      {
        id: "additional-settings",
        title: "Additional Settings",
        description: "Miscellaneous NPC settings",
        columns: [
          "dwAllianceIdx",
          "statusTransformTblidx",
          "contentsTblidx"
        ]
      },
      {
        id: "unknown-values",
        title: "Unknown Values",
        description: "Unidentified fields",
        columns: [
          "wUnknown",
          "dwUnknown2",
          "dwUnknown3"
        ]
      }
    ]
  }
];

const npcQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "bValidity_Able", "Name", "wszNameText", "szModel", "byLevel", "byGrade"]
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

const npcQuickStats = [
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
    label: 'Base LP', 
    column: 'dwBasic_LP',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'purple'
  },
];

interface NpcFormProps {
  initialData?: NpcFormData;
  onSubmit: (data: NpcFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function NpcForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: NpcFormProps) {
  return (
    <ModularForm<NpcFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={npcTabs}
      quickViewSections={npcQuickViewSections}
      quickStats={npcQuickStats}
      customSchema={npcSchema}
      defaultTab="basic"
      showFooter={true}
      enableQuickView={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add NPC';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate NPC';
      }}
    />
  );
}
