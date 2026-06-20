// src/pages/Cookies.jsx
import { useMemo } from "react";
import { NavLink } from "react-router-dom";

export default function CookiesPolicy() {
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
      {/* Breadcrumbs — MOBILE ONLY (matches Privacy/Terms pattern) */}
      <nav className="small mb-2 d-lg-none" aria-label="breadcrumb">
        <NavLink className="text-muted text-decoration-none" to="/">Home</NavLink>
        <span className="text-muted"> / </span>
        <span className="text-muted">Legal</span>
        <span className="text-muted"> / </span>
        <span className="text-muted">Cookie Policy</span>
      </nav>

      <h1 className="policy-title fw-bold">Cookie Policy</h1>
      <p className="text-muted">Effective Date: {effective}</p>

      <section className="policy-section" id="intro">
        <h2>Introduction</h2>
        <p>
          This Cookie Policy explains how <strong>Arohio</strong> uses cookies and similar technologies on our
          website and app. It works together with our{" "}
          <NavLink to="/privacy" className="link-teal text-decoration-none">Privacy Policy</NavLink>.
          By using Arohio, you agree we can place cookies on your device as described here.
        </p>
      </section>

      <section className="policy-section" id="what">
        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files placed on your device by a website or app. They help remember your
          preferences, keep you signed in, and understand how the product is used. We also use local storage,
          session storage, and similar technologies for the same purposes.
        </p>
      </section>

      <section className="policy-section" id="how-we-use">
        <h2>How Arohio uses cookies</h2>
        <p>
          Arohio processes documents (e.g., PDFs) and provides AI-powered extraction and accessibility checks.
          We use cookies to:
        </p>
        <ul className="policy-bullets">
          <li><strong>Keep you signed in</strong> and route your requests securely.</li>
          <li><strong>Remember preferences</strong> like language, theme, and UI layout.</li>
          <li><strong>Measure usage</strong> (e.g., which features—upload, extraction, analysis—are used) so we can improve reliability and UX.</li>
          <li><strong>Protect accounts</strong> (CSRF protection, rate limits, fraud prevention).</li>
        </ul>
      </section>

      <section className="policy-section" id="types">
        <h2>Types of cookies we use</h2>
        <ul className="policy-bullets">
          <li>
            <strong>Strictly Necessary:</strong> required for core functionality (authentication, load balancing,
            fraud prevention). These cannot be switched off in our systems.
          </li>
          <li>
            <strong>Performance &amp; Analytics:</strong> help us understand usage and improve speed and stability.
            We aggregate and de-identify analytics whenever possible.
          </li>
          <li>
            <strong>Functionality:</strong> remember choices (e.g., Times New Roman font preference, last used
            workspace, dismissed banners) to provide a personalized experience.
          </li>
          <li>
            <strong>Security:</strong> detect unusual activity and enforce session integrity.
          </li>
          <li>
            <strong>Advertising:</strong> <em>Not used as of the Effective Date</em>. If this changes, we’ll update
            this page and request consent where required.
          </li>
        </ul>
      </section>

      <section className="policy-section" id="first-party">
        <h2>Cookies set by Arohio (first-party)</h2>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Purpose</th>
                <th>Typical Duration</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>arohio_session</code></td>
                <td>Maintains your logged-in session and routes requests.</td>
                <td>Session</td>
                <td>Strictly Necessary</td>
              </tr>
              <tr>
                <td><code>csrf_token</code></td>
                <td>Prevents cross-site request forgery.</td>
                <td>Session</td>
                <td>Security</td>
              </tr>
              <tr>
                <td><code>consent_prefs</code></td>
                <td>Saves your cookie consent choices (e.g., analytics on/off).</td>
                <td>6–12 months</td>
                <td>Functionality</td>
              </tr>
              <tr>
                <td><code>ui_prefs</code></td>
                <td>Remembers UI preferences (font, compact mode, hidden banners).</td>
                <td>6–12 months</td>
                <td>Functionality</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small text-muted mb-0">
          Names may vary by environment; durations are indicative and may change as we refine the product.
        </p>
      </section>

      <section className="policy-section" id="third-party">
        <h2>Third-party cookies</h2>
        <p>
          Some cookies are set by third parties when you use certain features, such as social sign-in or analytics.
          These third parties are responsible for their cookies and may use them for their own purposes.
        </p>
        <ul className="policy-bullets">
          <li>
            <strong>Analytics:</strong> helps us understand page performance, usage flows (e.g., upload → extraction
            → AI analysis), and error rates. Data is used in aggregate to improve reliability.
          </li>
          <li>
            <strong>Social sign-in:</strong> if you choose “Continue with Google/Microsoft/GitHub/LinkedIn,” those
            providers may set cookies on their domains to support authentication and account linking.
          </li>
        </ul>
      </section>

      <section className="policy-section" id="choices">
        <h2>Your choices</h2>
        <ul className="policy-bullets">
          <li>
            <strong>Consent controls:</strong> Where required, we show a banner to let you accept or manage
            non-essential cookies (e.g., analytics). You can change your choice anytime in “Settings &gt; Privacy”.
          </li>
          <li>
            <strong>Browser controls:</strong> You can block or delete cookies via your browser settings.
            Blocking essential cookies may break login and core features.
          </li>
          <li>
            <strong>Opt-out of analytics:</strong> If available in your account, toggle analytics off to limit
            data collection for measurement.
          </li>
        </ul>
      </section>

      <section className="policy-section" id="signals">
        <h2>Do Not Track &amp; signals</h2>
        <p>
          Some browsers offer signals such as Do Not Track (DNT) or Global Privacy Control (GPC). Where our
          systems can recognize a valid signal, we treat it as a preference to limit non-essential tracking.
        </p>
      </section>

      <section className="policy-section" id="changes">
        <h2>Updates to this Cookie Policy</h2>
        <p>
          We may update this policy to reflect changes in technology, law, or our product. If changes are
          material, we’ll provide additional notice where appropriate. The “Effective Date” above shows when
          the latest version took effect.
        </p>
      </section>

      <section className="policy-section" id="contact">
        <h2>Contact us</h2>
        <p>
          Questions about cookies at Arohio? Email{" "}
          <a href="mailto:support@arohio.com" className="link-teal text-decoration-none">
            support@arohio.com
          </a>.
        </p>
      </section>
    </div>
  );
}
