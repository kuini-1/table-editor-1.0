import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ChatCommandTableFormData } from "./schema";
import { columns, chatCommandTableSchema } from "./schema";

const chatCommandTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this chat command entry',
    columns: ['tblidx', 'bValidity_Able', 'wAction_Animation_Index']
  },
  {
    id: 'chat-commands-0-9',
    title: 'Chat Commands 0-9',
    description: 'Configure chat commands 0 through 9',
    columns: ['aChat_Command_0', 'aChat_Command_1', 'aChat_Command_2', 'aChat_Command_3', 'aChat_Command_4', 'aChat_Command_5', 'aChat_Command_6', 'aChat_Command_7', 'aChat_Command_8', 'aChat_Command_9']
  },
  {
    id: 'chat-commands-10-19',
    title: 'Chat Commands 10-19',
    description: 'Configure chat commands 10 through 19',
    columns: ['aChat_Command_10', 'aChat_Command_11', 'aChat_Command_12', 'aChat_Command_13', 'aChat_Command_14', 'aChat_Command_15', 'aChat_Command_16', 'aChat_Command_17', 'aChat_Command_18', 'aChat_Command_19']
  }
];

const chatCommandQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'bValidity_Able', 'wAction_Animation_Index']
  }
];

const chatCommandQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Validity', column: 'bValidity_Able', color: 'green' },
];

interface ChatCommandFormProps {
  initialData?: Partial<ChatCommandTableFormData>;
  onSubmit: (data: ChatCommandTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ChatCommandForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ChatCommandFormProps) {
  return (
    <ModularForm<ChatCommandTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={chatCommandTableSections}
      quickViewSections={chatCommandQuickViewSections}
      quickStats={chatCommandQuickStats}
      customSchema={chatCommandTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

