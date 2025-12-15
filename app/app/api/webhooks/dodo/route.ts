// ============================================
// API: /api/webhooks/dodo
// Handle DodoPayments webhooks for credit purchases
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, parseWebhookPayload } from '@/lib/dodo';
import { addCredits } from '@/lib/credits';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('dodo-signature') || request.headers.get('x-webhook-signature') || '';

    // Verify webhook signature
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Parse the webhook payload
    const payload = parseWebhookPayload(rawBody);
    if (!payload) {
      console.error('Invalid webhook payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log('Dodo webhook received:', payload.type, payload.data);

    // Handle payment success events
    if (payload.type === 'payment.succeeded' || payload.type === 'payment.completed') {
      const { payment_id, metadata } = payload.data;

      // Only process credit purchases
      if (metadata?.type !== 'credit_purchase') {
        console.log('Ignoring non-credit purchase webhook');
        return NextResponse.json({ received: true });
      }

      const userId = metadata?.user_id;
      const creditAmount = parseInt(metadata?.credit_amount || '0', 10);

      if (!userId || !creditAmount) {
        console.error('Missing userId or creditAmount in webhook metadata');
        return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
      }

      // Check if we've already processed this payment (idempotency)
      const existingTransaction = await prisma.creditTransaction.findFirst({
        where: {
          userId,
          type: 'purchase',
          metadata: {
            path: ['payment_id'],
            equals: payment_id,
          },
        },
      });

      if (existingTransaction) {
        console.log('Payment already processed:', payment_id);
        return NextResponse.json({ received: true, status: 'already_processed' });
      }

      // Add credits to user's balance
      const result = await addCredits(
        userId,
        creditAmount,
        'purchase',
        `Purchased ${creditAmount} credits`,
        { payment_id }
      );

      console.log('Credits added:', {
        userId,
        creditAmount,
        newBalance: result.newBalance,
        transactionId: result.transactionId,
      });

      return NextResponse.json({
        received: true,
        status: 'credits_added',
        creditAmount,
        transactionId: result.transactionId,
      });
    }

    // Handle payment failure events
    if (payload.type === 'payment.failed') {
      const { payment_id, metadata, error_code, error_message } = payload.data as any;
      console.error('Payment failed:', {
        payment_id,
        userId: metadata?.user_id,
        error_code,
        error_message,
      });

      // We don't need to do anything for failed payments - user can try again
      return NextResponse.json({ received: true, status: 'payment_failed' });
    }

    // Handle refund events
    if (payload.type === 'refund.succeeded' || payload.type === 'refund.completed') {
      const { metadata } = payload.data;
      const userId = metadata?.user_id;
      const creditAmount = parseInt(metadata?.credit_amount || '0', 10);

      if (userId && creditAmount) {
        // Deduct credits for refund (negative addition)
        await addCredits(
          userId,
          -creditAmount,
          'refund',
          `Refund: ${creditAmount} credits`,
          { refund: true }
        );
        console.log('Credits refunded:', { userId, creditAmount });
      }

      return NextResponse.json({ received: true, status: 'refund_processed' });
    }

    // Acknowledge other webhook types
    console.log('Unhandled webhook type:', payload.type);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: String(error) },
      { status: 500 }
    );
  }
}

// Dodo may use GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Dodo webhook endpoint' });
}
