import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

/* --------- Tiny inline icons (no external deps) --------- */
function Ico({ name, size = 20 }) {
    const c = "currentColor";
    switch (name) {
        case "upload":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M5 20h14a2 2 0 0 0 2-2v-5h-2v5H5v-5H3v5a2 2 0 0 0 2 2zm7-16 5 5h-3v6h-4v-6H7l5-5z" /></svg>;
        case "image":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M21 19V5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2zM8.5 11.5 11 15l2.5-3.5L18 18H6l2.5-6.5zM8 8a2 2 0 1 0 .001-3.999A2 2 0 0 0 8 8z" /></svg>;
        case "alt":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M3 5h18v2H3V5zm0 12h18v2H3v-2zM3 9h2v6H3V9zm16 0h2v6h-2V9zM8 9h8v6H8z" /></svg>;
        case "seo":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M3 13h8v8H3v-8zm10 0h8v8h-8v-8zM3 3h8v8H3V3zm10 0h8v8h-8V3z" /></svg>;
        case "globe":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2c1.9 0 3.6.66 5 1.76C15.92 7.1 14.06 8 12 8S8.08 7.1 7 5.76A8 8 0 0 1 12 4Zm0 16a8 8 0 0 1-5-1.76C8.08 16.9 9.94 16 12 16s3.92.9 5 2.24A8 8 0 0 1 12 20Zm7-4.53A9.97 9.97 0 0 0 14 14c-1.33 0-2.59.26-3.74.72A9.97 9.97 0 0 0 5 15.47 8 8 0 1 1 19 15.47Z" /></svg>;
        case "bot":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M11 2h2v3h-2V2zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 17 8zM5 11h14v7a2 2 0 0 1-2 2h-3v2h-4v-2H7a2 2 0 0 1-2-2v-7z" /></svg>;
        case "pdf":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L18.5 9H15zM8 13h2.5a1.5 1.5 0 0 1 0 3H9.5V18H8v-5zm5 0h1.5a1.5 1.5 0 0 1 0 3H13v2h-1.5v-5H13zm4 0h2v1.5h-0.5V18H17v-5z" /></svg>;
        case "word":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M4 4h10l6 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm10 1.5V10h4.5L14 5.5zM6 9h2l1 4 1-4h2l-2 8H9l-1-4-1 4H5L6 9z" /></svg>;
        case "excel":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M4 4h10l6 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm10 1.5V10h4.5L14 5.5zM7 9h2l1.5 2.5L12 9h2l-2.5 3.5L14 16h-2l-1.5-2.3L9 16H7l2.5-3.5L7 9z" /></svg>;
        case "ocr":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M3 7V3h4v2H5v2H3zm16 0V5h-2V3h4v4h-2zM5 17h2v2h2v2H5v-4zm12 0h2v2h2v2h-4v-4zM7 9h10v2H7V9zm0 4h7v2H7v-2z" /></svg>;
        case "spark":
            return <svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="m12 2 2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5L12 2z" /></svg>;
        default:
            return null;
    }
}

