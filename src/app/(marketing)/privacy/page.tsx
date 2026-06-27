import type { Metadata } from "next";
import { Prose } from "@/components/marketing/elements";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Auditr handles data. Plain-language privacy template for a portfolio project.",
};

export default function PrivacyPage() {
  return (
    <>
      <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(48px,7vw,80px) 24px" }}>
          <div style={{ fontFamily: mk.font.mono, fontSize: mk.type.eyebrow, letterSpacing: "0.12em", textTransform: "uppercase", color: mk.color.accent, fontWeight: 600 }}>
            Legal
          </div>
          <h1 style={{ fontSize: mk.type.h2, fontWeight: 700, letterSpacing: "-0.025em", color: mk.color.ink, margin: "14px 0 0" }}>
            Privacy Policy
          </h1>
          <p style={{ marginTop: 12, color: mk.color.faint, fontSize: mk.type.small }}>
            Last updated: portfolio preview · This is illustrative template text, not legal advice.
          </p>
        </div>
      </div>

      <div style={{ padding: `${mk.sectionY} 0` }}>
        <Prose>
          <p>
            This page explains, in plain terms, how Auditr would handle information. Auditr is a
            portfolio project, so the text below is a clearly-labelled template rather than a binding
            policy. A production deployment would replace it with a reviewed document.
          </p>

          <h2>What we collect</h2>
          <p>To provide accessibility scanning, Auditr would handle a few categories of data:</p>
          <ul>
            <li><strong>Account details</strong> — name and email for the people using the dashboard.</li>
            <li><strong>Scan inputs</strong> — the URLs you ask us to crawl, and design or component files you submit for checking.</li>
            <li><strong>Scan results</strong> — the accessibility issues found, including screenshots of the pages scanned and the relevant page markup.</li>
            <li><strong>Usage data</strong> — basic, privacy-respecting analytics about how the product is used, to improve it.</li>
          </ul>

          <h2>How we use it</h2>
          <p>
            Data is used to run scans, show you results, track your scores over time, and support your
            account. We would not sell personal information, and we would not use the contents of your
            scans for any purpose beyond delivering the service to you.
          </p>

          <h2>Where it lives</h2>
          <p>
            Scan results and screenshots would be stored securely and associated with your account.
            You would be able to delete a site, scan, or your whole account, which removes the
            associated data.
          </p>

          <h2>Third parties</h2>
          <p>
            Auditr&apos;s scanning engine uses axe-core, an open-source library, which runs within our
            own infrastructure. A production deployment may also use standard service providers for
            hosting, email, and error monitoring, each bound by their own agreements.
          </p>

          <h2>Your choices</h2>
          <p>
            You would be able to access, correct, export, or delete your data, and to contact us with
            any privacy question. Depending on where you live, you may have additional rights under
            laws such as the GDPR or CCPA.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this template can go to <a href="/contact">our contact page</a>. For a real
            product, this section would name a data controller and a contact route for privacy requests.
          </p>
        </Prose>
      </div>
    </>
  );
}
