import { Hero } from "@/components/marketing/Hero";
import { Section, SectionHeading, FeatureCard, Grid } from "@/components/marketing/elements";
import { Button } from "@adobe/react-spectrum";
import { mk } from "@/components/marketing/tokens";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Three surfaces */}
      <Section alt>
        <SectionHeading
          align="center"
          eyebrow="One engine, three surfaces"
          title="Catch issues at every stage of delivery"
          lead="Most tools check one place. Auditr checks the design, the code, and the live site — and routes every finding to the same dashboard."
        />
        <div style={{ marginTop: 48 }}>
          <Grid min={300}>
            <FeatureCard
              glyph="◳"
              title="In Figma"
              body="A plugin checks contrast, text size, and target dimensions while designers work — before anything reaches code."
            />
            <FeatureCard
              glyph="⌥"
              title="In CI"
              body="A checker runs against your components on every pull request and fails the build when new violations appear."
            />
            <FeatureCard
              glyph="◉"
              title="On your live site"
              body="A headless crawler audits rendered pages against WCAG and captures each issue with a screenshot and the exact element."
            />
          </Grid>
        </div>
      </Section>

      {/* The honest difference */}
      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
          className="mk-split"
        >
          <div>
            <SectionHeading
              eyebrow="Honest by design"
              title="No false confidence"
              lead="Roughly a third of WCAG can't be tested by a machine — whether alt text is meaningful, whether reading order is logical. Auditr flags those for human review instead of silently passing them. A green score you can't trust is worse than no score."
            />
            <div style={{ marginTop: 28 }}>
              <Button variant="secondary" elementType="a" href="/features">
                How scoring works
              </Button>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${mk.color.line}`,
              borderRadius: mk.radius,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Colour contrast", state: "fail", note: "2.1:1 · automatic" },
              { label: "Image alt text", state: "review", note: "present · verify meaning" },
              { label: "Form labels", state: "review", note: "present · verify clarity" },
              { label: "Target size", state: "pass", note: "44px · automatic" },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderTop: i === 0 ? "none" : `1px solid ${mk.color.surfaceAlt}`,
                  background: mk.color.white,
                }}
              >
                <span style={{ fontWeight: 550, color: mk.color.ink, fontSize: mk.type.body }}>{row.label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: mk.type.small, color: mk.color.faint, fontFamily: mk.font.mono }}>{row.note}</span>
                  <StateDot state={row.state} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Built on Spectrum */}
      <Section alt>
        <SectionHeading
          align="center"
          eyebrow="Accessible foundations"
          title="A tool that practises what it audits"
          lead="Auditr's interface is built on Adobe Spectrum, whose components ship compliant keyboard interaction, focus management, and ARIA. The product is held to the standard it measures."
        />
      </Section>

      {/* CTA */}
      <Section>
        <div
          style={{
            borderRadius: 20,
            background: mk.color.ink,
            color: mk.color.white,
            padding: "clamp(40px, 6vw, 72px)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: mk.type.h2, letterSpacing: "-0.025em", fontWeight: 700, margin: 0 }}>
            See your site through Auditr
          </h2>
          <p style={{ marginTop: 16, fontSize: mk.type.lead, color: "rgba(255,255,255,0.72)", maxWidth: 560, marginInline: "auto", lineHeight: 1.55 }}>
            Book a walkthrough and we'll scan a page of your choice live.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" staticColor="white" style="fill" elementType="a" href="/contact">
              Request a demo
            </Button>
            <Button variant="secondary" staticColor="white" style="outline" elementType="a" href="/pricing">
              View pricing
            </Button>
          </div>
        </div>
      </Section>

      <style>{`
        @media (max-width: 880px) {
          .mk-split { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </>
  );
}

function StateDot({ state }: { state: string }) {
  const map: Record<string, { c: string; t: string }> = {
    fail: { c: "#d31510", t: "Fail" },
    review: { c: "#2680eb", t: "Review" },
    pass: { c: "#2d9d78", t: "Pass" },
  };
  const s = map[state] ?? map.pass;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 64 }}>
      <span style={{ width: 9, height: 9, borderRadius: 999, background: s.c }} />
      <span style={{ fontSize: mk.type.small, color: s.c, fontWeight: 600 }}>{s.t}</span>
    </span>
  );
}
