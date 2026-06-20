import { useMemo, useState } from "react";
import {
    FaFolderOpen,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaPlus,
    FaEllipsisH,
    FaFilePdf,
    FaCheckCircle,
    FaClock,
    FaTrash,
    FaDownload,
} from "react-icons/fa";
import SectionHeader from "../../components/dashboard/SectionHeader";

export default function DashboardProjects() {
    const INK = "#0f172a";
    const TEAL = "#21c7b8";

    const projectCards = useMemo(
        () => [
            { id: "p1", title: "Marketing Campaign 2024", files: 12, updated: "Sep 13, 2025", color: "#43c4b6", badges: [] },
            { id: "p2", title: "Product Launch Q3", files: 8, updated: "Aug 22, 2025", color: "#b8c1cc", badges: ["Planning"] },
            { id: "p3", title: "Client Onboarding", files: 5, updated: "Jul 15, 2025", color: "#9aa6b2", badges: ["Active", "New"] },
            { id: "p4", title: "Internal Training Materials", files: 15, updated: "Jun 30, 2025", color: "#b9c0c8", badges: [] },
        ],
        []
    );

    const [activeProject] = useState(projectCards[0]);

    const files = useMemo(
        () => [
            { id: "f1", name: "Campaign_Brief_v3.pdf", size: "1.2 MB", meta: "Uploaded by Jane Doe", status: "Approved" },
            { id: "f2", name: "Social_Media_Assets.pdf", size: "5.8 MB", meta: "Uploaded by John Smith", status: "Reviewed" },
            { id: "f3", name: "Ad_Copy_Final.pdf", size: "450 KB", meta: "Uploaded by Jane Doe", status: "Processing" },
        ],
        []
    );

    return (
        <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
            <style>{`
        :root{
          --ink:${INK};
          --teal:${TEAL};
          --card:#ffffff;
          --line:#e7edf4;
          --muted:#64748b;
        }
        .page-title{font-weight:800;color:var(--ink);}
        .muted{color:var(--muted);}
        .card{background:var(--card);border:1px solid var(--line);border-radius:4px;}
        /* ----- Controls */
        .toolbar{display:flex;gap:10px;flex-wrap:wrap}
        .search{
          display:flex;align-items:center;gap:8px;
          background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;min-width:280px;
        }
        .search input{
          border:none;outline:none;flex:1;background:#fff;color:var(--ink);
        }
        .search input::placeholder{color:#9aa6b2}
        /* fix dark-mode / autofill making input black */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus{
          -webkit-text-fill-color: var(--ink);
          -webkit-box-shadow: 0 0 0px 1000px #fff inset;
          box-shadow: 0 0 0px 1000px #fff inset;
        }
        .kbtn{
          border:1px solid var(--line);background:#fff;border-radius:3px;
          padding:10px 12px;display:inline-flex;align-items:center;gap:8px;color:#1f2937;font-weight:700;
        }
        .btn-teal{background:var(--teal);color:#fff;border:none;border-radius:3px;padding:10px 14px;font-weight:800;}
        /* ----- Projects grid (equal height) */
        .project-grid{
          display:grid;gap:14px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .project-card{
          background:#fff;border:1px solid var(--line);border-radius:4px;padding:14px 14px;
          display:flex;flex-direction:column;justify-content:space-between;min-height:120px;
          transition:box-shadow .2s, transform .05s;
        }
        .project-card:hover{box-shadow:0 10px 26px rgba(15,23,42,.08)}
        .folder-icon{width:44px;height:34px;border-radius:3px;display:grid;place-items:center;color:#fff;flex:none}
        .badge-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
        .chip{border-radius:999px;padding:2px 10px;font-size:.72rem;font-weight:800;border:1px solid var(--line);background:#f6f7fa;color:#475569}
        .chip.plan{background:#eaf3ff;border-color:#cfe2ff;color:#1b61b0}
        .chip.live{background:#e8fbf7;border-color:#c6f2ea;color:#0f766e}
        /* ----- Breadcrumb */
        .crumbs{font-size:.95rem;color:#94a3b8;margin-top:2px}
        .crumbs b{color:var(--ink)}
        /* ----- Table list */
        .table{width:100%;border-collapse:separate;border-spacing:0 10px}
        .row-card{background:#fff;border:1px solid var(--line);border-radius:3px}
        .cell{padding:14px 16px;vertical-align:middle}
        .status{display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:.75rem;padding:6px 12px;border-radius:999px;border:1px solid}
        .s-approved{background:#e7f9f4;color:#0b7a65;border-color:#b8e8dd}
        .s-reviewed{background:#fff8e6;color:#9b6a09;border-color:#ffdfa6}
        .s-processing{background:#eaf3ff;color:#1b61b0;border-color:#cfe2ff}
        .right-panel{position:sticky;top:16px}
        .pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#f7fafc;border-radius:999px;padding:6px 10px;color:#1f2937;font-weight:700;font-size:.8rem;}
        .btn-icon{border:1px solid var(--line);background:#fff;border-radius:3px;padding:8px 10px;color:#64748b; }
        /* Hide default */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

/* When checked */
input[type="checkbox"]:checked {
  background: #21c7b8;      /* teal */
  border-color: #21c7b8;
}

/* Add tick icon */
input[type="checkbox"]:checked::after {
  content: "✓";
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 3px;
}

      `}</style>
            <SectionHeader
                title="Projects & Folders"
                description="Keep your PDFs organized with folders, tags, and quick filters."
                buttonText="New Project"
                buttonIcon={<FaPlus />}
                onButtonClick={() => console.log("clicked")}
            />

            <div className="toolbar mb-4">
                <div className="search flex-grow-1">
                    <FaSearch style={{ color: "#94a3b8" }} />
                    <input placeholder="Search projects or files…" />
                </div>
                <button className="kbtn"><FaFilter /> Filter</button>
                <button className="kbtn"><FaSortAmountDown /> Sort: Name</button>
            </div>

            <div className="project-grid mb-4">
                {projectCards.map((p) => (
                    <div className="project-card" key={p.id}>
                        <div className="d-flex align-items-start gap-3">
                            <div className="folder-icon" style={{ background: p.color }}>
                                <FaFolderOpen />
                            </div>
                            <div className="flex-grow-1">
                                <div className="fw-bold" style={{ color: INK }}>{p.title}</div>
                                {!!p.badges.length && (
                                    <div className="badge-row">
                                        {p.badges.map((b, i) => (
                                            <span key={i} className={`chip ${b === "Planning" ? "plan" : "live"}`}>{b}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="muted small mt-2">
                                    Files: {p.files} <span className="mx-1">|</span> Last Updated: {p.updated}
                                </div>
                            </div>
                            <button className="btn-icon" title="More">
                                <FaEllipsisH />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Breadcrumb */}
            <div className="crumbs mb-3">Projects <span className="mx-1">›</span> <b>{activeProject.title}</b></div>

            <div className="row g-3">
                {/* Files list */}
                <div className="col-12 col-lg-8">
                    <div className="card p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="h6 m-0" style={{ color: INK }}>Files</div>
                            <div className="toolbar">
                                <label className="muted small d-flex align-items-center gap-2 m-0">
                                    <input type="checkbox" /> Select All
                                </label>
                                <button className="kbtn"><FaDownload /> Export</button>
                                <button className="kbtn"><FaTrash /> Delete</button>
                            </div>
                        </div>

                        <table className="table m-0">
                            <tbody>
                                {files.map((f) => (
                                    <tr key={f.id} className="row-card">
                                        <td className="cell" style={{ width: 36 }}>
                                            <input type="checkbox" />
                                        </td>
                                        <td className="cell" style={{ width: 42 }}>
                                            <FaFilePdf className="muted" />
                                        </td>
                                        <td className="cell" style={{ minWidth: 280 }}>
                                            <div className="fw-semibold" style={{ color: INK }}>{f.name}</div>
                                            <div className="muted small">{f.size} | {f.meta}</div>
                                        </td>
                                        <td className="cell" style={{ width: 180 }}>
                                            {f.status === "Approved" && <span className="status s-approved"><FaCheckCircle /> Approved</span>}
                                            {f.status === "Reviewed" && <span className="status s-reviewed"><FaClock /> Reviewed</span>}
                                            {f.status === "Processing" && <span className="status s-processing"><FaClock /> Processing</span>}
                                        </td>
                                        <td className="cell text-end" style={{ minWidth: 200 }}>
                                            <button className="kbtn"><FaDownload /> Download</button>
                                            <button className="kbtn"><FaTrash /> Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right panel */}
                <div className="col-12 col-lg-4">
                    <div className="card p-3 right-panel">
                        <div className="h6 m-0 mb-2" style={{ color: INK }}>Folder Info</div>

                        <div className="muted small mb-1 fw-bold">Description</div>
                        <div className="kbtn" style={{ background: "#f8fafc", borderColor: "#e5e7eb", cursor: "default" }}>
                            All assets for the 2024 marketing campaign.
                        </div>

                        <div className="muted small mb-1 fw-bold mt-3">Created Date</div>
                        <div className="kbtn" style={{ background: "#f8fafc", borderColor: "#e5e7eb", cursor: "default" }}>
                            January 15, 2024
                        </div>

                        <div className="muted small mb-1 fw-bold mt-3">Tags</div>
                        <div className="d-flex gap-2 flex-wrap mb-2">
                            <span className="pill">campaign</span>
                            <span className="pill">2024</span>
                            <span className="pill">social</span>
                        </div>

                        <div className="muted small mb-1 fw-bold mt-2">Members</div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="pill">S</span>
                            <span className="pill">J</span>
                            <span className="pill">M</span>
                            <button className="kbtn" aria-label="Add member"><FaPlus /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
