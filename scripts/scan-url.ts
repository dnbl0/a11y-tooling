// Quick end-to-end proof of the engine, no DB or UI required.
// Usage: npm run scan -- https://example.com
//
// Prints a score and a grouped list of violations to the terminal.

import { scanUrl } from "../src/lib/scanner";
import { scorePage } from "../src/lib/scoring";

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: npm run scan -- <url>");
    process.exit(1);
  }

  console.log(`\nScanning ${url} ...\n`);
  const page = await scanUrl(url);
  const score = scorePage(page.issues);

  console.log(`Title:  ${page.title}`);
  console.log(`Score:  ${score}/100`);
  console.log(`Issues: ${page.issues.length}\n`);

  const bySeverity = new Map<string, number>();
  for (const i of page.issues) {
    bySeverity.set(i.severity, (bySeverity.get(i.severity) ?? 0) + 1);
  }
  for (const [sev, count] of bySeverity) {
    console.log(`  ${sev.padEnd(10)} ${count}`);
  }

  console.log("\nTop issues:");
  for (const i of page.issues.slice(0, 10)) {
    const flag = i.needsReview ? " [needs review]" : "";
    console.log(`  • [${i.severity}] ${i.ruleId} (WCAG ${i.wcagRef} ${i.wcagLevel})${flag}`);
    console.log(`    ${i.help}`);
    console.log(`    ${i.target}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
