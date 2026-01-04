import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ChartitleTableFormData } from "./schema";
import { columns, chartitleTableSchema } from "./schema";

const chartitleTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this character title entry',
    columns: ['tblidx', 'tblNameIndex', 'byContentsType', 'byRepresentationType', 'wszBoneName', 'wszEffectName', 'wszEffectSound']
  },
  {
    id: 'system-effects-0-4',
    title: 'System Effects 0-4',
    description: 'Configure system effects 0 through 4',
    columns: ['atblSystem_Effect_Index_0', 'abySystem_Effect_Type_0', 'abySystem_Effect_Value_0', 'atblSystem_Effect_Index_1', 'abySystem_Effect_Type_1', 'abySystem_Effect_Value_1', 'atblSystem_Effect_Index_2', 'abySystem_Effect_Type_2', 'abySystem_Effect_Value_2', 'atblSystem_Effect_Index_3', 'abySystem_Effect_Type_3', 'abySystem_Effect_Value_3', 'atblSystem_Effect_Index_4', 'abySystem_Effect_Type_4', 'abySystem_Effect_Value_4']
  },
  {
    id: 'system-effects-5-9',
    title: 'System Effects 5-9',
    description: 'Configure system effects 5 through 9',
    columns: ['atblSystem_Effect_Index_5', 'abySystem_Effect_Type_5', 'abySystem_Effect_Value_5', 'atblSystem_Effect_Index_6', 'abySystem_Effect_Type_6', 'abySystem_Effect_Value_6', 'atblSystem_Effect_Index_7', 'abySystem_Effect_Type_7', 'abySystem_Effect_Value_7', 'atblSystem_Effect_Index_8', 'abySystem_Effect_Type_8', 'abySystem_Effect_Value_8', 'atblSystem_Effect_Index_9', 'abySystem_Effect_Type_9', 'abySystem_Effect_Value_9']
  }
];

const chartitleQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'tblNameIndex', 'byContentsType']
  }
];

const chartitleQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Index', column: 'tblNameIndex', color: 'blue' },
];

interface ChartitleFormProps {
  initialData?: Partial<ChartitleTableFormData>;
  onSubmit: (data: ChartitleTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ChartitleForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ChartitleFormProps) {
  return (
    <ModularForm<ChartitleTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={chartitleTableSections}
      quickViewSections={chartitleQuickViewSections}
      quickStats={chartitleQuickStats}
      customSchema={chartitleTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

