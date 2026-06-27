import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  siteId: z.string(),
});

// POST /api/scan — queue a live-site scan. The worker picks it up.
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "siteId required" }, { status: 400 });
  }

  const site = await prisma.site.findUnique({ where: { id: parsed.data.siteId } });
  if (!site) {
    return NextResponse.json({ error: "site not found" }, { status: 404 });
  }

  const scan = await prisma.scan.create({
    data: { siteId: site.id, source: "LIVE_SITE", status: "QUEUED" },
  });

  return NextResponse.json({ scanId: scan.id, status: scan.status });
}
