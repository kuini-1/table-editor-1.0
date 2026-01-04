import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { HtbSetTableFormData } from "./schema";
import { columns, htbSetTableSchema } from "./schema";

const htbSetTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this HTB set entry',
    columns: ['tblidx', 'wszNameText', 'HTB_Skill_Name', 'bValidity_Able', 'dwPC_Class_Bit_Flag', 'bySlot_Index', 'bySkill_Grade', 'szIcon_Name']
  },
  {
    id: 'skill-settings',
    title: 'Skill Settings',
    description: 'Configure skill settings',
    columns: ['wNeed_EP', 'byRequire_Train_Level', 'dwRequire_Zenny', 'wNext_Skill_Train_Exp', 'wCool_Time', 'dwCoolTimeInMilliSecs', 'Note', 'bySetCount', 'byStop_Point', 'wRequireSP']
  },
  {
    id: 'htb-actions-0-4',
    title: 'HTB Actions 0-4',
    description: 'Configure HTB actions 0 through 4',
    columns: ['aHTBAction_0_bySkillType', 'aHTBAction_0_skillTblidx', 'aHTBAction_1_bySkillType', 'aHTBAction_1_skillTblidx', 'aHTBAction_2_bySkillType', 'aHTBAction_2_skillTblidx', 'aHTBAction_3_bySkillType', 'aHTBAction_3_skillTblidx', 'aHTBAction_4_bySkillType', 'aHTBAction_4_skillTblidx']
  },
  {
    id: 'htb-actions-5-9',
    title: 'HTB Actions 5-9',
    description: 'Configure HTB actions 5 through 9',
    columns: ['aHTBAction_5_bySkillType', 'aHTBAction_5_skillTblidx', 'aHTBAction_6_bySkillType', 'aHTBAction_6_skillTblidx', 'aHTBAction_7_bySkillType', 'aHTBAction_7_skillTblidx', 'aHTBAction_8_bySkillType', 'aHTBAction_8_skillTblidx', 'aHTBAction_9_bySkillType', 'aHTBAction_9_skillTblidx']
  }
];

const htbSetQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'wszNameText', 'HTB_Skill_Name']
  }
];

const htbSetQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name Text', column: 'wszNameText', color: 'blue' },
];

interface HtbSetFormProps {
  initialData?: Partial<HtbSetTableFormData>;
  onSubmit: (data: HtbSetTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function HtbSetForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: HtbSetFormProps) {
  return (
    <ModularForm<HtbSetTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={htbSetTableSections}
      quickViewSections={htbSetQuickViewSections}
      quickStats={htbSetQuickStats}
      customSchema={htbSetTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

