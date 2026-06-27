import { prisma } from "@/lib/db";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { ScoreTrend, type TrendPoint } from "@/components/charts/ScoreTrend";
import { DashboardView } from "@/components/views/DashboardView";
import type { Severity } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const sites = await prisma.site.findMany({
    include: {
      scans: {
        where: { status: "COMPLETE" },
        orderBy: { finishedAt: "desc" },
        include: { pages: { include: { issues: true } } },
      },
    },
  });

  const latestScores: number[] = [];
  const sevCounts: Record<Severity, number> = {
    CRITICAL: 0,
    SERIOUS: 0,
    MODERATE: 0,
    MINOR: 0,
  };
  const trend: TrendPoint[] = [];

  for (const site of sites) {
    const latest = site.scans[0];
    if (latest?.score != null) latestScores.push(latest.score);
    for (const scan of [...site.scans].reverse()) {
      if (scan.score != null && scan.finishedAt) {
        trend.push({
          date: scan.finishedAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          score: scan.score,
        });
      }
      for (const page of scan.pages) {
        for (const issue of page.issues) sevCounts[issue.severity]++;
      }
    }
  }

  const overall =
    latestScores.length > 0
      ? Math.round(latestScores.reduce((a, b) => a + b, 0) / latestScores.length)
      : 100;

  const totalIssues = Object.values(sevCounts).reduce((a, b) => a + b, 0);

  const siteRows = sites.map((s) => {
    const latest = s.scans[0];
    return {
      id: s.id,
      name: s.name,
      baseUrl: s.baseUrl,
      source: latest?.source ?? null,
      score: latest?.score ?? null,
    };
  });

  return (
    <DashboardView
      siteCount={sites.length}
      overall={overall}
      sevCounts={sevCounts}
      totalIssues={totalIssues}
      siteRows={siteRows}
      ring={<ScoreRing score={overall} label="overall" />}
      trend={trend.length > 1 ? <ScoreTrend data={trend} /> : null}
      trendCount={trend.length}
    />
  );
}
