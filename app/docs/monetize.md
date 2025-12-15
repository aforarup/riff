# Riff Credits System

## Our Philosophy

We don't believe in growth hacking. You shouldn't pay for features you don't use.

Credits let you pay only for AI-powered actions that actually cost us money. Everything else - creating decks, editing, publishing, sharing - is free.

---

## How It Works

### Free to Start
Every new user gets **50 free credits**. That's enough to:
- Generate ~50 AI images
- Create ~250 custom themes
- Convert ~50 documents to slides

### Pay What You Use
When you run out, buy exactly what you need:
- **$1 = 20 credits**
- Minimum purchase: $1
- No maximum - buy as much as you need

No subscriptions. No auto-renewals. No tricks.

---

## What Costs Credits

| Action | Credits | Why |
|--------|---------|-----|
| AI Image Generation | 1 | Uses expensive image AI models |
| AI Image Restyle | 1 | Same cost as generation |
| Document Conversion | 1 | AI processes your document |
| Theme Generation | 0.2 | Uses lighter text models |

### What's Free

| Action | Cost |
|--------|------|
| Creating decks | Free |
| Editing content | Free |
| Publishing | Free |
| Sharing links | Free |
| Embedding | Free |
| Uploading your own images | Free |

---

## What Your Money Gets You

| Amount | Credits | Approx. Usage |
|--------|---------|---------------|
| $1 | 20 | Quick top-up - polish a deck |
| $3 | 60 | A couple of presentations |
| $5 | 100 | Several polished decks |
| $10 | 200 | A whole project |
| $20 | 400 | Power user territory |

---

## Pricing Transparency

We charge **$1 for 20 credits** (~$0.05 per credit). Here's why:

| Component | Cost per credit |
|-----------|-----------------|
| AI model costs | ~$0.02-0.03 |
| Infrastructure | ~$0.005 |
| Risk buffer (refunds, failures) | ~$0.005 |
| Margin to keep Riff running | ~$0.01 |
| **Total** | **~$0.05** |

We're not trying to maximize revenue. We're trying to build a sustainable product that treats you fairly.

---

## FAQ

### Why credits instead of a subscription?

Subscriptions incentivize us to get you to pay regardless of usage. Credits align our interests: you pay when you get value.

### What happens when I run out of credits?

You can still create and edit decks, publish, and share. AI-powered features (image generation, themes, conversion) will prompt you to add credits.

### Do credits expire?

No. Your credits are yours forever.

### Can I get a refund?

If something goes wrong (failed generation, bug, etc.), contact us. We'll make it right.

### What if I need a lot of credits?

Just buy them. There's no maximum. The price is the same whether you buy $1 or $100 worth.

---

## Technical Details

### Credit Costs by API

```
POST /api/generate-image    → 1 credit
POST /api/restyle-image     → 1 credit
POST /api/convert-document  → 1 credit
POST /api/generate-theme    → 0.2 credits
```

### Error Response

When you don't have enough credits:

```json
{
  "error": "insufficient_credits",
  "required": 1,
  "balance": 0.4,
  "message": "You need 1 credit but have 0.4"
}
```

HTTP Status: `402 Payment Required`

---

## Contact

Questions about credits or billing? Email us at [hello@riff.im](mailto:hello@riff.im)
