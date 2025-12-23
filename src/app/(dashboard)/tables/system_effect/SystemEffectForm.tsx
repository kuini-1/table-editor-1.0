import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SystemEffectFormData } from "./schema";
import { columns, systemEffectSchema } from "./schema";

const systemEffectTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic system effect information",
        columns: ["effect_info_text"]
      }
    ]
  },
  {
    id: "effects",
    label: "Keep Effects",
    sections: [
      {
        id: "keep-effects",
        title: "Keep Effects",
        description: "Configure keep effects",
        columns: ["keep_effect_name", "bytarget_effect_position", "wkeep_animation_index"]
      }
    ]
  },
  {
    id: "success",
    label: "Success Effects",
    sections: [
      {
        id: "success-effects",
        title: "Success Effects",
        description: "Configure success effects",
        columns: ["szsuccess_effect_name", "bysuccess_projectile_type", "bysuccess_effect_position"]
      },
      {
        id: "end-effects",
        title: "End Effects",
        description: "Configure end effects",
        columns: ["szsuccess_end_effect_name", "byend_effect_position"]
      }
    ]
  }
];

const systemEffectQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszname", "byeffect_type", "byactive_effect_type", "effect_info_text"]
  }
];

const systemEffectQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Name', 
    column: 'wszname',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Effect Type', 
    column: 'byeffect_type',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
];

interface SystemEffectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: SystemEffectFormData;
  onSubmit: (data: SystemEffectFormData) => void;
  tableId: string;
}

export default function SystemEffectForm({
  mode,
  initialData,
  onSubmit,
  tableId,
  onOpenChange,
}: SystemEffectFormProps) {
  return (
    <ModularForm<SystemEffectFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={systemEffectTabs}
      quickViewSections={systemEffectQuickViewSections}
      quickStats={systemEffectQuickStats}
      customSchema={systemEffectSchema}
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
