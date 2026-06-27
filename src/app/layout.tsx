import type { Metadata } from "next";
import { SpectrumProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Auditr — automated accessibility for design and code",
    template: "%s · Auditr",
  },
  description:
    "Catch WCAG issues in Figma, in CI, and on your live site. One accessibility engine, one dashboard, for designers and engineers.",
};

// Root layout holds only the shared Spectrum Provider. The sidebar app frame
// lives in the platform route layout; marketing pages bring their own header
// and footer. This keeps the two surfaces cleanly separated while sharing one
// theme, locale, and router wiring.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <SpectrumProvider>{children}</SpectrumProvider>
      </body>
    </html>
  );
}
