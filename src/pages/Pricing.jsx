import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

/* tiny inline icons so the file is self-contained */
function Icon({ name, size = 18 }) {
  const c = "currentColor";
  switch (name) {
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      );
    case "x":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="m18.3 5.7-1.4-1.4L12 9.2 7.1 4.3 5.7 5.7 10.6 10.6 5.7 15.5l1.4 1.4L12 12l4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9z" />
        </svg>
      );
    case "spark":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

/* money formatter */
function money(v, currency = "USD") {
  return Number(v).toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

/* normalize features from API -> array of strings */
function toFeatureArray(features) {
  if (!features) return [];
  try {
    const parsed = typeof features === "string" ? JSON.parse(features) : features;
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed && typeof parsed === "object")
      return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`);
  } catch {
    if (typeof features === "string")
      return features.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export default function Pricing() {
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'annual'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE =
    (import.meta.env?.VITE_API_BASE && String(import.meta.env.VITE_API_BASE).trim()) ||
    "http://127.0.0.1:8000";

  // Fetch real plans
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/v1/plans`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPlans(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE]);

  // Build cards from API data (only active plans)
  const cards = useMemo(() => {
    const active = (plans || []).filter(
      (p) => (p.status || "").toLowerCase() === "active"
    );
    const sorted = [...active].sort((a, b) => {
      const sa = a.sort_order ?? 9999;
      const sb = b.sort_order ?? 9999;
      if (sa !== sb) return sa - sb;
      const pa = a.price_monthly ?? Number.MAX_SAFE_INTEGER;
      const pb = b.price_monthly ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });

    return sorted.map((p, idx) => {
      const currency = p.currency || "USD";
      const monthly = p.price_monthly ?? null;
      const yearly = p.price_yearly ?? null;

      // If annual selected, show monthly-equivalent for visual consistency
      const price =
        billing === "monthly"
          ? monthly
          : yearly != null
          ? Math.round(Number(yearly) / 12)
          : null;

      const isCustom = price == null || Number.isNaN(Number(price));

      return {
        id: p.id,
        name: p.name,
        featured: Boolean(p.featured) || idx === 1,
        tag: p.tag || (idx === 1 ? "Popular" : undefined),
        priceLabel: isCustom ? "Custom" : money(price, currency),
        perLabel: isCustom ? "" : "/mo",
        blurb: p.meta_line || "",
        bullets: toFeatureArray(p.features),
        cta: {
          label: isCustom ? "Contact Sales →" : `Get ${p.name} →`,
          to: isCustom ? "/contact" : "/signup",
          kind: isCustom ? "outline" : "primary",
        },
      };
    });
  }, [plans, billing]);

  return (
    <div className="pricing-page">
      {/* HERO */}
      <section className="py-5 text-center">
        <div className="container">
          <h1
            className="fw-bold pricing-title"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted mb-3">
            Start free with 20 credits. Upgrade anytime to unlock advanced features.
          </p>

          {/* Billing toggle */}
          <div className="billing-toggle d-inline-flex align-items-center gap-2">
            <button
              type="button"
              className={`bill-btn ${billing === "monthly" ? "active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`bill-btn ${billing === "annual" ? "active" : ""}`}
              onClick={() => setBilling("annual")}
              title="Approx. monthly equivalent"
            >
              Annual <span className="save">Save ~2 months</span>
            </button>
          </div>
          {error && <div className="text-danger small mt-2">{error}</div>}
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="pb-4">
        <div className="container">
          {loading ? (
            <div className="row g-3 g-md-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-12 col-md-6 col-xl-3">
                  <div
                    className="p-card h-100 placeholder-glow"
                    style={{ minHeight: 280 }}
                  >
                    <div className="placeholder col-6 my-2" />
                    <div className="placeholder col-4 my-2" />
                    <div className="placeholder col-8 my-2" />
                    <div className="placeholder col-10 my-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center text-muted py-4">
              No plans available right now.
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {cards.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-xl-3">
                  <div className={`p-card h-100 ${p.featured ? "featured" : ""}`}>
                    {p.tag && <span className="p-badge">{p.tag}</span>}
                    <div className="p-head">
                      <div className="p-name">{p.name}</div>
                      <div className="p-price">
                        <span className="amount">{p.priceLabel}</span>
                        {p.perLabel && <span className="per">{p.perLabel}</span>}
                      </div>
                      {p.blurb && <div className="p-sub text-muted">{p.blurb}</div>}
                    </div>

                    {!!p.bullets?.length && (
                      <ul className="p-list">
                        {p.bullets.map((b, i) => (
                          <li key={i}>
                            <Icon name="check" /> {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    <NavLink
                      to={p.cta.to}
                      className={`btn ${
                        p.cta.kind === "primary"
                          ? "btn-teal-slim"
                          : "btn-outline-teal-slim"
                      } w-100`}
                    >
                      {p.cta.label}
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURE COMPARISON */}
      <section className="py-5">
        <div className="container">
          <h2 className="fs-8 fw-bold text-center section-title mb-3">
            Feature Comparison
          </h2>
          <div className="table-responsive">
            <table className="table ftable text-start align-top">
              <thead>
                <tr>
                  <th>Features</th>
                  <th>Free</th>
                  <th>Starter</th>
                  <th className="pro-col">Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Upload PDFs", true, true, true, true],
                  ["High-res extraction", false, true, true, true],
                  ["Alt-text AI", true, true, true, true],
                  ["Auto QA & flags", false, false, true, true],
                  ["PDF/UA export", false, false, true, true],
                  ["SAML SSO", false, false, false, true],
                  ["Support", "Email", "Email", "Chat", "Dedicated"],
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="feat">{row[0]}</td>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} className={i === 2 ? "pro-col" : ""}>
                        {typeof cell === "boolean" ? (
                          cell ? (
                            <span className="ok">
                              <Icon name="check" />
                            </span>
                          ) : (
                            <span className="no">
                              <Icon name="x" />
                            </span>
                          )
                        ) : (
                          <span className="text-muted small">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-5 pricing-cta full-bleed">
        <div className="container text-center">
          <h3
            className="fw-bold m-0 cta-title"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Get started today and make your PDFs accessible with AI.
          </h3>
          <p className="cta-sub mt-2 mb-0">Try it free — no credit card required.</p>

          <div className="d-flex gap-3 justify-content-center mt-3">
            <NavLink to="/signup" className="btn btn-teal-slim btn-lg">
              Try Free Credits
            </NavLink>
            <NavLink to="/signup" className="btn btn-outline-teal-slim btn-lg">
              Upgrade Now
            </NavLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5">
        <div className="container">
          <h2 className="fs-5 fw-bold text-center section-title mb-3">
            Frequently Asked Questions
          </h2>

          <div className="accordion accordion-flush" id="pricingFaq">
            {[
              {
                q: "Can I switch plans anytime?",
                a: (
                  <>
                    <p>
                      Yes. You can upgrade or downgrade at any time from your
                      Billing page. Upgrades take effect immediately and we prorate
                      the rest of your current cycle. Downgrades are scheduled for
                      the end of the current term so you don’t lose access mid-cycle.
                    </p>
                    <ul>
                      <li>All projects and outputs remain intact when you change plans.</li>
                      <li>If you add or remove seats, the change is prorated from the moment you confirm.</li>
                      <li>Annual → Monthly moves are supported; remaining annual value is credited to your balance.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "Do unused credits roll over?",
                a: (
                  <>
                    <p>
                      Monthly plans reset credits each billing cycle. Annual plans
                      allocate a larger monthly amount and include the option to
                      purchase discounted top-ups when you have a temporary spike.
                    </p>
                    <ul>
                      <li>Top-ups never expire while your subscription is active.</li>
                      <li>You can set usage alerts so you’re notified before limits.</li>
                      <li>See detailed usage in <em>Settings → Usage</em>.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "What payment methods are accepted?",
                a: (
                  <>
                    <p>
                      We accept major credit/debit cards (Visa, Mastercard, American
                      Express). For Enterprise customers we also support invoicing,
                      bank transfer, and purchase orders.
                    </p>
                    <ul>
                      <li>Prices are in USD; we handle local currency conversion.</li>
                      <li>Tax/VAT applied where required and shown at checkout/invoices.</li>
                      <li>Invoices downloadable as PDF from Billing.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "Is my data secure?",
                a: (
                  <>
                    <p>
                      Security is a top priority. Data is encrypted in transit (TLS
                      1.2+) and at rest (AES-256). Access is limited by role, with
                      auditing and just-in-time elevation for sensitive ops.
                    </p>
                    <ul>
                      <li>SSO (SAML) and SCIM available for Enterprise.</li>
                      <li>Private data never trains our general models unless you opt in.</li>
                      <li>Daily backups; regular third-party penetration tests.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "What happens if I hit plan limits?",
                a: (
                  <>
                    <p>
                      We’ll notify you as you approach limits. We apply soft throttling,
                      then pause new runs at the cap. Resume via top-ups or upgrade.
                    </p>
                    <ul>
                      <li>Admins can set per-project caps.</li>
                      <li>Usage dashboards show hourly/daily/monthly breakdowns.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "Do you offer refunds?",
                a: (
                  <>
                    <p>
                      Free Trial is free. Paid monthly charges are non-refundable once
                      a cycle begins. Annual plans can be cancelled within 14 days for
                      a prorated refund of the unused term.
                    </p>
                    <ul>
                      <li>We review extenuating circumstances—contact support.</li>
                      <li>Local consumer laws may grant additional rights; we comply.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "How long do you retain my files and outputs?",
                a: (
                  <>
                    <p>
                      By default, uploads are retained for 30 days. You can select
                      immediate deletion or enforce shorter retention org-wide.
                    </p>
                    <ul>
                      <li>Activity logs: 90 days; backups: 30 days.</li>
                      <li>Export all outputs and metadata anytime.</li>
                      <li>Permanent deletion finishes within ~24 hours across systems.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "Do you guarantee accessibility compliance?",
                a: (
                  <>
                    <p>
                      We align to WCAG 2.2 AA and PDF/UA best practices, but context
                      matters—tools support human QA before publishing.
                    </p>
                    <ul>
                      <li>Validation flags clarity/contrast/structure issues.</li>
                      <li>Export reports help pass audits and document process.</li>
                      <li>Recommend a final manual review for critical docs.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "Is there an API or integrations?",
                a: (
                  <>
                    <p>
                      Yes—REST API (batch, webhooks, signed uploads) plus integrations
                      for SharePoint, Google Drive, S3/Blob, and popular CMSs.
                    </p>
                    <ul>
                      <li>Sandbox keys on Starter and above.</li>
                      <li>Rate limits scale with plan; Enterprise can request custom.</li>
                      <li>SDKs for JavaScript and Python.</li>
                    </ul>
                  </>
                ),
              },
              {
                q: "What support and SLAs are included?",
                a: (
                  <>
                    <p>
                      Starter: email support. Pro: priority chat. Enterprise:
                      dedicated success + custom onboarding.
                    </p>
                    <ul>
                      <li>Target uptime: <strong>99.9%</strong> for Pro & Enterprise.</li>
                      <li>Public status page with incident history.</li>
                      <li>Maintenance windows announced ≥72 hours in advance.</li>
                    </ul>
                  </>
                ),
              },
            ].map((item, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header" id={`pf-h${i}`}>
                  <button
                    className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#pf-c${i}`}
                    aria-expanded={i === 0 ? "true" : "false"}
                    aria-controls={`pf-c${i}`}
                  >
                    {item.q}
                  </button>
                </h2>
                <div
                  id={`pf-c${i}`}
                  className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                  aria-labelledby={`pf-h${i}`}
                  data-bs-parent="#pricingFaq"
                >
                  <div className="accordion-body faq-body text-start">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
