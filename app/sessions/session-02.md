# Session 02: Image Features & Gemini 3 Upgrade

**Date:** 2025-12-11

## Summary

This session focused on enhancing image handling capabilities and upgrading the image generation API to use Google's Gemini 3 model.

---

## 1. Image Background Color Fix

### Problem
Images were being generated with white/default backgrounds instead of matching the slide deck's theme background color.

### Root Causes Identified
1. **Weak prompt instruction**: Background color instruction was appended at the END of the prompt - image models often ignore late instructions
2. **Instruction too vague**: "seamlessly blends" was ambiguous

### Solution
Updated `app/api/generate-image/route.ts`:
- Changed instruction to be **strong and explicit**: `IMPORTANT: Use a solid ${backgroundColor} background color. The background MUST be ${backgroundColor}.`
- **Prepended** instruction to the START of the prompt instead of appending to end
- Image models pay more attention to instructions at the beginning

### Files Modified
- `app/api/generate-image/route.ts` (lines 14-26)
- `app/components/ImagePlaceholder.tsx` (added `getBackgroundColor()` helper)

---

## 2. Gemini 3 API Upgrade

### Previous Setup
- Primary: `imagen-3.0-generate-001` via `:predict` endpoint
- Fallback: `gemini-2.0-flash-exp` via `:generateContent`

### New Setup
Model priority with graceful fallback chain:
1. **Gemini 3** (`gemini-3-pro-image-preview`) - Primary, best quality
2. **Imagen 3** (`imagen-3.0-generate-001`) - Fallback 1
3. **Gemini 2.0 Flash** (`gemini-2.0-flash-exp`) - Fallback 2

### Gemini 3 Advantages
- Up to 4K resolution support
- Better text rendering in images
- Improved instruction following
- Grounded generation capability (Google Search integration)

### API Differences
```javascript
// Gemini 3 uses generateContent endpoint
POST /v1beta/models/gemini-3-pro-image-preview:generateContent
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { responseModalities: ['image'] }
}

// vs Imagen 3 uses predict endpoint
POST /v1beta/models/imagen-3.0-generate-001:predict
{
  instances: [{ prompt }],
  parameters: { aspectRatio: '16:9', sampleCount: 1 }
}
```

### Files Modified
- `app/api/generate-image/route.ts` (complete rewrite)

---

## 3. Image Upload Feature

### Functionality
- Users can upload their own images instead of generating them
- Supports: PNG, JPEG, WebP, GIF
- Max file size: 10MB
- Images stored in Vercel Blob at `uploads/{hash}.{ext}`

### API Endpoint
```
POST /api/upload-image
Content-Type: multipart/form-data

Body:
- file: Image file
- description: Optional description string
```

### Response
```json
{
  "url": "https://blob.vercel-storage.com/uploads/abc123.png",
  "filename": "uploads/abc123.png",
  "description": "User uploaded image",
  "source": "uploaded"
}
```

### Files Created
- `app/api/upload-image/route.ts`

---

## 4. Image Restyle Feature

### Functionality
Apply style transformations to existing images (uploaded or generated):
- Select from preset styles (Modern, Editorial, Voxel, Retro Anime, Manga, Cyberpunk, etc.)
- Or provide a custom prompt for free-form styling
- Uses Gemini's image-to-image transformation capabilities

### API Endpoint
```
POST /api/restyle-image
Content-Type: application/json

Body:
{
  "imageUrl": "https://...",
  "styleId": "modern" | "voxel" | etc,  // OR
  "customPrompt": "Transform into watercolor...",
  "backgroundColor": "#0a0a0a"  // Optional, for theme matching
}
```

### Response
```json
{
  "url": "https://blob.vercel-storage.com/restyled/xyz789.png",
  "originalUrl": "https://...",
  "styleId": "modern",
  "model": "gemini-3-pro-image-preview"
}
```

### Files Created
- `app/api/restyle-image/route.ts`

---

## 5. Restore Original Image

### Functionality
- When an image has been restyled, a "Restore" button appears
- Clicking it reverts to the original image (before any restyling)
- Original URL tracked in component state via `ImageMetadata.originalUrl`

### Implementation
```typescript
interface ImageMetadata {
  url: string;
  originalUrl?: string;  // For restore after restyle
  source: 'generated' | 'uploaded' | 'restyled';
}
```

---

## 6. Updated ImagePlaceholder UI

### New Action Buttons (on hover)
| Button | Color | Icon | Action |
|--------|-------|------|--------|
| Regenerate | Accent | RefreshCw | Generate new AI image |
| Upload | Blue | Upload | Upload custom image |
| Restyle | Purple | Wand2 | Open restyle modal |
| Restore | Amber | Undo2 | Revert to original (only if restyled) |

### Source Badge
Shows image origin on hover:
- "Generated" (gray) - AI-generated image
- "Uploaded" (blue) - User-uploaded image
- "Restyled" (purple) - Transformed image

