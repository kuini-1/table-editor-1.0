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
function getBandwidthLimit(priceId: string): number {
  // Basic plan price IDs
  if (priceId.includes('basic')) {
    return 5 * 1024 * 1024 * 1024; // 5GB in bytes
  }
  // Pro plan price IDs
  if (priceId.includes('pro')) {
    return 50 * 1024 * 1024 * 1024; // 50GB in bytes
  }
  // Default to basic plan limit
  return 5 * 1024 * 1024 * 1024; // 5GB in bytes
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
            monthly_bandwidth_limit: getBandwidthLimit(priceId),
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
        console.log(`Processing ${event.type}`);
        console.log('Subscription metadata:', subscription.metadata);
        
        // For subscription events, we'll return 200 even if we can't find the user ID
        // because the customer might not be fully created yet
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
            monthly_bandwidth_limit: 5 * 1024 * 1024 * 1024, // Reset to basic plan limit
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