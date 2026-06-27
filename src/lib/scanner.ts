// Live-site scanner. Drives a headless Chromium with Playwright, injects
// axe-core into the rendered page, runs the audit, and captures everything
// the inspector UI needs: the violation, the offending node, a selector,
// a bounding box for the overlay, and a full-page screenshot.
//
// This is deliberately framework-agnostic: it returns plain objects that
// the worker persists. The same shape is what the Figma plugin and CI
// checker produce, so all three feed one results model.

import { chromium, type Browser } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { mapImpact, parseWcag, needsReview } from "./axe-map";
import type { Severity } from "@prisma/client";

const require = createRequire(import.meta.url);
// Resolve the bundled axe-core source so we can inject it into any page.
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf-8");

export interface ScannedIssue {
  ruleId: string;
  wcagRef: string;
  wcagLevel: string;
  severity: Severity;
  needsReview: boolean;
  help: string;
  helpUrl: string;
  target: string;
  html: string;
  box?: { x: number; y: number; w: number; h: number };
}

export interface ScannedPage {
  url: string;
  title: string;
  screenshotPath: string | null;
  issues: ScannedIssue[];
}

interface ScanOptions {
  screenshotDir?: string; // absolute path; if omitted, no screenshot
  screenshotName?: string; // file name without extension
  timeoutMs?: number;
}

export async function scanUrl(
  url: string,
  opts: ScanOptions = {},
): Promise<ScannedPage> {
  const { timeoutMs = 30000 } = opts;
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ args: ["--no-sandbox"] });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    const title = await page.title();

    // Inject and run axe in the page context.
    await page.evaluate(axeSource);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = await page.evaluate(async () => {
      // @ts-expect-error axe is injected at runtime
      return await window.axe.run(document, {
        resultTypes: ["violations"],
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      });
    });

    const issues: ScannedIssue[] = [];

    for (const v of results.violations ?? []) {
      const { ref, level } = parseWcag(v.tags ?? []);
      for (const node of v.nodes ?? []) {
        const selector = Array.isArray(node.target)
          ? node.target.join(" ")
          : String(node.target ?? "");

        // Measure the element so the inspector can draw an overlay box.
        let box: ScannedIssue["box"];
        try {
          const handle = await page.$(selector);
          if (handle) {
            const bb = await handle.boundingBox();
            if (bb) box = { x: Math.round(bb.x), y: Math.round(bb.y), w: Math.round(bb.width), h: Math.round(bb.height) };
          }
        } catch {
          // selector may be non-standard (axe shadow-dom paths); skip box
        }

        issues.push({
          ruleId: v.id,
          wcagRef: ref,
          wcagLevel: level,
          severity: mapImpact(v.impact),
          needsReview: needsReview(v.id),
          help: v.help ?? v.description ?? v.id,
          helpUrl: v.helpUrl ?? "",
          target: selector,
          html: (node.html ?? "").slice(0, 600),
          box,
        });
      }
    }

    let screenshotPath: string | null = null;
    if (opts.screenshotDir && opts.screenshotName) {
      const file = `${opts.screenshotName}.png`;
      await page.screenshot({
        path: `${opts.screenshotDir}/${file}`,
        fullPage: true,
      });
      screenshotPath = `/screenshots/${file}`;
    }

    await context.close();
    return { url, title, screenshotPath, issues };
  } finally {
    if (browser) await browser.close();
  }
}
