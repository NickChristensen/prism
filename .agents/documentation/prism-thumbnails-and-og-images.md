# Prism Thumbnails and OG Images

## Why this is non-trivial

Prism specs are loaded on the server in [`src/app/[id]/page.tsx`](/Users/louie/code/prism/src/app/[id]/page.tsx), but the actual spec rendering crosses into a client boundary at [`src/components/app/prism-renderer.tsx`](/Users/louie/code/prism/src/components/app/prism-renderer.tsx), which is marked `"use client"`.

That means Prism cannot currently reuse the existing page renderer as a pure server-side image generator.

## Current architecture constraint

- The page route is a Server Component and reads spec files from `~/.openclaw/media/prism/<id>.jsonl`.
- The render tree then passes into `PrismRenderer`.
- `PrismRenderer` uses `JSONUIProvider` and `Renderer` from `@json-render/react` inside a client component tree.

Result: Prism is not currently "entirely server-rendered" from the point where the spec becomes UI.

## Main options

### 1. Headless browser screenshots

Generate thumbnails by opening the real page in Playwright or Puppeteer and taking a screenshot.

Pros:
- Closest possible match to the actual rendered UI
- Works with the current architecture
- Reuses the real page rather than building a second renderer

Cons:
- Requires a browser runtime
- Slower and heavier than pure server image generation
- Needs caching and invalidation

This is the most practical option if the goal is accurate thumbnails.

### 2. Dedicated OG image renderer

Build a separate image-oriented renderer for a subset of the spec format using `ImageResponse`, SVG, or another server-side drawing path.

Pros:
- Fast
- No browser dependency
- Good fit for `og:image`

Cons:
- Does not match the real page exactly
- Requires maintaining a second renderer
- Complex components need fallback behavior

This is a good option if social previews matter more than exact visual fidelity.

### 3. Move more rendering server-side

Try to make the spec renderer itself server-compatible.

Pros:
- In theory, one render path for page and image generation

Cons:
- Likely a significant architecture change
- May conflict with how `@json-render/react` and interactive shadcn components work today
- High effort relative to the likely payoff

This is not the recommended short-term path.

## Recommended direction

Start with a screenshot cache pipeline.

Suggested flow:

1. Read the spec from `~/.openclaw/media/prism/<id>.jsonl`
2. Compare the spec file modification time to a cached image
3. If the cache is fresh, serve it
4. If not, open `/<id>` in a headless browser and capture a screenshot
5. Store the PNG and reuse it for both the index page and `og:image`

Suggested cache location:

- Spec: `~/.openclaw/media/prism/<id>.jsonl`
- Thumbnail cache: `~/.openclaw/media/prism-cache/<id>.png`

## Why this is the best first step

- It works with the current client-rendered UI
- It avoids rewriting the renderer
- It can support both homepage thumbnails and social preview images
- It keeps the spec as the source of truth

## OG image caveat

Even if Prism can generate images locally, external link previews usually require a publicly reachable HTTPS URL for the page and image. Tailscale-only HTTP will not be sufficient for general crawler access.

## Good future implementation targets

- A thumbnail route that serves cached screenshots
- Homepage cards that display cached thumbnails
- Metadata wiring so each spec page can expose an `og:image`
- Cache invalidation based on the spec file modification time

