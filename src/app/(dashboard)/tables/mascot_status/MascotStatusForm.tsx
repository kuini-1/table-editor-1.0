import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MascotStatusTableFormData } from "./schema";
import { columns, mascotStatusTableSchema } from "./schema";

const mascotStatusTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this mascot status entry',
    columns: ['tblidx', 'Name', 'wszNameText', 'bValidity_Able', 'szModel', 'byRank', 'bySlot_Num']
  },
  {
    id: 'status-stats',
    title: 'Status Statistics',
    description: 'Configure status statistics',
    columns: ['wVpUpMin', 'wVpUpMax', 'trash1', 'wSkillGrade1', 'wSkillGrade2', 'wSkillGrade3', 'wVpRegen', 'wSkillGradeMax']
  },
  {
    id: 'advanced',
    title: 'Advanced Settings',
    description: 'Configure advanced settings',
    columns: ['nextMascotTblidx', 'sealItemIndex']
  }
];

const mascotStatusQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszNameText', 'byRank']
  }
];

const mascotStatusQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Text', column: 'wszNameText', color: 'blue' },
  { label: 'Rank', column: 'byRank', color: 'green' },
];

interface MascotStatusFormProps {
  initialData?: Partial<MascotStatusTableFormData>;
  onSubmit: (data: MascotStatusTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function MascotStatusForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MascotStatusFormProps) {
  return (
    <ModularForm<MascotStatusTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={mascotStatusTableSections}
      quickViewSections={mascotStatusQuickViewSections}
      quickStats={mascotStatusQuickStats}
      customSchema={mascotStatusTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

