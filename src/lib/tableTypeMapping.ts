/**
 * Maps database table types to their corresponding folder names.
 * This ensures that when clicking on a table, it routes to the correct folder.
 * 
 * Handles variations where database types might have underscores but folders don't,
 * or vice versa (e.g., 'air_costume' in DB -> 'aircostume' folder).
 */
export const TYPE_TO_FOLDER_MAP: Record<string, string> = {
  // Direct mappings (type matches folder exactly)
  'action': 'action',
  'aircostume': 'aircostume',
  'charm': 'charm',
  'chartitle': 'chartitle',
  'chat_command': 'chat_command',
  'chat_filter': 'chat_filter',
  'common_config': 'common_config',
  'db_returnpoint': 'db_returnpoint',
  'db_reward': 'db_reward',
  'direction_link': 'direction_link',
  'dojo': 'dojo',
  'dragon_ball': 'dragon_ball',
  'dungeon': 'dungeon',
  'dwc': 'dwc',
  'dwc_mission': 'dwc_mission',
  'dynamic_object': 'dynamic_object',
  'event_system_dynamic': 'event_system_dynamic',
  'exp': 'exp',
  'formula': 'formula',
  'hls': 'hls',
  'hls_item': 'hls_item',
  'htb_set': 'htb_set',
  'item': 'item',
  'item_bag_list': 'item_bag_list',
  'item_disassemble': 'item_disassemble',
  'item_enchant': 'item_enchant',
  'item_group_list': 'item_group_list',
  'item_mix_exp': 'item_mix_exp',
  'item_mix_machine': 'item_mix_machine',
  'item_option': 'item_option',
  'item_recipe': 'item_recipe',
  'item_upgrade_newrate': 'item_upgrade_newrate',
  'mascot': 'mascot',
  'mascot_grade': 'mascot_grade',
  'mascot_status': 'mascot_status',
  'merchant': 'merchant',
  'mob': 'mob',
  'mob_data_server': 'mob_data_server',
  'mob_move_pattern': 'mob_move_pattern',
  'newbie': 'newbie',
  'npc': 'npc',
  'npc_data_server': 'npc_data_server',
  'npc_speech': 'npc_speech',
  'pc': 'pc',
  'portal': 'portal',
  'quest_drop': 'quest_drop',
  'quest_item': 'quest_item',
  'quest_probability': 'quest_probability',
  'quest_reward': 'quest_reward',
  'quest_reward_select': 'quest_reward_select',
  'rankbattle': 'rankbattle',
  'server_config': 'server_config',
  'set_item': 'set_item',
  'skill': 'skill',
  'slot_machine': 'slot_machine',
  'slot_machine_item': 'slot_machine_item',
  'status_transform': 'status_transform',
  'system_effect': 'system_effect',
  'tmq': 'tmq',
  'use_item': 'use_item',
  'vehicle': 'vehicle',
  'world': 'world',
  'world_play': 'world_play',
  'world_zone': 'world_zone',
  'worldmap': 'worldmap',
  
  // Variations with underscores (database type has underscore, folder doesn't)
  'air_costume': 'aircostume',  // Database: 'air_costume' -> Folder: 'aircostume'
  
  // Variations without underscores (database type doesn't have underscore, folder does)
  'chatcommand': 'chat_command',
  'chatfilter': 'chat_filter',
  'commonconfig': 'common_config',
  'dbreturnpoint': 'db_returnpoint',
  'dbreward': 'db_reward',
  'directionlink': 'direction_link',
  'dragonball': 'dragon_ball',
  'dwcmission': 'dwc_mission',
  'dynamicobject': 'dynamic_object',
  'eventsystemdynamic': 'event_system_dynamic',
  'htbset': 'htb_set',
  'itemdisassemble': 'item_disassemble',
  'itemmachinemix': 'item_mix_machine',
  'itemmixmachine': 'item_mix_machine',
  'itemrecipe': 'item_recipe',
  'itemupgradenewrate': 'item_upgrade_newrate',
  'mascotgrade': 'mascot_grade',
  'mascotstatus': 'mascot_status',
  'mobmovepattern': 'mob_move_pattern',
  'npcspeech': 'npc_speech',
  'questdrop': 'quest_drop',
  'questitem': 'quest_item',
  'questreward': 'quest_reward',
  'questrewardselect': 'quest_reward_select',
  'serverconfig': 'server_config',
  'slotmachine': 'slot_machine',
  'statustransform': 'status_transform',
  'worldplay': 'world_play',
  'worldzone': 'world_zone',
  
  // Special mappings where database type differs significantly from folder name
  'budokai': 'tenkaichibudokai',  // Database type 'budokai' -> folder 'tenkaichibudokai'
  'tenkaichibudokai': 'tenkaichibudokai',  // Also support the full name
  'dragon_ball_returnpoint': 'db_returnpoint',  // Database type 'dragon_ball_returnpoint' -> folder 'db_returnpoint'
  'dragonballreturnpoint': 'db_returnpoint',  // Variation without underscores
  'dragon_ball_reward': 'db_reward',  // Database type 'dragon_ball_reward' -> folder 'db_reward'
  'dragonballreward': 'db_reward',  // Variation without underscores
  'item_upgrade': 'item_upgrade_newrate',  // Database type 'item_upgrade' -> folder 'item_upgrade_newrate'
  'itemupgrade': 'item_upgrade_newrate',  // Variation without underscores
  'title': 'chartitle',  // Database type 'title' -> folder 'chartitle'
  'char_title': 'chartitle',  // Alternative name
};

/**
 * Gets the folder name for a given database table type.
 * Falls back to the type itself if no mapping exists.
 * Also handles case-insensitive matching as a fallback.
 */
export function getFolderNameForType(type: string): string {
  // First try exact match
  if (TYPE_TO_FOLDER_MAP[type]) {
    return TYPE_TO_FOLDER_MAP[type];
  }
  
  // Try case-insensitive match
  const lowerType = type.toLowerCase();
  if (TYPE_TO_FOLDER_MAP[lowerType]) {
    return TYPE_TO_FOLDER_MAP[lowerType];
  }
  
  // Try removing underscores and matching
  const noUnderscore = type.replace(/_/g, '');
  if (TYPE_TO_FOLDER_MAP[noUnderscore]) {
    return TYPE_TO_FOLDER_MAP[noUnderscore];
  }
  
  // Try adding underscores (less common, but handle it)
  // This would require knowing where to add underscores, so we skip this
  
  // Final fallback: return the type as-is
  return type;
}
