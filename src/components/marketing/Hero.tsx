"use client";

// Home hero. The thesis: accessibility issues, caught in place. Rather than the
// generic big-number template, the hero pairs a clear value headline with a
// stylised "scan view" — a mock page with live issue overlays that echo the
// real product's inspector. The overlays animate in on load (respecting
// reduced-motion) so the core idea reads instantly.

import { useEffect, useState } from "react";
import { Button } from "@adobe/react-spectrum";
import { mk } from "./tokens";

const OVERLAYS = [
  { top: "18%", left: "8%", w: "44%", h: "11%", sev: "#d4500a", label: "Contrast 2.1:1" },
  { top: "40%", left: "8%", w: "84%", h: "20%", sev: "#d31510", label: "Missing alt text" },
  { top: "73%", left: "8%", w: "30%", h: "8%", sev: "#d97706", label: "Target 18px" },
];

export function Hero() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setShown(true);
    const t = setTimeout(() => setShown(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{ background: mk.color.white, overflow: "hidden" }}>
      <div
        style={{
          maxWidth: mk.maxWidth,
          margin: "0 auto",
          padding: "clamp(56px, 8vw, 104px) 24px clamp(56px, 8vw, 96px)",
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
        className="mk-hero-grid"
      >
        {/* Copy */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${mk.color.line}`,
              background: mk.color.surface,
              fontSize: mk.type.small,
              color: mk.color.muted,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 999, background: mk.color.accent }} />
            WCAG 2.2 · design-time and live-site
          </div>

          <h1
            style={{
              fontSize: mk.type.display,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              color: mk.color.ink,
              margin: "22px 0 0",
            }}
          >
            Accessibility issues,
            <br />
            caught in place.
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: mk.type.lead,
              lineHeight: 1.55,
              color: mk.color.muted,
              maxWidth: 520,
            }}
          >
            Auditr scans your Figma files, your components in CI, and your live site against WCAG, then shows every issue exactly where it lives. One engine, one dashboard, for designers and engineers.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <Button variant="accent" elementType="a" href="/contact">
              Request a demo
            </Button>
            <Button variant="secondary" elementType="a" href="/features">
              See how it works
            </Button>
          </div>

          <p style={{ marginTop: 18, fontSize: mk.type.small, color: mk.color.faint }}>
            No false confidence — issues that need a human are flagged, not hidden.
          </p>
        </div>

        {/* Stylised scan view */}
        <div
          aria-hidden
          style={{
            position: "relative",
            borderRadius: mk.radius,
            border: `1px solid ${mk.color.line}`,
            background: mk.color.surface,
            boxShadow: "0 24px 60px -28px rgba(17,20,23,0.28)",
            overflow: "hidden",
            aspectRatio: "4 / 3.2",
          }}
        >
          {/* browser chrome */}
          <div style={{ height: 36, borderBottom: `1px solid ${mk.color.line}`, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: mk.color.white }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#e5544b" }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#f5b13d" }} />
            <span style={{ width: 9, height: 9, borderRadius: 999, background: "#3fb950" }} />
            <span style={{ marginLeft: 10, height: 16, flex: 1, borderRadius: 5, background: mk.color.surfaceAlt }} />
          </div>

          {/* mock page content */}
          <div style={{ position: "relative", padding: 20, height: "calc(100% - 36px)" }}>
            <div style={{ height: 22, width: "46%", borderRadius: 6, background: "#d8dee4" }} />
            <div style={{ marginTop: 26, height: "20%", borderRadius: 8, background: "#e6ebef" }} />
            <div style={{ marginTop: 18, height: 12, width: "92%", borderRadius: 5, background: "#e6ebef" }} />
            <div style={{ marginTop: 10, height: 12, width: "80%", borderRadius: 5, background: "#e6ebef" }} />
            <div style={{ marginTop: 24, height: 30, width: "30%", borderRadius: 8, background: mk.color.accentSoft }} />

            {/* issue overlays */}
            {OVERLAYS.map((o, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: o.top,
                  left: o.left,
                  width: o.w,
                  height: o.h,
                  border: `2px solid ${o.sev}`,
                  background: `${o.sev}14`,
                  borderRadius: 4,
                  opacity: shown ? 1 : 0,
                  transform: shown ? "scale(1)" : "scale(0.96)",
                  transition: `opacity 360ms ease ${i * 140}ms, transform 360ms ease ${i * 140}ms`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    left: -2,
                    transform: "translateY(-100%)",
                    background: o.sev,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 5,
                    whiteSpace: "nowrap",
                    fontFamily: mk.font.mono,
                  }}
                >
                  {o.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .mk-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
