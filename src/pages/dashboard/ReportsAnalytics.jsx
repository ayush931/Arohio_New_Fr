import { useMemo, useState } from "react";
import {
  FaArrowUp,
  FaFileExport,
  FaUsers,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

export default function ReportsAnalytics() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";

  const kpis = useMemo(
    () => [
      { id: "k1", title: "SEO Score Improvement", value: "+32%", sub: "this month", chip: true, accent: "#e8fbf7" },
      { id: "k2", title: "Accessibility Compliance", value: "92%", sub: "WCAG 2.1 AA", chip: false, accent: "#eef6ff" },
      { id: "k3", title: "Alt Text Coverage", value: "134 / 150", sub: "images covered", chip: false, accent: "#fff7e9" },
      { id: "k4", title: "Credits Used", value: "120 / 200", sub: "", chip: false, accent: "#f5f7fb", progress: 120 / 200 },
    ],
    []
  );

  const [weeklyEmail, setWeeklyEmail] = useState(true);

  return (
    <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:#e6edf4; }
        .title{font-weight:800;color:var(--ink)}
        .muted{color:#677489}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;}
        .krow{display:grid;gap:14px;grid-template-columns:repeat(auto-fit, minmax(200px,1fr))}
        .kcard{padding:14px;border:1px solid var(--line);border-radius:4px;background:#fff;display:flex;flex-direction:column;gap:6px}
        .kval{font-weight:900;font-size:1.3rem;color:var(--ink);display:flex;align-items:center;gap:6px}
        .pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#f7fafc;border-radius:3px;padding:4px 8px;font-size:.8rem;font-weight:800}
        .grid{display:grid;gap:16px;grid-template-columns:2fr 1fr}
        @media(max-width:992px){.grid{grid-template-columns:1fr}}
        .pane{padding:16px}
        .chartbox{background:#0b1220;border-radius:3px;height:220px;display:flex;align-items:center;justify-content:center}
        .tile{display:flex;align-items:center;gap:16px}
        .thumb{width:140px;height:120px;display:grid;place-items:center}
        .btn{border:1px solid var(--line);background:#fff;border-radius:3px;padding:10px 12px;font-weight:700;display:inline-flex;align-items:center;gap:6px}
        .btn-teal{background:var(--teal);color:#fff;border:none}
        .toggle{border:1px solid var(--line);background:#fff;border-radius:3px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between}
        .note{border-radius:2px;padding:12px;font-weight:700;border:1px solid;margin-bottom:8px}
        .n-green{background:#e8fbf1;border-color:#c6f2da;color:#126c45}
        .n-amber{background:#fff7e6;border-color:#ffe0a8;color:#8f6a0a}
        .n-blue{background:#eef6ff;border-color:#cfe2ff;color:#1b61b0}
      `}</style>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h5 title m-0">Reports & Analytics</h1>
          <div className="muted">Track your accessibility performance and SEO improvements with Arohio.</div>
        </div>
        <div className="d-flex gap-2">
          <select className="btn" defaultValue="7d">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select className="btn" defaultValue="all">
            <option value="all">All Projects</option>
            <option value="p1">Project Alpha</option>
            <option value="p2">Project Beta</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="krow mb-4">
        {kpis.map((k) => (
          <div key={k.id} className="kcard">
            <div className="muted small">{k.title}</div>
            <div className="kval">
              {k.value}
              {k.chip && <span className="pill"><FaArrowUp /> {k.value}</span>}
            </div>
            <div className="muted small">{k.sub}</div>
            {"progress" in k && (
              <div style={{height:"6px",background:"#eef2f7",borderRadius:"999px",overflow:"hidden"}}>
                <span style={{display:"block",height:"100%",width:`${Math.round((k.progress||0)*100)}%`,background:TEAL}}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid">
        {/* Left side */}
        <div className="d-flex flex-column gap-3">
          <div className="card pane">
            <h6>SEO Improvements</h6>
            <div className="chartbox">
              <svg viewBox="0 0 600 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={TEAL} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <rect width="600" height="220" fill="#0b1220" />
                <path d="M20,160 L80,150 L140,130 L200,145 L260,120 L320,110 L380,90 L440,95 L500,70 L560,60"
                      fill="none" stroke={TEAL} strokeWidth="3"/>
                <path d="M20,160 L80,150 L140,130 L200,145 L260,120 L320,110 L380,90 L440,95 L500,70 L560,60 L560,220 L20,220 Z"
                      fill="url(#g1)" />
              </svg>
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-12 col-lg-6">
              <div className="card pane">
                <h6>Accessibility Compliance</h6>
                <div className="tile">
                  <div className="thumb">
                    {/* proper donut */}
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e6edf4" strokeWidth="12" fill="none"/>
                      <circle cx="50" cy="50" r="40" stroke={TEAL} strokeWidth="12" fill="none"
                        strokeDasharray={2*Math.PI*40}
                        strokeDashoffset={(1-0.92)*2*Math.PI*40}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"/>
                      <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK}>92%</text>
                    </svg>
                  </div>
                  <div className="muted">92% compliant across all PDFs.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card pane">
                <h6>Alt Text Coverage</h6>
                <div className="tile">
                  <div className="thumb">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <rect x="20" y="60" width="12" height="20" fill="#cfe2ff"/>
                      <rect x="40" y="50" width="12" height="30" fill="#a8d8ce"/>
                      <rect x="60" y="40" width="12" height="40" fill="#7fd0c1"/>
                      <rect x="80" y="25" width="12" height="55" fill={TEAL}/>
                    </svg>
                  </div>
                  <div className="muted">134 of 150 images have alt text.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="d-flex flex-column gap-3">
          <div className="card pane">
            <h6>Credits Usage</h6>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ fontSize:"1.6rem", fontWeight:"900", color:INK }}>120</div>
                <div className="muted small">Used</div>
              </div>
              <div className="pill">80 credits remaining</div>
            </div>
            <button className="btn btn-teal mt-3">Buy More Credits</button>
          </div>

          <div className="card pane">
            <h6>Export & Sharing</h6>
            <button className="btn"><FaFileExport/> Export Report</button>
            <button className="btn mt-2"><FaUsers/> Share with Team</button>
            <div className="toggle mt-3">
              <label>Email weekly reports</label>
              <button onClick={() => setWeeklyEmail(!weeklyEmail)} style={{border:"none",background:"transparent"}}>
                {weeklyEmail ? <FaToggleOn size={28} color={TEAL}/> : <FaToggleOff size={28} color="#94a3b8"/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications moved to END */}
      <div className="card pane mt-4">
        <h6>Notifications & Insights</h6>
        <div className="note n-green">Your SEO improved 32% in the last 30 days.</div>
        <div className="note n-amber">5 images still missing alt text.</div>
        <div className="note n-blue">AI Suggestion: Focus on multilingual alt text for Project Beta.</div>
      </div>
    </div>
  );
}
