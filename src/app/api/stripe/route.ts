import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: Request) {
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
      console.error('Profile error details:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint
      });
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    if (!profile) {
      console.error('No profile found for user:', user.id);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    console.log('Found profile:', { role: profile.role, id: profile.id });

    // If user is a sub-owner, get the owner's subscription
    const userId = profile.role === 'sub_owner' 
      ? request.headers.get('X-User-Id') // Get owner's ID from headers
      : user.id;

    if (!userId) {
      console.error('No user ID found for subscription fetch');
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    console.log('Fetching subscription for user:', userId);

    // Get the user's Stripe customer ID
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      console.error('User profile error details:', {
        code: userError.code,
        message: userError.message,
        details: userError.details,
        hint: userError.hint
      });
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    if (!userProfile) {
      console.error('No profile found for user:', userId);
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    console.log('Found user profile:', {
      hasCustomerId: !!userProfile.stripe_customer_id,
      hasSubscriptionId: !!userProfile.stripe_subscription_id
    });

    if (!userProfile.stripe_customer_id || !userProfile.stripe_subscription_id) {
      console.log('No active subscription found for user:', userId);
      return NextResponse.json({ subscription: null });
    }

    try {
      // Get subscription details from Stripe
      console.log('Fetching Stripe subscription:', userProfile.stripe_subscription_id);
      const subscription = await stripe.subscriptions.retrieve(
        userProfile.stripe_subscription_id,
        {
          expand: ['plan'],
        }
      );

      return NextResponse.json({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          plan: {
            id: subscription.items.data[0].price.id,
            name: subscription.items.data[0].price.nickname || subscription.items.data[0].price.id,
            amount: subscription.items.data[0].price.unit_amount || 0,
          },
        },
      });
    } catch (stripeError) {
      console.error('Error fetching Stripe subscription:', stripeError);
      return NextResponse.json({ error: 'Failed to fetch Stripe subscription' }, { status: 500 });
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

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!user) {
      console.error('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Only allow owners to create/modify subscriptions
    if (profile.role !== 'owner') {
      console.error('Non-owner attempted to modify subscription:', user.id);
      return NextResponse.json({ error: 'Only owners can modify subscriptions' }, { status: 403 });
    }

    const body = await request.json();
    const { priceId, action } = body;

    if (!priceId) {
      console.error('No price ID provided in request');
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    console.log('Processing subscription request:', { priceId, action, userId: user.id });

    try {
      let customerId = profile.stripe_customer_id;

      // If no Stripe customer exists, create one
      if (!customerId) {
        console.log('Creating new Stripe customer for user:', user.id);
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id,
            role: profile.role
          }
        });
        customerId = customer.id;

        // Update profile with Stripe customer ID
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile with Stripe customer ID:', updateError);
          return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }
      }

      if (action === 'cancel') {
        // Handle subscription cancellation
        if (!profile.stripe_subscription_id) {
          return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
        }

        const subscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          { cancel_at_period_end: true }
        );

        return NextResponse.json({ subscription });
      } else {
        // Create a new subscription
        const origin = request.headers.get('origin') || 'http://localhost:3000';
        console.log('Creating checkout session with origin:', origin);
        
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${origin}/settings?success=true`,
          cancel_url: `${origin}/settings?canceled=true`,
          metadata: {
            user_id: user.id,
            role: profile.role
          },
          allow_promotion_codes: true,
          billing_address_collection: 'required',
          payment_method_collection: 'always',
          subscription_data: {
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel',
              },
            },
          },
        });

        console.log('Checkout session created:', {
          id: session.id,
          url: session.url,
          status: session.status
        });

        if (!session.url) {
          console.error('No checkout URL in session:', session);
          throw new Error('No checkout URL returned from Stripe');
        }

        return NextResponse.json({ url: session.url });
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { error: stripeError instanceof Error ? stripeError.message : 'Failed to process subscription request' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/stripe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 