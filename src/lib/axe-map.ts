// Translation layer between axe-core's output and our schema.
// axe gives us `impact` ("critical" | "serious" | "moderate" | "minor")
// and `tags` (e.g. ["wcag2a", "wcag143"]). We normalise both.

import type { Severity } from "@prisma/client";

export function mapImpact(impact: string | null | undefined): Severity {
  switch (impact) {
    case "critical":
      return "CRITICAL";
    case "serious":
      return "SERIOUS";
    case "moderate":
      return "MODERATE";
    default:
      return "MINOR";
  }
}

// Pull a human-readable WCAG criterion (e.g. "1.4.3") out of axe tags
// like "wcag143". Returns ref + level. Falls back gracefully.
export function parseWcag(tags: string[]): { ref: string; level: string } {
  let level = "AA";
  if (tags.includes("wcag2a") || tags.includes("wcag21a") || tags.includes("wcag22a")) level = "A";
  if (tags.includes("wcag2aa") || tags.includes("wcag21aa") || tags.includes("wcag22aa")) level = "AA";
  if (tags.includes("wcag2aaa") || tags.includes("wcag21aaa")) level = "AAA";

  // criterion tags look like "wcag143" -> 1.4.3, or "wcag1411" -> 1.4.11
  const critTag = tags.find((t) => /^wcag\d{3,4}$/.test(t));
  let ref = "—";
  if (critTag) {
    const digits = critTag.replace("wcag", "");
    if (digits.length === 3) {
      ref = `${digits[0]}.${digits[1]}.${digits[2]}`;
    } else if (digits.length === 4) {
      // last two digits are the criterion number (e.g. 1.4.11)
      ref = `${digits[0]}.${digits[1]}.${digits.slice(2)}`;
    }
  }
  return { ref, level };
}

// Rules that automation genuinely cannot decide on its own get surfaced
// as "needs manual review" instead of being silently passed. Being honest
// about the ~30-40% of WCAG that isn't machine-testable is what separates
// a credible tool from one that gives false confidence.
const NEEDS_HUMAN_REVIEW = new Set<string>([
  "image-alt", // alt may exist but be meaningless
  "link-name", // link text may be present but unclear
  "label", // a label may exist but not describe the control
  "heading-order", // order may be valid but not logical
  "region", // landmark presence != correct structure
]);

export function needsReview(ruleId: string): boolean {
  return NEEDS_HUMAN_REVIEW.has(ruleId);
}
