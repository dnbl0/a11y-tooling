# Architecture

## Data flow

```
                        ┌─────────────────────┐
   Live site (URL) ───► │  Playwright + axe    │ ──┐
                        └─────────────────────┘   │
                        ┌─────────────────────┐   │   ┌──────────────────┐   ┌───────────┐
   Figma file      ───► │  Plugin (sandbox)    │ ──┼─► │ ScannedPage[]    │─► │ scan-     │
                        └─────────────────────┘   │   │ (normalised)     │   │ service   │
                        ┌─────────────────────┐   │   └──────────────────┘   └─────┬─────┘
   Components/CI   ───► │  axe in headless     │ ──┘                                │
                        └─────────────────────┘                                    ▼
                                                                          ┌──────────────────┐
                                                                          │ Postgres/SQLite  │
                                                                          │ Scan→Page→Issue  │
                                                                          └────────┬─────────┘
                                                                                   ▼
                                                                          ┌──────────────────┐
                                                                          │ Dashboard /      │
                                                                          │ Inspector        │
                                                                          └──────────────────┘
```

The key property: all three sources converge on the same `ScannedPage[]` shape before they touch the database. `src/server/scan-service.ts` is the single choke point for persistence and scoring, so adding a fourth source (a browser extension, say) means producing that shape and calling the same service.

## Data model

`Project → Site → Scan → Page → Issue`

- A **Scan** has a `source` (`LIVE_SITE | FIGMA | COMPONENT`) and a `status`. Scores are computed on completion.
- A **Page** is a crawled URL for live-site scans, or a frame name / story id for design-time scans. It owns a screenshot path (live-site only) and a per-page score.
- An **Issue** carries the axe rule id, the resolved WCAG criterion and level, a severity, a `needsReview` flag, the offending markup, a selector, and an optional bounding box for the inspector overlay.

## Scoring

Defined in `src/lib/scoring.ts`. Start at 100, subtract weighted penalties:

```
penalty = severityWeight × levelMultiplier × reviewDamping
```

- Severity weight: critical 10, serious 6, moderate 3, minor 1.
- Level multiplier: A ×1.5, AA ×1.0, AAA ×0.5 (failing a Level A criterion matters more).
- Review damping: ×0.4 for `needsReview` issues, since they're "verify", not "fail".

Page scores average up to a scan score. This is an original formula — deliberately not any commercial vendor's proprietary algorithm.

## Why "needs review" exists

axe-core can prove a contrast ratio fails. It cannot prove that `alt="image"` is *meaningful*, that a heading order is *logical*, or that a label *describes* its control. Rather than pass these silently (false confidence) or fail them outright (false positives), they're flagged for human verification and penalised lightly. The set lives in `src/lib/axe-map.ts`.

## Scaling roadmap

What the scaffold does **not** do yet, and how I'd add it:

1. **Multi-page crawling.** Today the worker scans one page. Add link discovery from the rendered DOM, respect `robots.txt`, cap crawl depth and page count, and dedupe URLs. Store the crawl frontier so large sites can resume.

2. **Real job queue.** The worker polls the DB, which is fine for a demo. Production wants BullMQ + Redis: enqueue scan jobs, run N Playwright workers in parallel, retry with backoff, and stream progress to the UI over SSE or websockets. Playwright is memory-heavy, so workers should be a separate, horizontally-scaled process — never in the request cycle.

3. **Auth + multi-tenancy.** Add Auth.js or Clerk, scope every query by organisation, and gate the ingest endpoints with per-project API keys (the Figma plugin and CI checker authenticate with those).

4. **Reports.** Per-stakeholder PDF/CSV export from scan data: an executive summary (score + trend), a developer view (issues grouped by rule with fixes), and a compliance view (WCAG criteria coverage).

5. **Regression alerts.** Compare each scan to the previous one for the same source; alert when the score drops or a new critical issue appears. This is what turns the tool from a snapshot into a guardrail.

6. **Screenshot storage.** Local disk works for the scaffold; move to object storage (S3/R2) with signed URLs in production, and capture element-level clips alongside the full-page shot for faster inspector loads.

## Trade-offs taken for the portfolio build

- **SQLite over Postgres** so `npm run db:push` just works with no external service. The schema is Postgres-ready; it's a one-line provider swap.
- **Polling worker over a queue** to avoid requiring Redis to see it run. The seam where a queue slots in is isolated to `workers/scan-worker.ts`.
- **Single-page scan** so the demo completes in seconds. Crawl logic is the obvious first extension and is called out in the worker.
