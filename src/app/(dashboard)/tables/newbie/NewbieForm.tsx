import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { NewbieTableFormData } from "./schema";
import { columns, newbieTableSchema } from "./schema";

const newbieTableTabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this newbie entry',
        columns: ['tblidx', 'byRace', 'byClass', 'world_Id', 'tutorialWorld', 'mapNameTblidx']
      },
      {
        id: 'spawn-location',
        title: 'Spawn Location',
        description: 'Configure spawn location and direction',
        columns: ['vSpawn_Loc_x', 'vSpawn_Loc_y', 'vSpawn_Loc_z', 'vSpawn_Dir_x', 'vSpawn_Dir_y', 'vSpawn_Dir_z']
      },
      {
        id: 'bind-location',
        title: 'Bind Location',
        description: 'Configure bind location and direction',
        columns: ['vBind_Loc_x', 'vBind_Loc_y', 'vBind_Loc_z', 'vBind_Dir_x', 'vBind_Dir_y', 'vBind_Dir_z']
      },
      {
        id: 'items',
        title: 'Starting Items',
        description: 'Configure starting items',
        columns: ['qItemTblidx1', 'byQPosition1', 'byQStackQuantity1', 'wMixLevelData']
      }
    ]
  },
  {
    id: 'quick-data',
    label: 'Quick Data',
    sections: [
      {
        id: 'quick-data-0-4',
        title: 'Quick Data 0-4',
        description: 'Configure quick data 0 through 4',
        columns: ['asQuickData_0_bySlotType', 'asQuickData_0_byQuickSlot', 'asQuickData_0_tblidx', 'asQuickData_1_bySlotType', 'asQuickData_1_byQuickSlot', 'asQuickData_1_tblidx', 'asQuickData_2_bySlotType', 'asQuickData_2_byQuickSlot', 'asQuickData_2_tblidx', 'asQuickData_3_bySlotType', 'asQuickData_3_byQuickSlot', 'asQuickData_3_tblidx', 'asQuickData_4_bySlotType', 'asQuickData_4_byQuickSlot', 'asQuickData_4_tblidx']
      },
      {
        id: 'quick-data-5-9',
        title: 'Quick Data 5-9',
        description: 'Configure quick data 5 through 9',
        columns: ['asQuickData_5_bySlotType', 'asQuickData_5_byQuickSlot', 'asQuickData_5_tblidx', 'asQuickData_6_bySlotType', 'asQuickData_6_byQuickSlot', 'asQuickData_6_tblidx', 'asQuickData_7_bySlotType', 'asQuickData_7_byQuickSlot', 'asQuickData_7_tblidx', 'asQuickData_8_bySlotType', 'asQuickData_8_byQuickSlot', 'asQuickData_8_tblidx', 'asQuickData_9_bySlotType', 'asQuickData_9_byQuickSlot', 'asQuickData_9_tblidx']
      }
    ]
  },
  {
    id: 'portals',
    label: 'Portals',
    sections: [
      {
        id: 'portals',
        title: 'Default Portals',
        description: 'Configure default portal IDs',
        columns: ['defaultPortalId_0', 'defaultPortalId_1', 'defaultPortalId_2']
      }
    ]
  }
];

const newbieQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byRace', 'byClass']
  }
];

const newbieQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Race', column: 'byRace', color: 'blue' },
];

interface NewbieFormProps {
  initialData?: Partial<NewbieTableFormData>;
  onSubmit: (data: NewbieTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function NewbieForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: NewbieFormProps) {
  return (
    <ModularForm<NewbieTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={newbieTableTabs}
      quickViewSections={newbieQuickViewSections}
      quickStats={newbieQuickStats}
      customSchema={newbieTableSchema}
      defaultTab="basic"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