export default function Features() {
    const [from, setFrom] = useState("PDF");
    const [to, setTo] = useState("Word");

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Features • Arohio";
    }, []);

    return (
        <div className="features-page">
            <style>{`
        /* --- Hero --- */
        .fx-hero {
          position: relative;
          color: #fff;
        }
          
     .fx-hero .bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(34,197,94,0.35), rgba(8,26,20,0.85)), 
    url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop") center/cover no-repeat;
  opacity: .9; 
}

        .fx-hero .overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,23,42,0.7), rgba(15,23,42,0.85)); }
        .fx-hero .content { position:relative; z-index:1; }
        .btn-teal { background:#12b981; color:#fff; }
        .btn-teal:hover { background:#0ea371; color:#fff; }
        .btn-ghost { background:transparent; border:1px solid rgba(255,255,255,.35); color:#fff; }
        .btn-ghost:hover { border-color:#fff; color:#fff; }
        .fx-kicker { letter-spacing:.18em; text-transform:uppercase; opacity:.85; font-weight:600; }

        /* --- Cards --- */
        .fx-card { border:0; border-radius:.75rem; box-shadow:0 8px 28px rgba(0,0,0,.10); height:100%; }
        .fx-ico { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:12px; background:#ecfeff; color:#06b6d4; }
        .fx-ico.teal { background:#e6fff7; color:#10b981; }
        .fx-ico.indigo { background:#eef2ff; color:#6366f1; }
        .fx-ico.amber { background:#fff7ed; color:#f59e0b; }

        /* --- Conversions --- */
        .fx-select { display:flex; gap:.5rem; flex-wrap:wrap; }
        .fx-select .form-select { min-width:160px; }
        .fx-options .tag { font-size:.8rem; background:#f1f5f9; border-radius:999px; padding:.35rem .6rem; display:inline-block; }
        .tag + .tag { margin-left:.35rem }

        /* --- How it works --- */
        .fx-step { border-left:3px solid #12b981; padding-left:1rem; }
        .fx-step .badge { background:#ecfeff; color:#06b6d4; border:1px solid #a5f3fc; }

        /* --- Testimonials --- */
        .fx-test .avatar { width:44px; height:44px; border-radius:999px; object-fit:cover; }
        .fx-stars { color:#f59e0b; }

        /* --- Stats band --- */
        .fx-band { background:#0b1220; color:#e5e7eb; border-radius:16px; }

        /* --- FAQ --- */
        details { border:1px solid #e5e7eb; border-radius:12px; padding:.75rem 1rem; background:#fff; }
        details + details { margin-top:.6rem; }
        summary { cursor:pointer; font-weight:600; }

        /* --- Utilities --- */
        .soft { background:#fff; border-radius:.75rem; }
      `}</style>

            {/* HERO */}
            <section className="fx-hero full-bleed">
                <div className="bg" />
                <div className="overlay" />
                <div className="content">
                    <div className="container py-5 py-lg-6 text-center text-white">
                        <div className="fx-kicker mb-2">Arohio Platform</div>
                        <h1 className="display-6 fw-bold" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                            Powerful Features for Smarter Accessibility
                        </h1>
                        <p className="lead mx-auto" style={{ maxWidth: 760 }}>
                            From uploading PDFs to generating multilingual SEO alt text, Arohio makes accessibility effortless — with
                            pro-grade conversions between PDF, Word, Excel, and images.
                        </p>
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <NavLink to="/signup" className="btn btn-teal btn-lg">Try Free Credits</NavLink>
                            <NavLink to="/pricing" className="btn btn-ghost btn-lg">Get Started</NavLink>
                        </div>
                    </div>
                </div>
            </section>

         <section className="py-5">
  <style>{`
    .fx-pro .card {
      border: 1px solid #e8eef1;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(8,24,39,.06);
      height: 100%;
      transition: transform .18s ease, box-shadow .18s ease;
      padding: 1.2rem;
    }
    .fx-pro .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 38px rgba(8,24,39,.12);
    }
    .fx-ring {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #eafaf6;
      border: 1px solid #c8efe5;
    }
    .fx-ring svg {
      width: 24px;
      height: 24px;
    }
    .tone-indigo .fx-ring {background:#eef2ff;border-color:#dfe3ff;color:#6366f1}
    .tone-teal .fx-ring {background:#e6fffb;border-color:#c6f7ef;color:#0ea5a2}
    .tone-amber .fx-ring {background:#fff7ed;border-color:#ffe7c7;color:#f59e0b}
    .fx-title {font-weight:700;margin-bottom:2px}
    .fx-desc {color:#475569;font-size:.9rem;line-height:1.55;margin-bottom:.35rem}
    .fx-badge {
      font-size:.72rem;
      border-radius:999px;
      padding:.25rem .55rem;
      background:#f1f5f9;
      color:#0b1220;
      border:1px solid #e5edf1;
    }
    .fx-points {margin:.4rem 0 0 0;padding-left:1.2rem}
    .fx-points li {color:#475569;font-size:.85rem;margin:.25rem 0;list-style:disc}
    .fx-foot {display:flex;align-items:center;justify-content:space-between;margin-top:.7rem}
    .fx-link {font-weight:600;color:#0ea5a2;text-decoration:none;font-size:.9rem}
    .fx-link:hover {text-decoration:underline}
  `}</style>

  <div className="container fx-pro">
    <h2 className="h4 fw-bold mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      Features
    </h2>
    <div className="row g-3 g-md-4">
      {[
        { ico: "upload", title: "PDF Upload", badge: "Secure & Fast", desc: "Drag & drop large PDFs with checksum validation and instant preview.", tone: "tone-indigo", points: ["Auto versioning", "Virus scan on ingest", "Smart page detection"] },
        { ico: "image", title: "Intelligent Image Extraction", badge: "Layout Aware", desc: "Capture figures and tables with positions intact for clean editing.", tone: "tone-teal", points: ["Table grid retention", "Caption linking", "Figure numbering"] },
        { ico: "alt", title: "AI-Powered Alt Text", badge: "WCAG Ready", desc: "Multilingual, tone-consistent descriptions tuned for accessibility.", tone: "tone-amber", points: ["100+ languages", "Brand glossary support", "Reading-order hints"] },
        { ico: "seo", title: "SEO Optimization", badge: "Structured", desc: "Headings, metadata, and schema suggestions to boost discoverability.", tone: "tone-indigo", points: ["Auto H1-H6 map", "Canonical hints", "OpenGraph tags"] },
        { ico: "globe", title: "Multilingual Support", badge: "Enterprise", desc: "Reliable translations with term memory and locale formatting.", tone: "tone-teal", points: ["Glossary lock", "RTL handling", "Date/number rules"] },
        { ico: "bot", title: "Automation & Chatbot", badge: "Assistant", desc: "Guided fixes and scheduled checks to standardize every export.", tone: "tone-amber", points: ["Policy playbooks", "Batch runs", "Slack/Email alerts"] },
      ].map((f, i) => (
        <div className="col-12 col-md-6 col-xl-4" key={i}>
          <div className={`card d-flex flex-row align-items-start gap-3 ${f.tone}`}>
            <div className="fx-ring"><Ico name={f.ico} /></div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <div className="fx-title">{f.title}</div>
                <span className="fx-badge">{f.badge}</span>
              </div>
              <div className="fx-desc">{f.desc}</div>
              <ul className="fx-points">
                {f.points.map((p, ix) => <li key={ix}>{p}</li>)}
              </ul>
              <div className="fx-foot">
                <a className="fx-link" href={`/feature-list/${i + 1}`}>Learn more</a>
                <span className="text-muted small">Included in all plans</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



            <section className="py-5">
                <style>{`
    .fx-suite .card{border:1px solid #e8eef1;border-radius:16px;background:#fff;box-shadow:0 10px 28px rgba(8,24,39,.06);height:100%}
    .fx-suite .head{display:flex;align-items:center;justify-content:space-between}
    .fx-suite .title{font-family:"Times New Roman", Times, serif;margin:0}
    .fx-suite .chip{font-size:.75rem;border-radius:999px;padding:.25rem .6rem;background:#ecfeff;border:1px solid #a5f3fc;color:#0b1220}
    .fx-suite .sub{color:#64748b}
    .fx-suite .seg{display:inline-flex;border:1px solid #e5edf1;border-radius:12px;overflow:hidden}
    .fx-suite .seg button{padding:.45rem .8rem;font-weight:600;background:#fff;border:0}
    .fx-suite .seg button.active{background:#0ec7b0;color:#051a16}
    .fx-suite .controls{display:flex;gap:.5rem;flex-wrap:wrap}
    .fx-suite .controls .form-select{min-width:170px}
    .fx-suite .go{background:#16c3b0;color:#061a15;border:0;border-radius:12px;font-weight:700;padding:.55rem 1rem}
    .fx-suite .go:hover{background:#0fa792}
    .fx-suite .tags{display:flex;flex-wrap:wrap;gap:.5rem}
    .fx-suite .tag{font-size:.8rem;background:#f1f5f9;border-radius:999px;padding:.35rem .6rem;border:1px solid #e6edf2}
    .fx-suite .grid .it{border:1px solid #eef3f6;border-radius:14px;padding:.8rem;background:#fff;display:flex;align-items:center;gap:.55rem}
    .fx-suite .ico{width:40px;height:40px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;background:#e6fffb;color:#0ea5a2}
    .fx-suite .vis{border-radius:12px;overflow:hidden;border:1px solid #e8eef1;background:#fff}
    .fx-suite .vis .cap{padding:.75rem;border-top:1px solid #eef3f6}
  `}</style>

                <div className="container fx-suite">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-12 col-lg-7">
                            <div className="card p-3 p-md-4 h-100">
                                <div className="head">
                                    <h2 className="h5 fw-bold title">Conversions Suite</h2>
                                    <span className="chip">12+ formats</span>
                                </div>
                                <p className="sub small mt-2 mb-3">High-fidelity exports that keep structure, fonts, and accessibility metadata wherever possible.</p>

                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="seg">
                                        {["Standard", "OCR", "Compress"].map((m, idx) => (
                                            <button key={m} className={idx === 0 ? "active" : ""}>{m}</button>
                                        ))}
                                    </div>
                                    <div className="small text-muted">Latency: ~2–8s per file</div>
                                </div>

                                <div className="controls mb-3">
                                    <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                                        <option>PDF</option>
                                        <option>Word</option>
                                        <option>Excel</option>
                                        <option>Image (JPG/PNG)</option>
                                    </select>
                                    <div className="d-flex align-items-center">→</div>
                                    <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                                        <option>Word</option>
                                        <option>Excel</option>
                                        <option>PDF</option>
                                        <option>Text (OCR)</option>
                                    </select>
                                    <button className="go">Convert</button>
                                </div>

                                <div className="tags mb-3">
                                    {["Preserve tables", "Keep images", "OCR scanned", "Compress output", "Embed fonts", "WCAG hints", "Retain headings", "Detect columns"].map(t => (
                                        <span key={t} className="tag">{t}</span>
                                    ))}
                                </div>

                                <div className="row g-3 grid">
                                    {[
                                        { ico: "pdf", label: "PDF → PDF (Clean)" },
                                        { ico: "pdf", label: "PDF → Word (.docx)" },
                                        { ico: "pdf", label: "PDF → Excel (.xlsx)" },
                                        { ico: "ocr", label: "Image → Text (OCR)" },
                                        { ico: "image", label: "Image → Word (.docx)" },
                                        { ico: "image", label: "Image → PDF" },
                                        { ico: "word", label: "Word → PDF" },
                                        { ico: "excel", label: "Excel → PDF" },
                                    ].map((c, i) => (
                                        <div className="col-6 col-md-4" key={i}>
                                            <div className="it">
                                                <div className="ico"><Ico name={c.ico} /></div>
                                                <div className="small">{c.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className="vis h-100">
                                <div style={{ position: "relative", height: 300 }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80"
                                        alt="Feature preview"
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(rgba(34,197,94,.25), rgba(8,26,20,.9))",
                                        }}
                                    />
                                </div>
                                <div className="cap p-3 p-md-4 text-start">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="ico"><Ico name="spark" /></div>
                                        <h6 className="fw-bold m-0">Precision OCR + Layout</h6>
                                    </div>
                                    <p className="text-muted small mb-3">
                                        Our OCR technology is built for precision. Unlike basic converters that flatten or
                                        distort content, Arohio’s engine carefully preserves structure, formatting, and
                                        design integrity. The result is output that looks professional, accurate, and ready
                                        for immediate use.
                                    </p>
                                    <ul className="text-muted small mb-3" style={{ paddingLeft: "1.2rem" }}>
                                        <li>Preserves tables with proper borders, merged cells, and alignment</li>
                                        <li>Maintains multi-column layouts without breaking reading order</li>
                                        <li>Keeps image captions and figures linked together correctly</li>
                                        <li>Retains fonts, styles, and colors wherever possible</li>
                                        <li>Supports 120+ languages with benchmarked accuracy</li>
                                        <li>Optimized for PDFs, scanned documents, and images alike</li>
                                    </ul>
                                    <p className="text-muted small mb-3">
                                        Whether you’re handling research papers, reports, contracts, or design-heavy
                                        documents, our OCR ensures your exports stay <strong>editable, reliable, and
                                            standards-compliant</strong>.
                                    </p>
                                    <a href="#" className="fw-semibold small text-decoration-none" style={{ color: "#0ea5a2" }}>
                                        Learn more →
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* HOW IT WORKS */}
            <section className="py-5">
                <div className="container">
                    <h2 className="h5 fw-bold mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>How it works</h2>
                    <div className="row g-3 g-md-4">
                        {[
                            { step: "01", title: "Upload", desc: "Drop your PDF or images. We auto-detect language, layout, and accessibility gaps." },
                            { step: "02", title: "Review", desc: "Preview extracted text, alt text, and tables. Adjust before exporting." },
                            { step: "03", title: "Export", desc: "Choose Word, Excel, or cleaned PDF. Keep structure and SEO metadata." },
                        ].map((s, i) => (
                            <div className="col-12 col-md-4" key={i}>
                                <div className="soft p-3 h-100 fx-step">
                                    <div className="badge">Step {s.step}</div>
                                    <h3 className="h6 fw-bold mt-2">{s.title}</h3>
                                    <p className="text-muted small mb-0">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS BAND */}
            <section className="py-5 full-bleed" style={{ background: "#f8fafc" }}>
                <div className="container">
                    <div className="row g-4 text-center">
                        {[
                            { k: "98.4%", v: "OCR Accuracy (benchmarked)" },
                            { k: "120+", v: "Languages supported" },
                            { k: "1.3M+", v: "Conversions run" },
                            { k: "WCAG 2.2", v: "Guidance baked-in" },
                        ].map((s, i) => (
                            <div className="col-6 col-md-3" key={i}>
                                <div className="display-6 fw-bold text-success">{s.k}</div>
                                <div className="small text-muted">{s.v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* TESTIMONIALS */}
            <section className="py-5">
                <style>{`
    .fx-testi .card {
      border: 1px solid #e8eef1;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 8px 26px rgba(0,0,0,.06);
      transition: transform .2s ease, box-shadow .2s ease;
      height: 100%;
    }
    .fx-testi .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 36px rgba(0,0,0,.12);
    }
    .fx-testi .quote {
      font-size: .95rem;
      line-height: 1.55;
      color: #374151;
      margin-bottom: 1rem;
    }
    .fx-testi .stars {
      color: #f59e0b;
      font-size: .9rem;
      margin-bottom: .5rem;
    }
    .fx-testi .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e5e7eb;
    }
    .fx-testi .name {
      font-weight: 600;
      font-size: .9rem;
    }
    .fx-testi .role {
      font-size: .8rem;
      color: #6b7280;
    }
  `}</style>

                <div className="container fx-testi">
                    <h2 className="h5 fw-bold mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                        What Teams Say
                    </h2>
                    <div className="row g-4">
                        {[
                            { name: "Ishaan Verma", role: "Accessibility Lead", msg: "Alt text quality was shockingly good. Our content editors just approve and ship.", avatar: "https://i.pravatar.cc/100?img=12" },
                            { name: "Cathy Wong", role: "Docs Ops", msg: "The PDF→Word export preserves headings and tables. Huge time saver for us.", avatar: "https://i.pravatar.cc/100?img=32" },
                            { name: "Leo Martins", role: "SEO Manager", msg: "Multilingual SEO is finally repeatable. Consistent tags across locales.", avatar: "https://i.pravatar.cc/100?img=56" },
                        ].map((t, i) => (
                            <div className="col-12 col-md-4" key={i}>
                                <div className="card p-4">
                                    <div className="stars">★★★★★</div>
                                    <p className="quote">“{t.msg}”</p>
                                    <div className="d-flex align-items-center gap-3">
                                        <img className="avatar" src={t.avatar} alt={t.name} />
                                        <div>
                                            <div className="name">{t.name}</div>
                                            <div className="role">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* FAQ */}
            <section className="py-5">
                <style>{`
    .fx-faq details {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1rem 1.4rem;
      background: #fff;
      transition: box-shadow .2s ease;
      text-align: left;
    }
    .fx-faq details:hover {
      box-shadow: 0 6px 20px rgba(0,0,0,.06);
    }
    .fx-faq summary {
      cursor: pointer;
      font-weight: 600;
      color: #0f172a;
    }
    .fx-faq p {
      font-size: .9rem;
      color: #374151;
      margin-top: .7rem;
      line-height: 1.65;
    }
  `}</style>

                <div className="container fx-faq">
                    <h2 className="h5 fw-bold mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                        FAQs
                    </h2>
                    <div className="row g-3">
                        {[
                            { q: "Do you keep my documents?", a: "By default, we do not permanently store your files. All uploads are processed in a secure, transient environment and automatically deleted once the conversion is complete. For teams that require document history or collaboration, you can enable secure cloud storage with encryption in your account settings." },
                            { q: "Will tables and images be preserved?", a: "Yes. Our conversion engine is designed to respect layout structure. Tables are exported with rows, columns, and merged cells intact, while images and captions remain anchored to their original positions. You can further customize whether to keep images, compress them, or generate alt text automatically." },
                            { q: "Which languages are supported?", a: "We support over 120 languages across OCR, translation, and alt text generation. This includes major languages like English, Hindi, Chinese, Spanish, Arabic, and also niche regional languages. Our AI also adapts formatting rules such as date formats, number separators, and right-to-left scripts." },
                            { q: "Is there a file size limit?", a: "Yes. Depending on your subscription plan, you can upload documents up to 500MB. Large files are intelligently chunked for faster parallel processing. Enterprise users can request higher limits or connect external storage like AWS S3 or Google Drive for seamless imports." },
                            { q: "Can I use this on mobile?", a: "Absolutely. The platform is fully responsive and works on phones, tablets, and desktops. You can upload images or PDFs directly from your camera roll, use drag-and-drop from cloud apps, and access converted results from anywhere." },
                            { q: "Do you support batch processing?", a: "Yes. Power users can upload multiple files at once, set batch conversion rules, and export them together. Enterprise plans include scheduling (e.g., nightly batch runs), API endpoints, and webhook integrations for automation." },
                            { q: "Is my data secure?", a: "Security is our top priority. All transfers are encrypted with TLS 1.3, and files are sandboxed during processing. You can also enable features like two-factor authentication, role-based access, and data residency options. For highly regulated industries, on-premise deployments are available." },
                            { q: "Can I customize alt text outputs?", a: "Yes. Alt text generation can be fine-tuned with your brand glossary, tone preferences (formal, casual, technical), and even length guidelines. This ensures that descriptions remain consistent with your brand’s style and meet accessibility standards." },
                            { q: "How accurate is OCR?", a: "Our OCR engine achieves benchmarked accuracy of 98.4% across multi-language datasets. It handles noisy scans, handwriting, and multi-column layouts. Post-processing options like spell-check and dictionary matching further improve reliability." },
                            { q: "Do you offer free credits?", a: "Yes. Every new account starts with free conversion credits. This allows you to test PDF-to-Word, OCR, and other core features risk-free before choosing a plan. You can also earn bonus credits through referrals or feedback programs." },
                        ].map((f, i) => (
                            <div className="col-12 col-md-6" key={i}>
                                <details>
                                    <summary>{f.q}</summary>
                                    <p>{f.a}</p>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
