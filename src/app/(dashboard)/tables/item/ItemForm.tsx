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
        columns: ["bydurability", "bydurability_count"]
      },
      {
        id: "offensive-stats",
        title: "Offensive Stats",
        description: "Combat offensive statistics",
        columns: [
          "bybattle_attribute",
          "wphysical_offence",
          "wenergy_offence",
          "fattack_range_bonus",
          "wattack_speed_rate"
        ]
      },
      {
        id: "defensive-stats",
        title: "Defensive Stats",
        description: "Combat defensive statistics",
        columns: [
          "wphysical_defence",
          "wenergy_defence"
        ]
      },
      {
        id: "stat-revisions",
        title: "Stat Revisions",
        description: "Stat revision multipliers",
        columns: [
          "fattack_physical_revision",
          "fattack_energy_revision",
          "fdefence_physical_revision",
          "fdefence_energy_revision"
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
        columns: ["byneed_min_level", "byneed_max_level"]
      },
      {
        id: "class-gender",
        title: "Class & Gender",
        description: "Class and gender restrictions",
        columns: [
          "dwneed_class_bit_flag",
          "dwneed_gender_bit_flag",
          "byclass_special",
          "byrace_special"
        ]
      },
      {
        id: "stat-requirements",
        title: "Stat Requirements",
        description: "Required attribute values",
        columns: [
          "wneed_str",
          "wneed_con",
          "wneed_foc",
          "wneed_dex",
          "wneed_sol",
          "wneed_eng"
        ]
      },
      {
        id: "other-requirements",
        title: "Other Requirements",
        description: "Additional requirements",
        columns: [
          "byrestricttype",
          "byneedfunction",
          "needitemtblidx"
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
          "biscanhaveoption",
          "item_option_tblidx",
          "byitemgroup",
          "charm_tblidx",
          "set_item_tblidx"
        ]
      },
      {
        id: "creation-flags",
        title: "Creation Flags",
        description: "Item creation capabilities",
        columns: [
          "bcreatesuperiorable",
          "bcreateexcellentable",
          "bcreaterareable",
          "bcreatelegendaryable",
          "biscanrenewal"
        ]
      },
      {
        id: "enhancement-tables",
        title: "Enhancement Tables",
        description: "Enhancement table references",
        columns: [
          "enchantratetblidx",
          "excellenttblidx",
          "raretblidx",
          "legendarytblidx"
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
          "bymodel_type",
          "szmodel",
          "szsub_weapon_act_model"
        ]
      },
      {
        id: "scouter-settings",
        title: "Scouter Settings",
        description: "Scouter device configuration",
        columns: [
          "wscouter_watt",
          "dwscouter_maxpower",
          "byscouter_parts_type1",
          "byscouter_parts_type2",
          "byscouter_parts_type3",
          "byscouter_parts_type4"
        ]
      },
      {
        id: "duration-settings",
        title: "Duration Settings",
        description: "Item duration and timing",
        columns: [
          "dwusedurationmax",
          "bydurationtype",
          "dwdurationgroup"
        ]
      },
      {
        id: "other-settings",
        title: "Other Settings",
        description: "Miscellaneous item settings",
        columns: [
          "bybag_size",
          "wcostumehidebitflag",
          "commonpoint",
          "bycommonpointtype",
          "contentstblidx",
          "use_item_tblidx",
          "bytmptabtype"
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
          "wdisassemble_bit_flag",
          "byusedisassemble",
          "bydroplevel"
        ]
      },
      {
        id: "normal-disassembly",
        title: "Normal Disassembly",
        description: "Normal disassembly range",
        columns: [
          "bydisassemblenormalmin",
          "bydisassemblenormalmax"
        ]
      },
      {
        id: "upper-disassembly",
        title: "Upper Disassembly",
        description: "Upper tier disassembly settings",
        columns: [
          "bydisassembleuppermin",
          "bydisassembleuppermax",
          "bydropvisual"
        ]
      }
    ]
  }
];

// Quick view sections - frequently used fields
const itemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "name", "wsznametext", "szicon_name"]
  },
  {
    title: "Item Properties",
    columns: ["byitem_type", "byequip_type", "byrank"]
  },
  {
    title: "Economy",
    columns: ["dwcost", "dwsell_price", "dwweight"]
  },
  {
    title: "Combat Stats",
    columns: ["wphysical_offence", "wenergy_offence", "wphysical_defence", "wenergy_defence"]
  },
  {
    title: "Flags",
    columns: ["bvalidity_able", "biscanhaveoption"]
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
    column: 'byrank',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Physical Offense', 
    column: 'wphysical_offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'green'
  },
  { 
    label: 'Energy Offense', 
    column: 'wenergy_offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'blue'
  },
  { 
    label: 'Cost', 
    column: 'dwcost',
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
