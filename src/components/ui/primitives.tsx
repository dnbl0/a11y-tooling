// Shared display primitives, now built on Spectrum components so they inherit
// its semantics and theming. Severity maps to Spectrum's Badge variants;
// "needs review" uses an info Badge; WCAG references use a neutral Tag-like chip.

import { Badge } from "@adobe/react-spectrum";
import type { Severity } from "@prisma/client";

// Spectrum Badge variants that read correctly for severity.
const SEV_VARIANT: Record<Severity, "negative" | "yellow" | "info" | "neutral"> = {
  CRITICAL: "negative",
  SERIOUS: "yellow",
  MODERATE: "info",
  MINOR: "neutral",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant={SEV_VARIANT[severity]}>
      {severity.charAt(0) + severity.slice(1).toLowerCase()}
    </Badge>
  );
}

export function ReviewBadge() {
  return <Badge variant="indigo">Needs review</Badge>;
}

export function WcagTag({ wcagRef, level }: { wcagRef: string; level: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 12,
        fontFamily: "var(--spectrum-code-font-family, monospace)",
        background: "var(--spectrum-gray-100, #f5f5f5)",
        color: "var(--spectrum-gray-700, #4b4b4b)",
      }}
    >
      WCAG {wcagRef} · {level}
    </span>
  );
}
