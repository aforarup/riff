# Content Pages Plan

Planning document for Docs, Blog, and Legal pages.

---

## 1. Documentation Page (`/docs`)

### Purpose
Explain how to use Riff and document all features for new and existing users.

### Suggested Structure

```
/docs                    → Overview / Getting Started
/docs/markdown-syntax    → Slide syntax reference
/docs/themes             → Theme generation guide
/docs/images             → Image placeholders & AI generation
/docs/presenting         → Keyboard shortcuts, presenter mode
/docs/sharing            → Publishing, embedding, sharing
/docs/importing          → Document import (PDF, DOCX, etc.)
```

### Content Outline

**Getting Started**
- What is Riff?
- Creating your first deck
- The editor interface
- Quick start (paste content → get slides)

**Markdown Syntax**
- Slide separators (`---`)
- Headings & hierarchy
- Lists & bullet points
- Tables
- Code blocks
- Blockquotes (speaker notes)
- Animations (`**pause**`, `[anvil]`, etc.)
- Section dividers (`[section]`)
- Background effects (`[bg:glow]`, `[bg:gradient]`)

**Images**
- Image placeholder syntax (`[image: description]`)
- AI image generation
- Image styles (realistic, illustration, etc.)
- Uploading custom images
- Image positioning (left, right, full)

**Themes**
- Theme Studio overview
- Quick styles
- Custom prompts
- What themes control (colors, fonts, spacing)

**Presenting**
- Keyboard shortcuts
- Fullscreen mode
- Speaker notes
- Slide overview
- Progress tracking

**Sharing & Publishing**
- Publishing a deck
- Share links
- Embedding in websites
- Embed customization

**Importing Documents**
- Supported formats
- How conversion works
- Tips for best results

### Implementation Options

| Option | Pros | Cons |
|--------|------|------|
| **A. MDX pages in `/app/docs`** | Simple, version controlled, fast | Need to build TOC/nav manually |
| **B. Headless CMS (Contentlayer)** | Type-safe, good DX | Additional dependency |
| **C. Notion/external docs** | Easy to edit | External dependency, less control |

**Recommendation:** Option A (MDX) - Keep it simple, matches the Riff philosophy.

### Design Notes
- Match landing page dark aesthetic
- Sidebar navigation (collapsible on mobile)
- Search functionality (later)
- Code syntax highlighting for examples
- Live preview embeds where helpful

---

## 2. Blog Page (`/blog`)

### Purpose
Share content about presentations, Riff updates, tips, and thought leadership.

### Suggested Structure

```
/blog                    → Blog listing page
/blog/[slug]             → Individual post page
```

### Content Ideas

**Launch & Updates**
- "Introducing Riff" - launch post
- Feature announcements
- Changelog highlights

**Educational**
- "The Art of Minimal Slides"
- "Why Markdown for Presentations"
- "10 Tips for Better Pitch Decks"
- "Presenter Mode: Hidden Features"

**Use Cases**
- "How Founders Use Riff for Pitch Decks"
- "From Meeting Notes to Slides in 60 Seconds"
- "Teaching with Riff"

**Technical**
- "How AI Theme Generation Works"
- "Building Riff: Architecture Decisions"

### Implementation Options

| Option | Pros | Cons |
|--------|------|------|
| **A. MDX in `/content/blog`** | Version controlled, simple | Manual RSS, no CMS |
| **B. Contentlayer + MDX** | Type-safe, frontmatter | Setup overhead |
| **C. External (Hashnode/Medium)** | Easy, SEO built-in | Less control, external |

**Recommendation:** Option A or B - MDX keeps content in repo.

### Design Notes
- Grid/list of posts on `/blog`
- Featured image per post
- Author info (later, when team grows)
- Tags/categories
- Reading time estimate
- Related posts
- Social sharing buttons
- RSS feed

### Blog Post Frontmatter
```yaml
---
title: "Post Title"
description: "Brief description for SEO"
date: "2025-01-15"
author: "Riff Team"
image: "/blog/post-cover.jpg"
tags: ["tips", "features"]
---
```

---

## 3. Legal Pages

### Pages Needed

```
/terms          → Terms of Service
/privacy        → Privacy Policy
```

### Terms of Service Sections
(Based on napkin.ai structure)

1. **Acceptance of Terms**
2. **Use of Services**
   - Account registration
   - Eligibility (age requirements)
