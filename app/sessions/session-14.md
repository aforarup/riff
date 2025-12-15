# Session 14: Philosophy Page

**Date:** 2025-12-15

## Summary

Created an editorial philosophy page at `/philosophy` articulating Riff's trust-first, anti-growth-hacking values. Inspired by Steph Ango's (Kepano) writings but expressed in Riff's own voice.

---

## Philosophy Themes

Core beliefs distilled into the page:

1. **Your work is yours** - Markdown-based, export anytime, no lock-in
2. **Pay for value, not access** - Credits model aligns incentives
3. **No dark patterns** - No FOMO, no guilt-tripping, no expiring credits
4. **Simplicity is respect** - Every feature is cognitive cost to user
5. **Easy to leave** - Forces us to be worth staying for

---

## Page Structure

| Section | Content |
|---------|---------|
| Header | "Worth staying for" + jump link to values |
| The Trap | What's wrong with typical SaaS friction tactics |
| Pull Quote | Kepano quote with attribution + link |
| What we believe | Intro to our approach |
| Values | 4 core principles with descriptions |
| The honest part | Sustainability, cost transparency, the deal |
| Cost breakdown | Actual costs per credit |
| An invitation | Open dialogue, email link |

---

## Design Choices

### Typography-First Editorial
- Playfair Display serif headings
- 680px max-width for optimal reading
- 1.8 line-height for body text
- Generous whitespace

### Visual Elements
- Dot pattern background (32px grid, 0.07 opacity)
- Amber gradient glow at top
- Side vignette for depth
- Subtle grain texture overlay
- Amber accent color for links and highlights
- Decorative dividers with centered amber dot

### Interactions
- Staggered fade-in animations on load
- Jump link "→ Our values" in first fold
- Hover states on links and quote attribution

---

## Key Quote Attribution

Attributed Steph Ango's quote with link to original tweet:
> "If you make it easy for people to leave, it forces you to improve in ways that make people want to stay."
> — Steph Ango, creator of Obsidian

Link: https://x.com/kepano/status/1968331862021177852

---

## Files Created

| File | Purpose |
|------|---------|
| `app/philosophy/page.tsx` | Philosophy page with essay content |

## Files Modified

| File | Changes |
|------|---------|
| `components/Landing.tsx` | Added "Philosophy" link to footer |

---

## Copy Highlights

**Opening:**
> "Most software is designed to keep you. We'd rather build something worth staying for."

**The honest part:**
> "We want to build something that works for both of us. You get a tool worth using; we get to keep building it. That's the whole equation."

**On credits:**
> "When you buy credits, we don't create anxiety of parked money. We discourage you to buy more when you already have enough. Your credits never expire. We'd rather you buy less and trust us more."

---

## Navigation

- Discoverable via footer link only (subtle, for those who look)
- Not in main navigation
- Links: Philosophy | Terms | Privacy
