// Marketing design tokens. Marketing layouts need larger type and more
// breathing room than Spectrum's product-tuned defaults, so we define a small
// scale here that builds on Spectrum's colour tokens (referenced via CSS custom
// properties) but sets its own typographic rhythm. One source of truth so every
// marketing component stays consistent — restrained, typographically driven,
// matching the Auditr app identity (ink + a single blue accent).

export const mk = {
  // Pull colour from Spectrum tokens where possible so marketing tracks the
  // app theme; fallbacks keep things sane if a token is missing.
  color: {
    ink: "var(--spectrum-gray-900, #111417)",
    body: "var(--spectrum-gray-700, #4b4b4b)",
    muted: "var(--spectrum-gray-600, #6e6e6e)",
    faint: "var(--spectrum-gray-500, #909090)",
    line: "var(--spectrum-gray-300, #d5d5d5)",
    surface: "var(--spectrum-gray-50, #fafafa)",
    surfaceAlt: "var(--spectrum-gray-100, #f0f0f0)",
    accent: "var(--spectrum-accent-color-900, #2680eb)",
    accentDark: "var(--spectrum-accent-color-1100, #1351b4)",
    accentSoft: "var(--spectrum-accent-color-100, #e6f0fb)",
    white: "#ffffff",
  },
  // Section width + rhythm
  maxWidth: 1120,
  sectionY: "clamp(64px, 9vw, 128px)",
  // Type scale (marketing, larger than product)
  type: {
    display: "clamp(2.6rem, 1.6rem + 4vw, 4.5rem)",
    h2: "clamp(1.9rem, 1.4rem + 1.8vw, 2.75rem)",
    h3: "1.35rem",
    lead: "clamp(1.1rem, 1rem + 0.4vw, 1.3rem)",
    body: "1.0625rem",
    small: "0.9rem",
    eyebrow: "0.8rem",
  },
  font: {
    // Adobe Clean ships with Spectrum; falls back gracefully.
    sans: '"Adobe Clean", adobe-clean, -apple-system, system-ui, sans-serif',
    mono: 'var(--spectrum-code-font-family, "Source Code Pro", ui-monospace, monospace)',
  },
  radius: 14,
} as const;

// Shared section wrapper styles (centred, padded).
export function sectionStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    maxWidth: mk.maxWidth,
    margin: "0 auto",
    padding: `0 24px`,
    ...extra,
  };
}