3. **Your Content**
   - Ownership (you own your content)
   - License grant to Riff
   - Content responsibility
4. **Riff's Services**
   - AI-generated content
   - Availability
   - Modifications
5. **Prohibited Conduct**
   - Acceptable use
   - No illegal content
   - No abuse of service
6. **Intellectual Property**
   - Riff's ownership
   - Trademarks
7. **Third-Party Services**
   - External links
   - Integrations (Google auth, etc.)
8. **Fees & Payment** (if applicable)
   - Free tier
   - Future paid features
9. **Termination**
   - By user
   - By Riff
10. **Disclaimers**
    - "As is" service
    - No warranties
11. **Limitation of Liability**
12. **Indemnification**
13. **Dispute Resolution**
    - Governing law
    - Arbitration (optional)
14. **General Provisions**
    - Entire agreement
    - Severability
    - Updates to terms

### Privacy Policy Sections
(Based on napkin.ai structure)

1. **Introduction**
   - Who we are
   - Scope of policy
2. **Information We Collect**
   - Account info (email, name via Google OAuth)
   - Content you create (decks, markdown)
   - Usage data (analytics)
   - Cookies
3. **How We Use Information**
   - Provide services
   - Improve product
   - Communications
   - Legal compliance
4. **How We Share Information**
   - Service providers (Vercel, blob storage)
   - Legal requirements
   - Business transfers
5. **Data Retention**
   - How long we keep data
   - Deletion policy
6. **Your Rights**
   - Access your data
   - Delete your account
   - Export your content
7. **Security**
   - Encryption (HTTPS)
   - Secure storage
8. **Third-Party Services**
   - Google OAuth
   - Analytics
9. **Children's Privacy**
   - Not intended for under 13
10. **International Users**
    - Data location (US/Vercel)
11. **Changes to Policy**
12. **Contact Us**

### Implementation

- Simple MDX pages at `/app/terms/page.tsx` and `/app/privacy/page.tsx`
- Or dynamic routes with markdown content
- Last updated date at top
- Clean, readable typography
- Table of contents for navigation

### Design Notes
- Match site aesthetic (dark theme)
- Clear section headings
- Good typography (readable body text)
- Sticky TOC on desktop (optional)
- Print-friendly styling

---

## Implementation Priority

### Phase 1: Legal (Required)
1. Terms of Service
2. Privacy Policy
3. Add footer links to both

### Phase 2: Documentation
1. Basic docs structure
2. Getting Started guide
3. Markdown Syntax reference
4. Add header link to docs

### Phase 3: Blog
1. Blog listing page
2. First post ("Introducing Riff")
3. RSS feed
4. Add header link

---

## Shared Components Needed

```
components/
  docs/
    DocsSidebar.tsx      # Navigation sidebar
    DocsLayout.tsx       # Page layout wrapper
    TableOfContents.tsx  # In-page TOC
  blog/
    BlogCard.tsx         # Post preview card
    BlogLayout.tsx       # Post page layout
  legal/
    LegalLayout.tsx      # Simple centered layout
  shared/
    Prose.tsx            # Styled markdown content
    Breadcrumb.tsx       # Navigation breadcrumb
```

---

## Questions to Decide

1. **Docs:** Single page vs multi-page? (Recommend: multi-page for SEO)
2. **Blog:** Start with blog or wait? (Recommend: Phase 3, after docs)
3. **Legal:** Custom written or use generator? (Recommend: Start with template, customize)
4. **Navigation:** Add to main nav or footer only? (Recommend: Footer + optional nav)

---

## File Structure Preview

```
app/
  docs/
    page.tsx                 # Docs landing
    layout.tsx               # Docs layout with sidebar
    [slug]/
      page.tsx               # Dynamic doc pages
  blog/
    page.tsx                 # Blog listing
    [slug]/
      page.tsx               # Individual posts
  terms/
    page.tsx                 # Terms of Service
  privacy/
    page.tsx                 # Privacy Policy

content/
  docs/
    getting-started.mdx
    markdown-syntax.mdx
    themes.mdx
    images.mdx
    presenting.mdx
    sharing.mdx
    importing.mdx
  blog/
    introducing-riff.mdx
    minimal-slides.mdx
  legal/
    terms.mdx
    privacy.mdx
```
