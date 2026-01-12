import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Create service client for bandwidth operations
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials');
  }

  return createServiceClient(supabaseUrl, serviceRoleKey);
}

/**
 * Check bandwidth limit for a user
 */
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceClient = getServiceClient();
    const { data: profile, error } = await serviceClient
      .from('profiles')
      .select('current_month_bandwidth_used, monthly_bandwidth_limit, subscription_status')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Failed to fetch bandwidth info' }, { status: 500 });
    }

    // Calculate limit based on subscription status
    let limit = profile.monthly_bandwidth_limit || 50 * 1024 * 1024; // Default 50MB
    if (profile.subscription_status === 'trialing') {
      limit = 50 * 1024 * 1024; // 50MB for trial
    }

    return NextResponse.json({
      used: profile.current_month_bandwidth_used || 0,
      limit: limit,
    });
  } catch (error) {
    console.error('Error in GET /api/bandwidth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Track bandwidth usage
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bytes } = await request.json();

    if (!bytes || bytes <= 0) {
      return NextResponse.json({ error: 'Invalid bytes value' }, { status: 400 });
    }

    const serviceClient = getServiceClient();

    // Try to use RPC function first
    const { error: rpcError } = await serviceClient.rpc('increment_bandwidth_usage', {
      p_user_id: user.id,
      p_bytes: bytes,
    });

    if (rpcError) {
      // Fallback to manual update
      const { data: profile, error: profileError } = await serviceClient
        .from('profiles')
        .select('current_month_bandwidth_used')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
      }

      if (profile) {
        const currentUsed = profile.current_month_bandwidth_used || 0;
        const { error: updateError } = await serviceClient
          .from('profiles')
          .update({
            current_month_bandwidth_used: currentUsed + bytes,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating bandwidth:', updateError);
          return NextResponse.json({ error: 'Failed to update bandwidth' }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/bandwidth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

