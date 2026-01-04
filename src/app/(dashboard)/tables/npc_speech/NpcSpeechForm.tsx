import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { NpcSpeechTableFormData } from "./schema";
import { columns, npcSpeechTableSchema } from "./schema";

const npcSpeechTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this NPC speech entry',
    columns: ['tblidx', 'dwDialogGroup', 'szDialogType', 'byRate', 'textIndex']
  },
  {
    id: 'display-settings',
    title: 'Display Settings',
    description: 'Configure display settings for the speech',
    columns: ['byBallonType', 'dwDisplayTime', 'szNote', 'bySpeechType']
  }
];

const npcSpeechQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwDialogGroup', 'szDialogType']
  }
];

const npcSpeechQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Dialog Group', column: 'dwDialogGroup', color: 'blue' },
];

interface NpcSpeechFormProps {
  initialData?: Partial<NpcSpeechTableFormData>;
  onSubmit: (data: NpcSpeechTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function NpcSpeechForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: NpcSpeechFormProps) {
  return (
    <ModularForm<NpcSpeechTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={npcSpeechTableSections}
      quickViewSections={npcSpeechQuickViewSections}
      quickStats={npcSpeechQuickStats}
      customSchema={npcSpeechTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

