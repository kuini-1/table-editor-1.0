import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { StatusTransformTableFormData } from "./schema";
import { columns, statusTransformTableSchema } from "./schema";

const statusTransformTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this status transform entry',
    columns: ['tblidx']
  },
  {
    id: 'transforms',
    title: 'Transform Values',
    description: 'Configure transform values',
    columns: ['fLP_Transform', 'fEP_Transform', 'fPhysical_Offence_Transform', 'fEnergy_Offence_Transform', 'fPhysical_Defence_Transform', 'fEnergy_Defence_Transform', 'fRun_Speed_Transform', 'fAttack_Speed_Transform', 'fAttack_Rate_Transform', 'fDodge_Rate_Transform', 'fBlock_Rate_Transform', 'fCurse_Success_Transform', 'fCurse_Tolerance_Transform', 'fAttack_Range_Change', 'fLP_Consume_Rate', 'fEP_Consume_Rate']
  },
  {
    id: 'duration',
    title: 'Duration Settings',
    description: 'Configure duration settings',
    columns: ['dwDuration', 'dwDurationInMilliSecs']
  }
];

const statusTransformQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'fLP_Transform', 'fEP_Transform']
  }
];

const statusTransformQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'LP Transform', column: 'fLP_Transform', color: 'blue' },
];

interface StatusTransformFormProps {
  initialData?: Partial<StatusTransformTableFormData>;
  onSubmit: (data: StatusTransformTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function StatusTransformForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: StatusTransformFormProps) {
  return (
    <ModularForm<StatusTransformTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={statusTransformTableSections}
      quickViewSections={statusTransformQuickViewSections}
      quickStats={statusTransformQuickStats}
      customSchema={statusTransformTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

