import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ActionTableFormData } from "./schema";
import { columns, actionTableSchema } from "./schema";

const actionTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this action entry',
    columns: ['tblidx', 'bValidity_Able', 'byAction_Type', 'Action_Name', 'szIcon_Name']
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Enter additional action details',
    columns: ['Note', 'chat_Command_Index', 'byETC_Action_Type']
  }
];

const actionQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'bValidity_Able', 'byAction_Type', 'Action_Name']
  }
];

const actionQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Action Type', column: 'byAction_Type', color: 'blue' },
  { label: 'Validity', column: 'bValidity_Able', color: 'green' },
];

interface ActionFormProps {
  initialData?: Partial<ActionTableFormData>;
  onSubmit: (data: ActionTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ActionForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ActionFormProps) {
  return (
    <ModularForm<ActionTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={actionTableSections}
      quickViewSections={actionQuickViewSections}
      quickStats={actionQuickStats}
      customSchema={actionTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

