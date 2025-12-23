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
        columns: ["sznametext", "szmodel", "szillust", "bvalidity_able", "bshow_name"]
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
        columns: ["wbasicstr", "wbasiccon", "wbasicfoc", "wbasicdex", "wbasicsol", "wbasiceng"]
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
          "bybattle_attribute",
          "wattack_speed_rate",
          "byattack_type",
          "fattack_range",
          "wattack_rate",
          "wdodge_rate",
          "wblock_rate",
          "wcurse_success_rate",
          "wcurse_tolerance_rate",
          "wbasic_aggro_point",
          "byattack_animation_quantity",
          "wattackcooltime"
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
          "fwalk_speed_origin",
          "fwalk_speed",
          "frun_speed_origin",
          "frun_speed",
          "fradius_x",
          "fradius_z",
          "fradius",
          "ffly_height",
          "fscale"
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
          "wsight_range",
          "wscan_range",
          "byvisible_sight_range",
          "wsightangle",
          "szcamera_bone_name"
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
          "wstomachachedefence",
          "wpoisondefence",
          "wbleeddefence",
          "wburndefence",
          "dwimmunity_bit_flag"
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
          "wlp_regeneration",
          "wep_regeneration"
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
          "dwdrop_zenny",
          "fdrop_zenny_rate",
          "dwexp",
          "drop_item_tblidx",
          "dropquesttblidx",
          "idxbigbag1",
          "bydroprate1",
          "bytrycount1",
          "idxbigbag2",
          "bydroprate2",
          "bytrycount2",
          "idxbigbag3",
          "bydroprate3",
          "bytrycount3",
          "bisdragonballdrop",
          "frewardexprate",
          "frewardzennyrate"
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
          "dwai_bit_flag",
          "bspawn_animation",
          "dwdialoggroup",
          "dwallianceidx",
          "waggromaxcount",
          "dwnpcattributeflag",
          "dwmobgroup",
          "wmob_kind",
          "bymob_type",
          "bsize",
          "wtmqpoint",
          "wmonsterclass",
          "wuserace"
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
          "dwformulaoffset",
          "fsettingrate_lp",
          "fsettingrate_lpregen",
          "fsettingrate_phyoffence",
          "fsettingrate_engoffence",
          "fsettingrate_phydefence",
          "fsettingrate_engdefence",
          "fsettingrate_attackrate",
          "fsettingrate_dodgerate",
          "fsettingphyoffencerate",
          "fsettingengoffencerate",
          "fsettingrate_defence_role"
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
          "dwunknown",
          "byunknown",
          "byunknown2"
        ]
      }
    ]
  }
];

const mobQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "name", "wsznametext", "bylevel", "bygrade"]
  },
  {
    title: "Combat Stats",
    columns: ["wbasic_physical_offence", "wbasic_energy_offence", "wbasic_physical_defence", "wbasic_energy_defence"]
  },
  {
    title: "Base Stats",
    columns: ["dwbasic_lp", "wbasic_ep"]
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
    column: 'bylevel',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Physical Attack', 
    column: 'wbasic_physical_offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'green'
  },
  { 
    label: 'Energy Attack', 
    column: 'wbasic_energy_offence',
    formatValue: (value: unknown) => String(value ?? 0),
    color: 'blue'
  },
  { 
    label: 'EXP', 
    column: 'dwexp',
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
