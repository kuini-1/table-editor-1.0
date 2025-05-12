import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET() {
  try {
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
      .select('*')
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

    console.log('Found profile:', {
      role: profile.role,
      id: profile.id,
      stripe_customer_id: profile.stripe_customer_id,
      stripe_subscription_id: profile.stripe_subscription_id,
      subscription_status: profile.subscription_status
    });

    // If no subscription info exists, return null subscription
    if (!profile.stripe_subscription_id) {
      console.log('No subscription ID found for user:', user.id);
      return NextResponse.json({ subscription: null });
    }

    try {
      // Get subscription details from Stripe
      console.log('Fetching Stripe subscription:', profile.stripe_subscription_id);
      const subscription = await stripe.subscriptions.retrieve(
        profile.stripe_subscription_id
      );

      console.log('Retrieved subscription from Stripe:', {
        id: subscription.id,
        status: subscription.status,
        items: subscription.items.data[0]
      });

      // Get the price details
      const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);

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
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, action } = await request.json();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
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

      // Create checkout session
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