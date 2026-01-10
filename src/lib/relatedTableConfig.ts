/**
 * Configuration for related table fields.
 * This allows defining which fields in which tables should have
 * a button to edit the related table row.
 */

export interface RelatedTableFieldConfig {
  /**
   * The field name in the current table that contains the ID
   */
  fieldName: string;
  
  /**
   * The table name (database table name) that this field references
   * e.g., 'table_item_data', 'table_skill_data', etc.
   */
  relatedTableName: string;
  
  /**
   * The table type (for routing/form selection and getting the correct table_id)
   * e.g., 'item', 'skill', 'npc', etc.
   * This is used to find the correct table_id that belongs to the owner
   */
  relatedTableType: string;
  
  /**
   * Optional: The field name in the related table to use as the ID
   * Defaults to 'id' if not specified
   * For item table, this should be 'tblidx'
   */
  relatedTableIdField?: string;
  
  /**
   * Optional: Display label for the button
   * Defaults to "Edit {relatedTableType}"
   */
  buttonLabel?: string;
}

/**
 * Configuration map: table type -> array of related field configurations
 * 
 * Example:
 * {
 *   'item': [
 *     {
 *       fieldName: 'use_item_tblidx',
 *       relatedTableName: 'table_use_item_data',
 *       relatedTableType: 'use_item',
 *       relatedTableIdField: 'tblidx'
 *     }
 *   ]
 * }
 */
export type RelatedTableConfigMap = Record<string, RelatedTableFieldConfig[]>;

/**
 * Global configuration for related table fields.
 * This will be populated by the user when they specify which fields
 * should have the related table edit button.
 */
export const relatedTableConfig: RelatedTableConfigMap = {
  // Item Bag List - item fields (aitem_0 through aitem_19)
  'item_bag_list': Array.from({ length: 20 }, (_, i) => ({
    fieldName: `aitem_${i}`,
    relatedTableName: 'table_item_data',
    relatedTableType: 'item',
    relatedTableIdField: 'tblidx', // Item table uses tblidx as the ID field
    buttonLabel: `Edit Item ${i}`,
  })),
  
  // Item Data Table - related table fields
  'item': [
    {
      fieldName: 'set_item_tblidx',
      relatedTableName: 'table_set_item_data',
      relatedTableType: 'set_item',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Set Item',
    },
    {
      fieldName: 'item_option_tblidx',
      relatedTableName: 'table_item_option_data',
      relatedTableType: 'item_option',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Item Option',
    },
    {
      fieldName: 'charm_tblidx',
      relatedTableName: 'table_charm_data',
      relatedTableType: 'charm',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Charm',
    },
    {
      fieldName: 'enchantratetblidx',
      relatedTableName: 'table_item_enchant_data',
      relatedTableType: 'item_enchant',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Item Enchant',
    },
    {
      fieldName: 'excellenttblidx',
      relatedTableName: 'table_item_data',
      relatedTableType: 'item',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Excellent Item',
    },
    {
      fieldName: 'raretblidx',
      relatedTableName: 'table_item_data',
      relatedTableType: 'item',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Rare Item',
    },
    {
      fieldName: 'legendarytblidx',
      relatedTableName: 'table_item_data',
      relatedTableType: 'item',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Legendary Item',
    },
    {
      fieldName: 'use_item_tblidx',
      relatedTableName: 'table_use_item_data',
      relatedTableType: 'use_item',
      relatedTableIdField: 'tblidx',
      buttonLabel: 'Edit Use Item',
    },
  ],
};

/**
 * Get related table configuration for a specific table and field
 */
export function getRelatedTableConfig(
  tableType: string,
  fieldName: string
): RelatedTableFieldConfig | undefined {
  const configs = relatedTableConfig[tableType];
  if (!configs) return undefined;
  
  return configs.find(config => config.fieldName === fieldName);
}

/**
 * Check if a field has a related table configuration
 */
export function hasRelatedTableConfig(
  tableType: string,
  fieldName: string
): boolean {
  return getRelatedTableConfig(tableType, fieldName) !== undefined;
}

