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
          "use_info_text"
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
          "dwcool_time_bit_flag",
          "wfunction_bit_flag",
          "dwuse_restriction_rule_bit_flag",
          "dwuse_allow_rule_bit_flag",
          "wneed_state_bit_flag"
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
          "byappoint_target",
          "byapply_target",
          "dwapply_target_index",
          "byapply_target_max"
        ]
      },
      {
        id: "range-settings",
        title: "Range Settings",
        description: "Configure range settings",
        columns: [
          "byapply_range",
          "byapply_area_size_1",
          "byapply_area_size_2"
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
          "dwrequire_lp",
          "wrequire_ep",
          "byrequire_rp_ball",
          "requiredquestid"
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
          "dwcastingtimeinmillisecs",
          "dwcooltimeinmillisecs",
          "dwkeeptimeinmillisecs",
          "bkeep_effect"
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
          "byuse_range_min",
          "fuse_range_min",
          "byuse_range_max",
          "fuse_range_max"
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
          "szcasting_effect",
          "szaction_effect",
          "wcasting_animation_start",
          "wcasting_animation_loop",
          "waction_animation_index",
          "waction_loop_animation_index",
          "waction_end_animation_index",
          "bycastingeffectposition",
          "byactioneffectposition"
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
          "useworldtblidx",
          "fuseloc_x",
          "fuseloc_z",
          "fuseloc_radius"
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
    columns: ["tblidx", "byuse_item_active_type", "bybuff_group", "bybuffkeeptype", "use_info_text"]
  },
  {
    title: "Timing",
    columns: ["fcasting_time", "dwcool_time", "dwkeep_time"]
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
    column: 'byuse_item_active_type',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Buff Group', 
    column: 'bybuff_group',
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
