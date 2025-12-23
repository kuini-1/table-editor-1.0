import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { SkillFormData } from "./schema";
import { columns, skillSchema } from "./schema";

const skillTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic skill information",
        columns: ["note"]
      },
      {
        id: "class-type",
        title: "Class and Type",
        description: "Skill classification settings",
        columns: [
          "byskill_active_type",
          "byskill_group"
        ]
      },
      {
        id: "requirements",
        title: "Requirements",
        description: "Skill requirements and costs",
        columns: [
          "dwrequire_lp",
          "wrequire_ep",
          "dwrequire_vp",
          "byrequire_rp_ball"
        ]
      },
      {
        id: "timing",
        title: "Timing",
        description: "Cast time, cooldown, and duration",
        columns: [
          "fcasting_time",
          "dwcastingtimeinmillisecs",
          "wcool_time",
          "dwcooltimeinmillisecs",
          "wkeep_time",
          "dwkeeptimeinmillisecs"
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
        description: "Target selection configuration",
        columns: [
          "byappoint_target",
          "byapply_target",
          "byapply_target_max"
        ]
      },
      {
        id: "range-settings",
        title: "Range Settings",
        description: "Skill range configuration",
        columns: [
          "byapply_range",
          "byuse_range_min",
          "byuse_range_max"
        ]
      }
    ]
  },
  {
    id: "skill_effects",
    label: "Skill Effects",
    sections: [
      {
        id: "effect-1",
        title: "Effect 1",
        description: "Primary skill effect",
        columns: [
          "skill_effect_0",
          "byskill_effect_type_0",
          "askill_effect_value_0"
        ]
      },
      {
        id: "effect-2",
        title: "Effect 2",
        description: "Secondary skill effect",
        columns: [
          "skill_effect_1",
          "byskill_effect_type_1",
          "askill_effect_value_1"
        ]
      }
    ]
  },
  {
    id: "rp_effects",
    label: "RP Effects",
    sections: Array.from({ length: 6 }, (_, i) => ({
      id: `rp-effect-${i}`,
      title: `RP Effect ${i + 1}`,
      description: `RP effect ${i + 1} configuration`,
      columns: [
        `abyrpeffect_${i}`,
        `afrpeffectvalue_${i}`
      ]
    }))
  }
];

const skillQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "skill_name", "wsznametext", "szicon_name"]
  },
  {
    title: "Class & Type",
    columns: ["byclass_type", "byskill_class", "byskill_type", "byskill_grade"]
  },
  {
    title: "Requirements",
    columns: ["byrequire_train_level", "dwrequire_zenny", "wrequiresp"]
  }
];

const skillQuickStats = [
  { 
    label: 'ID', 
    column: 'tblidx',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'mono'
  },
  { 
    label: 'Skill Name', 
    column: 'skill_name',
    formatValue: (value: unknown) => String(value ?? '—')
  },
  { 
    label: 'Skill Class', 
    column: 'byskill_class',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'blue'
  },
  { 
    label: 'Required Level', 
    column: 'byrequire_train_level',
    formatValue: (value: unknown) => String(value ?? '—'),
    color: 'purple'
  },
];

interface SkillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FormMode;
  initialData?: SkillFormData;
  onSubmit: (data: SkillFormData) => void;
  tableId: string;
}

export default function SkillForm({
  onOpenChange,
  initialData,
  onSubmit,
  mode,
  tableId,
}: SkillFormProps) {
  return (
    <ModularForm<SkillFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      mode={mode}
      tableId={tableId}
      tabs={skillTabs}
      quickViewSections={skillQuickViewSections}
      quickStats={skillQuickStats}
      customSchema={skillSchema}
      defaultTab="basic"
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Skill';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Skill';
      }}
    />
  );
}
