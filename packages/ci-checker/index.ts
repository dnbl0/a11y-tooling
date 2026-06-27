// CI checker (engineer-time scanner) — reference implementation.
//
// Renders a set of component URLs (Storybook stories or component routes) in
// headless Chromium, runs axe-core against each, and either:
//   • posts results to the platform (so they appear in the same dashboard), and/or
//   • fails the CI build when new violations are introduced.
//
// This is the piece that catches accessibility regressions before they ship,
// closing the loop: designers catch issues in Figma, engineers catch them in CI,
// and live-site scanning catches whatever slips through to production.
//
// Usage:
//   tsx packages/ci-checker/index.ts --config a11y.config.json
//   (or wire into a GitHub Action — see docs/CI.md)

import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf-8");

interface Config {
  baseUrl: string; // e.g. http://localhost:6006 for Storybook
  routes: string[]; // story paths or component routes
  failOn: "critical" | "serious" | "moderate" | "minor"; // build-fail threshold
  postTo?: { endpoint: string; siteId: string };
}

const SEV_ORDER = ["minor", "moderate", "serious", "critical"];

async function main() {
  const configPath =
    process.argv.includes("--config")
      ? process.argv[process.argv.indexOf("--config") + 1]
      : "a11y.config.json";

  const config: Config = JSON.parse(readFileSync(configPath, "utf-8"));
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  const pages = [];
  let worstSeverityIndex = -1;

  for (const route of config.routes) {
    const url = `${config.baseUrl}${route}`;
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(axeSource);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = await page.evaluate(async () => {
      // @ts-expect-error injected at runtime
      return await window.axe.run(document, { resultTypes: ["violations"] });
    });
    await page.close();

    const issues = [];
    for (const v of results.violations ?? []) {
      const sevIdx = SEV_ORDER.indexOf(v.impact ?? "minor");
      if (sevIdx > worstSeverityIndex) worstSeverityIndex = sevIdx;
      for (const node of v.nodes ?? []) {
        issues.push({
          ruleId: v.id,
          impact: v.impact,
          help: v.help,
          target: Array.isArray(node.target) ? node.target.join(" ") : String(node.target),
        });
      }
    }

    pages.push({ url: route, title: route, issues });
    const status = issues.length === 0 ? "PASS" : `${issues.length} issues`;
    console.log(`  ${route.padEnd(40)} ${status}`);
  }

  await browser.close();

  // Optionally push to the platform.
  if (config.postTo) {
    // Map to the platform's ingest shape (COMPONENT source).
    const payload = {
      siteId: config.postTo.siteId,
      source: "COMPONENT",
      pages: pages.map((p) => ({
        url: p.url,
        title: p.title,
        screenshotPath: null,
        issues: p.issues.map((i) => ({
          ruleId: i.ruleId,
          wcagRef: "—",
          wcagLevel: "AA",
          severity: (i.impact ?? "minor").toUpperCase(),
          needsReview: false,
          help: i.help ?? i.ruleId,
          helpUrl: "",
          target: i.target,
          html: "",
        })),
      })),
    };
    try {
      const res = await fetch(config.postTo.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(`\nPosted to platform. Scan score: ${data.score ?? "?"}`);
    } catch (e) {
      console.warn(`\nCould not post results: ${(e as Error).message}`);
    }
  }

  // Fail the build if anything met or exceeded the threshold.
  const failIdx = SEV_ORDER.indexOf(config.failOn);
  if (worstSeverityIndex >= failIdx) {
    console.error(`\n✗ Build failed: found ${SEV_ORDER[worstSeverityIndex]} issues (threshold: ${config.failOn}).`);
    process.exit(1);
  }
  console.log(`\n✓ No issues at or above "${config.failOn}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
