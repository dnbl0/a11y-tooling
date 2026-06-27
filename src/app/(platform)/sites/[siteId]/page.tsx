import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SiteView } from "@/components/views/SiteView";

export const dynamic = "force-dynamic";

export default async function SitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      scans: {
        orderBy: { startedAt: "desc" },
        include: { pages: { include: { issues: true } } },
      },
    },
  });

  if (!site) notFound();

  const latest = site.scans.find((s) => s.status === "COMPLETE") ?? null;

  const scanRows = site.scans.map((scan) => ({
    id: scan.id,
    source: scan.source,
    status: scan.status,
    score: scan.score,
    startedAt: scan.startedAt.toLocaleString(),
    pageCount: scan.pages.length,
    issueCount: scan.pages.reduce((n, p) => n + p.issues.length, 0),
  }));

  const pageRows =
    latest?.pages.map((p) => ({
      id: p.id,
      scanId: latest.id,
      url: p.url,
      title: p.title,
      score: p.score,
      issueCount: p.issues.length,
    })) ?? [];

  return (
    <SiteView
      name={site.name}
      baseUrl={site.baseUrl}
      ring={latest?.score != null ? <ScoreRing score={latest.score} label="latest scan" /> : null}
      scanRows={scanRows}
      pageRows={pageRows}
    />
  );
}
