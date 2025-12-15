# Session 12: Credits & Payment System with DodoPayments

**Date:** 2025-12-15

## Summary

Implemented a complete credits-based monetization system using DodoPayments. Philosophy: fair pricing, no subscriptions, no growth hacking. Users get 50 free credits and pay only for AI-powered actions.

## Philosophy

- **No subscriptions** - One-time credit purchases only
- **No growth hacking** - Users pay for value received
- **Transparent pricing** - $0.05/credit with cost breakdown shown
- **Trust-first** - Dodo invisible to users, no dark patterns

## Credit Costs

| Action | Credits | Rationale |
|--------|---------|-----------|
| AI Image Generation | 1 | Most expensive (Gemini/Imagen) |
| AI Image Restyle | 1 | Same as generation |
| Document Conversion | 1 | Uses AI (Kimi K2) |
| Theme Generation | 0.2 | Lighter text model |
| Publishing/CRUD | 0 | Core functionality free |

**New users:** 50 free credits

## Architecture

```
User signs up → Create Dodo Customer → Initialize 50 credits in DB
User buys credits → Dodo Checkout → Webhook → Add credits to balance
User generates image → Check balance → Deduct credit → Proceed
```

**Source of Truth:** Database (not Dodo wallet - SDK limitations)

## Implementation Phases

### Phase 1: Database & Dodo Setup
**Files:**
- `prisma/schema.prisma` - Added UserCredits, CreditTransaction models
- `lib/dodo.ts` - DodoPayments client

```prisma
model UserCredits {
  id             String   @id @default(cuid())
  userId         String   @unique
  dodoCustomerId String   @unique
  cachedBalance  Float    @default(0)
  lastSynced     DateTime @default(now())
  // ... relations
}

model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Float    // Positive = add, Negative = deduct
  type        String   // "purchase", "usage", "bonus", "refund", "initial"
  description String?
  metadata    Json?
  // ... relations, indexes
}
```

### Phase 2: User Onboarding
**File:** `lib/auth.ts`

Modified NextAuth `createUser` event:
```typescript
events: {
  createUser: async ({ user }) => {
    // Create preferences (existing)
    await prisma.userPreferences.create({ ... });

    // Initialize credits (new)
    if (user.email) {
      await initializeUserCredits(user.id, user.email, user.name);
    }
  },
}
```

### Phase 3: Credit Operations Library
**File:** `lib/credits.ts`

Constants:
```typescript
export const CREDIT_COSTS = {
  IMAGE_GENERATION: 1,
  IMAGE_RESTYLE: 1,
  DOCUMENT_CONVERSION: 1,
  THEME_GENERATION: 0.2,
};
export const INITIAL_FREE_CREDITS = 50;
export const PRICE_PER_CREDIT_CENTS = 5;
export const MIN_PURCHASE_CREDITS = 10;
```

Functions:
- `initializeUserCredits(userId, email, name)` - Setup new user
- `ensureUserCredits(userId)` - Lazy initialization
- `getBalance(userId)` - Get current balance
- `hasEnoughCredits(userId, amount)` - Quick check
- `requireCredits(userId, cost)` - Check + error object
- `deductCredits(userId, amount, description, metadata)` - Subtract credits
- `addCredits(userId, amount, type, description, metadata)` - Add credits
- `getTransactionHistory(userId, limit)` - Recent transactions
- `isInsufficientCreditsError(result)` - Type guard

### Phase 4: API Integration
**Files:**
- `app/api/generate-image/route.ts` - 1 credit
- `app/api/restyle-image/route.ts` - 1 credit
- `app/api/generate-theme/route.ts` - 0.2 credits
- `app/api/convert-document/route.ts` - 1 credit

Pattern applied to each:
```typescript
// Auth check
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Credit check (before expensive operation)
const creditCheck = await requireCredits(session.user.id, CREDIT_COSTS.X);
if (!creditCheck.allowed) {
  return NextResponse.json(creditCheck.error, { status: 402 });
}

// ... perform operation ...

// Deduct credits (after success)
await deductCredits(session.user.id, CREDIT_COSTS.X, 'Description', { metadata });
```

