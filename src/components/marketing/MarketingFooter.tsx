// Marketing footer: link columns, wordmark, and legal row. Server component
// (no interactivity needed). Styled with marketing tokens.

import NextLink from "next/link";
import { mk } from "./tokens";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${mk.color.line}`, background: mk.color.surface }}>
      <div
        style={{
          maxWidth: mk.maxWidth,
          margin: "0 auto",
          padding: "56px 24px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(3, 1fr)",
            gap: 32,
          }}
          className="mk-footer-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: mk.color.ink,
                  color: mk.color.white,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                A
              </span>
              <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: mk.color.ink }}>
                Auditr
              </span>
            </div>
            <p style={{ marginTop: 14, color: mk.color.muted, fontSize: mk.type.small, maxWidth: 280, lineHeight: 1.6 }}>
              Automated accessibility for designers and engineers. Catch WCAG issues in design, in code, and in production.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3
                style={{
                  fontSize: mk.type.eyebrow,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: mk.color.faint,
                  fontWeight: 600,
                  margin: "0 0 14px",
                }}
              >
                {col.heading}
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <NextLink
                      href={l.href}
                      style={{ textDecoration: "none", color: mk.color.body, fontSize: mk.type.small }}
                    >
                      {l.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${mk.color.line}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: mk.color.faint,
            fontSize: mk.type.small,
          }}
        >
          <span>© {new Date().getFullYear()} Auditr. A portfolio project.</span>
          <span>Built on Adobe Spectrum · axe-core (MPL-2.0)</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .mk-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 460px) {
          .mk-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
