import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { MascotGradeTableFormData } from "./schema";
import { columns, mascotGradeTableSchema } from "./schema";

const mascotGradeTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this mascot grade entry',
    columns: ['tblidx', 'dwNeedExp', 'wBabyFusion', 'wAdultFusion', 'wLightFusion']
  }
];

const mascotGradeQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwNeedExp', 'wBabyFusion']
  }
];

const mascotGradeQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Need Exp', column: 'dwNeedExp', color: 'blue' },
];

interface MascotGradeFormProps {
  initialData?: Partial<MascotGradeTableFormData>;
  onSubmit: (data: MascotGradeTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function MascotGradeForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: MascotGradeFormProps) {
  return (
    <ModularForm<MascotGradeTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={mascotGradeTableSections}
      quickViewSections={mascotGradeQuickViewSections}
      quickStats={mascotGradeQuickStats}
      customSchema={mascotGradeTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

