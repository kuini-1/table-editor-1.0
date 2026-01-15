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
        columns: ["Effect_Info_Text"]
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
        columns: ["Keep_Effect_Name", "byTarget_Effect_Position", "wKeep_Animation_Index"]
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
        columns: ["szSuccess_Effect_Name", "bySuccess_Projectile_Type", "bySuccess_Effect_Position"]
      },
      {
        id: "end-effects",
        title: "End Effects",
        description: "Configure end effects",
        columns: ["szSuccess_End_Effect_Name", "byEnd_Effect_Position"]
      }
    ]
  }
];

const systemEffectQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "wszName", "byEffect_Type", "byActive_Effect_Type", "Effect_Info_Text"]
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
    column: 'wszName',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Effect Type', 
    column: 'byEffect_Type',
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
