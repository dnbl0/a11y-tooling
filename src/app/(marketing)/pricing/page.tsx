import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/elements";
import { Button } from "@adobe/react-spectrum";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, scope-based pricing for Auditr. Plans for individuals, teams, and organisations.",
};

interface Tier {
  name: string;
  price: string;
  cadence?: string;
  blurb: string;
  cta: { label: string; href: string; variant: "accent" | "secondary" };
  features: string[];
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "free while in portfolio preview",
    blurb: "For individuals auditing a single site or design file.",
    cta: { label: "Get started", href: "/dashboard", variant: "secondary" },
    features: [
      "1 site, single-page live scans",
      "Figma plugin (design-time checks)",
      "In-situ issue inspector",
      "WCAG 2.2 A & AA coverage",
    ],
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per editor / month",
    blurb: "For product teams shipping accessible work together.",
    cta: { label: "Request a demo", href: "/contact", variant: "accent" },
    featured: true,
    features: [
      "Unlimited sites, multi-page crawling",
      "CI checker + GitHub Action",
      "Score trends and history",
      "Exportable reports",
      "Shared dashboard for designers and engineers",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "For organisations with governance and scale needs.",
    cta: { label: "Talk to us", href: "/contact", variant: "secondary" },
    features: [
      "Everything in Team",
      "SSO and role-based access",
      "Custom WCAG policies",
      "Priority support and onboarding",
      "Self-hosting options",
    ],
  },
];

function Check() {
  return (
    <span aria-hidden style={{ color: mk.color.accent, fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>
      ✓
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
        <div style={{ maxWidth: mk.maxWidth, margin: "0 auto", padding: "clamp(48px,7vw,88px) 24px" }}>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Pay for scope, not seats you don't use"
            lead="Start free, grow into team and organisation plans as your accessibility programme matures. Prices shown are illustrative for this portfolio project."
          />
        </div>
      </div>

      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
          className="mk-pricing-grid"
        >
          {TIERS.map((t) => (
            <div
              key={t.name}
              style={{
                border: t.featured ? `1.5px solid ${mk.color.accent}` : `1px solid ${mk.color.line}`,
                borderRadius: 16,
                background: mk.color.white,
                padding: 28,
                position: "relative",
                boxShadow: t.featured ? "0 20px 48px -24px rgba(38,128,235,0.4)" : "none",
              }}
            >
              {t.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 28,
                    background: mk.color.accent,
                    color: "#fff",
                    fontSize: mk.type.eyebrow,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  Most popular
                </span>
              )}
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: mk.color.ink, margin: 0 }}>{t.name}</h2>
              <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "2.6rem", fontWeight: 750, letterSpacing: "-0.03em", color: mk.color.ink }}>{t.price}</span>
              </div>
              {t.cadence && <div style={{ marginTop: 4, fontSize: mk.type.small, color: mk.color.faint }}>{t.cadence}</div>}
              <p style={{ marginTop: 16, fontSize: mk.type.body, color: mk.color.body, lineHeight: 1.55, minHeight: 48 }}>{t.blurb}</p>

              <div style={{ marginTop: 8, marginBottom: 24 }}>
                <Button variant={t.cta.variant} elementType="a" href={t.cta.href} width="100%">
                  {t.cta.label}
                </Button>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: mk.type.body, color: mk.color.body, lineHeight: 1.5 }}>
                    <Check />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section alt>
        <SectionHeading align="center" eyebrow="Questions" title="Common questions" />
        <div style={{ maxWidth: 760, margin: "40px auto 0", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            {
              q: "Does Auditr replace manual accessibility testing?",
              a: "No, and it doesn't claim to. Automation reliably catches a subset of WCAG. Auditr flags the rest for human review rather than passing it silently. It makes manual testing more focused, not unnecessary.",
            },
            {
              q: "Which WCAG version do you test against?",
              a: "WCAG 2.2, Level A and AA, the conformance target for most legal obligations including the ADA and the European Accessibility Act.",
            },
            {
              q: "Can designers and engineers share one workspace?",
              a: "Yes. Findings from Figma, CI, and live scans all land in the same dashboard, so everyone works from one source of truth.",
            },
            {
              q: "Is this a real commercial product?",
              a: "It's a portfolio project demonstrating the architecture and design of an accessibility platform. Pricing here is illustrative.",
            },
          ].map((item, i) => (
            <details
              key={i}
              style={{
                borderTop: i ? `1px solid ${mk.color.line}` : "none",
                padding: "18px 4px",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: 600, color: mk.color.ink, fontSize: mk.type.body, listStyle: "none" }}>
                {item.q}
              </summary>
              <p style={{ marginTop: 12, color: mk.color.body, fontSize: mk.type.body, lineHeight: 1.65 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <style>{`
        @media (max-width: 900px) {
          .mk-pricing-grid { grid-template-columns: 1fr !important; max-width: 420px; margin-inline: auto; }
        }
      `}</style>
    </>
  );
}
