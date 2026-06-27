// Reusable marketing building blocks, styled with marketing tokens. Custom
// layout primitives (not raw Spectrum components) because marketing needs
// larger type and persuasion-oriented composition, but every colour/spacing
// value derives from the shared tokens so it stays consistent with the app.

import type { ReactNode, CSSProperties } from "react";
import { mk, sectionStyle } from "./tokens";

export function Section({
  children,
  alt = false,
  style,
}: {
  children: ReactNode;
  alt?: boolean;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        padding: `${mk.sectionY} 0`,
        background: alt ? mk.color.surface : mk.color.white,
        ...style,
      }}
    >
      <div style={sectionStyle()}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: mk.type.eyebrow,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontWeight: 600,
        color: mk.color.accent,
        fontFamily: mk.font.mono,
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  maxWidth,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        textAlign: align,
        marginInline: align === "center" ? "auto" : undefined,
        maxWidth: maxWidth ?? (align === "center" ? 720 : undefined),
      }}
    >
      {eyebrow && (
        <div style={{ marginBottom: 16 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2
        style={{
          fontSize: mk.type.h2,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          fontWeight: 700,
          color: mk.color.ink,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          style={{
            marginTop: 18,
            fontSize: mk.type.lead,
            lineHeight: 1.55,
            color: mk.color.muted,
            marginInline: align === "center" ? "auto" : undefined,
            maxWidth: align === "center" ? 640 : 680,
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export function FeatureCard({
  title,
  body,
  glyph,
}: {
  title: string;
  body: string;
  glyph: ReactNode;
}) {
  return (
    <div
      style={{
        border: `1px solid ${mk.color.line}`,
        borderRadius: mk.radius,
        padding: 28,
        background: mk.color.white,
        height: "100%",
      }}
    >
      <div
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: mk.color.accentSoft,
          color: mk.color.accentDark,
          display: "grid",
          placeItems: "center",
          marginBottom: 18,
          fontSize: 22,
        }}
      >
        {glyph}
      </div>
      <h3 style={{ fontSize: mk.type.h3, fontWeight: 650, color: mk.color.ink, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: mk.type.body, lineHeight: 1.6, color: mk.color.body, margin: 0 }}>{body}</p>
    </div>
  );
}

export function Grid({
  children,
  min = 280,
  gap = 20,
}: {
  children: ReactNode;
  min?: number;
  gap?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

// Prose wrapper for legal pages — readable measure, generous line-height.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        color: mk.color.body,
        fontSize: mk.type.body,
        lineHeight: 1.7,
      }}
      className="mk-prose"
    >
      {children}
      <style>{`
        .mk-prose h2 { font-size: 1.4rem; color: ${mk.color.ink}; margin: 40px 0 12px; letter-spacing: -0.01em; }
        .mk-prose h3 { font-size: 1.1rem; color: ${mk.color.ink}; margin: 28px 0 8px; }
        .mk-prose p { margin: 0 0 16px; }
        .mk-prose ul { margin: 0 0 16px; padding-left: 22px; }
        .mk-prose li { margin: 0 0 8px; }
        .mk-prose a { color: ${mk.color.accent}; }
        .mk-prose strong { color: ${mk.color.ink}; }
      `}</style>
    </div>
  );
}
