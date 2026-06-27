// Seed sample data so the dashboard, site view, and inspector render
// immediately after setup — no need to wait for a live crawl. Uses the
// same shape the real scanner produces, including overlay boxes so the
// inspector demonstrates in-situ highlighting against a placeholder image.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean slate
  await prisma.issue.deleteMany();
  await prisma.page.deleteMany();
  await prisma.scan.deleteMany();
  await prisma.site.deleteMany();
  await prisma.project.deleteMany();

  const project = await prisma.project.create({
    data: { name: "Portfolio Demo" },
  });

  const site = await prisma.site.create({
    data: {
      projectId: project.id,
      name: "Acme Marketing Site",
      baseUrl: "https://example.com",
    },
  });

  // A few historical scans to populate the trend line.
  const history = [
    { daysAgo: 28, score: 58 },
    { daysAgo: 21, score: 64 },
    { daysAgo: 14, score: 71 },
    { daysAgo: 7, score: 79 },
  ];
  for (const h of history) {
    const when = new Date(Date.now() - h.daysAgo * 86400_000);
    await prisma.scan.create({
      data: {
        siteId: site.id,
        source: "LIVE_SITE",
        status: "COMPLETE",
        score: h.score,
        startedAt: when,
        finishedAt: when,
      },
    });
  }

  // Latest scan with real-shaped issues + overlay boxes.
  const latest = await prisma.scan.create({
    data: {
      siteId: site.id,
      source: "LIVE_SITE",
      status: "COMPLETE",
      score: 82,
      finishedAt: new Date(),
      pages: {
        create: [
          {
            url: "https://example.com/",
            title: "Home",
            score: 82,
            // points at a checked-in placeholder; replace with a real crawl screenshot
            screenshotPath: "/screenshots/sample-home.svg",
            issues: {
              create: [
                {
                  ruleId: "color-contrast",
                  wcagRef: "1.4.3",
                  wcagLevel: "AA",
                  severity: "SERIOUS",
                  needsReview: false,
                  help: "Text has insufficient contrast against its background.",
                  helpUrl: "https://dequeuniversity.com/rules/axe/4.10/color-contrast",
                  target: "header .tagline",
                  html: '<p class="tagline">Build better, faster</p>',
                  boxX: 120,
                  boxY: 230,
                  boxW: 420,
                  boxH: 36,
                },
                {
                  ruleId: "image-alt",
                  wcagRef: "1.1.1",
                  wcagLevel: "A",
                  severity: "CRITICAL",
                  needsReview: true,
                  help: "Image may be missing meaningful alternative text.",
                  helpUrl: "https://dequeuniversity.com/rules/axe/4.10/image-alt",
                  target: "main img.hero",
                  html: '<img class="hero" src="/hero.jpg">',
                  boxX: 80,
                  boxY: 360,
                  boxW: 1120,
                  boxH: 420,
                },
                {
                  ruleId: "label",
                  wcagRef: "4.1.2",
                  wcagLevel: "A",
                  severity: "SERIOUS",
                  needsReview: true,
                  help: "Form field may not have an accessible label.",
                  helpUrl: "https://dequeuniversity.com/rules/axe/4.10/label",
                  target: "form .newsletter input",
                  html: '<input type="email" placeholder="Email">',
                  boxX: 140,
                  boxY: 880,
                  boxW: 300,
                  boxH: 44,
                },
                {
                  ruleId: "link-name",
                  wcagRef: "2.4.4",
                  wcagLevel: "A",
                  severity: "MODERATE",
                  needsReview: true,
                  help: "Link has no discernible text.",
                  helpUrl: "https://dequeuniversity.com/rules/axe/4.10/link-name",
                  target: "footer a.icon",
                  html: '<a class="icon" href="/x"><svg></svg></a>',
                  boxX: 980,
                  boxY: 1180,
                  boxW: 40,
                  boxH: 40,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded project ${project.name}, site ${site.name}, latest scan ${latest.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
