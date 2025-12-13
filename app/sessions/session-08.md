# Session 08: Image Persistence Architecture

**Date:** 2025-12-13

## Summary

Implemented YAML frontmatter-based image persistence to solve the critical bug where images disappeared on shared presentations. Images are now stored directly in the markdown file, making decks fully portable and self-contained (file-over-app philosophy).

## Problem Statement

Images in Riff were stored in Vercel Blob but their URL mappings were only kept in:
- **Zustand store** (memory) - lost on page refresh
- **localStorage** - lost in different browser/incognito/devices

This caused images to disappear on:
- Shared presentations (different browser)
- After browser session clears
- Across devices

### Image Types Affected

| Type | Blob Path | URL Predictable? | Previous Persistence |
|------|-----------|------------------|---------------------|
| Generated | `images/{hash}.png` | ✅ Yes | Could re-lookup |
| Uploaded | `uploads/{random}.{ext}` | ❌ No | localStorage only - **LOST** |
| Restyled | `restyled/{random}.png` | ❌ No | localStorage only - **LOST** |

## Solution: YAML Frontmatter

Store all image URLs directly in the markdown file:

```yaml
---
images:
  "a futuristic city":
    generated: https://blob.url/images/abc123.png
    uploaded: https://blob.url/uploads/def456.png
    restyled: https://blob.url/restyled/ghi789.png
    active: uploaded
---

# Slide 1
[image: a futuristic city]
```

## What Was Built

### 1. Frontmatter Parser (`lib/parser.ts`)

**New Functions:**
- `extractFrontmatter(content)` - Parse YAML from markdown
- `updateImageInManifest(content, description, slot, url)` - Add/update image URL
- `setActiveImageSlot(content, description, slot)` - Switch active variant
- `removeImageFromManifest(content, description)` - Remove entry

**Modified:**
- `parseSlideMarkdown()` now returns `imageManifest` in `ParsedDeck`

### 2. Type Definitions (`lib/types.ts`)

```typescript
export type ImageSlot = 'generated' | 'uploaded' | 'restyled';

export interface ImageManifestEntry {
  generated?: string;
  uploaded?: string;
  restyled?: string;
  active: ImageSlot;
}

export type ImageManifest = Record<string, ImageManifestEntry>;
```

### 3. ImagePlaceholder Updates (`components/ImagePlaceholder.tsx`)

**New Props:**
- `manifestEntry` - Image data from frontmatter
- `onImageChange(slot, url)` - Callback when image generated/uploaded/restyled
- `onActiveSlotChange(slot)` - Callback when user switches variants

**Behavior:**
- Prioritizes frontmatter data over localStorage
- Calls callbacks on any image change for auto-save

### 4. Component Threading

Threaded `imageManifest` and callbacks through:
- `SlideRenderer.tsx` - Passes to ImagePlaceholder
- `Presenter.tsx` - For presentation mode
- `SlidePreview.tsx` - For editor preview
- `EmbedClient.tsx` - For embedded views

### 5. Editor Auto-Save (`app/editor/page.tsx`)

**New Handlers:**
- `handleImageChange()` - Updates frontmatter + auto-saves
- `handleActiveSlotChange()` - Updates active slot + auto-saves

### 6. Silent Repair on Publish (`app/api/decks/[id]/publish/route.ts`)

When publishing, the API:
1. Receives localStorage URLs from ShareDialog
2. Parses `vibe-image-{slot}:{description}` keys
3. Merges missing URLs into frontmatter
4. Saves repaired content back to blob

This recovers images for legacy decks created before frontmatter.

### 7. Documentation (`docs/yaml-frontmatter.md`)

Comprehensive documentation covering:
- Frontmatter format
- Image slot types
- How persistence works
- Migration from old decks

## ShareDialog UI Improvements

Refined the share dialog layout:
- **URL row**: Input + "Copy" button (icon + text)
- **Status row**: Live indicator + "Preview" link (text + icon)
- Reduced vertical padding for compact appearance

## File Summary

### New Files
| File | Purpose |
|------|---------|
| `docs/yaml-frontmatter.md` | Image persistence documentation |

### Modified Files
| File | Changes |
|------|---------|
| `lib/types.ts` | Added `ImageSlot`, `ImageManifestEntry`, `ImageManifest` types |
| `lib/parser.ts` | Frontmatter extraction/serialization functions |
| `components/ImagePlaceholder.tsx` | Manifest props, change callbacks |
| `components/SlideRenderer.tsx` | Thread manifest and callbacks |
| `components/Presenter.tsx` | Thread manifest and callbacks |
| `components/SlidePreview.tsx` | Thread manifest and callbacks |
| `components/EmbedClient.tsx` | Pass imageManifest |
| `app/editor/page.tsx` | Image change handlers with auto-save |
| `app/api/decks/[id]/publish/route.ts` | Silent repair logic |
| `components/sharing/ShareDialog.tsx` | UI layout improvements |

### Dependencies Added
```bash
npm install js-yaml @types/js-yaml
```

## Data Flow

```
Markdown File (with frontmatter)
         │
         ▼
    Parser extracts
    imageManifest
         │
         ▼
    Presenter/Editor
         │
         ▼
    SlideRenderer
         │
         ▼
    ImagePlaceholder
    (receives manifestEntry)
         │
         ▼
    On image change:
    callback → Editor → updateImageInManifest → auto-save
```

## Migration & Compatibility

- **Old decks** (no frontmatter): Work normally, fall back to cache-check
- **On any image change**: Frontmatter created/updated automatically
- **On publish**: Silent repair merges localStorage URLs into frontmatter

## Testing Checklist

- [x] New images persist to frontmatter immediately
- [x] Images appear on shared/embedded views
- [x] Switching variants persists active slot
- [x] Legacy decks work and get repaired on publish
- [x] Build passes successfully
