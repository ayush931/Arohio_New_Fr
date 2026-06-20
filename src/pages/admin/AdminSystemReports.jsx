import { useMemo } from "react";
import { FaDownload } from "react-icons/fa";

export default function AdminSystemReports() {
  const INK = "#0f172a",
    TEAL = "#21c7b8",
    LINE = "#e6edf4",
    BG = "#f6f8fb";

  // Demo uptime graph
  const uptimeData = [98, 96, 99, 97, 95, 98, 97, 99, 98, 97, 96, 99];
  const uptimePath = useMemo(() => {
    const w = 260,
      h = 100,
      pad = 6;
    const max = Math.max(...uptimeData),
      min = Math.min(...uptimeData);
    const normX = (i) =>
      pad + (i * (w - pad * 2)) / Math.max(uptimeData.length - 1, 1);
    const normY = (v) =>
      h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return uptimeData
      .map((v, i) => `${i === 0 ? "M" : "L"}${normX(i)},${normY(v)}`)
      .join(" ");
  }, []);

  const logs = [
    {
      ts: "Sep 12, 2025",
      type: "Error",
      details: "Alt text service timeout",
      sev: "High",
    },
    {
      ts: "Sep 12, 2025",
      type: "Warning",
      details: "Export queue full",
      sev: "Medium",
    },
    {
      ts: "Sep 11, 2025",
      type: "Error",
      details: "Extraction failed for document",
      sev: "High",
    },
    {
      ts: "Sep 10, 2025",
      type: "Warning",
      details: "Alt text service slow",
      sev: "Low",
    },
    {
      ts: "Sep 09, 2025",
      type: "Error",
      details: "Export failed for document",
      sev: "High",
    },
  ];

  return (
    <div className="container py-3 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .grid{display:grid;gap:16px}
        .grid-4{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
        .grid-3{grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
        .stat{font-size:1.4rem;font-weight:900;color:var(--ink)}
        .pill{font-size:.75rem;font-weight:800;border-radius:999px;padding:4px 10px}
        .sev-high{color:#dc2626;background:#fee2e2}
        .sev-medium{color:#a16207;background:#fef3c7}
        .sev-low{color:#15803d;background:#dcfce7}
        .table{width:100%;border-collapse:separate;border-spacing:0}
        .table thead th{padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff}
        .table tbody td{padding:12px;border-bottom:1px solid var(--line);font-size:.9rem}
      `}</style>

      <h1 className="h5 title mb-1">System Reports</h1>
      <div className="muted mb-3">
        Monitor platform stability and performance.
      </div>

      {/* KPI cards */}
      <div className="grid grid-4 mb-4">
        <div className="card pane">
          <div className="muted">Uptime (Last 30 Days)</div>
          <div className="stat">99.98%</div>
        </div>
        <div className="card pane">
          <div className="muted">Processing Errors (Fail Rate)</div>
          <div className="stat">0.02%</div>
        </div>
        <div className="card pane">
          <div className="muted">Avg Processing Speed (Per PDF)</div>
          <div className="stat">1.2s</div>
        </div>
        <div className="card pane">
          <div className="muted">Server Load (Avg CPU)</div>
          <div className="stat">25%</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-3 mb-4">
        <div className="card pane">
          <div style={{ fontWeight: 900, color: INK, marginBottom: 8 }}>
            Uptime % Over Time
          </div>
          <svg viewBox="0 0 260 100" preserveAspectRatio="none" width="100%" height="100">
            <path d={uptimePath} fill="none" stroke={TEAL} strokeWidth="3" />
          </svg>
        </div>
        <div className="card pane">
          <div style={{ fontWeight: 900, color: INK, marginBottom: 8 }}>
            Errors by Type
          </div>
          <ul className="muted" style={{ paddingLeft: 16, lineHeight: "1.8" }}>
            <li>Extraction</li>
            <li>Alt Text</li>
            <li>Export</li>
          </ul>
        </div>
        <div className="card pane">
          <div style={{ fontWeight: 900, color: INK, marginBottom: 8 }}>
            System Load (CPU & RAM Usage)
          </div>
          <ul className="muted" style={{ paddingLeft: 16, lineHeight: "1.8" }}>
            <li>CPU</li>
            <li>RAM</li>
          </ul>
        </div>
      </div>

      {/* Logs Viewer */}
      <div className="card pane mb-3">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontWeight: 900, color: INK }}>Logs Viewer</div>
          <button className="btn btn-sm" style={{ border: "1px solid var(--line)", background: TEAL, color: "#fff", borderRadius: 8, padding: "6px 12px", fontWeight: 800 }}>
            <FaDownload size={12} style={{ marginRight: 6 }} />
            Export CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Details</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}>
                  <td>{l.ts}</td>
                  <td>{l.type}</td>
                  <td>{l.details}</td>
                  <td>
                    <span
                      className={`pill ${
                        l.sev === "High"
                          ? "sev-high"
                          : l.sev === "Medium"
                          ? "sev-medium"
                          : "sev-low"
                      }`}
                    >
                      {l.sev}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
