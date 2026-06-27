import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

// Marketing layout: public-facing pages get their own header + footer instead
// of the app sidebar. Shares the root Spectrum Provider for theme + tokens.
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <MarketingHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <MarketingFooter />
    </div>
  );
}
