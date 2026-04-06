# Alventosa Morell Arquitectes

Portfolio website for [Alventosa Morell Arquitectes](https://www.alventosamorell.com), a Mallorca-based architecture firm. Built with Next.js 16 and Sanity CMS, deployed on Vercel.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **CMS:** Sanity v3 with GROQ, real-time visual editing, and Presentation Tool
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** Vercel
- **Smooth Scroll:** Lenis

## Architecture

The app follows a monorepo structure with two workspaces:

```
├── nextjs-app/          # Next.js frontend
│   ├── app/
│   │   ├── components/  # 29 UI components (block renderers, navigation, overlays)
│   │   ├── context/     # Client-side state (language, filters, image slider, project category)
│   │   ├── projects/    # Dynamic [slug] routes + grid/index views
│   │   ├── about/
│   │   ├── sitemap.ts
│   │   ├── image-sitemap.xml/  # Google Image Sitemap (route handler)
│   │   └── robots.ts
│   └── sanity/          # Client, queries, utils
└── studio/              # Sanity Studio
    └── src/schemaTypes/
        ├── documents/   # project
        ├── singletons/  # home, about, settings
        └── objects/     # 12 block types (coverImage, diptychImage, etc.)
```

## Key Implementations

### Block-Based Page Builder

Project pages are composed from a modular `builder[]` array in Sanity, rendered via a `BlockRenderer` that maps `_type` strings to React components:

- `coverImage` — Full-bleed hero with responsive desktop/mobile variants
- `coverVideo` — Vimeo background video embed with autoplay
- `diptychImage` — Two-column layout with optional hover states
- `monoptychImage` — Single centered image with lightbox
- `imageCarousel` — Multi-image slider
- `projectSummary`, `projectInfo`, `textBlock` — Content blocks

Each block type supports localized alt text (ca/es/en) and is clickable into a full-screen `PopupSlider` lightbox powered by a shared `ImageSliderContext`.

### Trilingual Content (ca/es/en)

The site supports Catalan, Spanish, and English through a client-side `LanguageContext`. All text content — including navigation labels, project descriptions, alt text, and SEO fields — uses a `{ ca, es, en }` object pattern in Sanity, resolved at render time via a `getTranslation()` utility. Language preference persists in `localStorage`.

### ISR (Incremental Static Regeneration)

All pages are statically generated at build time and revalidate every 60 seconds. The architecture separates server components (pages with `generateMetadata` and data fetching) from client components (interactive UI), allowing full SSR metadata while keeping the interactive experience client-side.

### SEO

- **Dynamic metadata** per page from Sanity, with trilingual SEO title/description/image fields behind a collapsible Studio UI
- **Canonical URLs** on every route to prevent duplicate content indexing
- **XML Sitemap** generated from Sanity project data with `lastModified` timestamps
- **Google Image Sitemap** — Custom route handler that queries all project builder blocks via GROQ, extracts every image reference (cover, diptych, monoptych, carousel, featured), converts Sanity asset `_ref` strings to CDN URLs, and serves a valid `<image:image>` sitemap with titles and captions
- **Schema.org JSON-LD** — `ArchitectureFirm` on the root layout, `BreadcrumbList` on project pages
- **Server-rendered navigation** — `<nav>` with internal links in the layout for crawler discoverability, independent of client-side JS hydration
- **robots.txt** with sitemap references

### Security Headers

Full security header suite via `next.config.ts`:

- Content-Security-Policy (with allowlists for Sanity CDN, Vimeo player, Vercel)
- X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy

### Image Optimization

- Next.js `<Image>` with AVIF/WebP format negotiation
- Responsive `sizes` attributes tuned per component (grid thumbnails, hero images, carousels)
- Sanity CDN pre-sizing via `urlForImage().width()` to avoid serving full-resolution originals
- 7-day CDN cache TTL for optimized variants
- Immutable cache headers for static font and image assets

### Custom Scroll & Animation

The homepage features a custom horizontal scroll gallery with:

- RAF-based cubic easing animation for snap-scrolling between featured projects
- Wheel event interception with cooldown debouncing
- Keyboard navigation (arrow keys)
- Welcome overlay animation on first visit (stored in `sessionStorage`)
- Responsive breakpoints: horizontal scroll on desktop, vertical snap scroll on mobile

## Development

```bash
# From the root
npm run dev     # Starts both Next.js (localhost:3000) and Studio (localhost:3333)
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
```
