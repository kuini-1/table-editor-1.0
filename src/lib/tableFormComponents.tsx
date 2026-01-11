/**
 * Mapping of table types to their form components
 * This allows RelatedTableEditModal to use the correct form for each table type
 */

import { lazy } from 'react';
import type { ComponentType } from 'react';

// Define a common interface for form components
// Note: Different form components may have slightly different prop requirements
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableFormComponentProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'duplicate';
  tableId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Lazy load form components to reduce initial bundle size
const ItemForm = lazy(() => 
  import('@/app/(dashboard)/tables/item/ItemForm').then(module => ({ 
    default: module.default 
  }))
);

const SetItemForm = lazy(() => 
  import('@/app/(dashboard)/tables/set_item/SetItemForm').then(module => ({ 
    default: module.default 
  }))
);

const ItemOptionForm = lazy(() => 
  import('@/app/(dashboard)/tables/item_option/ItemOptionForm').then(module => ({ 
    default: module.ItemOptionForm 
  }))
);

const CharmForm = lazy(() => 
  import('@/app/(dashboard)/tables/charm/CharmForm').then(module => ({ 
    default: module.CharmForm 
  }))
);

const ItemEnchantForm = lazy(() => 
  import('@/app/(dashboard)/tables/item_enchant/ItemEnchantForm').then(module => ({ 
    default: module.ItemEnchantForm 
  }))
);

const UseItemForm = lazy(() => 
  import('@/app/(dashboard)/tables/use_item/UseItemForm').then(module => ({ 
    default: module.default 
  }))
);

// Map table types to their form components
export const TABLE_FORM_COMPONENTS: Record<string, ComponentType<TableFormComponentProps>> = {
  'item': ItemForm,
  'set_item': SetItemForm,
  'item_option': ItemOptionForm,
  'charm': CharmForm,
  'item_enchant': ItemEnchantForm,
  'use_item': UseItemForm,
  // Add more table form components here as needed
  // 'skill': SkillForm,
  // 'npc': NpcForm,
  // etc.
};

/**
 * Get the form component for a specific table type
 */
export function getFormComponentForTableType(
  tableType: string
): ComponentType<TableFormComponentProps> | null {
  return TABLE_FORM_COMPONENTS[tableType] || null;
}

/**
 * Check if a form component exists for a table type
 */
export function hasFormComponentForTableType(tableType: string): boolean {
  return tableType in TABLE_FORM_COMPONENTS;
}

