import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { ItemRecipeTableFormData } from "./schema";
import { columns, itemRecipeTableSchema } from "./schema";

const itemRecipeTableTabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        description: 'Enter the basic details for this item recipe entry',
        columns: ['tblidx', 'bValidityAble', 'dwName', 'byRecipeType', 'byNeedMixLevel', 'dwNeedMixZenny']
      }
    ]
  },
  {
    id: 'create-items',
    label: 'Create Items',
    sections: [
      {
        id: 'create-items',
        title: 'Create Items',
        description: 'Configure items that can be created',
        columns: ['asCreateItemTblidx_0_itemTblidx', 'asCreateItemTblidx_0_itemRate', 'asCreateItemTblidx_1_itemTblidx', 'asCreateItemTblidx_1_itemRate', 'asCreateItemTblidx_2_itemTblidx', 'asCreateItemTblidx_2_itemRate', 'asCreateItemTblidx_3_itemTblidx', 'asCreateItemTblidx_3_itemRate', 'asCreateItemTblidx_4_itemTblidx', 'asCreateItemTblidx_4_itemRate']
      }
    ]
  },
  {
    id: 'materials',
    label: 'Materials',
    sections: [
      {
        id: 'materials-0-4',
        title: 'Materials 0-4',
        description: 'Configure materials 0 through 4',
        columns: ['asMaterial_0_materialTblidx', 'asMaterial_0_byMaterialCount', 'asMaterial_1_materialTblidx', 'asMaterial_1_byMaterialCount', 'asMaterial_2_materialTblidx', 'asMaterial_2_byMaterialCount', 'asMaterial_3_materialTblidx', 'asMaterial_3_byMaterialCount', 'asMaterial_4_materialTblidx', 'asMaterial_4_byMaterialCount']
      },
      {
        id: 'materials-5-9',
        title: 'Materials 5-9',
        description: 'Configure materials 5 through 9',
        columns: ['asMaterial_5_materialTblidx', 'asMaterial_5_byMaterialCount', 'asMaterial_6_materialTblidx', 'asMaterial_6_byMaterialCount', 'asMaterial_7_materialTblidx', 'asMaterial_7_byMaterialCount', 'asMaterial_8_materialTblidx', 'asMaterial_8_byMaterialCount', 'asMaterial_9_materialTblidx', 'asMaterial_9_byMaterialCount']
      }
    ]
  }
];

const itemRecipeQuickViewSections = [
  {
    title: 'Basic Information',
    columns: ['tblidx', 'dwName', 'byRecipeType']
  }
];

const itemRecipeQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Name', column: 'dwName', color: 'blue' },
];

interface ItemRecipeFormProps {
  initialData?: Partial<ItemRecipeTableFormData>;
  onSubmit: (data: ItemRecipeTableFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
}

export function ItemRecipeForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: ItemRecipeFormProps) {
  return (
    <ModularForm<ItemRecipeTableFormData>
      columns={columns}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={itemRecipeTableTabs}
      quickViewSections={itemRecipeQuickViewSections}
      quickStats={itemRecipeQuickStats}
      customSchema={itemRecipeTableSchema}
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

