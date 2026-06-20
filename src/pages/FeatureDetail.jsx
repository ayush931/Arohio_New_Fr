import { useParams, Link, NavLink } from "react-router-dom";
import { useMemo } from "react";

const FEATURE_DATA = {
    1: {
        slug: "automated-alt-text",
        title: "Automated Alt Text Generation",
        heroImg: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
        overview:
            "Arohio’s Automated Alt Text Generation creates WCAG-aware, multilingual descriptions for images, charts, and diagrams. It adapts to brand glossaries and tone, understands surrounding context like captions and headings, and enforces length rules so descriptions remain useful for assistive tech and search engines.",
        useCases: [
            { title: "E-commerce", desc: "Generate descriptive product imagery at scale for PDPs, listings, email, and marketplace feeds." },
            { title: "Content Management Systems", desc: "Create alt text on upload inside WordPress, Drupal, and headless CMS pipelines with policy controls." },
            { title: "Media Libraries", desc: "Backfill missing descriptions across archives while maintaining consistent terminology." },
            { title: "Enterprise Docs", desc: "Make charts, dashboards, and app screenshots accessible for reports and knowledge bases." },
            { title: "Marketing Sites", desc: "Improve image SEO with keyword-aware phrasing, canonical tags, and structured metadata." },
            { title: "Regulated Industries", desc: "Meet internal accessibility standards with audit logs and approval workflows." }
        ],
        benefits: [
            "Accessibility Compliance: WCAG-aware defaults and length guidance improve screen reader outcomes.",
            "SEO Impact: Semantic descriptions strengthen image discovery and long-tail search visibility.",
            "Time Savings: Reduce manual copywriting with bulk generation and batch approvals.",
            "Brand Consistency: Glossary and tone controls keep language aligned across locales.",
            "Quality Controls: Confidence scores, diff view, and reviewer checklists before publish."
        ],
        capabilities: [
            "Understands charts and UI elements with role-aware phrasing",
            "Links captions and figures to keep context intact",
            "Supports right-to-left languages and locale formatting",
            "Exports to CMS fields, JSON, CSV, and DOCX",
            "Batch and API access with webhooks"
        ],
        integrations: [
            "WordPress",
            "Drupal",
            "Contentful",
            "Sanity",
            "Shopify",
            "AEM",
            "GCS/S3"
        ],
        metrics: [
            { k: "98.4%", v: "Benchmark accuracy across languages" },
            { k: "120+", v: "Languages supported" },
            { k: "80%", v: "Average time saved" }
        ],
        related: [
            { id: 2, title: "Image Optimization", caption: "Compression + formats" },
            { id: 3, title: "Content Analysis", caption: "Readability + structure" },
            { id: 4, title: "Accessibility Audits", caption: "WCAG 2.2 checks" }
        ],
        testimonial: {
            quote: "Arohio reduced our copy effort by 80% while raising the quality bar for accessibility and SEO.",
            author: "Accessibility Manager",
            avatar: "https://i.pravatar.cc/100?img=47"
        },
        steps: [
            "Connect CMS or upload images",
            "Choose tone, glossary, and length rules",
            "Auto-generate and review suggestions",
            "Approve in bulk and publish to fields"
        ]
    },
    2: {
        slug: "image-optimization",
        title: "Image Optimization",
        heroImg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
        overview:
            "Optimize images to modern formats with responsive sizing, perceptual quality controls, and accessibility-aware defaults that preserve context and captions.",
        useCases: [
            { title: "High-traffic pages", desc: "Reduce LCP and bandwidth with AVIF/WebP, smart srcsets, and lazy loading." },
            { title: "CMS pipelines", desc: "Generate variants on upload and enforce file-size budgets." },
            { title: "Design systems", desc: "Standardize aspect ratios, naming, and color profiles." }
        ],
        benefits: [
            "Faster Pages: Smaller files with crisp quality.",
            "Better Core Web Vitals: Optimized delivery and caching.",
            "Governance: Policy-based presets and audit logs."
        ],
        capabilities: [
            "AVIF/WebP/optimized PNG/JPEG",
            "Smart cropping and focal point detection",
            "CDN rewrite helpers and cache keys"
        ],
        integrations: ["WordPress", "Next.js", "Shopify", "Akamai", "Cloudflare"],
        metrics: [{ k: "40–70%", v: "Average size reduction" }],
        related: [{ id: 1, title: "Automated Alt Text", caption: "WCAG-aware" }],
        testimonial: {
            quote: "We saw immediate speed gains and lower CDN costs without visual regressions.",
            author: "Web Lead",
            avatar: "https://i.pravatar.cc/100?img=22"
        },
        steps: ["Connect storage or CDN", "Select presets", "Process library", "Verify and publish"]
    }
};

