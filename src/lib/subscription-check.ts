import Stripe from 'stripe';

// Profile type based on what we query from Supabase
type Profile = {
  id: string;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

/**
 * Check if a user has an active subscription or is within their free trial period
 * Uses Stripe's built-in trial tracking via subscription status
 * @param profile User profile from Supabase
 * @returns Object with hasAccess boolean and reason string
 */
export async function checkSubscriptionAccess(profile: Profile | null): Promise<{
  hasAccess: boolean;
  reason?: string;
  isTrial?: boolean;
  trialEnd?: number;
}> {
  if (!profile) {
    return { hasAccess: false, reason: 'No profile found' };
  }

  // If no subscription ID, user needs to subscribe
  if (!profile.stripe_subscription_id) {
    return { hasAccess: false, reason: 'No subscription found' };
  }

  try {
    // Get subscription details from Stripe to get accurate status
    const subscription = await stripe.subscriptions.retrieve(
      profile.stripe_subscription_id
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
 */
export function hasActiveSubscriptionSync(profile: Profile | null): boolean {
  if (!profile) return false;

  // Check if subscription status indicates active subscription or trial
  // Stripe sets status to 'trialing' during trial period, 'active' after trial
  const activeStatuses = ['active', 'trialing', 'past_due'];
  
  return profile.subscription_status 
    ? activeStatuses.includes(profile.subscription_status)
    : false;
}

