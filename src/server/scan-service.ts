// Persistence + scoring orchestration shared by all three scan sources.
// The worker (live-site), the Figma plugin endpoint, and the CI endpoint
// all funnel ScannedPage[] through here, which is what keeps the data model
// unified.

import { prisma } from "@/lib/db";
import { scorePage, scoreScan } from "@/lib/scoring";
import type { ScannedPage } from "@/lib/scanner";
import type { ScanSource } from "@prisma/client";

export async function createScan(siteId: string, source: ScanSource) {
  return prisma.scan.create({
    data: { siteId, source, status: "RUNNING" },
  });
}

export async function persistResults(scanId: string, pages: ScannedPage[]) {
  const pageScores: number[] = [];

  for (const p of pages) {
    const score = scorePage(p.issues);
    pageScores.push(score);

    await prisma.page.create({
      data: {
        scanId,
        url: p.url,
        title: p.title,
        score,
        screenshotPath: p.screenshotPath,
        issues: {
          create: p.issues.map((i) => ({
            ruleId: i.ruleId,
            wcagRef: i.wcagRef,
            wcagLevel: i.wcagLevel,
            severity: i.severity,
            needsReview: i.needsReview,
            help: i.help,
            helpUrl: i.helpUrl || null,
            target: i.target,
            html: i.html,
            boxX: i.box?.x ?? null,
            boxY: i.box?.y ?? null,
            boxW: i.box?.w ?? null,
            boxH: i.box?.h ?? null,
          })),
        },
      },
    });
  }

  const score = scoreScan(pageScores);
  await prisma.scan.update({
    where: { id: scanId },
    data: { status: "COMPLETE", score, finishedAt: new Date() },
  });

  return score;
}

export async function failScan(scanId: string, error: string) {
  await prisma.scan.update({
    where: { id: scanId },
    data: { status: "FAILED", error, finishedAt: new Date() },
  });
}
