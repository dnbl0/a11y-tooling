# Auditr

Automated accessibility for designers and engineers. One WCAG scanning engine, three surfaces: a **live-site crawler**, a **Figma plugin** for design-time checks, and a **CI checker** for component-level regression gating. All three feed a single dashboard so a designer, a developer, and a manager see one source of truth.

This is a portfolio build. The product concept and UX patterns (score gauge, scan history, in-situ issue inspector) are modelled on the category leaders in web governance; the brand, copy, scoring formula, and code are original. The interface is built entirely on **Adobe Spectrum**.

## Why it's shaped this way

Most accessibility tools check one place. The interesting decision here is a **shared results model**: design-time findings (Figma), engineer-time findings (CI), and live-site findings all normalise to the same `Issue` shape and flow through the same scoring and persistence path. That's what lets the platform tell a coherent story across the whole delivery lifecycle instead of being three disconnected tools.

The second deliberate choice is **honesty about automation limits**. Roughly 30–40% of WCAG success criteria can't be machine-tested (whether alt text is *meaningful*, whether reading order is *logical*). Those are surfaced as "needs review" rather than silently passed, and they're penalised lightly in scoring. A tool that claims to fully automate accessibility is selling false confidence.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Adobe Spectrum** (`@adobe/react-spectrum`) for the entire UI — chosen deliberately: its components ship WCAG-compliant keyboard interaction, focus management, and ARIA via React Aria, so an accessibility tool is itself built on accessible foundations
- **Prisma** + SQLite for local dev (swap to Postgres for production)
- **Playwright** + **axe-core** for the scanning engine
- Score ring and trend chart are hand-rolled SVG (Spectrum has no radial gauge), styled with Spectrum design tokens so they track the theme

## Quick start

```bash
npm install
npx playwright install chromium     # one-time browser download
cp .env.example .env
npm run db:push                     # create the SQLite schema
npm run db:seed                     # load sample data so the UI isn't empty
npm run dev                         # http://localhost:3000
```

The whole app is wrapped in Spectrum's `Provider` (see `src/app/providers.tsx`), which sets the theme, locale, and wires Spectrum's `router` to Next so Spectrum links and table rows do client-side navigation while keeping their keyboard behaviour.

Open the dashboard, click the seeded site, then open a page to see the issue inspector with overlay boxes.

### Run a real scan

In a second terminal, start the worker, then queue a scan:

```bash
npm run worker                      # polls for queued scans
```

Queue one against the seeded site via the API (grab the siteId from the dashboard URL):

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"siteId":"<siteId>"}'
```

Or scan any URL straight from the terminal with no DB:

```bash
npm run scan -- https://example.com
```

## The three surfaces

### Live-site crawler (`src/lib/scanner.ts`, `workers/scan-worker.ts`)
Playwright loads a rendered page, injects axe-core, captures each violation with its WCAG criterion, a CSS selector, a bounding box, and a full-page screenshot. The worker persists results and computes scores. The scaffold scans a single page; extend `scan-worker.ts` with link discovery to walk the full site tree.

### Figma plugin (`packages/figma-plugin/`)
Runs in Figma's sandbox, walks the document tree, and checks what a design file actually knows: text contrast (full WCAG relative-luminance math), text size, and touch-target dimensions. Posts to `/api/sites/ingest` with `source: "FIGMA"`.

### CI checker (`packages/ci-checker/`)
Renders Storybook stories or component routes, runs axe against each, and fails the build when new serious+ violations appear. Optionally posts results to the dashboard with `source: "COMPONENT"`. Wired up as a GitHub Action in `.github/workflows/accessibility.yml`.

## Project layout

```
src/
  app/
    layout.tsx         root: shared Spectrum Provider only
    (marketing)/       public site — own header/footer, no app sidebar
      page.tsx         home (hero + sections)
      features/        the three surfaces, inspector, scoring
      pricing/         tiers + FAQ
      about/           story + principles
      contact/         Spectrum contact form
      privacy/ terms/  legal (original template text)
    (platform)/        logged-in app — wrapped in the sidebar AppShell
      dashboard/       overall score, trend, severity, site list
      sites/[siteId]/  scan history + pages for one site
      scans/[scanId]/  the issue inspector (signature screen)
    api/scan/          queue a live-site scan
    api/sites/ingest/  shared endpoint for Figma + CI results
    api/contact/       contact form submissions
  components/
    AppShell.tsx       Spectrum sidebar + content frame (platform)
    IssueInspector.tsx screenshot overlays + issue detail (Spectrum chrome)
    views/             DashboardView, SiteView, InspectorView (Spectrum client UIs)
    ui/primitives.tsx  SeverityBadge/ReviewBadge/WcagTag on Spectrum Badge
    charts/            ScoreRing + ScoreTrend (SVG, Spectrum tokens)
    marketing/         MarketingHeader, MarketingFooter, Hero, ContactForm,
                       elements + tokens (marketing layout on Spectrum tokens)
  lib/
    scanner.ts         Playwright + axe-core engine
    scoring.ts         original weighted scoring model
    axe-map.ts         axe -> schema translation + needs-review logic
  server/
    scan-service.ts    shared persistence + scoring for all three sources
prisma/
  schema.prisma        Project -> Site -> Scan -> Page -> Issue
  seed.ts              sample data
packages/
  figma-plugin/        design-time scanner
  ci-checker/          engineer-time scanner
workers/
  scan-worker.ts       background scan processor
docs/
  ARCHITECTURE.md      data flow + scaling notes
```

## Marketing site

The public surface lives in the `(marketing)` route group with its own header and footer. It reuses Spectrum's `Provider`, design tokens, and form components (the contact form is real Spectrum), but the persuasion-oriented layout pieces (hero, feature grids, pricing cards) are custom components styled with Spectrum tokens — the same approach Adobe takes for its own marketing pages, since Spectrum is an application design system, not a marketing one. The home hero leads with the product's core idea (issues caught in place) rather than a generic headline-and-stat template.

Pages: home, features, pricing, about, contact, privacy, terms. Legal pages are original plain-language templates, clearly marked as illustrative, not copied from any existing document.

## What I'd do next

See `docs/ARCHITECTURE.md` for the roadmap: multi-page crawling with depth limits, a real job queue (BullMQ + Redis), authentication and multi-tenancy, PDF report export, and trend-based regression alerts.

## License

MIT. axe-core is MPL-2.0 (Deque Systems).
