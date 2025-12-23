import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { WorldFormData } from "./schema";
import { columns, worldSchema } from "./schema";

const worldTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic world information",
        columns: [
          "dwdynamiccreatecountsharegroup",
          "bydoortype",
          "dwdestroytimeinmillisec"
        ]
      },
      {
        id: "spawn-tables",
        title: "Spawn Tables",
        description: "Configure spawn table names",
        columns: [
          "wszmobspawn_table_name",
          "wsznpcspawn_table_name",
          "wszobjspawn_table_name"
        ]
      }
    ]
  },
  {
    id: "locations",
    label: "Locations",
    sections: [
      {
        id: "start-end",
        title: "Start & End Locations",
        description: "Start and end coordinates",
        columns: [
          "vstart_x", "vstart_y", "vstart_z",
          "vend_x", "vend_y", "vend_z"
        ]
      },
      {
        id: "standard",
        title: "Standard Location",
        description: "Standard location coordinates",
        columns: [
          "vstandardloc_x", "vstandardloc_y", "vstandardloc_z"
        ]
      },
      {
        id: "default",
        title: "Default Location & Direction",
        description: "Default location and direction",
        columns: [
          "vdefaultloc_x", "vdefaultloc_y", "vdefaultloc_z",
          "vdefaultdir_x", "vdefaultdir_y", "vdefaultdir_z"
        ]
      }
    ]
  },
  {
    id: "battle",
    label: "Battle Locations",
    sections: [
      {
        id: "battle-1",
        title: "Battle 1 Locations",
        description: "First battle start and end locations",
        columns: [
          "vbattlestartloc_x", "vbattlestartloc_y", "vbattlestartloc_z",
          "vbattleendloc_x", "vbattleendloc_y", "vbattleendloc_z"
        ]
      },
      {
        id: "battle-2",
        title: "Battle 2 Locations",
        description: "Second battle start and end locations",
        columns: [
          "vbattlestart2loc_x", "vbattlestart2loc_y", "vbattlestart2loc_z",
          "vbattleend2loc_x", "vbattleend2loc_y", "vbattleend2loc_z"
        ]
      },
      {
        id: "outside-battle",
        title: "Outside Battle Locations",
        description: "Outside battle start and end locations",
        columns: [
          "voutsidebattlestartloc_x", "voutsidebattlestartloc_y", "voutsidebattlestartloc_z",
          "voutsidebattleendloc_x", "voutsidebattleendloc_y", "voutsidebattleendloc_z"
        ]
      },
      {
        id: "spectator",
        title: "Spectator Locations",
        description: "Spectator start and end locations",
        columns: [
          "vspectatorstartloc_x", "vspectatorstartloc_y", "vspectatorstartloc_z",
          "vspectatorendloc_x", "vspectatorendloc_y", "vspectatorendloc_z"
        ]
      }
    ]
  },
  {
    id: "start-points",
    label: "Start Points",
    sections: [
      {
        id: "start-1",
        title: "Start Point 1",
        description: "Start point 1 location and direction",
        columns: [
          "vstart1loc_x", "vstart1loc_y", "vstart1loc_z",
          "vstart1dir_x", "vstart1dir_y", "vstart1dir_z"
        ]
      },
      {
        id: "start-2",
        title: "Start Point 2",
        description: "Start point 2 location and direction",
        columns: [
          "vstart2loc_x", "vstart2loc_y", "vstart2loc_z",
          "vstart2dir_x", "vstart2dir_y", "vstart2dir_z"
        ]
      },
      {
        id: "waiting-1",
        title: "Waiting Point 1",
        description: "Waiting point 1 location and direction",
        columns: [
          "vwaitingpoint1loc_x", "vwaitingpoint1loc_y", "vwaitingpoint1loc_z",
          "vwaitingpoint1dir_x", "vwaitingpoint1dir_y", "vwaitingpoint1dir_z"
        ]
      },
      {
        id: "waiting-2",
        title: "Waiting Point 2",
        description: "Waiting point 2 location and direction",
        columns: [
          "vwaitingpoint2loc_x", "vwaitingpoint2loc_y", "vwaitingpoint2loc_z",
          "vwaitingpoint2dir_x", "vwaitingpoint2dir_y", "vwaitingpoint2dir_z"
        ]
      }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    sections: [
      {
        id: "world-settings",
        title: "World Settings",
        description: "Configure world settings",
        columns: [
          "fsplitsize",
          "wfuncflag",
          "worldruletbldx"
        ]
      },
      {
        id: "outworld",
        title: "Outworld Settings",
        description: "Configure outworld settings",
        columns: [
          "outworldtblidx",
          "outworldloc_x", "outworldloc_y", "outworldloc_z",
          "outworlddir_x", "outworlddir_y", "outworlddir_z"
        ]
      },
      {
        id: "resources",
        title: "Resource Settings",
        description: "Configure resource settings",
        columns: [
          "wszresourcefolder",
          "fbgmresttime",
          "dwworldresourceid",
          "ffreecamera_height",
          "wszenterresourceflash",
          "wszleaveresourceflash"
        ]
      },
      {
        id: "other",
        title: "Other Settings",
        description: "Other world settings",
        columns: [
          "wpslinkindex",
          "bystartpointrange",
          "dwprohibition_bit_flag"
        ]
      }
    ]
  },
  {
    id: "dragon-balls",
    label: "Dragon Balls",
    sections: Array.from({ length: 5 }, (_, i) => ({
      id: `dragon-ball-${i}`,
      title: `Dragon Ball ${i}`,
      description: `Configure dragon ball ${i} rates`,
      columns: [
        `abydragonballhaverate_${i}`,
        `abydragonballdroprate_${i}`
      ]
    }))
  }
];

const worldQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "szname", "wszname", "bdynamic", "ncreatecount"]
  },
  {
    title: "World Settings",
    columns: ["bnight_able", "bystatic_time", "byworldruletype"]
  }
];

const worldQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'szname',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Dynamic', 
    column: 'bdynamic',
    formatValue: (value: unknown) => value ? 'Yes' : 'No',
    color: 'blue'
  },
  { 
    label: 'Create Count', 
    column: 'ncreatecount',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface WorldFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: WorldFormData;
  onSubmit: (data: WorldFormData) => void;
  tableId: string;
}

export default function WorldForm({
  initialData,
  onSubmit,
  mode,
  tableId,
  onOpenChange,
}: WorldFormProps) {
  return (
    <ModularForm<WorldFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={worldTabs}
      quickViewSections={worldQuickViewSections}
      quickStats={worldQuickStats}
      customSchema={worldSchema}
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
