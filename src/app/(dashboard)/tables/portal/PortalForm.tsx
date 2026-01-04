import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { PortalTableFormData } from "./schema";
import { columns, portalTableSchema } from "./schema";

const portalTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this portal entry',
    columns: ['tblidx', 'dwPointName', 'szPointNameText', 'dwUnknown', 'worldId', 'byGrade']
  },
  {
    id: 'location',
    title: 'Location Settings',
    description: 'Configure location and direction settings',
    columns: ['vLoc_x', 'vLoc_y', 'vLoc_z', 'vDir_x', 'vDir_y', 'vDir_z', 'vMap_x', 'vMap_y', 'vMap_z']
  },
  {
    id: 'points',
    title: 'Portal Points',
    description: 'Configure portal points and zenny costs',
    columns: ['aPoint_0', 'adwPointZenny_0', 'aPoint_1', 'adwPointZenny_1', 'aPoint_2', 'adwPointZenny_2', 'aPoint_3', 'adwPointZenny_3']
  }
];

const portalQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'szPointNameText', 'worldId']
  }
];

const portalQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Point Name', column: 'szPointNameText', color: 'blue' },
];

interface PortalFormProps {
  initialData?: Partial<PortalTableFormData>;
  onSubmit: (data: PortalTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function PortalForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: PortalFormProps) {
  return (
    <ModularForm<PortalTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={portalTableSections}
      quickViewSections={portalQuickViewSections}
      quickStats={portalQuickStats}
      customSchema={portalTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

