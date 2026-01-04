import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { NpcDataServerTableFormData } from "./schema";
import { columns, npcDataServerTableSchema } from "./schema";

const npcDataServerTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this NPC data server entry',
    columns: ['tblidx', 'bValidity_Able', 'dwServerBitFlag']
  }
];

const npcDataServerQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'bValidity_Able', 'dwServerBitFlag']
  }
];

const npcDataServerQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Validity', column: 'bValidity_Able', color: 'green' },
];

interface NpcDataServerFormProps {
  initialData?: Partial<NpcDataServerTableFormData>;
  onSubmit: (data: NpcDataServerTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function NpcDataServerForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: NpcDataServerFormProps) {
  return (
    <ModularForm<NpcDataServerTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={npcDataServerTableSections}
      quickViewSections={npcDataServerQuickViewSections}
      quickStats={npcDataServerQuickStats}
      customSchema={npcDataServerTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

