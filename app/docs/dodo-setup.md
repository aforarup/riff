# DodoPayments Setup Guide

This guide covers setting up DodoPayments for the Riff credits system.

## Overview

Riff uses DodoPayments for credit purchases. The integration requires:
- API key for server-side operations
- Webhook secret for payment notifications
- Product ID for the credits product

## Step 1: Create DodoPayments Account

1. Sign up at [dodopayments.com](https://dodopayments.com)
2. Complete business verification (required for live payments)

## Step 2: Get API Key

1. Go to **Dashboard → Settings → API Keys**
2. You'll see two keys:
   - **Test mode:** `sk_test_...` (for development)
   - **Live mode:** `sk_live_...` (for production)
3. Copy the appropriate key

## Step 3: Create Credits Product

1. Go to **Dashboard → Products**
2. Click **Create Product**
3. Fill in:
   - **Name:** Riff Credits
   - **Description:** Credits for AI-powered features
   - **Type:** One-time payment
   - **Price:** $1.00 (minimum purchase, quantity calculated dynamically)
4. Save and copy the **Product ID** (e.g., `prod_xxxxx`)

**Pricing model:**
- $1 = 20 credits
- Minimum purchase: $1 (20 credits)
- Slider selection: $1 to $50+

## Step 4: Set Up Webhooks

Webhooks notify your app when payments succeed or fail.

### For Production (Vercel)

1. Go to **Dashboard → Settings → Webhooks**
2. Click **Add Endpoint**
3. Enter URL: `https://www.riff.im/api/webhooks/dodo`
4. Select events:
   - `payment.succeeded` - triggers credit addition
   - `payment.failed` - logged for debugging
   - `payment.processing` - informational
   - `payment.cancelled` - informational
   - `refund.succeeded` - triggers credit deduction
   - `refund.failed` - logged for debugging
5. Save and copy the **Webhook Secret** (e.g., `whsec_xxxxx`)

### For Local Development (ngrok)

Since localhost isn't accessible from the internet, you need a tunnel.

#### Setting Up ngrok

1. **Install ngrok** (if not already):
   ```bash
   # macOS
   brew install ngrok

   # Or download from https://ngrok.com/download
   ```

2. **Authenticate ngrok** (one-time):
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   # Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
   ```

3. **Start the tunnel** (run this whenever you're testing webhooks):
   ```bash
   # Start your Next.js dev server first
   cd "/Users/nyn/develop/vibe project/app"
   npm run dev

   # In another terminal, start ngrok
   ngrok http 3000
   ```

4. **With a reserved domain** (your case):
   ```bash
   ngrok http 3000 --domain=uncontrastive-umbilicate-kanesha.ngrok-free.dev
   ```

   This gives you a stable URL that doesn't change between sessions.

5. **Your webhook URL will be:**
   ```
   https://uncontrastive-umbilicate-kanesha.ngrok-free.dev/api/webhooks/dodo
   ```

6. **Add this URL to Dodo Dashboard:**
   - Go to **Settings → Webhooks**
   - Add endpoint with the ngrok URL
   - Copy the webhook secret for your `.env.local`

#### ngrok Tips

- The free tier URL changes each time you restart ngrok (unless you have a reserved domain like yours)
- ngrok dashboard shows all incoming requests: http://127.0.0.1:4040
- You can inspect webhook payloads in the ngrok dashboard for debugging

## Step 5: Configure Environment Variables

### Local Development (.env.local)

Create or update `/Users/nyn/develop/vibe project/app/.env.local`:

```env
# DodoPayments - Use TEST mode keys for local development
DODO_PAYMENTS_API_KEY=sk_test_your_test_api_key_here
DODO_PAYMENTS_ENVIRONMENT=test_mode
DODO_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here
DODO_CREDITS_PRODUCT_ID=prod_your_product_id_here

# Optional: Override default free credits (default: 50)
# INITIAL_FREE_CREDITS=50
```

### Production (Vercel)

1. Go to [vercel.com](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add each variable for **Production** environment:

| Variable | Value | Notes |
|----------|-------|-------|
| `DODO_PAYMENTS_API_KEY` | `sk_live_...` | Live mode key (SDK reads this) |
| `DODO_PAYMENTS_ENVIRONMENT` | `live_mode` | Production mode |
| `DODO_WEBHOOK_SECRET` | `whsec_...` | From production webhook |
| `DODO_CREDITS_PRODUCT_ID` | `prod_...` | Same product works for both |
| `INITIAL_FREE_CREDITS` | `50` | Optional |

Or via CLI:
```bash
vercel env add DODO_PAYMENTS_API_KEY production
vercel env add DODO_PAYMENTS_ENVIRONMENT production
vercel env add DODO_WEBHOOK_SECRET production
vercel env add DODO_CREDITS_PRODUCT_ID production
```

## Testing the Integration

### 1. Test Webhook Delivery

After setting up ngrok:

```bash
# Terminal 1: Run Next.js
npm run dev

# Terminal 2: Run ngrok
ngrok http 3000 --domain=uncontrastive-umbilicate-kanesha.ngrok-free.dev
```

Then trigger a test payment in Dodo's test mode, or use their webhook simulator.

### 2. Verify Webhook Logs

Check ngrok's web interface at http://127.0.0.1:4040 to see:
- Incoming webhook requests
- Response status codes
- Request/response bodies

### 3. Test Purchase Flow

1. Sign in to Riff locally
2. Click the credits display in the toolbar
3. Select credit amount and click Purchase
4. Complete checkout (use Dodo's test card numbers)
5. Verify credits are added to your account

## Dodo Test Cards

For testing in test mode:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date and any 3-digit CVC.

## Troubleshooting

### Webhook not receiving requests
- Check ngrok is running and URL matches Dodo dashboard
- Verify webhook events are selected in Dodo
- Check ngrok inspector at http://127.0.0.1:4040

### Signature verification failing
- Ensure `DODO_WEBHOOK_SECRET` matches the webhook endpoint
- Check for trailing spaces in environment variable

### Credits not being added
- Check server logs for errors
- Verify the webhook handler at `/api/webhooks/dodo` is receiving events
- Ensure user exists in database

### "Product not found" error
- Verify `DODO_CREDITS_PRODUCT_ID` is correct
- Ensure product exists in the same mode (test/live) as your API key

## Environment Summary

| Environment | API Key | Webhook URL |
|-------------|---------|-------------|
| Local | `sk_test_...` | `https://your-ngrok-domain.ngrok-free.dev/api/webhooks/dodo` |
| Production | `sk_live_...` | `https://www.riff.im/api/webhooks/dodo` |

## Quick Start Commands

```bash
# Start local dev with webhook testing
cd "/Users/nyn/develop/vibe project/app"

# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000 --domain=uncontrastive-umbilicate-kanesha.ngrok-free.dev
```

Your webhook URL: `https://uncontrastive-umbilicate-kanesha.ngrok-free.dev/api/webhooks/dodo`
