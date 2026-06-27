"use client";

// Marketing site header: wordmark, primary nav, and a Spectrum CTA button.
// Sticky, with a subtle bottom border that appears on scroll. Mobile collapses
// the nav into a disclosure menu. Active route is reflected for orientation.

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Button } from "@adobe/react-spectrum";
import { mk } from "./tokens";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.85)" : mk.color.white,
        backdropFilter: scrolled ? "saturate(180%) blur(8px)" : "none",
        borderBottom: `1px solid ${scrolled ? mk.color.line : "transparent"}`,
        transition: "border-color 200ms ease, background 200ms ease",
      }}
    >
      <div
        style={{
          maxWidth: mk.maxWidth,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <NextLink
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: mk.color.ink,
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 28,
              height: 28,
              borderRadius: 7,
              background: mk.color.ink,
              color: mk.color.white,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            A
          </span>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>Auditr</span>
        </NextLink>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="mk-desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <NextLink
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                style={{
                  textDecoration: "none",
                  fontSize: 15,
                  padding: "8px 12px",
                  borderRadius: 8,
                  color: active ? mk.color.ink : mk.color.body,
                  fontWeight: active ? 600 : 450,
                }}
              >
                {n.label}
              </NextLink>
            );
          })}
          <div style={{ width: 8 }} />
          <NextLink href="/dashboard" style={{ textDecoration: "none", marginRight: 4 }}>
            <span style={{ fontSize: 15, color: mk.color.body, fontWeight: 450 }}>Sign in</span>
          </NextLink>
          <Button variant="accent" elementType="a" href="/contact">
            Request demo
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="mk-mobile-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            background: "transparent",
            border: `1px solid ${mk.color.line}`,
            borderRadius: 8,
            width: 40,
            height: 40,
            cursor: "pointer",
            fontSize: 18,
            color: mk.color.ink,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          aria-label="Primary"
          className="mk-mobile-nav"
          style={{
            display: "none",
            flexDirection: "column",
            padding: "8px 24px 20px",
            borderTop: `1px solid ${mk.color.line}`,
            gap: 4,
          }}
        >
          {NAV.map((n) => (
            <NextLink
              key={n.href}
              href={n.href}
              style={{
                textDecoration: "none",
                fontSize: 16,
                padding: "12px 8px",
                color: mk.color.ink,
                borderBottom: `1px solid ${mk.color.surfaceAlt}`,
              }}
            >
              {n.label}
            </NextLink>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Button variant="secondary" elementType="a" href="/dashboard" flex>
              Sign in
            </Button>
            <Button variant="accent" elementType="a" href="/contact" flex>
              Request demo
            </Button>
          </div>
        </nav>
      )}

      {/* Responsive switches without a CSS framework */}
      <style>{`
        @media (max-width: 820px) {
          .mk-desktop-nav { display: none !important; }
          .mk-mobile-toggle { display: grid !important; place-items: center; }
          .mk-mobile-nav { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
