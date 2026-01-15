import Stripe from 'stripe';

// Profile type based on what we query from Supabase
type Profile = {
  id: string;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  role?: 'owner' | 'sub_owner';
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

/**
 * Get the owner's profile for a sub_owner user
 * Returns the owner's profile if user is a sub_owner, otherwise returns null
 */
export async function getOwnerProfileForSubOwner(userId: string): Promise<Profile | null> {
  try {
    // Only works on server
    if (typeof window !== 'undefined') {
      return null;
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      return null;
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user's profile to check role
    const { data: userProfile, error: profileError } = await serviceClient
      .from('profiles')
      .select('role, sub_owners(owner_id)')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile || userProfile.role !== 'sub_owner') {
      return null;
    }

    // Get owner_id from sub_owners
    const subOwnerData = userProfile.sub_owners as unknown as Array<{ owner_id: string }>;
    if (!subOwnerData || subOwnerData.length === 0) {
      return null;
    }

    const ownerId = subOwnerData[0].owner_id;

    // Get owner's profile via owners table
    const { data: ownerData, error: ownerError } = await serviceClient
      .from('owners')
      .select('profile_id')
      .eq('id', ownerId)
      .single();

    if (ownerError || !ownerData) {
      return null;
    }

    // Get owner's profile
    const { data: ownerProfile, error: ownerProfileError } = await serviceClient
      .from('profiles')
      .select('id, stripe_subscription_id, subscription_status, role')
      .eq('id', ownerData.profile_id)
      .single();

    if (ownerProfileError || !ownerProfile) {
      return null;
    }

    return ownerProfile as Profile;
  } catch (error) {
    console.error('Error getting owner profile for sub owner:', error);
    return null;
  }
}

/**
 * Check if a user has an active subscription or is within their free trial period
 * Uses Stripe's built-in trial tracking via subscription status
 * For sub_owners, checks the owner's subscription instead
 * @param profile User profile from Supabase
 * @param userId Optional user ID to check if user is sub_owner
 * @returns Object with hasAccess boolean and reason string
 */
export async function checkSubscriptionAccess(profile: Profile | null, userId?: string): Promise<{
  hasAccess: boolean;
  reason?: string;
  isTrial?: boolean;
  trialEnd?: number;
}> {
  if (!profile) {
    return { hasAccess: false, reason: 'No profile found' };
  }

  // If user is a sub_owner, check owner's subscription instead
  let profileToCheck = profile;
  if (profile.role === 'sub_owner' && userId) {
    const ownerProfile = await getOwnerProfileForSubOwner(userId);
    if (ownerProfile) {
      profileToCheck = ownerProfile;
    } else {
      return { hasAccess: false, reason: 'Owner profile not found' };
    }
  }

  // If no subscription ID, user needs to subscribe
  if (!profileToCheck.stripe_subscription_id) {
    return { hasAccess: false, reason: 'No subscription found' };
  }

  try {
    // Get subscription details from Stripe to get accurate status
    const subscription = await stripe.subscriptions.retrieve(
      profileToCheck.stripe_subscription_id
    );

    // Check if subscription is active or in trial (Stripe handles trial tracking)
    const activeStatuses = ['active', 'trialing', 'past_due'];
    if (activeStatuses.includes(subscription.status)) {
      return {
        hasAccess: true,
        isTrial: subscription.status === 'trialing',
        trialEnd: subscription.trial_end || undefined,
      };
    }

    return {
      hasAccess: false,
      reason: `Subscription status: ${subscription.status}`,
    };
  } catch (error) {
    console.error('Error checking Stripe subscription:', error);
    // If subscription doesn't exist in Stripe, deny access
    return {
      hasAccess: false,
      reason: 'Subscription not found in Stripe',
    };
  }
}

/**
 * Check if user has active subscription (synchronous check using profile data only)
 * This is a lighter check that doesn't call Stripe API
 * Relies on subscription_status being kept up-to-date by webhooks
 * For sub_owners, checks the owner's subscription instead
 * @param profile User profile from Supabase
 * @param userId Optional user ID to check if user is sub_owner (requires async lookup)
 */
export async function hasActiveSubscriptionSync(profile: Profile | null, userId?: string): Promise<boolean> {
  if (!profile) return false;

  // If user is a sub_owner, check owner's subscription instead
  let profileToCheck = profile;
  if (profile.role === 'sub_owner' && userId) {
    const ownerProfile = await getOwnerProfileForSubOwner(userId);
    if (ownerProfile) {
      profileToCheck = ownerProfile;
    } else {
      return false;
    }
  }

  // Check if subscription status indicates active subscription or trial
  // Stripe sets status to 'trialing' during trial period, 'active' after trial
  const activeStatuses = ['active', 'trialing', 'past_due'];
  
  return profileToCheck.subscription_status 
    ? activeStatuses.includes(profileToCheck.subscription_status)
    : false;
}

/**
 * Synchronous version that doesn't check owner for sub_owners
 * Use this only when you're certain the profile is for an owner
 * @deprecated Use hasActiveSubscriptionSync with userId parameter instead
 */
export function hasActiveSubscriptionSyncLegacy(profile: Profile | null): boolean {
  if (!profile) return false;

  const activeStatuses = ['active', 'trialing', 'past_due'];
  
  return profile.subscription_status 
    ? activeStatuses.includes(profile.subscription_status)
    : false;
}

