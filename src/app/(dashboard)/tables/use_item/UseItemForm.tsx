import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { UseItemFormData } from "./schema";
import { columns, useItemSchema } from "./schema";

const useItemTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic use item information",
        columns: [
          "Use_Info_Text"
        ]
      }
    ]
  },
  {
    id: "flags",
    label: "Flags",
    sections: [
      {
        id: "flags-settings",
        title: "Flags",
        description: "Configure flags",
        columns: [
          "dwCool_Time_Bit_Flag",
          "wFunction_Bit_Flag",
          "dwUse_Restriction_Rule_Bit_Flag",
          "dwUse_Allow_Rule_Bit_Flag",
          "wNeed_State_Bit_Flag"
        ]
      }
    ]
  },
  {
    id: "target",
    label: "Target & Range",
    sections: [
      {
        id: "target-settings",
        title: "Target Settings",
        description: "Configure target settings",
        columns: [
          "byAppoint_Target",
          "byApply_Target",
          "dwApply_Target_Index",
          "byApply_Target_Max"
        ]
      },
      {
        id: "range-settings",
        title: "Range Settings",
        description: "Configure range settings",
        columns: [
          "byApply_Range",
          "byApply_Area_Size_1",
          "byApply_Area_Size_2"
        ]
      }
    ]
  },
  {
    id: "requirements",
    label: "Requirements",
    sections: [
      {
        id: "requirements-settings",
        title: "Requirements",
        description: "Configure requirements",
        columns: [
          "dwRequire_LP",
          "wRequire_EP",
          "byRequire_RP_Ball",
          "RequiredQuestID"
        ]
      }
    ]
  },
  {
    id: "timing",
    label: "Timing",
    sections: [
      {
        id: "timing-settings",
        title: "Timing",
        description: "Configure timing settings",
        columns: [
          "dwCastingTimeInMilliSecs",
          "dwCoolTimeInMilliSecs",
          "dwKeepTimeInMilliSecs",
          "bKeep_Effect"
        ]
      }
    ]
  },
  {
    id: "range",
    label: "Range",
    sections: [
      {
        id: "range-settings",
        title: "Range",
        description: "Configure range settings",
        columns: [
          "byUse_Range_Min",
          "fUse_Range_Min",
          "byUse_Range_Max",
          "fUse_Range_Max"
        ]
      }
    ]
  },
  {
    id: "effects",
    label: "Effects",
    sections: [
      {
        id: "effects-settings",
        title: "Effects",
        description: "Configure effects",
        columns: [
          "szCasting_Effect",
          "szAction_Effect",
          "wCasting_Animation_Start",
          "wCasting_Animation_Loop",
          "wAction_Animation_Index",
          "wAction_Loop_Animation_Index",
          "wAction_End_Animation_Index",
          "byCastingEffectPosition",
          "byActionEffectPosition"
        ]
      }
    ]
  },
  {
    id: "location",
    label: "Location",
    sections: [
      {
        id: "location-settings",
        title: "Location",
        description: "Configure location settings",
        columns: [
          "useWorldTblidx",
          "fUseLoc_X",
          "fUseLoc_Z",
          "fUseLoc_Radius"
        ]
      }
    ]
  },
  {
    id: "system_effects",
    label: "System Effects",
    sections: Array.from({ length: 2 }, (_, i) => ({
      id: `system-effect-${i}`,
      title: `System Effect ${i}`,
      description: `Configure system effect ${i}`,
      columns: [
        `asystem_effect_${i}`,
        `abysystem_effect_type_${i}`,
        `asystem_effect_value_${i}`
      ]
    }))
  }
];

const useItemQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "byUse_Item_Active_Type", "byBuff_Group", "byBuffKeepType", "Use_Info_Text"]
  },
  {
    title: "Timing",
    columns: ["fCasting_Time", "dwCool_Time", "dwKeep_Time"]
  }
];

const useItemQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Active Type', 
    column: 'byUse_Item_Active_Type',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Buff Group', 
    column: 'byBuff_Group',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface UseItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: UseItemFormData;
  onSubmit: (data: UseItemFormData) => void;
  tableId: string;
}

export default function UseItemForm({
  mode,
  initialData,
  onSubmit,
  tableId,
  onOpenChange,
}: UseItemFormProps) {
  return (
    <ModularForm<UseItemFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={useItemTabs}
      quickViewSections={useItemQuickViewSections}
      quickStats={useItemQuickStats}
      customSchema={useItemSchema}
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
