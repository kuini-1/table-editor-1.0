import { ModularForm } from "@/components/table/ModularForm";
import type { FormMode } from "@/components/table/ModularForm";
import type { FormulaFormData } from "./schema";
import { columns, newFormulaSchema } from "./schema";

const formulaTabs = [
  {
    id: "basic",
    label: "Basic Info",
    sections: [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Enter basic formula information",
        columns: ["tblidx", "bValidity_Able"]
      }
    ]
  },
  {
    id: "rates",
    label: "Rates",
    sections: [
      {
        id: "rate-settings",
        title: "Rate Settings",
        description: "Configure formula rates",
        columns: ["afRate_0", "afRate_1", "afRate_2", "afRate_3"]
      }
    ]
  }
];

const formulaQuickViewSections = [
  {
    title: "Basic Information",
    columns: ["tblidx", "bValidity_Able"]
  }
];

const formulaQuickStats = [
  { label: 'ID', column: 'tblidx' },
  { label: 'Valid', column: 'bValidity_Able' },
];

interface FormulaFormProps {
  initialData?: FormulaFormData | null;
  onSubmit: (data: FormulaFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
}

export function FormulaForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
}: FormulaFormProps) {
  return (
    <ModularForm<FormulaFormData>
      columns={columns}
      initialData={initialData || undefined}
      onSubmit={onSubmit}
      onCancel={onCancel}
      mode={mode}
      tableId={tableId}
      tabs={formulaTabs}
      quickViewSections={formulaQuickViewSections}
      quickStats={formulaQuickStats}
      customSchema={newFormulaSchema}
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