export default function FeatureDetail() {
    const { id } = useParams();
    const data = FEATURE_DATA[id] || FEATURE_DATA[1];

    const theme = useMemo(
        () => ({
            green: "#16c3b0",
            greenDeep: "#0fa792",
            grayBg: "#f8fafc",
            border: "#e8eef1",
            ink: "#0f172a"
        }),
        []
    );

    return (
        <div className="feature-detail text-start">
            <style>{`

        .fd-hero{border:1px solid ${theme.border}; border-radius:16px; overflow:hidden; background:#fff; box-shadow:0 10px 28px rgba(8,24,39,.06)}
        .fd-hero img{display:block; width:100%; height:340px; object-fit:cover}
        .fd-side{position:sticky; top:88px}
        .fd-h{font-family:"Times New Roman", Times, serif}
        .fd-kicker{letter-spacing:.12em; text-transform:uppercase; color:${theme.green}; font-weight:700; font-size:.8rem}
        .fd-card{border:1px solid ${theme.border}; border-radius:16px; background:#fff; box-shadow:0 8px 22px rgba(0,0,0,.05)}
        .fd-chip{display:inline-block; font-size:.75rem; border-radius:999px; padding:.25rem .6rem; background:#ecfeff; border:1px solid #a5f3fc; color:#0b1220}
        .fd-list{padding-left:1.1rem}
        .fd-list li{margin:.35rem 0}
        .fd-stat{font-weight:800}
        .fd-rel .card{border:1px solid ${theme.border}; border-radius:14px; transition:transform .18s ease, box-shadow .18s ease}
        .fd-rel .card:hover{transform:translateY(-2px); box-shadow:0 12px 26px rgba(0,0,0,.08)}
        .fd-cta{background:${theme.grayBg}; border-radius:16px}
        .btn-green{background:${theme.green}; color:#061a15; border:0; border-radius:12px; font-weight:700; padding:.7rem 1rem}
        .btn-green:hover{background:${theme.greenDeep}}
        .link{color:${theme.greenDeep}; text-decoration:none; font-weight:600}
        .link:hover{text-decoration:underline}
        .pill{display:inline-flex;align-items:center;gap:.4rem;border:1px solid ${theme.border};border-radius:999px;padding:.35rem .6rem;background:#fff}
        .muted{color:#475569}
      `}</style>

            <div className="fd-wrap px-3 px-md-4 py-4 py-md-5">
                <div className="mb-2 fd-kicker">{data.slug.replace(/-/g, " ")}</div>
                <h1 className="h3 h-md-2 fw-bold fd-h mb-3">{data.title}</h1>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="fd-hero mb-4">
                            <img src={data.heroImg} alt={data.title} />
                        </div>

                        <div className="fd-card p-3 p-md-4 mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h3 className="h6 fw-bold m-0">Overview</h3>
                                <span className="fd-chip">Production-ready</span>
                            </div>
                            <p className="muted mb-0">{data.overview}</p>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <div className="fd-card p-3 p-md-4 h-100">
                                    <h3 className="h6 fw-bold mb-2">Use Cases</h3>
                                    <ul className="muted mb-0 fd-list">
                                        {data.useCases.slice(0, Math.ceil(data.useCases.length / 2)).map((u, i) => (
                                            <li key={i}><strong>{u.title}:</strong> {u.desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="fd-card p-3 p-md-4 h-100">
                                    <h3 className="h6 fw-bold mb-2">More Use Cases</h3>
                                    <ul className="muted mb-0 fd-list">
                                        {data.useCases.slice(Math.ceil(data.useCases.length / 2)).map((u, i) => (
                                            <li key={i}><strong>{u.title}:</strong> {u.desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="fd-card p-3 p-md-4 mb-4">
                            <h3 className="h6 fw-bold mb-2">Key Capabilities</h3>
                            <div className="d-flex flex-wrap gap-2">
                                {data.capabilities.map((c, i) => (
                                    <span key={i} className="pill">{c}</span>
                                ))}
                            </div>
                            {data.metrics?.length ? (
                                <div className="row g-3 mt-3">
                                    {data.metrics.map((m, i) => (
                                        <div className="col-6 col-md-4" key={i}>
                                            <div className="p-3" style={{ border: `1px solid ${theme.border}`, borderRadius: 12 }}>
                                                <div className="fd-stat">{m.k}</div>
                                                <div className="small muted">{m.v}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="fd-card p-3 p-md-4 mb-4">
                            <h3 className="h6 fw-bold mb-2">Benefits</h3>
                            <ul className="muted mb-0 fd-list">
                                {data.benefits.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="fd-card p-3 p-md-4 mb-4">
                            <h3 className="h6 fw-bold mb-2">Setup Steps</h3>
                            <ol className="muted mb-0" style={{ paddingLeft: "1.1rem" }}>
                                {data.steps.map((s, i) => (
                                    <li key={i} style={{ margin: ".35rem 0" }}>{s}</li>
                                ))}
                            </ol>
                        </div>

                        <div className="mb-4">
                            <h3 className="h6 fw-bold mb-2">Related Features</h3>
                            <div className="row g-3 fd-rel">
                                {data.related.map((r, i) => (
                                    <div className="col-12 col-md-4" key={i}>
                                        <NavLink to={`/feature-list/${r.id}`} className="card p-3 text-decoration-none">
                                            <div className="fw-semibold">{r.title}</div>
                                            <div className="small muted">{r.caption}</div>
                                        </NavLink>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fd-card p-3 p-md-4 d-flex align-items-start gap-3">
                            <img src={data.testimonial.avatar} alt={data.testimonial.author} style={{ width: 52, height: 52, borderRadius: 999, objectFit: "cover" }} />
                            <div>
                                <div className="mb-1" style={{ color: "#f59e0b" }}>★★★★★</div>
                                <p className="mb-1">“{data.testimonial.quote}”</p>
                                <div className="small muted">— {data.testimonial.author}</div>
                            </div>
                        </div>

                        <div className="fd-cta p-4 p-md-5 mt-4">
                            <div className="row align-items-center g-3">
                                <div className="col-12 col-md">
                                    <h3 className="h5 fw-bold m-0 fd-h">Ready to elevate accessibility and SEO?</h3>
                                    <div className="small muted mt-1">Start automating content remediation with policy-driven controls.</div>
                                </div>
                                <style>{`
  .btn-green {
    background: ${theme.green};
    color: #fff; /* white text */
    border: 0;
    border-radius: 6px; /* reduced radius */
    font-weight: 700;
    padding: .7rem 1rem;
    text-decoration: none !important; /* remove underline */
    display: inline-block;
  }
  .btn-green:hover {
    background: ${theme.greenDeep};
    color: #fff; /* keep white text on hover */
    text-decoration: none !important;
  }
`}</style>

                                <div className="col-12 col-md-auto">
                                    <NavLink to="/signup" className="btn-green">Get started with {data.title.split(" ")[0]}</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="fd-side">
                            <div className="fd-card p-3 p-md-4 mb-3">
                                <div className="fw-bold mb-2">Quick Links</div>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-1"><Link to="/docs" className="link">Docs</Link></li>
                                    <li className="mb-1"><Link to="/pricing" className="link">Pricing</Link></li>
                                    <li className="mb-1"><Link to="/use-cases" className="link">Use Cases</Link></li>
                                    <li className="mb-1"><Link to="/faq" className="link">FAQ</Link></li>
                                </ul>
                            </div>
                            <div className="fd-card p-3 p-md-4 mb-3">
                                <div className="fw-bold mb-2">Integrations</div>
                                <div className="d-flex flex-wrap gap-2">
                                    {data.integrations.map((i, ix) => (
                                        <span key={ix} className="pill">{i}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="fd-card p-3 p-md-4">
                                <div className="fw-bold mb-2">Latest Resources</div>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-1"><a href="#" className="link">SEO Best Practices for Images</a></li>
                                    <li className="mb-1"><a href="#" className="link">Accessibility Guide for Developers</a></li>
                                    <li className="mb-1"><a href="#" className="link">WCAG 2.2 Checklist</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
