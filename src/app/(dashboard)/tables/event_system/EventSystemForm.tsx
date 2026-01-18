import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { EventSystemFormData } from "./schema";
import { columns, eventSystemSchema } from "./schema";

const eventSystemTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic event system information",
        columns: ["tblidx", "wszName", "bOnOff", "byServerFarm", "dwConnectionTime"]
      }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    sections: [
      {
        id: "event-settings",
        title: "Event Settings",
        description: "Configure event system settings",
        columns: ["byType", "tIndex", "dwContentRestrictionBitFlag", "fRate", "byAction", "aIndex", "byGroup"]
      }
    ]
  },
  {
    id: "advanced",
    label: "Advanced",
    sections: [
      {
        id: "advanced-settings",
        title: "Advanced Settings",
        description: "Configure advanced event system settings",
        columns: ["dwVolume", "dwUnknown", "adwSetting_0", "adwSetting_1", "adwSetting_2"]
      }
    ]
  }
];

const eventSystemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszName", "bOnOff", "byType"]
  }
];

const eventSystemQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'wszName',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Type', 
    column: 'byType',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'On/Off', 
    column: 'bOnOff',
    formatValue: (value: unknown) => value ? 'On' : 'Off',
    color: 'green'
  },
];

interface EventSystemFormProps {
  initialData?: Partial<EventSystemFormData>;
  onSubmit: (data: EventSystemFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function EventSystemForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: EventSystemFormProps) {
  return (
    <ModularForm<EventSystemFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={eventSystemTabs}
      quickViewSections={eventSystemQuickViewSections}
      quickStats={eventSystemQuickStats}
      customSchema={eventSystemSchema}
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