### Restyle Modal
- Image preview
- 2-column grid of style presets
- Custom prompt textarea
- Cancel / Apply Style buttons
- Loading state with spinner

### Image Fit Fix
Changed from `object-cover` to `object-contain`:
- Images now fit entirely within container
- Preserves original aspect ratio
- No cropping of uploaded images with non-16:9 ratios

### Files Modified
- `app/components/ImagePlaceholder.tsx` (complete rewrite, ~560 lines)

---

## Architecture Notes

### Image Storage Locations (Vercel Blob)
- Generated images: `images/{hash}.png`
- Uploaded images: `uploads/{hash}.{ext}`
- Restyled images: `restyled/{hash}.png`

### Cache Key Strategy
- Key format: `{styleId}:{description}` or just `{description}`
- Background color NOT in cache key (images persist across theme changes)
- User must click "Regenerate" to get new background color

### Model Fallback Chain
```
Gemini 3 → Imagen 3 → Gemini 2.0 Flash → Error
```
Each model tried in sequence; first success wins.

---

## 7. Slide Generator (HTML/CSS) Fix

### Problems
1. Generated HTML used `100vw/100vh` but rendered inside a container → overflow
2. No theme integration - hardcoded colors ignored CSS variables
3. LLM went "wild" with inconsistent designs across slides
4. Just converted markdown to HTML without improving layout

### Solution

#### Force Containment (Parent-side CSS)
Added `!important` overrides in `GeneratedSlide.tsx`:
```css
.generated-slide-container > * {
  max-width: 100% !important;
  max-height: 100% !important;
  position: absolute !important;
  inset: 0 !important;
  overflow: hidden !important;
}
```

#### New System Prompt (Design-Focused)
Rewrote `DEFAULT_SLIDE_SYSTEM_PROMPT` to:
- Use `width: 100%; height: 100%` (not viewport units)
- **MUST use CSS variables** for colors/fonts
- Actually DESIGN layouts (not just convert markdown)
- 8 layout templates provided (Title + Points, Two Column, Big Statement, etc.)
- Animation classes with directional entrances

#### Layout Ideas in Prompt
| Layout | Use Case |
|--------|----------|
| Title Slide | Opening slides |
| Title + Points | Title left, bullets right |
| Big Statement | Single impactful phrase |
| Quote | Large quotes with attribution |
| Two Column | Balanced content split |
| Title + Grid | Title above 2x2 content |

#### Animation Classes
```css
.from-left    /* Slide in from left */
.from-right   /* Slide in from right */
.from-bottom  /* Slide up from bottom */
.scale-in     /* Scale up entrance */
```

### Files Modified
- `lib/prompts.ts` - Complete rewrite of `DEFAULT_SLIDE_SYSTEM_PROMPT`
- `components/GeneratedSlide.tsx` - Added theme CSS injection + containment

---

## 8. Image Slots System (3-Slot Architecture)

### Problem
- All image types shared same cache key, overwrote each other
- On reload, AI-generated image took priority over uploaded/restyled
- No way to toggle between different versions

### Solution: 3 Separate Slots

#### Cache Key Format
| Slot | Cache Key | Color |
|------|-----------|-------|
| Generated | `gen:${styleId}:${description}` | Emerald |
| Uploaded | `upload:${description}` | Blue |
| Restyled | `restyle:${description}` | Purple |

#### Load Priority
On page load: **Restyled → Uploaded → Generated**

First one found becomes active slot.

#### Toggle UI
- Badge shows current slot (AI / Upload / Styled)
- If multiple slots exist, badge shows **Layers icon + count**
- Click badge to open **slot picker dropdown**
- Switch between any available slot instantly

#### Behavior
- **Generate** → saves to `generated` slot
- **Upload** → saves to `uploaded` slot
- **Restyle** → saves to `restyled` slot
- All 3 coexist - none overwrite each other

### Visual
```
┌─────────────────────────────────┐
│ [Styled (3)] ←── click to toggle│
│         [Image Here]            │
│  [Generate] [Upload] [Restyle]  │
└─────────────────────────────────┘
        ↓ click badge
┌─────────────┐
│ ● AI        │
│ ● Upload    │ ← picker dropdown
│ ● Styled ✓  │
└─────────────┘
```

### Files Modified
- `components/ImagePlaceholder.tsx` - Complete rewrite with slot system

---

## Files Changed Summary

### New Files
- `app/api/upload-image/route.ts` - Image upload endpoint
- `app/api/restyle-image/route.ts` - Image transformation endpoint
- `app/sessions/session-02.md` - This documentation

### Modified Files
- `app/api/generate-image/route.ts` - Gemini 3 upgrade + bg color fix
- `app/components/ImagePlaceholder.tsx` - Full rewrite with 3-slot system
- `app/components/GeneratedSlide.tsx` - Theme CSS injection + containment
- `app/lib/prompts.ts` - Rewritten slide generation prompt
