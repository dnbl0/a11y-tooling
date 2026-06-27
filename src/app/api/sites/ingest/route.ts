import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { persistResults } from "@/server/scan-service";
import type { ScannedPage } from "@/lib/scanner";

// Shared ingest endpoint for design-time sources (Figma plugin, CI checker).
// They produce the same ScannedPage shape as the live-site scanner, so they
// share the exact same persistence + scoring path. This is the integration
// seam that unifies design-time and live-site results.

const IssueSchema = z.object({
  ruleId: z.string(),
  wcagRef: z.string(),
  wcagLevel: z.string(),
  severity: z.enum(["CRITICAL", "SERIOUS", "MODERATE", "MINOR"]),
  needsReview: z.boolean().default(false),
  help: z.string(),
  helpUrl: z.string().optional().default(""),
  target: z.string(),
  html: z.string().default(""),
  box: z
    .object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })
    .optional(),
});

const Body = z.object({
  siteId: z.string(),
  source: z.enum(["FIGMA", "COMPONENT"]),
  pages: z.array(
    z.object({
      url: z.string(), // frame name or story id
      title: z.string().default(""),
      screenshotPath: z.string().nullable().default(null),
      issues: z.array(IssueSchema),
    }),
  ),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { siteId, source, pages } = parsed.data;

  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return NextResponse.json({ error: "site not found" }, { status: 404 });

  const scan = await prisma.scan.create({
    data: { siteId, source, status: "RUNNING" },
  });

  const score = await persistResults(scan.id, pages as ScannedPage[]);
  return NextResponse.json({ scanId: scan.id, score });
}
