import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function GET() {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!user) {
      console.error('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching profile for user:', user.id);

    // Get the user's profile to check their role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, sub_owners(owner_id), owners(id)')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    if (!profile) {
      console.error('No profile found for user:', user.id);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // If user is a sub_owner, get the owner's profile instead
    let profileToUse = profile;
    if (profile.role === 'sub_owner') {
      const subOwnerData = profile.sub_owners as unknown as Array<{ owner_id: string }>;
      if (subOwnerData && subOwnerData.length > 0) {
        const ownerId = subOwnerData[0].owner_id;
        
        // Get owner's profile_id via owners table
        const { data: ownerData, error: ownerError } = await supabase
          .from('owners')
          .select('profile_id')
          .eq('id', ownerId)
          .single();

        if (!ownerError && ownerData) {
          // Get owner's profile
          const { data: ownerProfile, error: ownerProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', ownerData.profile_id)
            .single();

          if (!ownerProfileError && ownerProfile) {
            profileToUse = ownerProfile;
            console.log('Sub owner detected, using owner profile:', {
              subOwnerId: user.id,
              ownerId: ownerProfile.id,
              ownerSubscriptionId: ownerProfile.stripe_subscription_id
            });
          }
        }
      }
    }

    console.log('Found profile:', {
      role: profile.role,
      id: profile.id,
      usingProfileId: profileToUse.id,
      stripe_customer_id: profileToUse.stripe_customer_id,
      stripe_subscription_id: profileToUse.stripe_subscription_id,
      subscription_status: profileToUse.subscription_status
    });

    // If no subscription ID in profile, check Stripe for active subscriptions
    if (!profileToUse.stripe_subscription_id) {
      // If we have a customer ID, check Stripe for subscriptions
      if (profileToUse.stripe_customer_id) {
        console.log('No subscription ID in profile, checking Stripe for customer:', profileToUse.stripe_customer_id);
        try {
          // List all subscriptions for this customer
          const subscriptions = await stripe.subscriptions.list({
            customer: profileToUse.stripe_customer_id,
            status: 'all', // Get all subscriptions to find active/trialing ones
            limit: 10
          });

          // Find the most recent active or trialing subscription
          const activeSubscription = subscriptions.data.find(
            sub => ['active', 'trialing', 'past_due'].includes(sub.status)
          );

          if (activeSubscription) {
            console.log('Found active subscription in Stripe:', {
              id: activeSubscription.id,
              status: activeSubscription.status
            });

            // Update owner's profile with the subscription ID and status (not sub_owner's)
            await supabase
              .from('profiles')
              .update({
                stripe_subscription_id: activeSubscription.id,
                subscription_status: activeSubscription.status
              })
              .eq('id', profileToUse.id);

            // Get the price details
            const price = await stripe.prices.retrieve(activeSubscription.items.data[0].price.id);
            const subscriptionItem = activeSubscription.items.data[0];

            return NextResponse.json({
              subscription: {
                id: activeSubscription.id,
                status: activeSubscription.status,
                current_period_end: activeSubscription.current_period_end,
                cancel_at_period_end: activeSubscription.cancel_at_period_end,
                plan: {
                  id: price.id,
                  name: price.nickname || 'Default Plan',
                  amount: price.unit_amount || 0,
                  interval: price.recurring?.interval || 'month'
                },
                items: subscriptionItem,
              },
            });
          } else {
            console.log('No active subscription found in Stripe for customer:', profileToUse.stripe_customer_id);
            return NextResponse.json({ subscription: null });
          }
        } catch (error) {
          console.error('Error checking Stripe for subscriptions:', error);
          // Continue to return null if we can't check Stripe
          return NextResponse.json({ subscription: null });
        }
      } else {
        console.log('No subscription ID or customer ID found');
        return NextResponse.json({ subscription: null });
      }
    }

    try {
      // Get subscription details from Stripe
      console.log('Fetching Stripe subscription:', profileToUse.stripe_subscription_id);
      const subscription = await stripe.subscriptions.retrieve(
        profileToUse.stripe_subscription_id
      );

      console.log('Retrieved subscription from Stripe:', {
        id: subscription.id,
        status: subscription.status,
        items: subscription.items.data[0]
      });

      // Get the price details
      const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
      const subscriptionItem = subscription.items.data[0];

      // Update subscription status in owner's profile if it's different (keeps it in sync)
      if (subscription.status !== profileToUse.subscription_status) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status
          })
          .eq('id', profileToUse.id);
      }

      return NextResponse.json({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          plan: {
            id: price.id,
            name: price.nickname || 'Default Plan',
            amount: price.unit_amount || 0,
            interval: price.recurring?.interval || 'month'
          },
          items: subscriptionItem,
        },
      });
    } catch (error: unknown) {
      console.error('Error fetching Stripe subscription:', error);
      
      // Type guard for Stripe errors
      const stripeError = error as { code?: string };
      
      // If subscription not found, clear the invalid subscription ID
      if (stripeError.code === 'resource_missing') {
        console.log('Subscription not found in Stripe, clearing from profile');
        await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: null,
            subscription_status: 'inactive'
          })
          .eq('id', user.id);
          
        return NextResponse.json({ subscription: null });
      }
      
      return NextResponse.json({ error: 'Failed to fetch subscription details' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/stripe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, action } = await request.json();

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, stripe_customer_id, stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Sub owners cannot manage subscriptions
    if (profile?.role === 'sub_owner') {
      return NextResponse.json({ 
        error: 'Sub owners cannot manage subscriptions. Please contact the account owner.' 
      }, { status: 403 });
    }

    if (action === 'create') {
      if (!priceId) {
        return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
      }

      // Get or create customer
      let customerId = profile?.stripe_customer_id;

      if (!customerId) {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id
          }
        });
        customerId = customer.id;

        // Update profile with customer ID
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
      }

      // Create checkout session with 3-day trial period
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${request.headers.get('origin')}/settings?success=true`,
        cancel_url: `${request.headers.get('origin')}/settings?canceled=true`,
        metadata: {
          user_id: user.id,
          price_id: priceId
        },
        subscription_data: {
          trial_period_days: 3,
          metadata: {
            user_id: user.id,
            price_id: priceId
          }
        }
      });

      if (!session.url) {
        console.error('No checkout URL in session:', session);
        throw new Error('No checkout URL returned from Stripe');
      }

      console.log('Checkout session created successfully:', {
        id: session.id,
        url: session.url,
        status: session.status,
        customerId,
        userId: user.id
      });

      return NextResponse.json({ 
        url: session.url,
        sessionId: session.id
      });
    } else if (action === 'cancel') {
      // Handle subscription cancellation
      if (!profile?.stripe_subscription_id) {
        return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
      }

      const subscription = await stripe.subscriptions.update(
        profile.stripe_subscription_id,
        { cancel_at_period_end: true }
      );

      return NextResponse.json({ subscription });
    } else {
      console.error('Invalid action:', action);
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/stripe:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 