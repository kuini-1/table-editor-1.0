import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { BANDWIDTH_LIMITS } from '@/lib/bandwidth-tracker';

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
 * Calculate bandwidth limit based on subscription status and stored limit
 */
function calculateBandwidthLimit(
  subscriptionStatus: string | null | undefined,
  storedLimit: number | null | undefined
): number {
  // If trialing, always use trial limit
  if (subscriptionStatus === 'trialing') {
    return BANDWIDTH_LIMITS.TRIAL;
  }

  // If active, use stored limit (should be set by webhook based on tier)
  if (subscriptionStatus === 'active' && storedLimit) {
    // Validate stored limit matches a known tier
    if (storedLimit === BANDWIDTH_LIMITS.BASIC || storedLimit === BANDWIDTH_LIMITS.PRO) {
      return storedLimit;
    }
    // If stored limit doesn't match, default to Basic
    return BANDWIDTH_LIMITS.BASIC;
  }

  // Default to trial limit
  return BANDWIDTH_LIMITS.DEFAULT;
}

/**
 * Get the owner's user ID for a sub_owner
 */
async function getOwnerUserIdForSubOwner(userId: string): Promise<string> {
  try {
    const serviceClient = getServiceClient();

    // Get user's profile to check role
    const { data: userProfile, error: profileError } = await serviceClient
      .from('profiles')
      .select('role, sub_owners(owner_id)')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile || userProfile.role !== 'sub_owner') {
      return userId;
    }

    // Get owner_id from sub_owners
    const subOwnerData = userProfile.sub_owners as unknown as Array<{ owner_id: string }>;
    if (!subOwnerData || subOwnerData.length === 0) {
      return userId;
    }

    const ownerId = subOwnerData[0].owner_id;

    // Get owner's profile_id via owners table
    const { data: ownerData, error: ownerError } = await serviceClient
      .from('owners')
      .select('profile_id')
      .eq('id', ownerId)
      .single();

    if (ownerError || !ownerData) {
      return userId;
    }

    return ownerData.profile_id;
  } catch (error) {
    console.error('Error getting owner user ID for sub owner:', error);
    return userId;
  }
}

/**
 * Check bandwidth limit for a user
 * For sub_owners, returns the owner's bandwidth info
 */
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the actual user ID to check (owner's ID if user is sub_owner)
    const actualUserId = await getOwnerUserIdForSubOwner(user.id);

    const serviceClient = getServiceClient();
    const { data: profile, error } = await serviceClient
      .from('profiles')
      .select('current_month_bandwidth_used, monthly_bandwidth_limit, subscription_status')
      .eq('id', actualUserId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Failed to fetch bandwidth info' }, { status: 500 });
    }

    // Calculate limit based on subscription status and tier
    const limit = calculateBandwidthLimit(
      profile.subscription_status,
      profile.monthly_bandwidth_limit
    );

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
 * For sub_owners, tracks bandwidth against both owner's account and sub owner's own account
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

    // Check if user is a sub_owner
    const { data: userProfile, error: profileError } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isSubOwner = !profileError && userProfile?.role === 'sub_owner';
    const actualUserId = await getOwnerUserIdForSubOwner(user.id);

    // Track bandwidth against owner (for limit checking)
    // Try to use RPC function first
    const { error: rpcError } = await serviceClient.rpc('increment_bandwidth_usage', {
      p_user_id: actualUserId,
      p_bytes: bytes,
    });

    if (rpcError) {
      // Fallback to manual update for owner
      const { data: profile, error: ownerProfileError } = await serviceClient
        .from('profiles')
        .select('current_month_bandwidth_used')
        .eq('id', actualUserId)
        .single();

      if (ownerProfileError) {
        console.error('Error fetching owner profile:', ownerProfileError);
        return NextResponse.json({ error: 'Failed to fetch owner profile' }, { status: 500 });
      }

      if (profile) {
        const currentUsed = profile.current_month_bandwidth_used || 0;
        const { error: updateError } = await serviceClient
          .from('profiles')
          .update({
            current_month_bandwidth_used: currentUsed + bytes,
          })
          .eq('id', actualUserId);

        if (updateError) {
          console.error('Error updating owner bandwidth:', updateError);
          return NextResponse.json({ error: 'Failed to update owner bandwidth' }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: 'Owner profile not found' }, { status: 404 });
      }
    }

    // If user is sub_owner, also track bandwidth against their own profile
    if (isSubOwner && user.id !== actualUserId) {
      const { error: subOwnerRpcError } = await serviceClient.rpc('increment_bandwidth_usage', {
        p_user_id: user.id,
        p_bytes: bytes,
      });

      if (subOwnerRpcError) {
        // Fallback to manual update for sub owner
        const { data: subOwnerProfile, error: subOwnerProfileError } = await serviceClient
          .from('profiles')
          .select('current_month_bandwidth_used')
          .eq('id', user.id)
          .single();

        if (subOwnerProfileError) {
          console.error('Error fetching sub owner profile:', subOwnerProfileError);
          // Don't fail the request if sub owner tracking fails, owner tracking succeeded
        } else if (subOwnerProfile) {
          const currentUsed = subOwnerProfile.current_month_bandwidth_used || 0;
          const { error: updateError } = await serviceClient
            .from('profiles')
            .update({
              current_month_bandwidth_used: currentUsed + bytes,
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating sub owner bandwidth:', updateError);
            // Don't fail the request if sub owner tracking fails, owner tracking succeeded
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/bandwidth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

