import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MascotTableFormData } from "./schema";
import { columns, mascotTableSchema } from "./schema";

const mascotTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this mascot entry',
    columns: ['tblidx', 'Name', 'wszNameText', 'bValidity_Able', 'byModel_Type', 'szModel']
  },
  {
    id: 'stats',
    title: 'Statistics',
    description: 'Configure mascot statistics',
    columns: ['byRank', 'bySlot_Num', 'wSP_Decrease_Rate', 'wMax_SP']
  }
];

const mascotQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszNameText', 'byRank']
  }
];

const mascotQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Text', column: 'wszNameText', color: 'blue' },
  { label: 'Rank', column: 'byRank', color: 'green' },
];

interface MascotFormProps {
  initialData?: Partial<MascotTableFormData>;
  onSubmit: (data: MascotTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function MascotForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MascotFormProps) {
  return (
    <ModularForm<MascotTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={mascotTableSections}
      quickViewSections={mascotQuickViewSections}
      quickStats={mascotQuickStats}
      customSchema={mascotTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

