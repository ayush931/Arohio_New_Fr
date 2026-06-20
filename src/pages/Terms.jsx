// src/pages/Terms.jsx
import { useMemo } from "react";
import { NavLink } from "react-router-dom";

function InfoIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#e9eef2" />
      <path fill="#64748B" d="M11 10h2v7h-2zM11 7h2v2h-2z" />
    </svg>
  );
}

export default function Terms() {
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
      {/* Breadcrumbs — show on mobile only (like privacy) */}
      <nav className="small mb-2 d-lg-none" aria-label="breadcrumb">
        <NavLink className="text-muted text-decoration-none" to="/">Home</NavLink>
        <span className="text-muted"> / </span>
        <span className="text-muted">Legal</span>
        <span className="text-muted"> / </span>
        <span className="text-muted">Terms of Service</span>
      </nav>

      {/* Title + Effective date */}
      <h1 className="policy-title fw-bold">Terms of Service</h1>
      <p className="text-muted">Effective Date: {effective}</p>

      {/* Intro */}
      <section className="policy-section" id="intro">
        <h2>Introduction</h2>
        <p>
          These Terms of Service (“Terms”) govern your access to and use of Arohio’s website, products,
          and services (“Services”). By using the Services, you agree to these Terms and to our{" "}
          <NavLink className="link-teal text-decoration-none" to="/privacy">Privacy Policy</NavLink>.
          If you do not agree, do not use the Services.
        </p>
      </section>

      <section className="policy-section" id="acceptance">
        <h2>Acceptance of Terms</h2>
        <p>
          You accept these Terms by creating an account, continuing to use the Services, or otherwise
          indicating consent. We may update these Terms from time to time. Material changes will be
          communicated by updating the date above and, where appropriate, by additional notice.
          Your continued use after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="policy-section" id="eligibility">
        <h2>Eligibility &amp; Accounts</h2>
        <p>
          You must be at least 16 years old (or the age of digital consent in your jurisdiction) to use
          Arohio. You are responsible for maintaining the confidentiality of your login credentials and
          for all activity under your account. Promptly notify us of any unauthorized use.
        </p>
      </section>

      <section className="policy-section" id="use">
        <h2>Use of Service &amp; Acceptable Use</h2>
        <p>
          You agree not to misuse the Services or help anyone else do so. Prohibited conduct includes:
          attempting to access another user’s data or non-public areas; interfering with the operation,
          integrity, or security of the platform; reverse engineering or scraping except as permitted by
          applicable law; infringing intellectual property; and using the Services to transmit malware,
          spam, or illegal content.
        </p>
      </section>

      <section className="policy-section" id="user-content">
        <h2>User Content &amp; License</h2>
        <p>
          You retain ownership of content you submit (“User Content”). You grant Arohio a worldwide,
          non-exclusive license to host, process, display, and create technical derivatives of your
          User Content solely to provide and improve the Services. You represent that you have all rights
          necessary to submit the User Content and grant this license.
        </p>
      </section>

      <section className="policy-section" id="billing">
        <h2>Subscriptions, Trials &amp; Billing</h2>
        <p>
          Some features may require a paid plan. Fees, billing cycles, and renewal terms are shown at
          checkout or in your subscription settings. Unless otherwise stated, subscriptions renew
          automatically until canceled. Trials convert to paid plans at the end of the trial unless you
          cancel. Taxes may apply based on your location.
        </p>
      </section>

      <section className="policy-section" id="ip">
        <h2>Intellectual Property</h2>
        <p>
          The Services, including software, design, and content (excluding User Content), are owned by
          Arohio or its licensors and are protected by intellectual-property laws. Except as expressly
          permitted, you may not copy, modify, distribute, sell, or lease any part of the Services.
        </p>
      </section>

      <section className="policy-section" id="thirdparty">
        <h2>Third-Party Services</h2>
        <p>
          The Services may interoperate with third-party products or contain links to third-party sites.
          Arohio is not responsible for those third parties or their practices. Your use of third-party
          services is governed by their own terms and policies.
        </p>
      </section>

      <section className="policy-section" id="beta">
        <h2>Beta &amp; Preview Features</h2>
        <p>
          We may offer features identified as beta or preview. Such features are provided “as is”
          for evaluation and may change or be discontinued at any time. Performance and availability may
          be less reliable than generally available features.
        </p>
      </section>

      <section className="policy-section" id="termination">
        <h2>Term &amp; Termination</h2>
        <p>
          You may stop using the Services at any time. We may suspend or terminate access immediately if
          you violate these Terms, if required by law, or to protect the security, integrity, or rights
          of users or Arohio. Upon termination, your right to access the Services ceases, but the sections
          intended to survive (e.g., IP, Disclaimers, Limitations of Liability, Indemnification, and
          Governing Law) will remain in effect.
        </p>
      </section>

      {/* Callout (disclaimer) */}
      <div className="legal-callout d-flex align-items-start gap-2">
        <div className="flex-shrink-0"><InfoIcon /></div>
        <div className="small">
          <strong>Disclaimer:</strong> The Services are provided for general informational and
          productivity purposes. While we strive for accuracy and uptime, we do not guarantee that the
          Services will be uninterrupted, error-free, or that results will meet your requirements.
        </div>
      </div>

      <section className="policy-section" id="disclaimer">
        <h2>Disclaimers</h2>
        <p>
          THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW,
          AROHIO DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
      </section>

      <section className="policy-section" id="liability">
        <h2>Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, AROHIO WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA,
          OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICES WILL NOT EXCEED THE
          AMOUNT PAID BY YOU TO AROHIO FOR THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE EVENT
          GIVING RISE TO THE CLAIM.
        </p>
      </section>

      <section className="policy-section" id="indemnification">
        <h2>Indemnification</h2>
        <p>
          You will defend, indemnify, and hold harmless Arohio and its affiliates, officers, employees,
          and agents from and against any claims, liabilities, damages, losses, and expenses (including
          reasonable legal fees) arising out of or in any way connected with your use of the Services or
          violation of these Terms.
        </p>
      </section>

      <section className="policy-section" id="law">
        <h2>Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws applicable in your jurisdiction, without regard to
          conflict-of-laws principles. Any disputes will be resolved in the competent courts of that
          jurisdiction, unless the parties agree to an alternative forum or arbitration as required by
          local law.
        </p>
      </section>

      <section className="policy-section" id="changes">
        <h2>Changes to These Terms</h2>
        <p>
          We may modify these Terms to reflect changes in law or our Services. We’ll post updates here
          and revise the effective date above. If a change is material, we’ll provide additional notice
          where appropriate. Continued use after changes take effect constitutes acceptance.
        </p>
      </section>

      <section className="policy-section" id="contact">
        <h2>Contact Us</h2>
        <p>
          Questions about these Terms? Contact us at{" "}
          <a href="mailto:support@arohio.com" className="link-teal text-decoration-none">
            support@arohio.com
          </a>.
        </p>
      </section>
    </div>
  );
}
