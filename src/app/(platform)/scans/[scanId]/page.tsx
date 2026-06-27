import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { InspectorView } from "@/components/views/InspectorView";

export const dynamic = "force-dynamic";

export default async function ScanInspectorPage({
  params,
  searchParams,
}: {
  params: Promise<{ scanId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { scanId } = await params;
  const { page: pageId } = await searchParams;

  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: {
      site: true,
      pages: { include: { issues: { orderBy: { severity: "asc" } } } },
    },
  });
  if (!scan) notFound();

  const page = scan.pages.find((p) => p.id === pageId) ?? scan.pages[0] ?? null;

  return (
    <InspectorView
      scanId={scan.id}
      siteId={scan.siteId}
      siteName={scan.site.name}
      pages={scan.pages.map((p) => ({
        id: p.id,
        url: p.url,
        title: p.title,
        score: p.score,
      }))}
      activePageId={page?.id ?? null}
      screenshotPath={page?.screenshotPath ?? null}
      issues={page?.issues ?? []}
    />
  );
}
