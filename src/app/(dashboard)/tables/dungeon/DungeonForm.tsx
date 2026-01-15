import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DungeonFormData } from "./schema";
import { columns, newDungeonSchema } from "./schema";

const dungeonTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic dungeon information",
        columns: ["tblidx", "byDungeonType", "byMaxMember", "linkWorld"]
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
        description: "Set level requirements for the dungeon",
        columns: ["byMinLevel", "byMaxLevel"]
      },
      {
        id: "other-requirements",
        title: "Other Requirements",
        description: "Additional requirements",
        columns: ["needItemTblidx"]
      }
    ]
  },
  {
    id: "rewards",
    label: "Rewards",
    sections: [
      {
        id: "reward-settings",
        title: "Reward Settings",
        description: "Configure dungeon rewards",
        columns: ["dwHonorPoint"]
      }
    ]
  },
  {
    id: "other",
    label: "Other",
    sections: [
      {
        id: "additional-settings",
        title: "Additional Settings",
        description: "Other dungeon settings",
        columns: ["wpsTblidx", "openCine", "groupIdx"]
      }
    ]
  }
];

const dungeonQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "byDungeonType", "byMaxMember", "linkWorld"]
  }
];

const dungeonQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Dungeon Type', column: 'byDungeonType' },
  { label: 'Max Members', column: 'byMaxMember', color: 'blue' },
];

interface DungeonFormProps {
  initialData?: DungeonFormData | null;
  onSubmit: (data: DungeonFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function DungeonForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DungeonFormProps) {
  return (
    <ModularForm<DungeonFormData>
      columns={columns}
      initialData={initialData || undefined}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={dungeonTabs}
      quickViewSections={dungeonQuickViewSections}
      quickStats={dungeonQuickStats}
      customSchema={newDungeonSchema}
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