**Note:** Cached images don't cost credits (only new generations)

### Phase 5: Purchase Flow
**Files:**
- `app/api/credits/route.ts` - GET balance
- `app/api/credits/purchase/route.ts` - Create checkout session
- `app/api/webhooks/dodo/route.ts` - Handle payment webhooks

Checkout flow:
1. User selects credit amount (min 10)
2. POST `/api/credits/purchase` creates Dodo checkout session
3. User redirected to Dodo checkout
4. On success, webhook adds credits to balance
5. User redirected to `/credits/success`

Webhook handling:
- Signature verification
- Idempotency check (prevent double-crediting)
- Support for payment.succeeded, payment.failed, refund events

### Phase 6: UI Components
**Files:**
- `components/CreditsDisplay.tsx` - Balance indicator
- `components/PurchaseCreditsModal.tsx` - Buy credits modal
- `components/InsufficientCreditsModal.tsx` - Upgrade prompt
- `hooks/useCredits.tsx` - Hook + context provider
- `app/credits/success/page.tsx` - Purchase success page

Design:
- Dark theme matching Riff aesthetic
- Amber/gold accents for credits
- Coin metaphor with subtle animations
- Trust messaging integrated naturally
- Framer Motion animations

## Files Created

| File | Purpose |
|------|---------|
| `lib/dodo.ts` | DodoPayments client |
| `lib/credits.ts` | Credit operations library |
| `app/api/credits/route.ts` | GET balance endpoint |
| `app/api/credits/purchase/route.ts` | Create checkout |
| `app/api/webhooks/dodo/route.ts` | Webhook handler |
| `components/CreditsDisplay.tsx` | Balance indicator |
| `components/PurchaseCreditsModal.tsx` | Purchase modal |
| `components/InsufficientCreditsModal.tsx` | Insufficient credits prompt |
| `hooks/useCredits.tsx` | Hook + context |
| `app/credits/success/page.tsx` | Success celebration |
| `docs/monetize.md` | User-facing documentation |

## Files Modified

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Added UserCredits, CreditTransaction models |
| `lib/auth.ts` | Initialize credits on signup |
| `app/api/generate-image/route.ts` | Credit check + deduction |
| `app/api/restyle-image/route.ts` | Credit check + deduction |
| `app/api/generate-theme/route.ts` | Credit check + deduction |
| `app/api/convert-document/route.ts` | Credit check + deduction |

## Database Migration

```bash
npx prisma migrate dev --name add_credits_system
```

Created: `prisma/migrations/20251215060154_add_credits_system/migration.sql`

On Vercel deploy, `prisma migrate deploy` applies this automatically.

## Environment Variables Required

```env
DODO_API_KEY=xxx              # DodoPayments API key
DODO_WEBHOOK_SECRET=xxx       # Webhook signature verification
DODO_CREDITS_PRODUCT_ID=xxx   # Product ID in Dodo dashboard
INITIAL_FREE_CREDITS=50       # Optional, defaults to 50
```

## Integration Status

**Completed:**
- [x] Add `CreditsDisplay` to editor toolbar (`app/editor/page.tsx`)
- [x] Wrap app with `CreditsProvider` in layout (`app/layout.tsx`)
- [x] Document environment variables (`.env.example`)

**Remaining:**
- [ ] Configure Dodo environment variables in Vercel dashboard
- [ ] Create credits product in Dodo dashboard

## Error Responses

Insufficient credits returns HTTP 402:
```json
{
  "error": "insufficient_credits",
  "required": 1,
  "balance": 0.4,
  "message": "You need 1 credit but have 0.4"
}
```

## Existing User Migration

Uses **lazy migration** approach:
- `ensureUserCredits()` called before any credit operation
- If user has no credits record, initializes with 50 free credits
- No batch migration needed
