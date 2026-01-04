import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DbRewardTableFormData } from "./schema";
import { columns, dbRewardTableSchema } from "./schema";

const dbRewardTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this DB reward entry',
    columns: ['tblidx', 'byBallType', 'byRewardCategoryDepth', 'rewardCategoryName', 'rewardCategoryDialog']
  },
  {
    id: 'reward-details',
    title: 'Reward Details',
    description: 'Configure reward details',
    columns: ['byRewardType', 'rewardName', 'rewardLinkTblidx', 'dwRewardZenny', 'rewardDialog1', 'rewardDialog2', 'dwClassBit']
  }
];

const dbRewardQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'byBallType', 'rewardCategoryName']
  }
];

const dbRewardQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Ball Type', column: 'byBallType', color: 'blue' },
];

interface DbRewardFormProps {
  initialData?: Partial<DbRewardTableFormData>;
  onSubmit: (data: DbRewardTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DbRewardForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DbRewardFormProps) {
  return (
    <ModularForm<DbRewardTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={dbRewardTableSections}
      quickViewSections={dbRewardQuickViewSections}
      quickStats={dbRewardQuickStats}
      customSchema={dbRewardTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

