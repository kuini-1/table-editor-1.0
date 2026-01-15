"use client";
import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import { itemTableSchema, columns, type ItemTableFormData } from "./schema";

// Define tabs with their sections for advanced fields
const itemTabs = [
  {
    id: "combat",
    label: "Combat Stats",
    sections: [
      {
        id: "durability",
        title: "Durability",
        description: "Item durability settings",
        columns: ["byDurability", "byDurability_Count"]
      },
      {
        id: "offensive-stats",
        title: "Offensive Stats",
        description: "Combat offensive statistics",
        columns: [
          "byBattle_Attribute",
          "wPhysical_Offence",
          "wEnergy_Offence",
          "fAttack_Range_Bonus",
          "wAttack_Speed_Rate"
        ]
      },
      {
        id: "defensive-stats",
        title: "Defensive Stats",
        description: "Combat defensive statistics",
        columns: [
          "wPhysical_Defence",
          "wEnergy_Defence"
        ]
      },
      {
        id: "stat-revisions",
        title: "Stat Revisions",
        description: "Stat revision multipliers",
        columns: [
          "fAttack_Physical_Revision",
          "fAttack_Energy_Revision",
          "fDefence_Physical_Revision",
          "fDefence_Energy_Revision"
        ]
      }
    ]
  },
  {
    id: "requirements",
    label: "Requirements",
    sections: [
      {
        id: "level-requirements",
        title: "Level Requirements",
        description: "Minimum and maximum level requirements",
        columns: ["byNeed_Min_Level", "byNeed_Max_Level"]
      },
      {
        id: "class-gender",
        title: "Class & Gender",
        description: "Class and gender restrictions",
        columns: [
          "dwNeed_Class_Bit_Flag",
          "dwNeed_Gender_Bit_Flag",
          "byClass_Special",
          "byRace_Special"
        ]
      },
      {
        id: "stat-requirements",
        title: "Stat Requirements",
        description: "Required attribute values",
        columns: [
          "wNeed_Str",
          "wNeed_Con",
          "wNeed_Foc",
          "wNeed_Dex",
          "wNeed_Sol",
          "wNeed_Eng"
        ]
      },
      {
        id: "other-requirements",
        title: "Other Requirements",
        description: "Additional requirements",
        columns: [
          "byRestrictType",
          "byNeedFunction",
          "NeedItemTblidx"
        ]
      }
    ]
  },
  {
    id: "enhancement",
    label: "Enhancement",
    sections: [
      {
        id: "enhancement-options",
        title: "Enhancement Options",
        description: "Item enhancement settings",
        columns: [
          "bIsCanHaveOption",
          "Item_Option_Tblidx",
          "byItemGroup",
          "Charm_Tblidx",
          "set_Item_Tblidx"
        ]
      },
      {
        id: "creation-flags",
        title: "Creation Flags",
        description: "Item creation capabilities",
        columns: [
          "bCreateSuperiorAble",
          "bCreateExcellentAble",
          "bCreateRareAble",
          "bCreateLegendaryAble",
          "bIsCanRenewal"
        ]
      },
      {
        id: "enhancement-tables",
        title: "Enhancement Tables",
        description: "Enhancement table references",
        columns: [
          "enchantRateTblidx",
          "excellentTblidx",
          "rareTblidx",
          "legendaryTblidx"
        ]
      }
    ]
  },
  {
    id: "special",
    label: "Special",
    sections: [
      {
        id: "model-settings",
        title: "Model Settings",
        description: "3D model configuration",
        columns: [
          "byModel_Type",
          "szModel",
          "szSub_Weapon_Act_Model"
        ]
      },
      {
        id: "scouter-settings",
        title: "Scouter Settings",
        description: "Scouter device configuration",
        columns: [
          "wScouter_Watt",
          "dwScouter_MaxPower",
          "byScouter_Parts_Type1",
          "byScouter_Parts_Type2",
          "byScouter_Parts_Type3",
          "byScouter_Parts_Type4"
        ]
      },
      {
        id: "duration-settings",
        title: "Duration Settings",
        description: "Item duration and timing",
        columns: [
          "dwUseDurationMax",
          "byDurationType",
          "dwDurationGroup"
        ]
      },
      {
        id: "other-settings",
        title: "Other Settings",
        description: "Miscellaneous item settings",
        columns: [
          "byBag_Size",
          "wCostumeHideBitFlag",
          "CommonPoint",
          "byCommonPointType",
          "contentsTblidx",
          "Use_Item_Tblidx",
          "byTmpTabType"
        ]
      }
    ]
  },
  {
    id: "disassembly",
    label: "Disassembly",
    sections: [
      {
        id: "disassembly-settings",
        title: "Disassembly Settings",
        description: "Item disassembly configuration",
        columns: [
          "wDisassemble_Bit_Flag",
          "byUseDisassemble",
          "byDropLevel"
        ]
      },
      {
        id: "normal-disassembly",
        title: "Normal Disassembly",
        description: "Normal disassembly range",
        columns: [
          "byDisassembleNormalMin",
          "byDisassembleNormalMax"
        ]
      },
      {
        id: "upper-disassembly",
        title: "Upper Disassembly",
        description: "Upper tier disassembly settings",
        columns: [
          "byDisassembleUpperMin",
          "byDisassembleUpperMax",
          "byDropVisual"
        ]
      }
    ]
  }
];

// Quick view sections - frequently used fields
const itemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "Name", "wszNameText", "szIcon_Name"]
  },
  {
    title: "Item Properties",
    columns: ["byItem_Type", "byEquip_Type", "byRank"]
  },
  {
    title: "Economy",
    columns: ["dwCost", "dwSell_Price", "dwWeight"]
  },
  {
    title: "Combat Stats",
    columns: ["wPhysical_Offence", "wEnergy_Offence", "wPhysical_Defence", "wEnergy_Defence"]
  },
  {
    title: "Flags",
    columns: ["bValidity_Able", "bIsCanHaveOption"]
  }
];

// Quick stats for the overview bar
const itemQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Rank', 
    column: 'byRank',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Physical Offense', 
    column: 'wPhysical_Offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'green'
  },
  { 
    label: 'Energy Offense', 
    column: 'wEnergy_Offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'blue'
  },
  { 
    label: 'Cost', 
    column: 'dwCost',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'purple'
  },
];

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: ItemTableFormData;
  onSubmit: (data: ItemTableFormData) => void;
  tableId: string;
}

export default function ItemForm({
  onOpenChange,
  initialData,
  onSubmit,
  mode,
  tableId,
}: ItemFormProps) {
  return (
    <ModularForm<ItemTableFormData>
      columns={columns}
      tabs={itemTabs}
      quickViewSections={itemQuickViewSections}
      quickStats={itemQuickStats}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tableType="item"
      customSchema={itemTableSchema}
      defaultTab="combat"
      compactFieldHeight={false}
      enableQuickView={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Item';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Item';
      }}
      showFooter={true}
    />
  );
}
