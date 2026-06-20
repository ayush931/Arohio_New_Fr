import { useMemo, useState } from "react";
import {
    FaFolderOpen,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaPlus,
    FaFilePdf,
    FaCheckCircle,
    FaClock,
    FaTrash,
    FaDownload,
    FaEdit,
    FaArchive,
} from "react-icons/fa";

export default function AdminProjects() {
    const INK = "#0f172a";
    const TEAL = "#21c7b8";

    // Demo projects
    const [projectCards, setProjectCards] = useState([
        { id: "p1", title: "Annual Report 2025", files: 14, updated: "Sep 20, 2025", color: "#43c4b6", owner: "Jane Doe", badges: ["Active"] },
        { id: "p2", title: "Product Launch 2025", files: 9, updated: "Aug 25, 2025", color: "#b8c1cc", owner: "John Smith", badges: ["Planning"] },
        { id: "p3", title: "Client Onboarding Series", files: 7, updated: "Jul 10, 2025", color: "#9aa6b2", owner: "Olivia Bennett", badges: [] },
        { id: "p4", title: "Training Docs Q2", files: 18, updated: "Jun 15, 2025", color: "#b9c0c8", owner: "Ethan Harper", badges: [] },
    ]);

    const [activeProject] = useState(projectCards[0]);

    const files = useMemo(
        () => [
            { id: "f1", name: "Annual_Report_Main.pdf", size: "1.4 MB", meta: "Uploaded by Jane Doe", status: "Approved" },
            { id: "f2", name: "Financials_Q2.pdf", size: "2.8 MB", meta: "Uploaded by John Smith", status: "Reviewed" },
            { id: "f3", name: "Summary_2025.pdf", size: "600 KB", meta: "Uploaded by Jane Doe", status: "Processing" },
        ],
        []
    );

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", owner: "", files: 0, tags: "" });

    const handleAddProject = () => {
        if (!newProject.title) return;
        setProjectCards([
            ...projectCards,
            {
                id: "p" + (projectCards.length + 1),
                title: newProject.title,
                files: newProject.files || 0,
                updated: new Date().toLocaleDateString(),
                color: "#94a3b8",
                owner: newProject.owner || "Admin",
                badges: newProject.tags ? newProject.tags.split(",") : [],
            },
        ]);
        setShowModal(false);
        setNewProject({ title: "", owner: "", files: 0, tags: "" });
    };

    return (
        <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
            <style>{`
        :root {
          --ink:${INK};
          --teal:${TEAL};
          --line:#e7edf4;
          --muted:#64748b;
        }
        .page-title { font-weight:800; color:var(--ink); }
        .muted { color:var(--muted); }
        .card { background:#fff; border:1px solid var(--line); border-radius:2px; }
        .toolbar { display:flex; gap:10px; flex-wrap:wrap }
        .search { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid var(--line); border-radius:2px; padding:10px 14px; min-width:280px; }
        .search input { border:none; outline:none; flex:1; background:#fff; color:var(--ink); font-size:.9rem }
        .btn { border:1px solid var(--line); background:#fff; border-radius:2px; padding:10px 14px; display:inline-flex; align-items:center; gap:6px; font-weight:600; color:var(--ink); cursor:pointer; transition:all .2s }
        .btn:hover { background:#f1f5f9 }
       .btn-teal {
  background: var(--teal);
  color: #fff;
  border: none;
  font-weight: 700;
  border-radius: 2px;
  padding: 12px 20px; 
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-teal:hover {
  background: #19b2a3;
}

        .btn-icon { border:1px solid var(--line); background:#fff; border-radius:2px; padding:8px; color:#64748b; cursor:pointer; }
        .project-grid { display:grid; gap:18px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .project-card { background:#fff; border:1px solid var(--line); border-radius:2px; padding:16px; transition:box-shadow .2s, transform .1s; }
        .project-card:hover { box-shadow:0 8px 20px rgba(0,0,0,.08); transform:translateY(-2px) }
        .folder-icon { width:50px; height:38px; border-radius:2px; display:grid; place-items:center; color:#fff; flex:none; font-size:1.2rem }
        .badge-row { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px }
        .chip { border-radius:999px; padding:4px 10px; font-size:.75rem; font-weight:700; border:1px solid var(--line); background:#f8fafc; color:#475569 }
        .table { width:100%; border-collapse:separate; border-spacing:0 10px }
        .row-card { background:#fff; border:1px solid var(--line); border-radius:2px }
        .cell { padding:14px 16px; vertical-align:middle }
        .status { font-size:.8rem; font-weight:700; border-radius:999px; padding:6px 12px; display:inline-flex; align-items:center; gap:6px }
        .s-approved { background:#ecfdf5; color:#15803d; border:1px solid #bbf7d0 }
        .s-reviewed { background:#fffbeb; color:#b45309; border:1px solid #fde68a }
        .s-processing { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe }
        /* Modal */
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999}
        .modal-box{background:#fff;border-radius:3px;padding:24px;max-width:460px;width:100%;box-shadow:0 8px 24px rgba(0,0,0,.15);}
        .modal-header{font-weight:700;font-size:1.2rem;color:var(--ink);margin-bottom:16px}
        .form-group{margin-bottom:16px;display:flex;flex-direction:column;gap:6px}
        .form-group label{font-size:.9rem;font-weight:600;color:var(--ink)}
        .form-group input{padding:10px 12px;border:1px solid var(--line);border-radius:2px;background:#fff;color:#0f172a;font-size:.9rem;outline:none}
        .form-group input:focus{border-color:var(--teal); box-shadow:0 0 0 3px rgba(33,199,184,0.25)}
      `}</style>

            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h1 className="h5 page-title m-0">All Projects</h1>
                    <div className="muted">Admin view: Manage and monitor all projects.</div>
                </div>
                <button className="btn-teal d-inline-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                    <FaPlus /> New Project
                </button>
            </div>

            {/* Search / Filter */}
            <div className="toolbar mb-4">
                <div className="search flex-grow-1">
                    <FaSearch style={{ color: "#94a3b8" }} />
                    <input placeholder="Search projects by name, owner, or tags…" />
                </div>
                <button className="btn"><FaFilter /> Filter</button>
                <button className="btn"><FaSortAmountDown /> Sort: Updated</button>
            </div>

            {/* Projects */}
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
                                        {p.badges.map((b, i) => <span key={i} className="chip">{b}</span>)}
                                    </div>
                                )}
                                <div className="muted small mt-2">
                                    Owner: <b>{p.owner}</b> | Files: {p.files} | Updated: {p.updated}
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                <button className="btn-icon" title="Edit"><FaEdit /></button>
                                <button className="btn-icon" title="Archive"><FaArchive /></button>
                                <button className="btn-icon" title="Delete"><FaTrash /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Files List */}
            <div className="card p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold" style={{ color: INK }}>Project Files</div>
                    <div className="toolbar">
                        <label className="muted small d-flex align-items-center gap-2 m-0">
                            <input type="checkbox" /> Select All
                        </label>
                        <button className="btn"><FaDownload /> Export</button>
                        <button className="btn"><FaTrash /> Delete</button>
                    </div>
                </div>

                <table className="table m-0">
                    <tbody>
                        {files.map((f) => (
                            <tr key={f.id} className="row-card">
                                <td className="cell" style={{ width: 36 }}><input type="checkbox" /></td>
                                <td className="cell" style={{ width: 42 }}><FaFilePdf className="muted" /></td>
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
                                    <button className="btn"><FaDownload /> Download</button>
                                    <button className="btn"><FaTrash /> Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">Add New Project</div>
                        <div className="form-group">
                            <label>Project Title</label>
                            <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Owner</label>
                            <input value={newProject.owner} onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Files Count</label>
                            <input type="number" value={newProject.files} onChange={(e) => setNewProject({ ...newProject, files: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input value={newProject.tags} onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })} />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-teal" onClick={handleAddProject}>Save Project</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
