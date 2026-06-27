import type { Metadata } from "next";
import { Prose } from "@/components/marketing/elements";
import { mk } from "@/components/marketing/tokens";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of service. Plain-language template for a portfolio project.",
};

export default function TermsPage() {
  return (
    <>
      <div style={{ background: mk.color.white, borderBottom: `1px solid ${mk.color.line}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(48px,7vw,80px) 24px" }}>
          <div style={{ fontFamily: mk.font.mono, fontSize: mk.type.eyebrow, letterSpacing: "0.12em", textTransform: "uppercase", color: mk.color.accent, fontWeight: 600 }}>
            Legal
          </div>
          <h1 style={{ fontSize: mk.type.h2, fontWeight: 700, letterSpacing: "-0.025em", color: mk.color.ink, margin: "14px 0 0" }}>
            Terms of Service
          </h1>
          <p style={{ marginTop: 12, color: mk.color.faint, fontSize: mk.type.small }}>
            Last updated: portfolio preview · This is illustrative template text, not legal advice.
          </p>
        </div>
      </div>

      <div style={{ padding: `${mk.sectionY} 0` }}>
        <Prose>
          <p>
            These terms describe, in plain language, how Auditr would be used. Auditr is a portfolio
            project, so this is a clearly-labelled template rather than a binding contract. A real
            product would replace it with a reviewed agreement.
          </p>

          <h2>Using the service</h2>
          <p>
            Auditr provides automated accessibility scanning for websites, design files, and code
            components. You would agree to use it only for sites and files you own or are authorised to
            test, and not to use it to disrupt or overload systems you do not control.
          </p>

          <h2>What automated testing can and can't do</h2>
          <p>
            This matters enough to state plainly: automated checks catch a portion of accessibility
            issues, not all of them. Auditr flags items that need human judgement rather than passing
            them silently, but a passing score is <strong>not</strong> a certification of full WCAG
            conformance or legal compliance. Auditr is a tool to support your accessibility work, not a
            substitute for expert review.
          </p>

          <h2>Accounts</h2>
          <p>
            You would be responsible for keeping your account credentials secure and for activity under
            your account. Let us know promptly if you suspect unauthorised use.
          </p>

          <h2>Your content</h2>
          <p>
            You keep ownership of the sites, files, and content you submit for scanning. You grant us
            only the permission needed to run scans and show you the results.
          </p>

          <h2>Availability</h2>
          <p>
            We would aim for reliable service but would not guarantee uninterrupted availability. Scans
            depend on the pages and files you provide and on third-party infrastructure.
          </p>

          <h2>Liability</h2>
          <p>
            To the extent permitted by law, Auditr would be provided &ldquo;as is&rdquo; without
            warranties, and our liability would be limited. Because accessibility carries legal weight
            in many jurisdictions, you remain responsible for your own compliance obligations.
          </p>

          <h2>Changes</h2>
          <p>
            These terms could be updated as the product evolves. Material changes would be communicated
            to account holders.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this template can go to <a href="/contact">our contact page</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
