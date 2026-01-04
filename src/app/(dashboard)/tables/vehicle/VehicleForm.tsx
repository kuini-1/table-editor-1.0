import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { VehicleTableFormData } from "./schema";
import { columns, vehicleTableSchema } from "./schema";

const vehicleTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this vehicle entry',
    columns: ['tblidx', 'szModelName', 'bySRPType', 'bySpeed', 'byVehicleType', 'wRunHeight', 'byPersonnel']
  }
];

const vehicleQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'szModelName', 'byVehicleType', 'bySpeed']
  }
];

const vehicleQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Model Name', column: 'szModelName', color: 'blue' },
  { label: 'Speed', column: 'bySpeed', color: 'green' },
];

interface VehicleFormProps {
  initialData?: Partial<VehicleTableFormData>;
  onSubmit: (data: VehicleTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function VehicleForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: VehicleFormProps) {
  return (
    <ModularForm<VehicleTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={vehicleTableSections}
      quickViewSections={vehicleQuickViewSections}
      quickStats={vehicleQuickStats}
      customSchema={vehicleTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

