// Scan worker. In production this would pull jobs off a queue (BullMQ + Redis)
// so long-running Playwright crawls never block the request cycle. For the
// portfolio build it runs a simple polling loop against the DB: picks up
// QUEUED live-site scans, crawls, persists, marks complete.
//
// Run with: npm run worker

import { prisma } from "../src/lib/db";
import { scanUrl } from "../src/lib/scanner";
import { persistResults, failScan } from "../src/server/scan-service";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");
const POLL_MS = 2000;

async function processOne() {
  const scan = await prisma.scan.findFirst({
    where: { status: "QUEUED", source: "LIVE_SITE" },
    include: { site: true },
    orderBy: { startedAt: "asc" },
  });
  if (!scan) return false;

  console.log(`[worker] picking up scan ${scan.id} for ${scan.site.baseUrl}`);
  await prisma.scan.update({ where: { id: scan.id }, data: { status: "RUNNING" } });

  try {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    // Single-page crawl for the scaffold. Extend with link discovery to
    // walk the site tree (respect robots.txt, cap depth + page count).
    const page = await scanUrl(scan.site.baseUrl, {
      screenshotDir: SCREENSHOT_DIR,
      screenshotName: scan.id,
    });
    const score = await persistResults(scan.id, [page]);
    console.log(`[worker] scan ${scan.id} complete — score ${score}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[worker] scan ${scan.id} failed:`, message);
    await failScan(scan.id, message);
  }
  return true;
}

async function loop() {
  console.log("[worker] started, polling for queued scans...");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const did = await processOne();
    if (!did) await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

loop().catch((err) => {
  console.error("[worker] fatal:", err);
  process.exit(1);
});
