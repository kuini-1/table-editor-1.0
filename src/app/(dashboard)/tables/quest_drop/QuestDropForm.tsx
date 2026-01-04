import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { QuestDropTableFormData } from "./schema";
import { columns, questDropTableSchema } from "./schema";

const questDropTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this quest drop entry',
    columns: ['tblidx']
  },
  {
    id: 'drops-0-4',
    title: 'Quest Drops 0-4',
    description: 'Configure quest drops 0 through 4',
    columns: ['aQuestItemTblidx_0', 'aDropRate_0', 'aQuestItemTblidx_1', 'aDropRate_1', 'aQuestItemTblidx_2', 'aDropRate_2', 'aQuestItemTblidx_3', 'aDropRate_3', 'aQuestItemTblidx_4', 'aDropRate_4']
  },
  {
    id: 'drops-5-9',
    title: 'Quest Drops 5-9',
    description: 'Configure quest drops 5 through 9',
    columns: ['aQuestItemTblidx_5', 'aDropRate_5', 'aQuestItemTblidx_6', 'aDropRate_6', 'aQuestItemTblidx_7', 'aDropRate_7', 'aQuestItemTblidx_8', 'aDropRate_8', 'aQuestItemTblidx_9', 'aDropRate_9']
  }
];

const questDropQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'aQuestItemTblidx_0', 'aDropRate_0']
  }
];

const questDropQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Drop Rate 0', column: 'aDropRate_0', color: 'blue' },
];

interface QuestDropFormProps {
  initialData?: Partial<QuestDropTableFormData>;
  onSubmit: (data: QuestDropTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function QuestDropForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: QuestDropFormProps) {
  return (
    <ModularForm<QuestDropTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={questDropTableSections}
      quickViewSections={questDropQuickViewSections}
      quickStats={questDropQuickStats}
      customSchema={questDropTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

