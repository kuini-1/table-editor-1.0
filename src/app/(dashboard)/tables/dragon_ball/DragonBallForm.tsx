import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { DragonBallTableFormData } from "./schema";
import { columns, dragonBallTableSchema } from "./schema";

const dragonBallTableSections = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details for this dragon ball entry',
    columns: ['tblidx', 'dwAltarGroup', 'byBallType', 'ballDropTblidx', 'ballJunkTblidx']
  },
  {
    id: 'dialogs',
    title: 'Dialog Settings',
    description: 'Configure dialog settings',
    columns: ['startDialog', 'endDialog', 'timeoverEndDialog', 'hurryDialog', 'timeoverDialog', 'noRepeatDialog', 'inventoryFullDialog', 'skillOverlapDialog', 'skillShortageOfLVDialog', 'dragonNPCTblidx', 'defaultSummonChat']
  },
  {
    id: 'direction',
    title: 'Direction & Balls',
    description: 'Configure direction and ball table IDs',
    columns: ['fDir_x', 'fDir_z', 'aBallTblidx_0', 'aBallTblidx_1', 'aBallTblidx_2', 'aBallTblidx_3', 'aBallTblidx_4', 'aBallTblidx_5', 'aBallTblidx_6']
  }
];

const dragonBallQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwAltarGroup', 'byBallType']
  }
];

const dragonBallQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Altar Group', column: 'dwAltarGroup', color: 'blue' },
];

interface DragonBallFormProps {
  initialData?: Partial<DragonBallTableFormData>;
  onSubmit: (data: DragonBallTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function DragonBallForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: DragonBallFormProps) {
  return (
    <ModularForm<DragonBallTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      sections={dragonBallTableSections}
      quickViewSections={dragonBallQuickViewSections}
      quickStats={dragonBallQuickStats}
      customSchema={dragonBallTableSchema}
      showFooter={true}
      submitLabel={(mode) => {
        if (mode === 'add') return 'Add Entry';
        if (mode === 'edit') return 'Save Changes';
        return 'Duplicate Entry';
      }}
    />
  );
}

