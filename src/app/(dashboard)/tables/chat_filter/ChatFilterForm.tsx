import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ChatFilterTableFormData } from "./schema";
import { columns, chatFilterTableSchema } from "./schema";

const chatFilterTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this chat filter entry',
    columns: ['tblidx', 'wszSlangText', 'filteringTextIndex']
  }
];

const chatFilterQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszSlangText', 'filteringTextIndex']
  }
];

const chatFilterQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Slang Text', column: 'wszSlangText', color: 'blue' },
];

interface ChatFilterFormProps {
  initialData?: Partial<ChatFilterTableFormData>;
  onSubmit: (data: ChatFilterTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ChatFilterForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ChatFilterFormProps) {
  return (
    <ModularForm<ChatFilterTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={chatFilterTableSections}
      quickViewSections={chatFilterQuickViewSections}
      quickStats={chatFilterQuickStats}
      customSchema={chatFilterTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

