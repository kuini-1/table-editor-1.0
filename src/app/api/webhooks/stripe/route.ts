import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const { default: Stripe } = await import('stripe');
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  });
}

// Helper function to get bandwidth limit based on price ID and subscription status
async function getBandwidthLimit(stripe: Stripe, priceId: string, subscriptionStatus?: string): Promise<number> {
  // If subscription is in trial, use trial limit (50MB)
  if (subscriptionStatus === 'trialing') {
    return 50 * 1024 * 1024; // 50MB in bytes
  }
  
  try {
    // Retrieve the price object from Stripe to get accurate plan information
    const price = await stripe.prices.retrieve(priceId);
    
    // Check price nickname (most reliable)
    const nickname = price.nickname?.toLowerCase() || '';
    if (nickname.includes('basic')) {
      return 10 * 1024 * 1024 * 1024; // 10GB in bytes
    }
    if (nickname.includes('pro')) {
      return 50 * 1024 * 1024 * 1024; // 50GB in bytes
    }
    
    // Fallback: Check price ID string
    const priceIdLower = priceId.toLowerCase();
    if (priceIdLower.includes('basic')) {
      return 10 * 1024 * 1024 * 1024; // 10GB in bytes
    }
    if (priceIdLower.includes('pro')) {
      return 50 * 1024 * 1024 * 1024; // 50GB in bytes
    }
    
    // Fallback: Check amount (Basic is typically cheaper than Pro)
    // This is a last resort and might need adjustment based on actual pricing
    const amount = price.unit_amount || 0;
    if (amount > 0 && amount < 5000) { // Assuming Basic is less than $50
      return 10 * 1024 * 1024 * 1024; // 10GB in bytes
    }
    if (amount >= 5000) { // Assuming Pro is $50 or more
      return 50 * 1024 * 1024 * 1024; // 50GB in bytes
    }
  } catch (error) {
    console.error('Error retrieving price from Stripe:', error);
  }
  
  // Default to Basic limit if we can't determine (safer than trial limit)
  return 10 * 1024 * 1024 * 1024; // 10GB in bytes (Basic)
}

export async function POST(request: Request) {
  let event: Stripe.Event | null = null;
  
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Missing STRIPE_WEBHOOK_SECRET' },
        { status: 500 }
      );
    }

    const stripe = await getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Server misconfiguration', details: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No signature found in webhook request');
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (!event) {
      console.error('No event constructed from webhook');
      return NextResponse.json({ error: 'No event constructed' }, { status: 400 });
    }

    console.log('Processing webhook event:', event.type);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2));

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const priceId = session.metadata?.price_id;

        if (!userId || !priceId) {
          console.error('Missing user_id or price_id in session metadata');
          return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
        }

        console.log('Processing checkout session:', {
          userId,
          priceId,
          subscriptionId: session.subscription
        });

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log('Retrieved subscription:', subscription);

        // Get invoice details
        const invoice = await stripe.invoices.retrieve(session.invoice as string);
        console.log('Retrieved invoice:', invoice);

        // Calculate bandwidth limit based on subscription tier
        const bandwidthLimit = await getBandwidthLimit(stripe, priceId, subscription.status);
        
        // Extract billing cycle start day from current_period_start (Unix timestamp)
        // Convert to date and get day of month (1-31)
        const billingCycleStartDate = new Date(subscription.current_period_start * 1000);
        const billingCycleStartDay = billingCycleStartDate.getDate();
        
        console.log('Setting bandwidth limit and billing cycle:', {
          userId,
          priceId,
          subscriptionStatus: subscription.status,
          bandwidthLimit,
          bandwidthLimitGB: (bandwidthLimit / (1024 * 1024 * 1024)).toFixed(2),
          billingCycleStartDay,
          currentPeriodStart: subscription.current_period_start
        });

        // Update profile with subscription details, bandwidth limit, and billing cycle start day
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: subscription.status,
            monthly_bandwidth_limit: bandwidthLimit,
            current_month_bandwidth_used: 0,
            last_bandwidth_reset: new Date().toISOString(),
            billing_cycle_start_day: billingCycleStartDay
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }

        console.log('Successfully updated profile with subscription details');
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        
        console.log(`Processing ${event.type}`, {
          subscriptionId: subscription.id,
          status: subscription.status,
          userId
        });

        if (userId) {
          // Get price ID from subscription items to determine plan tier
          const priceId = subscription.items.data[0]?.price?.id || '';
          
          // Always calculate bandwidth limit based on subscription status and price ID
          // This ensures limits match subscription tiers correctly
          const bandwidthLimit: number = await getBandwidthLimit(stripe, priceId, subscription.status);
          
          // Extract billing cycle start day from current_period_start (Unix timestamp)
          // Convert to date and get day of month (1-31)
          const billingCycleStartDate = new Date(subscription.current_period_start * 1000);
          const billingCycleStartDay = billingCycleStartDate.getDate();
          
          console.log('Updating bandwidth limit and billing cycle:', {
            userId,
            subscriptionStatus: subscription.status,
            priceId,
            bandwidthLimit,
            bandwidthLimitGB: ((bandwidthLimit as number) / (1024 * 1024 * 1024)).toFixed(2),
            billingCycleStartDay,
            currentPeriodStart: subscription.current_period_start
          });
          
          // Update profile with current subscription status, bandwidth limit, and billing cycle start day
          // This keeps our database in sync with Stripe, especially for trial status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              monthly_bandwidth_limit: bandwidthLimit,
              billing_cycle_start_day: billingCycleStartDay
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating profile subscription status:', updateError);
            // Don't fail the webhook, just log the error
          } else {
            console.log('Successfully updated subscription status and bandwidth limit:', {
              status: subscription.status,
              bandwidthLimit
            });
          }
        }
        
        return NextResponse.json({ received: true });
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error('Missing user_id in subscription metadata');
          return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
        }

        // Update profile to reflect subscription cancellation
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: null,
            subscription_status: 'canceled',
            monthly_bandwidth_limit: 50 * 1024 * 1024, // Reset to trial limit (50MB)
            current_month_bandwidth_used: 0,
            last_bandwidth_reset: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }

        console.log('Successfully updated profile after subscription cancellation');
        break;
      }

      default:
        return NextResponse.json({ received: true });
    }
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 