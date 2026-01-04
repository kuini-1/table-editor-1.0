import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { WorldmapTableFormData } from "./schema";
import { columns, worldmapTableSchema } from "./schema";

const worldmapTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this worldmap entry',
    columns: ['tblidx', 'World_Tblidx', 'Zone_Tblidx', 'Worldmap_Name', 'wszNameText', 'bValidityAble', 'byMapType']
  },
  {
    id: 'location',
    title: 'Location Settings',
    description: 'Configure location settings',
    columns: ['vStandardLoc_x', 'vStandardLoc_y', 'vStandardLoc_z', 'fWorldmapScale', 'dwLinkMapIdx', 'dwComboBoxType', 'byRecomm_Min_Level', 'byRecomm_Max_Level', 'vUiModify_x', 'vUiModify_y', 'vUiModify_z']
  },
  {
    id: 'warfog',
    title: 'Warfog Settings',
    description: 'Configure warfog settings',
    columns: ['wWarfog_0', 'wWarfog_1', 'wWarfog_2', 'wWarfog_3', 'wWarfog_4', 'wWarfog_5', 'wWarfog_6', 'wWarfog_7', 'wWarfog_8', 'wWarfog_9']
  }
];

const worldmapQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'World_Tblidx', 'wszNameText']
  }
];

const worldmapQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'World Table ID', column: 'World_Tblidx', color: 'blue' },
];

interface WorldmapFormProps {
  initialData?: Partial<WorldmapTableFormData>;
  onSubmit: (data: WorldmapTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function WorldmapForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: WorldmapFormProps) {
  return (
    <ModularForm<WorldmapTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={worldmapTableSections}
      quickViewSections={worldmapQuickViewSections}
      quickStats={worldmapQuickStats}
      customSchema={worldmapTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

