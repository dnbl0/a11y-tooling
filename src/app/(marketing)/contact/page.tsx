import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";
import { SectionHeading } from "@/components/marketing/elements";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Auditr — request a demo, ask about pricing, or talk accessibility.",
};

export default function ContactPage() {
  return (
    <>
      <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
        <div style={{ maxWidth: mk.maxWidth, margin: "0 auto", padding: "clamp(48px,7vw,80px) 24px" }}>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk"
            lead="Tell us what you're working on and we'll get back to you. Want to see Auditr on your own site? Mention it and we'll scan a page live in the demo."
            maxWidth={680}
          />
        </div>
      </div>

      <div style={{ background: mk.color.surface, padding: `${mk.sectionY} 0` }}>
        <div
          style={{
            maxWidth: mk.maxWidth,
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 56,
            alignItems: "start",
          }}
          className="mk-contact-grid"
        >
          {/* Aside */}
          <div>
            <h2 style={{ fontSize: mk.type.h3, fontWeight: 650, color: mk.color.ink, margin: "0 0 16px" }}>
              What to expect
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                ["A real reply", "A person reads every message — no auto-responders bouncing you around."],
                ["A focused demo", "We'll tailor the walkthrough to your stack, design or engineering."],
                ["A live scan", "Share a URL and we'll show you its real WCAG issues, in place."],
              ].map(([h, b]) => (
                <li key={h} style={{ display: "flex", gap: 12 }}>
                  <span aria-hidden style={{ color: mk.color.accent, fontWeight: 700, lineHeight: 1.5 }}>→</span>
                  <div>
                    <div style={{ fontWeight: 600, color: mk.color.ink, fontSize: mk.type.body }}>{h}</div>
                    <div style={{ color: mk.color.body, fontSize: mk.type.body, lineHeight: 1.55, marginTop: 2 }}>{b}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${mk.color.line}` }}>
              <div style={{ fontSize: mk.type.small, color: mk.color.faint }}>Prefer email?</div>
              <a href="mailto:hello@auditr.example" style={{ color: mk.color.accent, fontSize: mk.type.body, textDecoration: "none" }}>
                hello@auditr.example
              </a>
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              background: mk.color.white,
              border: `1px solid ${mk.color.line}`,
              borderRadius: 16,
              padding: "clamp(24px, 4vw, 36px)",
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .mk-contact-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </>
  );
}
