// ============================================
// API: /api/credits/purchase
// Create checkout session for purchasing credits
// Dollar-based: Dodo product = $1, quantity = dollars
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensureUserCredits, MIN_PURCHASE_DOLLARS, dollarsToCredits } from '@/lib/credits';
import { createCheckoutSession } from '@/lib/dodo';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dollarAmount } = await request.json();

    // Validate dollar amount
    if (!dollarAmount || typeof dollarAmount !== 'number' || dollarAmount < MIN_PURCHASE_DOLLARS) {
      return NextResponse.json(
        { error: `Minimum purchase is $${MIN_PURCHASE_DOLLARS}` },
        { status: 400 }
      );
    }

    // Ensure user has credits record (get their Dodo customer ID)
    const { dodoCustomerId } = await ensureUserCredits(session.user.id);

    // Calculate credits they'll receive
    const creditAmount = dollarsToCredits(dollarAmount);

    // Get base URL for return
    const baseUrl = process.env.NEXTAUTH_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || 'http://localhost:3000';

    // Create checkout session
    // Dodo product is $1, so quantity = dollar amount
    const { checkoutUrl, sessionId } = await createCheckoutSession({
      customerId: dodoCustomerId,
      customerEmail: session.user.email,
      customerName: session.user.name || undefined,
      dollarAmount, // This becomes Dodo quantity (product is $1)
      creditAmount, // For metadata
      successUrl: `${baseUrl}/credits/success`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      checkoutUrl,
      sessionId,
      dollarAmount,
      creditAmount,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: String(error) },
      { status: 500 }
    );
  }
}
