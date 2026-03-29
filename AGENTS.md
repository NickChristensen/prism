# AGENTS.md — Prism

Context for AI agents working in this repo.

## What is Prism?

Prism is a rich content renderer for OpenClaw. It's a Next.js app running on a Mac Mini that serves dynamic, data-driven UI pages — linked from Telegram messages as Telegram Web App buttons or plain HTTPS links.

The goal: instead of squeezing complex data into Telegram's 40-char-wide text renderer, Claudette (the OpenClaw AI) generates a rich UI spec and sends a link. The user taps the link and sees a proper dashboard, chart, calendar view, etc.

## Architecture

### The flow

1. Claudette decides a rich view is warranted (briefing, workout summary, stock view, etc.)
2. Claudette generates a JSON spec (standalone json-render format)
3. Spec is written to `data/<messageId>.json` on the Mac Mini
4. Next.js dynamic route at `/rich/[id]` reads the spec and renders it
5. Claudette sends a Telegram message with a short text summary + link to the page

### Key design decisions

- **Standalone generation mode** — Claudette produces pure JSON (no prose mixed in). The spec and the Telegram text summary are two separate things.
- **No streaming** — We're not streaming patches from AI to browser in real-time. The full spec is generated, written, then served. Simple batch pattern.
- **Dynamic routes, not static export** — New "pages" are just new data files. No rebuild needed per message. The route is defined once; data changes per request.
- **Durable pages** — Each message gets its own spec file and URL. Old pages stay accessible.

## Stack

- **Next.js 15** — App Router, TypeScript, `src/` dir, `@/*` alias
- **Tailwind CSS** — Styling
- **@json-render/shadcn** — 36 pre-built shadcn/ui components (Radix UI + Tailwind). This is the standard toolbox.
- **@json-render/react** — React renderer (shadcn package builds on this)
- **@json-render/core** — Catalog definitions, Zod schemas, prompt generation

## Component Strategy

### Standard toolbox (from @json-render/shadcn)

Card, Stack, Grid, Table, Tabs, Accordion, Badge, Alert, Progress, Avatar, Dialog, Drawer, Separator, Heading, Text, and ~20 more. Use these for generic layout and data display.

### Custom components (to be built)

These are domain-specific and will be registered in the catalog alongside the shadcn components:

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
  → writes to ~/code/prism/data/<messageId>.json
  → sends Telegram message: "Here's your briefing [Open in Prism →]"

User taps link
  → https://<prism-host>/rich/<messageId>
  → Next.js reads data/<messageId>.json
  → Renders via json-render + shadcn + custom components
```

## Hosting

Running on a Mac Mini (headless). Needs a public HTTPS URL for Telegram to open pages in its in-app browser. Options being evaluated:

- **Cloudflare Tunnel** — simplest, free, no port forwarding needed
- **Tailscale Funnel** — good for private/trusted access

TBD which one we go with.

## Spec Format

Claudette generates specs in the json-render JSONL patch format (RFC 6902 patches, standalone mode). Each spec targets the registered catalog — Claudette can only use components that exist in the catalog.

Example minimal spec (conceptual):

```json
{ "op": "add", "path": "/root", "value": { "type": "Stack", "props": { "direction": "vertical", "gap": "md" } } }
{ "op": "add", "path": "/elements/0", "value": { "type": "Heading", "props": { "text": "Morning Briefing", "level": "h1" } } }
{ "op": "add", "path": "/elements/1", "value": { "type": "BriefingCard", "props": { ... } } }
```

## Development Notes

- The catalog definition is the source of truth. If a component isn't in the catalog, Claudette can't use it.
- Each custom component needs: a Zod props schema, a description (this goes into the AI prompt), and an example (helps the AI know how to use it).
- Keep component props flat and serializable — no functions, no JSX in the spec.
- The `data/` directory is gitignored (runtime content, not source).

## Project Context

- **Owner:** Nick Christensen (@NickChristensen)
- **Integrated with:** OpenClaw (personal AI assistant framework), Telegram
- **AI agent:** Claudette (Claude Sonnet, running as OpenClaw main agent)
- **Related OpenClaw workspace:** `~/.openclaw/workspace` (do not touch)
