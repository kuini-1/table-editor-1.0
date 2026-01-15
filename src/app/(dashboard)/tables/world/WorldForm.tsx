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
          "dwDynamicCreateCountShareGroup",
          "byDoorType",
          "dwDestroyTimeInMilliSec"
        ]
      },
      {
        id: "spawn-tables",
        title: "Spawn Tables",
        description: "Configure spawn table names",
        columns: [
          "wszMobSpawn_Table_Name",
          "wszNpcSpawn_Table_Name",
          "wszObjSpawn_Table_Name"
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
          "vStart_X", "vStart_Y", "vStart_Z",
          "vEnd_X", "vEnd_Y", "vEnd_Z"
        ]
      },
      {
        id: "standard",
        title: "Standard Location",
        description: "Standard location coordinates",
        columns: [
          "vStandardLoc_X", "vStandardLoc_Y", "vStandardLoc_Z"
        ]
      },
      {
        id: "default",
        title: "Default Location & Direction",
        description: "Default location and direction",
        columns: [
          "vDefaultLoc_X", "vDefaultLoc_Y", "vDefaultLoc_Z",
          "vDefaultDir_X", "vDefaultDir_Y", "vDefaultDir_Z"
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
          "vBattleStartLoc_X", "vBattleStartLoc_Y", "vBattleStartLoc_Z",
          "vBattleEndLoc_X", "vBattleEndLoc_Y", "vBattleEndLoc_Z"
        ]
      },
      {
        id: "battle-2",
        title: "Battle 2 Locations",
        description: "Second battle start and end locations",
        columns: [
          "vBattleStart2Loc_X", "vBattleStart2Loc_Y", "vBattleStart2Loc_Z",
          "vBattleEnd2Loc_X", "vBattleEnd2Loc_Y", "vBattleEnd2Loc_Z"
        ]
      },
      {
        id: "outside-battle",
        title: "Outside Battle Locations",
        description: "Outside battle start and end locations",
        columns: [
          "vOutSideBattleStartLoc_X", "vOutSideBattleStartLoc_Y", "vOutSideBattleStartLoc_Z",
          "vOutSideBattleEndLoc_X", "vOutSideBattleEndLoc_Y", "vOutSideBattleEndLoc_Z"
        ]
      },
      {
        id: "spectator",
        title: "Spectator Locations",
        description: "Spectator start and end locations",
        columns: [
          "vSpectatorStartLoc_X", "vSpectatorStartLoc_Y", "vSpectatorStartLoc_Z",
          "vSpectatorEndLoc_X", "vSpectatorEndLoc_Y", "vSpectatorEndLoc_Z"
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
          "vStart1Loc_X", "vStart1Loc_Y", "vStart1Loc_Z",
          "vStart1Dir_X", "vStart1Dir_Y", "vStart1Dir_Z"
        ]
      },
      {
        id: "start-2",
        title: "Start Point 2",
        description: "Start point 2 location and direction",
        columns: [
          "vStart2Loc_X", "vStart2Loc_Y", "vStart2Loc_Z",
          "vStart2Dir_X", "vStart2Dir_Y", "vStart2Dir_Z"
        ]
      },
      {
        id: "waiting-1",
        title: "Waiting Point 1",
        description: "Waiting point 1 location and direction",
        columns: [
          "vWaitingPoint1Loc_X", "vWaitingPoint1Loc_Y", "vWaitingPoint1Loc_Z",
          "vWaitingPoint1Dir_X", "vWaitingPoint1Dir_Y", "vWaitingPoint1Dir_Z"
        ]
      },
      {
        id: "waiting-2",
        title: "Waiting Point 2",
        description: "Waiting point 2 location and direction",
        columns: [
          "vWaitingPoint2Loc_X", "vWaitingPoint2Loc_Y", "vWaitingPoint2Loc_Z",
          "vWaitingPoint2Dir_X", "vWaitingPoint2Dir_Y", "vWaitingPoint2Dir_Z"
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
          "fSplitSize",
          "wFuncFlag",
          "worldRuleTbldx"
        ]
      },
      {
        id: "outworld",
        title: "Outworld Settings",
        description: "Configure outworld settings",
        columns: [
          "outWorldTblidx",
          "outWorldLoc_X", "outWorldLoc_Y", "outWorldLoc_Z",
          "outWorldDir_X", "outWorldDir_Y", "outWorldDir_Z"
        ]
      },
      {
        id: "resources",
        title: "Resource Settings",
        description: "Configure resource settings",
        columns: [
          "wszResourceFolder",
          "fBGMRestTime",
          "dwWorldResourceID",
          "fFreeCamera_Height",
          "wszEnterResourceFlash",
          "wszLeaveResourceFlash"
        ]
      },
      {
        id: "other",
        title: "Other Settings",
        description: "Other world settings",
        columns: [
          "wpsLinkIndex",
          "byStartPointRange",
          "dwProhibition_Bit_Flag"
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
        `abyDragonBallHaveRate_${i}`,
        `abyDragonBallDropRate_${i}`
      ]
    }))
  }
];

const worldQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "szName", "wszName", "bDynamic", "nCreateCount"]
  },
  {
    title: "World Settings",
    columns: ["bNight_Able", "byStatic_Time", "byWorldRuleType"]
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
    column: 'szName',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Dynamic', 
    column: 'bDynamic',
    formatValue: (value: unknown) => value ? 'Yes' : 'No',
    color: 'blue'
  },
  { 
    label: 'Create Count', 
    column: 'nCreateCount',
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
