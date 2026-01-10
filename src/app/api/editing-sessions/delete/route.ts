import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    // Handle both JSON and FormData (for sendBeacon)
    let body: any;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData from sendBeacon
      const formData = await request.formData();
      const dataStr = formData.get('data') as string;
      if (dataStr) {
        body = JSON.parse(dataStr);
      } else {
        // Fallback: try to get individual fields
        body = {
          sessionId: formData.get('sessionId') || undefined,
          tableId: formData.get('tableId') || undefined,
          userId: formData.get('userId') || undefined,
          sessionType: formData.get('sessionType') || undefined,
          rowId: formData.get('rowId') || undefined,
        };
      }
    } else {
      // Try to parse as JSON anyway
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: 'Invalid request format', details: 'Expected JSON or FormData' },
          { status: 400 }
        );
      }
    }
    
    const { sessionId, tableId, userId, sessionType, rowId } = body;

    // Validate input - need either sessionId OR (tableId + userId + sessionType)
    if (!sessionId && (!tableId || !userId || !sessionType)) {
      return NextResponse.json(
        { error: 'Missing required parameters', details: 'Need either sessionId or (tableId, userId, sessionType)' },
        { status: 400 }
      );
    }

    let deleteQuery = supabaseAdmin
      .from('table_editing_sessions')
      .delete();

    if (sessionId) {
      // Delete by session ID
      deleteQuery = deleteQuery.eq('id', sessionId);
    } else {
      // Delete by table_id, user_id, and session_type
      deleteQuery = deleteQuery
        .eq('table_id', tableId)
        .eq('user_id', userId)
        .eq('session_type', sessionType);
      
      // Include row_id if provided
      if (rowId !== undefined) {
        if (rowId === null) {
          deleteQuery = deleteQuery.is('row_id', null);
        } else {
          deleteQuery = deleteQuery.eq('row_id', rowId);
        }
      }
    }

    const { error, count } = await deleteQuery;

    if (error) {
      console.error('Error deleting editing session:', error);
      return NextResponse.json(
        { error: 'Failed to delete session', details: error.message },
        { status: 500 }
      );
    }

    console.log('Session deleted successfully:', { sessionId, tableId, userId, sessionType, count });

    return NextResponse.json({ success: true, deleted: count || 0 });
  } catch (error) {
    console.error('Error in delete session endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

