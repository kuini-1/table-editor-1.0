import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DwcTableFormData } from "./schema";
import { columns, dwcTableSchema } from "./schema";

const dwcTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this DWC entry',
    columns: ['tblidx', 'tblNameIndex', 'byLevel_Min', 'byLevel_Max', 'wAdmission_Bit_Flag', 'byAdmission_Num_Min', 'byAdmission_Num_Max', 'prologueCinematicTblidx', 'prologueTblidx', 'worldTblidx']
  },
  {
    id: 'conditions-0-4',
    title: 'Conditions 0-4',
    description: 'Configure conditions 0 through 4',
    columns: ['aConditionTblidx_0', 'aConditionTblidx_1', 'aConditionTblidx_2', 'aConditionTblidx_3', 'aConditionTblidx_4']
  },
  {
    id: 'conditions-5-9',
    title: 'Conditions 5-9',
    description: 'Configure conditions 5 through 9',
    columns: ['aConditionTblidx_5', 'aConditionTblidx_6', 'aConditionTblidx_7', 'aConditionTblidx_8', 'aConditionTblidx_9']
  },
  {
    id: 'missions-0-4',
    title: 'Missions 0-4',
    description: 'Configure missions 0 through 4',
    columns: ['aMissionTblidx_0', 'aMissionTblidx_1', 'aMissionTblidx_2', 'aMissionTblidx_3', 'aMissionTblidx_4']
  },
  {
    id: 'missions-5-9',
    title: 'Missions 5-9',
    description: 'Configure missions 5 through 9',
    columns: ['aMissionTblidx_5', 'aMissionTblidx_6', 'aMissionTblidx_7', 'aMissionTblidx_8', 'aMissionTblidx_9']
  }
];

const dwcQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'tblNameIndex', 'byLevel_Min']
  }
];

const dwcQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Index', column: 'tblNameIndex', color: 'blue' },
];

interface DwcFormProps {
  initialData?: Partial<DwcTableFormData>;
  onSubmit: (data: DwcTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DwcForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DwcFormProps) {
  return (
    <ModularForm<DwcTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={dwcTableSections}
      quickViewSections={dwcQuickViewSections}
      quickStats={dwcQuickStats}
      customSchema={dwcTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

