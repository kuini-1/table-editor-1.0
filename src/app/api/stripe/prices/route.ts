import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const PRODUCT_IDS = {
  BASIC: 'prod_S2h3imHCUbra01',
  PRO: 'prod_S2hAvrrPeet9is',
};

export async function GET() {
  try {
    // Fetch prices for both products
    const [basicPrices, proPrices] = await Promise.all([
      stripe.prices.list({
        product: PRODUCT_IDS.BASIC,
        active: true,
        expand: ['data.product'],
      }),
      stripe.prices.list({
        product: PRODUCT_IDS.PRO,
        active: true,
        expand: ['data.product'],
      }),
    ]);

    // Combine and format prices
    const prices = [...basicPrices.data, ...proPrices.data].map(price => {
      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        name: product.name,
        priceId: price.id,
        amount: price.unit_amount || 0,
        interval: price.recurring?.interval || 'one-time',
        description: product.description || '',
        productId: product.id,
        features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
        marketingFeatures: product.metadata.marketingFeatures ? JSON.parse(product.metadata.marketingFeatures) : [],
      };
    });

    // Sort prices by amount
    prices.sort((a, b) => a.amount - b.amount);

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
} 