import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { EventSystemDynamicTableFormData } from "./schema";
import { columns, eventSystemDynamicTableSchema } from "./schema";

const eventSystemDynamicTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this event system dynamic entry',
    columns: ['tblidx', 'wszName', 'bOnOff', 'byServerFarm', 'dwConnectionTime', 'byType', 'tIndex', 'dwContentRestrictionBitFlag']
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure event settings',
    columns: ['adwSetting_0', 'adwSetting_1', 'adwSetting_2', 'fRate', 'byAction', 'aIndex', 'byGroup', 'dwVolume']
  }
];

const eventSystemDynamicQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszName', 'bOnOff']
  }
];

const eventSystemDynamicQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name', column: 'wszName', color: 'blue' },
];

interface EventSystemDynamicFormProps {
  initialData?: Partial<EventSystemDynamicTableFormData>;
  onSubmit: (data: EventSystemDynamicTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function EventSystemDynamicForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: EventSystemDynamicFormProps) {
  return (
    <ModularForm<EventSystemDynamicTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={eventSystemDynamicTableSections}
      quickViewSections={eventSystemDynamicQuickViewSections}
      quickStats={eventSystemDynamicQuickStats}
      customSchema={eventSystemDynamicTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

