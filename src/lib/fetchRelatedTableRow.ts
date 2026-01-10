import { createClient } from '@/lib/supabase/client';

/**
 * Gets the table_id for a specific table type for the current user's owner
 */
async function getTableIdForType(tableType: string): Promise<string | null> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;
    
    // Get user's profile to determine if they're owner or sub_owner
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, owners(id), sub_owners(owner_id)')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) return null;
    
    let ownerId: string | null = null;
    
    if (profile.role === 'owner' && profile.owners && profile.owners.length > 0) {
      ownerId = profile.owners[0].id;
    } else if (profile.role === 'sub_owner' && profile.sub_owners && profile.sub_owners.length > 0) {
      ownerId = profile.sub_owners[0].owner_id;
    }
    
    if (!ownerId) return null;
    
    // Get the table_id for the specified table type
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('id')
      .eq('owner_id', ownerId)
      .eq('type', tableType)
      .single();
    
    if (tableError || !table) return null;
    
    return table.id;
  } catch (error) {
    console.error('Error getting table_id for type:', error);
    return null;
  }
}

/**
 * Fetches a single row from a related table by ID
 * Ensures the row belongs to the owner by using the correct table_id
 */
export async function fetchRelatedTableRow<T = Record<string, unknown>>(
  tableName: string,
  currentTableId: string, // The related table's table_id (should already be the correct one)
  rowId: string | number,
  idField: string = 'id',
  relatedTableType?: string // Optional: table type to get the correct table_id (only used if currentTableId is not the correct one)
): Promise<T | null> {
  try {
    const supabase = createClient();
    
    // Get the correct table_id for the related table if table type is provided
    // Only fetch if we don't already have the correct table_id
    let relatedTableId = currentTableId;
    if (relatedTableType && currentTableId) {
      // If currentTableId looks like it might be the parent table's ID (UUID format),
      // we need to get the related table's ID. Otherwise, assume currentTableId is already correct.
      // For now, if relatedTableType is provided, we'll fetch it to be safe
      // But ideally, the caller should pass the correct table_id directly
      const tableIdForType = await getTableIdForType(relatedTableType);
      if (tableIdForType) {
        relatedTableId = tableIdForType;
      } else {
        console.error(`Could not find table_id for table type: ${relatedTableType}`);
        return null;
      }
    }
    
    // Build the query
    let query = supabase
      .from(tableName)
      .select('*')
      .eq('table_id', relatedTableId);
    
    // Use the specified ID field (e.g., tblidx for item table)
    if (idField === 'id') {
      query = query.eq('id', rowId);
    } else {
      // For non-UUID fields (like tblidx), we need to match by the field name
      query = query.eq(idField, rowId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      // If single() fails, try using limit(1) and take first result
      const { data: dataArray, error: arrayError } = await supabase
        .from(tableName)
        .select('*')
        .eq('table_id', relatedTableId)
        .eq(idField, rowId)
        .limit(1);
      
      if (arrayError) {
        console.error('Error fetching related table row:', arrayError);
        return null;
      }
      
      return (dataArray && dataArray.length > 0 ? dataArray[0] : null) as T | null;
    }
    
    return data as T | null;
  } catch (error) {
    console.error('Error fetching related table row:', error);
    return null;
  }
}

/**
 * Updates a row in a related table
 * Ensures the row belongs to the owner by filtering by table_id
 */
export async function updateRelatedTableRow<T = Record<string, unknown>>(
  tableName: string,
  rowId: string,
  updates: Partial<T>,
  tableId?: string // Optional: table_id to ensure we're updating the correct owner's row
): Promise<T | null> {
  try {
    const supabase = createClient();
    
    console.log('updateRelatedTableRow called with:', {
      tableName,
      rowId,
      tableId,
      updateKeys: Object.keys(updates),
      updateCount: Object.keys(updates).length
    });
    
    // Build the update query
    let query = supabase
      .from(tableName)
      .update(updates)
      .eq('id', rowId);
    
    // If table_id is provided, also filter by it to ensure we're updating the correct owner's row
    if (tableId) {
      query = query.eq('table_id', tableId);
    }
    
    const { data, error } = await query
      .select()
      .single();
    
    if (error) {
      console.error('Error updating related table row:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      console.error('Update details:', { 
        tableName, 
        rowId, 
        tableId,
        updateKeys: Object.keys(updates),
        sampleUpdate: Object.fromEntries(Object.entries(updates).slice(0, 3))
      });
      return null;
    }
    
    console.log('Row updated successfully:', {
      tableName,
      rowId,
      updatedFields: Object.keys(updates)
    });
    
    return data as T | null;
  } catch (error) {
    console.error('Exception updating related table row:', error);
    return null;
  }
}

