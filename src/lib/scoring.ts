// Original scoring model. NOT Silktide's algorithm (that's proprietary).
// Approach: start at 100, subtract weighted penalties per issue, floor at 0.
// Weights reflect both severity and conformance level. Issues flagged
// needsReview are penalised lightly because they're "verify", not "fail".

import type { Severity } from "@prisma/client";

const SEVERITY_WEIGHT: Record<Severity, number> = {
  CRITICAL: 10,
  SERIOUS: 6,
  MODERATE: 3,
  MINOR: 1,
};

const LEVEL_MULTIPLIER: Record<string, number> = {
  A: 1.5, // failing a Level A criterion is more serious
  AA: 1.0,
  AAA: 0.5,
};

export interface ScorableIssue {
  severity: Severity;
  wcagLevel: string;
  needsReview: boolean;
}

export function scorePage(issues: ScorableIssue[]): number {
  let penalty = 0;
  for (const issue of issues) {
    const base = SEVERITY_WEIGHT[issue.severity] ?? 1;
    const mult = LEVEL_MULTIPLIER[issue.wcagLevel] ?? 1;
    const reviewDamping = issue.needsReview ? 0.4 : 1;
    penalty += base * mult * reviewDamping;
  }
  // Soft curve so a page with a handful of minor issues isn't nuked.
  const raw = 100 - penalty;
  return Math.max(0, Math.round(raw));
}

export function scoreScan(pageScores: number[]): number {
  if (pageScores.length === 0) return 100;
  const sum = pageScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / pageScores.length);
}
