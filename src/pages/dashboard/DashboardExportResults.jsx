import { Link } from "react-router-dom";
import {
  FaFilePdf,
  FaFileWord,
  FaFileCsv,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaDownload,
  FaTrash,
  FaChevronRight,
} from "react-icons/fa";

export default function DashboardExportResults() {
  const TEAL = "#21c7b8";
  const INK = "#0f172a"; // primary text

  const recent = [
    { name: "Annual_Report_2023.pdf", format: "PDF", date: "Mar 15, 2024", status: "Completed" },
    { name: "Marketing_Images_01.zip", format: "JSON", date: "Mar 14, 2024", status: "Processing" },
    { name: "Product_Descriptions.docx", format: "Word", date: "Mar 12, 2024", status: "Failed" },
  ];

  return (
    <div className="container py-4 text-start" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <style>{`
        /* Typography / colors */
        .title{font-weight:800;color:${INK};}
        .subtle{color:#475569;} /* darker than before for contrast */

        /* Cards & tiles */
        .card{background:#fff;border:1px solid #e8eef5;border-radius:3px;}
        .tile{background:#fff;border:1px solid #e8eef5;border-radius:3px;padding:18px;display:flex;flex-direction:column;gap:10px;height:100%}
        .tile-head{display:flex;align-items:center;gap:10px}
        .tile-title{font-weight:800;color:${INK}}
        .tile .small{line-height:1.35}

        /* Buttons & links */
        .btn{border-radius:2px;font-weight:700;padding:9px 14px;border:1px solid transparent}
        .btn-teal{background:${TEAL};color:#fff;border:none}
        .btn-white{background:#fff;border:1px solid #d1d5db;color:${INK}}
        .btn-link{display:inline-flex;align-items:center;gap:8px;font-weight:700;color:${TEAL};text-decoration:none}

        /* Inputs */
        .select,.check{background:#fff;border:1px solid #e5e7eb;border-radius:2px;padding:10px;color:${INK};}
        .select:focus,.check:focus{outline:2px solid ${TEAL}33; outline-offset:1px}
        .form-check-input{cursor:pointer}

        /* Banners */
        .banner{border-radius:2px;padding:12px 14px;font-size:.92rem;display:flex;align-items:center;gap:10px}
        .b-green{background:#e6f9ef;border:1px solid #bfeeda;color:#065f46}
        .b-yellow{background:#fff5cd;border:1px solid #ffe59a;color:#6f5407}
        .b-red{background:#ffeaea;border:1px solid #ffd2d2;color:#b42318}

        /* Table */
        .table{width:100%;border-collapse:separate;border-spacing:0 12px}
        .table th{color:#64748b;font-weight:700;font-size:.8rem;text-transform:uppercase;padding:0 10px 6px}
        .row-card{background:#fff;border:1px solid #e8eef5;border-radius:3px}
        .cell{padding:12px 14px;color:${INK}}

        /* Status pills */
        .status{font-size:.75rem;font-weight:800;padding:4px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:6px}
        .s-ok{background:#e7f9f4;border:1px solid #b8e8dd;color:#0b7a65}
        .s-warn{background:#fff3cd;border:1px solid #ffe59a;color:#6f5407}
        .s-bad{background:#ffecec;border:1px solid #ffd2d2;color:#b42318}

        /* Footer CTA (no sticky) */
        .footerbar{background:#0cb09f;color:#fff;border-radius:3px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;margin:24px 0 8px}
      `}</style>

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="h5 title mb-1">Export Your Results</h1>
        <div className="subtle">Choose your preferred format to integrate alt text into your publishing workflow.</div>
      </div>

      {/* Export types */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="tile">
            <div className="tile-head">
              <FaFilePdf color="#e31b23" />
              <div className="tile-title">PDF</div>
            </div>
            <div className="subtle small">Download full accessible PDF with alt text inline.</div>
            <a className="btn-link" href="#" onClick={(e)=>e.preventDefault()}>
              Download PDF <FaChevronRight size={12}/>
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="tile">
            <div className="tile-head">
              <FaFileWord color="#2b579a" />
              <div className="tile-title">Word (DOCX)</div>
            </div>
            <div className="subtle small">Editable document with figures + alt text included.</div>
            <a className="btn-link" href="#" onClick={(e)=>e.preventDefault()}>
              Download Word <FaChevronRight size={12}/>
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="tile">
            <div className="tile-head">
              <FaFileCsv color="#1f9d55" />
              <div className="tile-title">CSV</div>
            </div>
            <div className="subtle small">Structured file mapping image → alt text for database use.</div>
            <a className="btn-link" href="#" onClick={(e)=>e.preventDefault()}>
              Download CSV <FaChevronRight size={12}/>
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="tile">
            <div className="tile-head">
              <FaCode color="#f59e0b" />
              <div className="tile-title">JSON</div>
            </div>
            <div className="subtle small">Developer-friendly export for system integrations.</div>
            <a className="btn-link" href="#" onClick={(e)=>e.preventDefault()}>
              Download JSON <FaChevronRight size={12}/>
            </a>
          </div>
        </div>
      </div>

      {/* Export settings */}
      <div className="card p-3 mb-3">
        <div className="fw-bold mb-2" style={{color: INK}}>Export Settings</div>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="small subtle mb-1">Select Language</div>
            <select className="select w-100" defaultValue="English" style={{appearance:"auto"}}>
              <option>English</option>
              <option>Spanish</option>
              <option>German</option>
              <option>French</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="d-inline-flex align-items-center gap-2">
              <input type="checkbox" className="form-check-input" />
              <span className="subtle small" style={{color: INK}}>Include Metadata (file name, page number, etc.)</span>
            </label>
          </div>
          <div className="col-12 col-md-4">
            <label className="d-inline-flex align-items-center gap-2">
              <input type="checkbox" className="form-check-input" />
              <span className="subtle small" style={{color: INK}}>Compress files (ZIP)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Info banners */}
      <div className="banner b-green mb-2">
        <FaCheckCircle /> Your export is ready.
      </div>
      <div className="banner b-yellow mb-2">
        <FaExclamationTriangle /> Large export, processing in the background. We’ll notify you when it’s done.
      </div>
      <div className="banner b-red mb-4">
        <FaTimesCircle /> Export failed. Please retry or contact support.
      </div>

      {/* Recent exports table */}
      <div className="fw-bold mb-2" style={{color: INK}}>Recent Exports</div>
      <div className="card p-2">
        <table className="table m-0">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Format</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.name} className="row-card">
                <td className="cell">{r.name}</td>
                <td className="cell">{r.format}</td>
                <td className="cell">{r.date}</td>
                <td className="cell">
                  {r.status === "Completed" && (
                    <span className="status s-ok"><FaCheckCircle/> Completed</span>
                  )}
                  {r.status === "Processing" && (
                    <span className="status s-warn"><FaExclamationTriangle/> Processing</span>
                  )}
                  {r.status === "Failed" && (
                    <span className="status s-bad"><FaTimesCircle/> Failed</span>
                  )}
                </td>
                <td className="cell text-end">
                  <button className="btn btn-white me-2">
                    <FaDownload/> Re-download
                  </button>
                  <button className="btn btn-white">
                    <FaTrash/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom-only CTA (no sticky) */}
      <div className="footerbar">
        <span className="fw-semibold">All done! Your content is now accessible and ready to share.</span>
        <Link to="/dashboard" className="btn btn-teal">
          Go to Dashboard <FaChevronRight/>
        </Link>
      </div>
    </div>
  );
}
