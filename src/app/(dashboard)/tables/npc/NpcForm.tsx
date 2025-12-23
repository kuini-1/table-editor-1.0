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
        columns: ["tblidx", "bvalidity_able", "name", "wsznametext", "szmodel", "bylevel", "bygrade"]
      },
      {
        id: "display-settings",
        title: "Display Settings",
        description: "Configure display and visual settings",
        columns: ["sznametext", "bspawn_animation", "szillust", "szcamera_bone_name", "fscale"]
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
        columns: ["dwbasic_lp", "wbasic_ep", "wlp_regeneration", "wep_regeneration"]
      },
      {
        id: "attributes",
        title: "Attributes",
        description: "Base attribute values",
        columns: ["wbasicstr", "wbasiccon", "wbasicfoc", "wbasicdex", "wbasicsol", "wbasiceng"]
      },
      {
        id: "defense-stats",
        title: "Defense Stats",
        description: "Defensive capabilities",
        columns: [
          "wbasic_physical_defence", "wbasic_energy_defence",
          "wstomachachedefence", "wpoisondefence", "wbleeddefence", "wburndefence"
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
          "wbasic_physical_offence", "wbasic_energy_offence",
          "byattack_type", "byattack_animation_quantity",
          "wattackcooltime", "wattack_speed_rate", "fattack_range"
        ]
      },
      {
        id: "combat-rates",
        title: "Combat Rates",
        description: "Combat success rates",
        columns: [
          "wattack_rate", "wdodge_rate", "wblock_rate",
          "wcurse_success_rate", "wcurse_tolerance_rate"
        ]
      },
      {
        id: "battle-properties",
        title: "Battle Properties",
        description: "Battle behavior settings",
        columns: [
          "bybattle_attribute", "wbasic_aggro_point", "waggromaxcount"
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
          "fwalk_speed_origin", "fwalk_speed",
          "frun_speed_origin", "frun_speed",
          "ffly_height"
        ]
      },
      {
        id: "range-settings",
        title: "Range Settings",
        description: "Detection and range settings",
        columns: [
          "fradius", "fradius_x", "fradius_z",
          "wsight_range", "wscan_range", "byvisible_sight_range"
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
          "dwai_bit_flag",
          "dwnpcattributeflag",
          "dwfunc_bit_flag"
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
          "dwdialoggroup",
          "dialog_script_index"
        ]
      },
      {
        id: "additional-settings",
        title: "Additional Settings",
        description: "Miscellaneous NPC settings",
        columns: [
          "dwallianceidx",
          "statustransformtblidx",
          "contentstblidx"
        ]
      },
      {
        id: "unknown-values",
        title: "Unknown Values",
        description: "Unidentified fields",
        columns: [
          "wunknown",
          "dwunknown2",
          "dwunknown3"
        ]
      }
    ]
  }
];

const npcQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "bvalidity_able", "name", "wsznametext", "szmodel", "bylevel", "bygrade"]
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

const npcQuickStats = [
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
    label: 'Base LP', 
    column: 'dwbasic_lp',
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
