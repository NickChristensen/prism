# AGENTS.md — Prism

Context for AI agents working in this repo.

## What is Prism?

Prism is a rich content renderer for OpenClaw. It's a Next.js app running on a Mac Mini that serves dynamic, data-driven UI pages — linked from Telegram messages as Telegram Web App buttons or plain HTTPS links.

The goal: instead of squeezing complex data into Telegram's 40-char-wide text renderer, Claudette (the OpenClaw AI) generates a rich UI spec and sends a link. The user taps the link and sees a proper dashboard, chart, calendar view, etc.

## Architecture

### The flow

1. Claudette decides a rich view is warranted (briefing, workout summary, stock view, etc.)
2. Claudette generates a JSON spec
3. Spec is written to `~/.openclaw/media/prism/<messageId>.json` on the Mac Mini
4. Next.js dynamic route at `/[id]` reads the spec and renders it
5. Claudette sends a Telegram message with a short text summary + link to the page

### Key design decisions

- **Standalone generation mode** — Claudette produces pure JSON (no prose mixed in). The spec and the Telegram text summary are two separate things.
- **No streaming** — We're not streaming patches from AI to browser in real-time. The full spec is generated, written, then served. Simple batch pattern.
- **Dynamic routes, not static export** — New "pages" are just new data files. No rebuild needed per message. The route is defined once; data changes per request.
- **Durable pages** — Each message gets its own spec file and URL. Old pages stay accessible.

## Stack

- **Next.js 16** — App Router, TypeScript, `src/` dir, `@/*` alias
- **Tailwind CSS** — Styling
- **@json-render/shadcn** — 36 pre-built shadcn/ui components (Radix UI + Tailwind). This is the standard toolbox.
- **@json-render/react** — React renderer (shadcn package builds on this)
- **@json-render/core** — Catalog definitions, Zod schemas, prompt generation

## Component Strategy

### Standard toolbox (from @json-render/shadcn)

Card, Stack, Grid, Table, Tabs, Accordion, Badge, Alert, Progress, Avatar, Dialog, Drawer, Separator, Heading, Text, and ~20 more. Use these for generic layout and data display.

### Custom components (to be built)

These are domain-specific and will be registered in the catalog alongside the shadcn components. Two tiny general-purpose list components already exist as examples: `BulletList` and `NumberedList`.

Likely next domain components:

- **CalendarDayView** — Events for a given day (from Google Calendar / Home Assistant)
- **ThingsTodoList** — Things 3 tasks, grouped by area/project
- **EmailSummary** — A digest of emails with sender, subject, snippet
- **MessageThread** — iMessage/SMS thread view
- **NutrientSummary** — Macro/micro breakdown from Apple Health
- **WorkoutSummary** — Workout details (type, duration, heart rate, etc.)
- **StockChart** — Price chart with % change, maybe Recharts under the hood
- **BriefingCard** — Structured morning briefing layout

### Catalog

All components (standard + custom) are registered in a single catalog via `defineCatalog()`. The catalog auto-generates the system prompt that Claudette uses to produce valid specs. The Zod schemas on each component definition are what constrain the AI output.

## Data Flow

```
Claudette (OpenClaw)
  → generates spec JSON
  → writes to ~/.openclaw/media/prism/<messageId>.json
  → sends Telegram message with a Prism link

User taps link
  → http(s)://<prism-host>/<messageId>
  → Next.js reads ~/.openclaw/media/prism/<messageId>.json
  → Renders via json-render + shadcn + custom components
```

## Runtime vs Build-Time Rule

This distinction matters:

- **Changing or adding JSON spec files** in `~/.openclaw/media/prism/` does **not** require a rebuild. Prism reads those files at request time.
- **Changing catalog, registry, or React component code** **does** require rebuilding and restarting the production server, because `next start` serves the compiled app.

Examples:
- New page at `~/.openclaw/media/prism/foo.json` → no rebuild needed
- Add `BulletList` component to registry → rebuild + restart required
- Change styling in `src/components/...` → rebuild + restart required

## Hosting

Running on a Mac Mini (headless).

Current state:
- Prism runs in **production mode** under launchd
- LaunchAgent label: `ai.nick.prism`
- Runner script in repo: `scripts/run-prod.sh`
- Tailscale hostname works for private access: `http://macmini.pony-rattlesnake.ts.net:60001/<id>`

Important:
- **Tailscale-only HTTP is fine for Nick's private use and testing**
- **Telegram Mini Apps / web_app flows require HTTPS**, so a public HTTPS endpoint will still be needed for that phase

Likely HTTPS options when needed:
- **Cloudflare Tunnel** — simplest, free, no port forwarding needed
- **Tailscale Funnel** — good if staying closer to the tailnet model

## Spec Format

The **canonical format** for Prism specs should remain the default json-render format (JSONL patches / flat element-map-oriented workflow), since that is what json-render itself expects and what tuned generation should target.

Prism currently has compatibility code that can accept nested JSON and convert it on read, but treat that as a convenience/fallback — not the primary contract to design around.

Each rendered spec still targets the registered catalog — Claudette can only use components that exist in the catalog.

## Development Notes

- The catalog definition is the source of truth. If a component isn't in the catalog, Claudette can't use it.
- Each custom component needs: a Zod props schema and a description. The schema defines what props the AI may pass.
- Prefer colocating each custom component's Zod props schema, inferred TypeScript props type, and exported catalog definition in the component file itself, then importing that definition into `src/lib/catalog.ts`. This keeps the AI-facing contract and runtime props in one place and avoids schema/type drift.
- Keep app-owned components and catalog components in separate folders: place custom json-render/catalog components in `src/components/catalog/` and Prism app infrastructure components in `src/components/app/`.
- Runtime component implementations receive `BaseComponentProps<T>` from `@json-render/react`; in practice you define the props schema in the catalog and then use `props` however you want in the component.
- Keep component props flat and serializable — no functions, no JSX in the spec.
- `@import` and `@source` do different jobs in Tailwind v4:
  - `@import` includes CSS files
  - `@source` tells Tailwind where to scan for class names
- Important Tailwind v4 gotcha: because `@json-render/shadcn` ships utility classes inside component code, Prism needs `@source "../../node_modules/@json-render/shadcn/dist";` in `src/app/globals.css` so those classes are emitted in the compiled CSS.
- Runtime content lives outside the repo in `~/.openclaw/media/prism/`.

## Project Context

- **Owner:** Nick Christensen (@NickChristensen)
- **Integrated with:** OpenClaw (personal AI assistant framework), Telegram
- **AI agent:** Claudette (Claude Sonnet, running as OpenClaw main agent)
- **Related OpenClaw workspace:** `~/.openclaw/workspace` (do not touch)
