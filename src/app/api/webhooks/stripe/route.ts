import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create a Supabase client with service role to bypass RLS
const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get bandwidth limit based on price ID
function getBandwidthLimit(priceId: string, subscriptionStatus?: string): number {
  // If subscription is in trial, use trial limit (50MB)
  if (subscriptionStatus === 'trialing') {
    return 50 * 1024 * 1024; // 50MB in bytes
  }
  
  // Basic plan price IDs
  if (priceId.includes('basic')) {
    return 10 * 1024 * 1024 * 1024; // 10GB in bytes
  }
  // Pro plan price IDs
  if (priceId.includes('pro')) {
    return 50 * 1024 * 1024 * 1024; // 50GB in bytes
  }
  // Default to trial limit for new subscriptions
  return 50 * 1024 * 1024; // 50MB in bytes
}

export async function POST(request: Request) {
  let event: Stripe.Event | null = null;
  
  try {
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

        // Update profile with subscription details and bandwidth limit
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: subscription.status,
            monthly_bandwidth_limit: getBandwidthLimit(priceId, subscription.status),
            current_month_bandwidth_used: 0,
            last_bandwidth_reset: new Date().toISOString()
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
          // Get current profile to check if we need to update bandwidth limit
          const { data: profile } = await supabase
            .from('profiles')
            .select('monthly_bandwidth_limit')
            .eq('id', userId)
            .single();
          
          // Determine bandwidth limit based on subscription status
          let bandwidthLimit = profile?.monthly_bandwidth_limit;
          
          // If status is trialing, set to trial limit (50MB)
          if (subscription.status === 'trialing') {
            bandwidthLimit = 50 * 1024 * 1024; // 50MB
          } else if (subscription.status === 'active') {
            // If becoming active, check if we need to update from trial limit
            // Get price ID from subscription items to determine plan
            const priceId = subscription.items.data[0]?.price?.id || '';
            if (!bandwidthLimit || bandwidthLimit === 50 * 1024 * 1024) {
              // Only update if currently at trial limit or not set
              bandwidthLimit = getBandwidthLimit(priceId, subscription.status);
            }
          }
          
          // Update profile with current subscription status and bandwidth limit
          // This keeps our database in sync with Stripe, especially for trial status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              monthly_bandwidth_limit: bandwidthLimit,
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating profile subscription status:', updateError);
            // Don't fail the webhook, just log the error
          } else {
            console.log('Successfully updated subscription status:', subscription.status);
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