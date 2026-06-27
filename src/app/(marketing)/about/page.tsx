import type { Metadata } from "next";
import { Section, SectionHeading, Grid } from "@/components/marketing/elements";
import { Button } from "@adobe/react-spectrum";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "About",
  description: "Why Auditr exists: accessibility that's built into how teams design and ship, not bolted on at the end.",
};

export default function AboutPage() {
  return (
    <>
      <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
        <div style={{ maxWidth: mk.maxWidth, margin: "0 auto", padding: "clamp(48px,7vw,88px) 24px" }}>
          <SectionHeading
            eyebrow="About"
            title="Accessibility belongs in the workflow, not at the end of it"
            lead="Most teams discover accessibility problems late — in an audit, a complaint, or a legal notice. By then they're expensive to fix and someone has already been excluded. Auditr moves the check to where the work happens."
            maxWidth={780}
          />
        </div>
      </div>

      <Section>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ color: mk.color.body, fontSize: mk.type.lead, lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 20px" }}>
              The same accessibility issues surface again and again: text no one can read against its background, images with no description, controls too small to tap, forms a screen reader can't navigate. They're well understood and largely preventable. The problem isn't knowledge, it's timing.
            </p>
            <p style={{ margin: "0 0 20px" }}>
              A designer can't see a contrast failure in a static mockup. An engineer doesn't catch a regression until it's in production. A manager has no way to know if things are getting better or worse. Each role is working blind to the others.
            </p>
            <p style={{ margin: 0 }}>
              Auditr connects those moments. The same checks run in Figma, in CI, and against the live site, and every finding flows to one dashboard. Accessibility becomes a shared, visible, continuous measure instead of a periodic surprise.
            </p>
          </div>
        </div>
      </Section>

      {/* Principles */}
      <Section alt>
        <SectionHeading align="center" eyebrow="What we believe" title="Principles behind the product" />
        <div style={{ marginTop: 48 }}>
          <Grid min={300}>
            <Principle
              title="Honesty over a green checkmark"
              body="Automation catches part of WCAG. Pretending it catches all of it is how inaccessible products ship with a passing grade. We flag what needs a human."
            />
            <Principle
              title="Shift left, but shift everywhere"
              body="Catching issues in design is good. Catching them in design and code and production is better. One engine across all three beats three disconnected tools."
            />
            <Principle
              title="Practise what we audit"
              body="The interface is built on Adobe Spectrum, with accessible components throughout. A tool that fails its own standard has no business measuring yours."
            />
            <Principle
              title="Findings should be obvious"
              body="An issue shown on the actual page, with the element and the fix, gets resolved. A line in a report gets ignored."
            />
          </Grid>
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: mk.type.h2, fontWeight: 700, letterSpacing: "-0.025em", color: mk.color.ink, margin: 0 }}>
            Want to talk about accessibility?
          </h2>
          <p style={{ marginTop: 16, fontSize: mk.type.lead, color: mk.color.muted, maxWidth: 520, marginInline: "auto" }}>
            Whether you're evaluating tools or just getting started, we're happy to help.
          </p>
          <div style={{ marginTop: 24 }}>
            <Button variant="accent" elementType="a" href="/contact">Get in touch</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ borderLeft: `2px solid ${mk.color.accent}`, paddingLeft: 20 }}>
      <h3 style={{ fontSize: mk.type.h3, fontWeight: 650, color: mk.color.ink, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ margin: 0, color: mk.color.body, fontSize: mk.type.body, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}
