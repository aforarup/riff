# Session 09: Icon Update & Favicon Architecture

**Date:** 2025-12-13

## Summary

Updated the Riff brand icon from a 4-square grid to a new "stacked pages" design across the entire app. Documented the favicon architecture and common pitfalls to prevent future debugging headaches.

## New Icon Design

The new icon represents stacked presentation slides:
- **Front page**: White, higher opacity - the main visible slide
- **Back page**: Gray, lower opacity, offset - representing depth

Source file: `/riff-icon.svg` (project root)

## What Was Updated

### 1. Favicon (Browser Tab)

**File:** `app/app/icon.svg`

This is the **Next.js App Router convention file** - it automatically becomes the favicon. Key learnings:

| Issue | Root Cause | Solution |
|-------|------------|----------|
| Favicon not updating | `app/app/icon.svg` overrides everything | Update THIS file, not `public/` |
| Icon appears as gray blob | Original 512x512 viewBox too large for 32x32 | Use cropped viewBox |
| Multiple conflicting sources | `metadata.icons`, `<link>` tags, convention files | Use ONLY `app/app/icon.svg` |

**ViewBox Fix:**
```svg
<!-- ❌ BAD: Icon content doesn't fill favicon space -->
<svg viewBox="0 0 512 512">

<!-- ✅ GOOD: Cropped to actual icon bounds -->
<svg viewBox="30 20 460 470">
```

### 2. React Component

**File:** `app/components/RiffIcon.tsx`

New reusable component with customizable size and colors:

```tsx
<RiffIcon
  size={26}
  primaryColor="rgba(255, 255, 255, 0.9)"
  secondaryColor="rgba(255, 255, 255, 0.5)"
/>
```

### 3. OpenGraph & Twitter Images

Updated inline SVG in all 4 files:
- `app/app/opengraph-image.tsx`
- `app/app/twitter-image.tsx`
- `app/app/p/[token]/opengraph-image.tsx`
- `app/app/p/[token]/twitter-image.tsx`

### 4. App Headers & Footer

| Location | File | Size |
|----------|------|------|
| Landing nav | `components/Landing.tsx` | 26px |
| Landing footer | `components/Landing.tsx` | 20px |
| Editor header | `app/editor/page.tsx` | 26px |

### 5. Attribution Badge

**File:** `app/components/RiffBadge.tsx`

Updated the "Made with Riff" badge with stacked pages icon and hover animations.

## Files Removed (Cleanup)

| File | Reason |
|------|--------|
| `app/app/icon.tsx` | Dynamic generation conflicts with `icon.svg` |
| `app/app/apple-icon.tsx` | Unused, conflicts |
| `public/icon.svg` | Duplicate, ignored when `app/app/icon.svg` exists |
| Manual `<link>` in layout.tsx | Next.js handles favicon automatically |
| `metadata.icons` in layout.tsx | Conflicts with convention file |

## Documentation

**File:** `/docs/icon-update-guide.md`

Comprehensive guide covering:
- Next.js favicon convention (the critical part!)
- Common pitfalls table
- What NOT to do
- Debugging section
- All icon locations with file paths
- ViewBox cropping for favicons
- Color guidelines
- SVG path data reference

## Key Learnings

### Next.js Favicon Priority

```
app/app/icon.svg          ← WINS (convention file)
app/app/icon.tsx          ← Also works, but conflicts with .svg
public/icon.svg           ← Ignored if app/app/icon.* exists
public/favicon.ico        ← Legacy fallback
```

### Favicon ViewBox Matters

The original icon paths span roughly 60-452 on X and 42-469 on Y within a 512x512 canvas. At 32x32 favicon size, the icon was too small to see.

**Solution:** Crop viewBox to `30 20 460 470` to make the icon fill the space.

### Don't Mix Approaches

Having multiple favicon sources causes unpredictable behavior:
- `metadata.icons` in layout.tsx
- `<link rel="icon">` in head
- Convention files (`icon.svg`, `icon.tsx`)
- Files in `public/`

**Pick one:** Use `app/app/icon.svg` only.

## File Summary

### New Files
| File | Purpose |
|------|---------|
| `app/components/RiffIcon.tsx` | Reusable icon component |
| `/docs/icon-update-guide.md` | Icon update documentation |

### Modified Files
| File | Changes |
|------|---------|
| `app/app/icon.svg` | New stacked pages icon with cropped viewBox |
| `app/app/layout.tsx` | Removed conflicting favicon config |
| `app/app/opengraph-image.tsx` | New icon SVG |
| `app/app/twitter-image.tsx` | New icon SVG |
| `app/app/p/[token]/opengraph-image.tsx` | New icon SVG |
| `app/app/p/[token]/twitter-image.tsx` | New icon SVG |
| `app/components/Landing.tsx` | Uses RiffIcon, increased sizes |
| `app/app/editor/page.tsx` | Uses RiffIcon, increased size |
| `app/components/RiffBadge.tsx` | New stacked pages icon |

### Deleted Files
| File | Reason |
|------|--------|
| `app/app/icon.tsx` | Conflicted with icon.svg |
| `app/app/apple-icon.tsx` | Conflicted with icon.svg |
| `public/icon.svg` | Duplicate |

## Testing Checklist

- [x] Favicon shows stacked pages (hard refresh to verify)
- [x] Landing page header shows new icon at correct size
- [x] Landing page footer shows new icon
- [x] Editor header shows new icon
- [x] "Made with Riff" badge shows new icon
- [x] Build passes
