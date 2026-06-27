import type { Metadata } from "next";
import { Section, SectionHeading, Grid, FeatureCard } from "@/components/marketing/elements";
import { Button } from "@adobe/react-spectrum";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "Features",
  description:
    "How Auditr scans design, code, and live sites against WCAG — and why its scoring is honest about what automation can and cannot check.",
};

function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
      <div style={{ maxWidth: mk.maxWidth, margin: "0 auto", padding: "clamp(48px,7vw,88px) 24px" }}>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} maxWidth={760} />
      </div>
    </div>
  );
}

// A surface block: alternating text + visual.
function Surface({
  index,
  eyebrow,
  title,
  body,
  points,
  visual,
  flip,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        alignItems: "center",
        direction: flip ? "rtl" : "ltr",
      }}
      className="mk-surface"
    >
      <div style={{ direction: "ltr" }}>
        <div style={{ fontFamily: mk.font.mono, color: mk.color.faint, fontSize: mk.type.small, marginBottom: 12 }}>
          {index}
        </div>
        <div style={{ fontFamily: mk.font.mono, fontSize: mk.type.eyebrow, letterSpacing: "0.12em", textTransform: "uppercase", color: mk.color.accent, fontWeight: 600, marginBottom: 14 }}>
          {eyebrow}
        </div>
        <h2 style={{ fontSize: mk.type.h2, lineHeight: 1.12, letterSpacing: "-0.025em", fontWeight: 700, color: mk.color.ink, margin: 0 }}>
          {title}
        </h2>
        <p style={{ marginTop: 16, fontSize: mk.type.body, lineHeight: 1.65, color: mk.color.body, maxWidth: 480 }}>{body}</p>
        <ul style={{ marginTop: 20, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {points.map((p) => (
            <li key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start", color: mk.color.body, fontSize: mk.type.body }}>
              <span aria-hidden style={{ color: mk.color.accent, fontWeight: 700, lineHeight: 1.5 }}>→</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ direction: "ltr" }}>{visual}</div>
    </div>
  );
}

function MockPanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ border: `1px solid ${mk.color.line}`, borderRadius: mk.radius, overflow: "hidden", background: mk.color.surface }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${mk.color.line}`, background: mk.color.white, fontFamily: mk.font.mono, fontSize: mk.type.small, color: mk.color.muted }}>
        {label}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="One accessibility engine, wherever your work lives"
        lead="Auditr runs the same WCAG checks across three surfaces and unifies the results, so design, code, and production are measured against one standard."
      />

      <Section>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(72px, 10vw, 128px)" }}>
          <Surface
            index="01"
            eyebrow="Design-time"
            title="Check designs before they become code"
            body="A Figma plugin walks the document tree and evaluates what a design file can actually answer: colour contrast with full WCAG luminance math, text sizing, and touch-target dimensions."
            points={[
              "Real contrast ratios, not eyeballed swatches",
              "Flags targets under 24×24px per WCAG 2.2",
              "Sends findings to the same dashboard as live scans",
            ]}
            visual={
              <MockPanel label="Figma · Auditr plugin">
                {[
                  { n: "Heading / XL", v: "4.8:1", ok: true },
                  { n: "Caption / S", v: "2.9:1", ok: false },
                  { n: "Button / Primary", v: "22×40", ok: false },
                ].map((r, i) => (
                  <div key={r.n} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: i ? `1px solid ${mk.color.surfaceAlt}` : "none" }}>
                    <span style={{ color: mk.color.ink, fontSize: mk.type.body }}>{r.n}</span>
                    <span style={{ fontFamily: mk.font.mono, fontSize: mk.type.small, color: r.ok ? "#2d9d78" : "#d4500a" }}>{r.v}</span>
                  </div>
                ))}
              </MockPanel>
            }
          />

          <Surface
            flip
            index="02"
            eyebrow="Engineer-time"
            title="Stop regressions at the pull request"
            body="A command-line checker renders your Storybook stories or component routes, runs axe-core against each, and fails the build when new serious issues appear. Wire it into CI as a GitHub Action."
            points={[
              "Blocks merges that introduce violations",
              "Configurable severity threshold",
              "Optionally posts results to your dashboard",
            ]}
            visual={
              <MockPanel label="CI · accessibility check">
                <pre style={{ margin: 0, fontFamily: mk.font.mono, fontSize: mk.type.small, lineHeight: 1.7, color: mk.color.body }}>
{`  button--primary        PASS
  button--secondary      PASS
  forms-input--default   1 issue
`}
                  <span style={{ color: "#d31510" }}>{`  ✗ build failed: serious`}</span>
                </pre>
              </MockPanel>
            }
          />

          <Surface
            index="03"
            eyebrow="Live-site"
            title="Audit production, page by page"
            body="A headless browser loads each rendered page, injects axe-core, and records every violation with the offending element, a CSS selector, and a full-page screenshot for the inspector."
            points={[
              "Tests the DOM users actually receive",
              "Captures a screenshot and bounding box per issue",
              "Tracks scores over time to show progress",
            ]}
            visual={
              <MockPanel label="example.com · live scan">
                <div style={{ position: "relative" }}>
                  <div style={{ height: 16, width: "50%", borderRadius: 5, background: "#d8dee4" }} />
                  <div style={{ marginTop: 14, height: 56, borderRadius: 8, background: "#e6ebef", border: "2px solid #d31510" }} />
                  <div style={{ marginTop: 12, height: 10, width: "85%", borderRadius: 4, background: "#e6ebef" }} />
                  <div style={{ marginTop: 8, height: 10, width: "70%", borderRadius: 4, background: "#e6ebef", border: "2px solid #d4500a" }} />
                </div>
              </MockPanel>
            }
          />
        </div>
      </Section>

      {/* Inspector + scoring */}
      <Section alt>
        <SectionHeading
          align="center"
          eyebrow="The dashboard"
          title="Findings that are actually actionable"
          lead="Every issue lands in one place, shown where it occurs, mapped to its WCAG criterion, with a plain-language fix."
        />
        <div style={{ marginTop: 48 }}>
          <Grid min={280}>
            <FeatureCard glyph="◎" title="In-situ inspector" body="See each issue highlighted on a screenshot of the real page, click it for the element, criterion, and remediation." />
            <FeatureCard glyph="◑" title="Honest scoring" body="A weighted 0–100 score by severity and WCAG level. Issues needing human review are penalised lightly, never hidden." />
            <FeatureCard glyph="↗" title="Progress over time" body="Trends across scans turn accessibility from a one-off audit into a metric your team can move." />
          </Grid>
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: mk.type.h2, fontWeight: 700, letterSpacing: "-0.025em", color: mk.color.ink, margin: 0 }}>
            Ready to see it on your own pages?
          </h2>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="accent" elementType="a" href="/contact">Request a demo</Button>
            <Button variant="secondary" elementType="a" href="/pricing">View pricing</Button>
          </div>
        </div>
      </Section>

      <style>{`
        @media (max-width: 880px) {
          .mk-surface { grid-template-columns: 1fr !important; gap: 32px !important; direction: ltr !important; }
        }
      `}</style>
    </>
  );
}
