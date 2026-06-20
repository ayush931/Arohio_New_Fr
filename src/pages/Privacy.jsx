import { useMemo } from "react";
import { NavLink } from "react-router-dom";

export default function Privacy() {
  // Effective date = today
  const effective = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <div className="container py-5 text-start">
      {/* Breadcrumbs: MOBILE ONLY (match /terms behavior) */}
      <nav className="small mb-2 d-lg-none" aria-label="breadcrumb">
        <NavLink className="text-muted text-decoration-none" to="/">Home</NavLink>
        <span className="text-muted"> / </span>
        <span className="text-muted">Legal</span>
        <span className="text-muted"> / </span>
        <span className="text-muted">Privacy Policy</span>
      </nav>

      <h1 className="policy-title fw-bold" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        Privacy Policy
      </h1>
      <p className="text-muted">Effective Date: {effective}</p>

      <section id="intro" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Introduction</h2>
        <p>
          Welcome to the Privacy Policy of Arohio. This document explains how we collect, use,
          disclose, and protect your personal information. By using our services, you agree to the
          practices described here.
        </p>
      </section>

      <section id="collect" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Information We Collect</h2>
        <p>We collect information to operate and improve our services, including:</p>
        <ul className="policy-bullets">
          <li>
            <strong>Information you provide:</strong> name, email address, company, and any content
            you upload or submit.
          </li>
          <li>
            <strong>Automatically collected information:</strong> IP address, device identifiers,
            browser type, pages visited, time on page, and referring URLs (via cookies and similar
            technologies).
          </li>
          <li>
            <strong>Third-party sources:</strong> with your consent, we may receive information
            from sign-in providers (e.g., Google, Microsoft) consistent with their privacy policies.
          </li>
        </ul>
      </section>

      <section id="use" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>How We Use Information</h2>
        <p>We use your information to:</p>
        <ul className="policy-bullets">
          <li>Provide, maintain, and improve the Arohio platform and features.</li>
          <li>Personalize your experience and remember your preferences.</li>
          <li>Communicate with you about updates, security alerts, and support.</li>
          <li>Analyze usage to improve performance, reliability, and UX.</li>
          <li>Comply with legal obligations and enforce our Terms.</li>
        </ul>
      </section>

      <section id="cookies" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Cookies & Tracking</h2>
        <p>
          We use cookies, local storage, and similar technologies to keep you signed in, remember
          settings, and understand product usage. You can control cookies through your browser
          settings; disabling some cookies may affect functionality.
        </p>
      </section>

      <section id="retention" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Data Retention</h2>
        <p>
          We retain personal data only as long as necessary for the purposes outlined in this
          policy, to provide services, resolve disputes, and comply with legal requirements.
          When no longer needed, we delete or anonymize it.
        </p>
      </section>

      <section id="security" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Data Sharing &amp; Security</h2>
        <p>
          We don’t sell your personal information. We may share it with trusted vendors that help
          us operate our services (e.g., hosting, analytics, email delivery) under confidentiality
          agreements. We apply technical and organizational safeguards to protect your data.
        </p>
      </section>

      <section id="international" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>International Transfers</h2>
        <p>
          Your information may be processed in countries other than your own. Where required, we
          implement appropriate safeguards (such as standard contractual clauses) for cross-border
          transfers.
        </p>
      </section>

      <section id="children" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Children’s Privacy</h2>
        <p>
          Our services are not directed to children under the age of digital consent. If we learn
          that we’ve collected personal data from a child, we will take steps to delete it.
        </p>
      </section>

      <section id="changes" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Changes to This Policy</h2>
        <p>
          We may update this policy to reflect product or legal changes. We’ll update the
          “Effective Date” above and, when appropriate, notify you through the app or email.
        </p>
      </section>

      <section id="rights" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export
          your personal data, and to object to or restrict certain processing. To exercise these
          rights, contact us using the details below. We’ll respond within a reasonable time.
        </p>
      </section>

      <section id="contact" className="policy-section">
        <h2 style={{ fontFamily: '"Times New Roman", Times, serif' }}>Contact Us</h2>
        <p>
          Questions or requests about this Privacy Policy? We’re here to help. Email us at{" "}
          <a href="mailto:support@arohio.com" className="link-teal text-decoration-none">
            support@arohio.com
          </a>.
        </p>
      </section>
    </div>
  );
}
