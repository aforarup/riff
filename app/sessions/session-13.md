# Session 13: Credits UI Polish & Payment Flow Fixes

**Date:** 2025-12-15

## Summary

Polished the PurchaseCreditsModal with slider-based selection, NumberFlow animations, tier-based value messaging, and a pre-screen for users with plenty of credits. Fixed critical bugs in payment flow including return URL construction and success page status handling.

## Changes from Session 12

Session 12 established the credits system foundation. This session focused on:
- UI/UX polish for the purchase experience
- Pricing model refinement ($1 = 20 credits)
- Payment flow bug fixes
- Trust-first design philosophy

---

## Pricing Model Refinement

Changed from credit-based to dollar-based pricing:

**Before (Session 12):**
- $0.05 per credit
- Min purchase: 10 credits ($0.50)

**After (Session 13):**
- $1 = 20 credits (CREDITS_PER_DOLLAR = 20)
- Min purchase: $1
- Dodo product priced at $1, quantity = dollar amount
- More intuitive for users and easier to manage

**Files:**
- `lib/credits-config.ts` - New file with client-safe constants
- `lib/credits.ts` - Updated to import from credits-config
- `lib/dodo.ts` - Updated to use dollar-based checkout

---

## PurchaseCreditsModal Redesign

Complete redesign with editorial, trust-first aesthetic.

### Before
- Quick-select buttons ($1, $2, $5, $10) + stepper + input
- Repeated info ("20 credits" shown 4x)
- Raw numbers (20 images, 100 themes)
- Coin chip overlapping close button

### After
- **Slider-based selection** (1-50 range with clickable marks)
- **NumberFlow animations** for smooth digit transitions
- **Tier-based value messaging** that changes contextually
- **Pre-screen** for users with 50+ credits
- **Trust promises** with icons (Shield, Infinity)

### Value Tiers

| Amount | Tier | Headline | Color |
|--------|------|----------|-------|
| $1 | starter | "A quick top-up" | zinc |
| $2-4 | couple | "A couple of decks" | rose |
| $5-9 | several | "Several presentations" | violet |
| $10-19 | project | "A whole project" | sky |
| $20-49 | powerUser | "Power user mode" | emerald |
| $50+ | excessive | "Whoa, big spender!" | amber |

### Custom Tier Icons
Created custom SVG icons for each tier:
- Starter: Single dot
- Couple: Two circles
- Several: Mini grid
- Project: Multiple deck shapes
- Power User: Star
- Excessive: Clock (time = money)

### Pre-screen for Wealthy Users

When user has ≥50 credits, shows initial screen:
- Stacked coins icon (custom SVG)
- "You're loaded!" headline
- Balance breakdown (images, themes, presentations)
- Quirky CTAs:
  - "🎨 Sweet, back to creating" (primary)
  - "💸 I want to buy more" (secondary)

### $50+ Easter Egg

When slider hits $50, bonus card appears:
- "Love Riff this much?" with heart icon
- Playful copy about excessive spending
- "Buy us a coffee instead?" link
- "Share the love" Twitter link

**File:** `components/PurchaseCreditsModal.tsx`

---

## NumberFlow Integration

Added `@number-flow/react` for smooth number animations.

```bash
npm install @number-flow/react
```

Usage:
```tsx
<NumberFlow
  value={dollarAmount}
  className="text-5xl font-semibold text-white"
  transformTiming={{ duration: 400, easing: 'ease-out' }}
  spinTiming={{ duration: 400, easing: 'ease-out' }}
/>
```

---

## Credits Display Fixes

### Infinite Loop Fix
`CreditsDisplay` had useEffect with `[balance]` dependency causing infinite re-renders.

**Fix:** Empty dependency array + functional setState:
```tsx
useEffect(() => {
  const fetchBalance = async () => {
    setBalance((prev) => {
      setLastBalance(prev);
      return data.balance;
    });
  };
  fetchBalance();
  const interval = setInterval(fetchBalance, 30000);
  return () => clearInterval(interval);
}, []); // Empty deps
```

### Client-Side Import Fix
`PurchaseCreditsModal` imported from `lib/credits.ts` which imported `lib/dodo.ts`, causing DodoPayments SDK to bundle into client.

**Fix:** Created `lib/credits-config.ts` with client-safe constants:
```typescript
// lib/credits-config.ts - Safe for client import
export const CREDIT_COSTS = { ... };
export const CREDITS_PER_DOLLAR = 20;
export const MIN_PURCHASE_DOLLARS = 1;
export function dollarsToCredits(dollars: number): number { ... }
```

### Decimal Display
Changed `.toFixed(1)` to `Math.round()` since credits are now whole numbers.

**Files:** `components/CreditsDisplay.tsx`, `components/PurchaseCreditsModal.tsx`

---

## Success Page Status Handling

The success page wasn't checking `status` query parameter, showing celebration even for failed payments.

### Before
Always showed success state regardless of URL params.

### After
Checks `?status=` parameter:
- `status=failed` → Shows failure UI (red X, "Payment failed", retry button)
- `status=cancelled` → Shows cancelled UI ("Payment cancelled", gentle message)
- Otherwise → Shows success UI (green check, confetti, celebration)

**File:** `app/credits/success/page.tsx`

---

## Return URL Bug Fix

**Bug:** Return URL was `https://undefined/credits/success`

**Cause:** JavaScript operator precedence issue:
```typescript
// Bug: evaluates wrong branch
const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`  // This runs when NEXTAUTH_URL is truthy!
  : 'http://localhost:3000';
```

**Fix:**
```typescript
const baseUrl = process.env.NEXTAUTH_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  || 'http://localhost:3000';
```

**File:** `app/api/credits/purchase/route.ts`

---

## Environment Variables

Updated to use SDK defaults:

| Variable | Purpose |
|----------|---------|
| `DODO_PAYMENTS_API_KEY` | SDK reads this automatically |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` or `live_mode` |
| `DODO_WEBHOOK_SECRET` | Webhook signature verification |
| `DODO_CREDITS_PRODUCT_ID` | Product ID from Dodo dashboard |

**File:** `.env.example`

---

## Banned Icons

Removed overused "Sparkles" icon from codebase. Replaced with:
- 🎨 emoji for creative actions
- Custom SVG icons for specific contexts

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/credits-config.ts` | Client-safe credits constants |

## Files Modified

| File | Changes |
|------|---------|
| `components/PurchaseCreditsModal.tsx` | Complete redesign with slider, tiers, pre-screen |
| `components/CreditsDisplay.tsx` | Fixed infinite loop, decimal display |
| `app/credits/success/page.tsx` | Added failed/cancelled state handling |
| `app/api/credits/purchase/route.ts` | Fixed return URL construction |
| `lib/credits.ts` | Import from credits-config |
| `lib/dodo.ts` | Dollar-based checkout, environment config |
| `.env.example` | Updated env var names |
| `package.json` | Added @number-flow/react |

---

## Testing Checklist

- [ ] Open purchase modal with <50 credits → Goes to purchase flow
- [ ] Open purchase modal with ≥50 credits → Shows pre-screen
- [ ] Slide to $50+ → Shows easter egg card
- [ ] Complete payment → Redirects to success page
- [ ] Failed payment → Shows failure page with retry option
- [ ] Cancelled payment → Shows cancelled page
- [ ] Return URL is correct (not undefined)

---

## Next Steps

- [ ] Enable payment methods in Dodo dashboard (card payments for test mode)
- [ ] Test complete webhook flow with ngrok
- [ ] Verify credits are added on successful payment
