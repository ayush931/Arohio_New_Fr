import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaUserEdit,
    FaUserCheck,
    FaUserTie,
    FaPaperPlane,
    FaComments,
    FaClock,
    FaFilePdf,
    FaDownload,
    FaCheck,
    FaUpload,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DashboardReviewApproval() {
    const TEAL = "#21c7b8";

    return (
        <div className="container py-4 text-start" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
            <style>{`
/* --------- base --------- */
.h-title{font-weight:800;color:#0f172a;}
.subtle{color:#6b7280;}
.card{background:#fff;border:1px solid #e8eef5;border-radius:4px;}
.btn{border-radius:3px;font-weight:700;font-size:.92rem;display:inline-flex;align-items:center;gap:8px}
.btn-teal{background:${TEAL};color:#fff;border:none;padding:8px 14px}
.btn-ghost{background:#fff;border:1px solid #d1d5db;color:#0f172a;padding:8px 14px}
.input, textarea, select{background:#fff;color:#0f172a;border:1px solid #e5e7eb;border-radius:3px;padding:10px;font-size:.92rem}
small, .small{font-size:.82rem}

/* --------- top banners (exact look) --------- */
.banner{border-radius:2px;padding:10px 12px;font-size:.92rem;display:flex;align-items:center;gap:8px}
.banner-yellow{background:#fff4cd;border:1px solid #ffe59a;color:#6f5407}
.banner-green{background:#c8f5d5;border:1px solid #a8e9bb;color:#065f46}

/* --------- roles --------- */
.role-head{display:flex;align-items:center;gap:8px;font-weight:700;color:#0f172a}
.badge-soft{border-radius:999px;padding:3px 8px;font-weight:700;font-size:.72rem;display:inline-flex;gap:6px;align-items:center}
.badge-needfix{background:#ffecec;border:1px solid #ffd2d2;color:#b42318}

/* --------- table --------- */
.table{width:100%;border-collapse:separate;border-spacing:0 12px}
.table th{color:#0f172a;font-weight:800;text-transform:uppercase;font-size:.78rem;padding:0 10px 6px}
.tr{background:#fff;border:1px solid #e8eef5;border-radius:3px;overflow:hidden}
.td{padding:12px 14px}
.thumb{width:38px;height:38px;border-radius:2px;object-fit:cover;border:1px solid #e8eef5}
.pill{font-size:.75rem;font-weight:800;padding:4px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:6px}
.pill-ok{background:#e7f9f4;border:1px solid #b8e8dd;color:#0b7a65}
.pill-warn{background:#fff1f0;border:1px solid #ffd2d2;color:#b42318}

/* --------- COLLABORATION (matches comp) --------- */
.chat-card{padding:14px}
.chat-title{display:flex;align-items:center;gap:8px;color:#0f172a;font-weight:700;margin-bottom:10px}
.chat-list{display:flex;flex-direction:column;gap:8px}
.chat-row{display:flex;gap:10px;background:#fff;border:1px solid #edf2f7;border-radius:2px;padding:10px}
.avatar{width:32px;height:32px;border-radius:50%;overflow:hidden;flex:0 0 32px;border:1px solid #e6ebf2;background:#fff}
.avatar img{width:100%;height:100%;object-fit:cover}
.msg{flex:1}
.msg-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:4px}
.name{font-weight:700;color:#0f172a}
.when{color:#9aa4b2;font-size:.78rem}
.msg-text{color:#334155;font-size:.9rem;line-height:1.35}

/* input row */
.chat-input{display:flex;gap:10px;margin-top:10px}
.chat-input .input{border-radius:2px}
.chat-send{display:inline-flex;align-items:center;gap:8px;background:#eefaf9;border:1px solid #cdeceb;color:#0f172a;padding:8px 14px;border-radius:8px}

/* --------- TIMELINE (matches comp) --------- */
.tl-card{padding:14px}
.tl-title{display:flex;align-items:center;gap:8px;color:#0f172a;font-weight:700;margin-bottom:10px}
.tl-list{display:flex;flex-direction:column;gap:10px}
.tl-item{display:flex;gap:10px;align-items:flex-start}
.tl-dot{width:22px;height:22px;border-radius:999px;display:grid;place-items:center;background:#e8faf8;color:${TEAL};border:1px solid #c7efea}
.tl-text{color:#334155}
.tl-when{color:#9aa4b2;font-size:.78rem}

/* --------- export --------- */
.export{display:flex;justify-content:center;gap:10px}
      `}</style>

            <h1 className="h6 h-title mb-1">Review &amp; Approval Workflow</h1>
            <div className="subtle mb-3">Ensure each alt text meets accessibility and SEO standards before publishing.</div>

            <div className="banner banner-yellow mb-2">
                <FaExclamationTriangle /> <strong>Heads up!</strong>&nbsp;Reviewer requested changes on 3 items.
            </div>
            <div className="banner banner-green mb-4">
                <FaCheckCircle /> <strong>All set!</strong>&nbsp;Approver signed off on this document.
            </div>

            {/* roles */}
            <div className="row g-3 mb-3">
                <div className="col-lg-4">
                    <div className="card p-3 h-100">
                        <div className="role-head mb-2"><FaUserEdit /> Creator</div>
                        <div className="small subtle mb-2">PDF + 5 uploaded images • Document ready for review</div>
                        <div className="small subtle mb-1">Notes from Creator</div>
                        <textarea rows={3} className="w-100 input mb-3" placeholder="Initial thoughts and context…" />
                        <button className="btn btn-ghost w-100">Re-upload / Edit Inputs</button>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card p-3 h-100">
                        <div className="role-head mb-2"><FaUserCheck /> Reviewer</div>
                        <div className="small fw-bold mb-1" style={{ color: "#0f172a" }}>Compliance Checklist</div>
                        <ul className="small subtle mb-2"><li>WCAG guidelines</li><li>SEO optimization</li></ul>
                        <div className="small subtle mb-1">Inline Review Comments</div>
                        <textarea rows={3} className="w-100 input mb-3" placeholder="Add specific comments per image below…" />
                        <div className="d-flex gap-2">
                            <button className="btn btn-teal flex-grow-1"><FaPaperPlane /> Approve for Next Step</button>
                            <button className="btn btn-ghost flex-grow-1"><FaTimesCircle /> Request Changes</button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card p-3 h-100">
                        <div className="role-head mb-2"><FaUserTie /> Approver</div>
                        <div className="small subtle">Awaiting final sign-off for 3/5 items.</div>
                        <div className="small fw-bold mt-2 mb-1" style={{ color: "#0f172a" }}>Global Compliance Badge</div>
                        <div className="badge-soft badge-needfix mb-3"><FaExclamationTriangle /> Needs Fix</div>
                        <button className="btn btn-teal w-100"><FaCheckCircle /> Sign Off &amp; Publish</button>
                    </div>
                </div>
            </div>

            {/* review list */}
            <div className="h6 h-title mb-2" style={{ fontSize: "1rem" }}>Image + Alt Text Review List</div>
            <div className="card p-3 mb-4">
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th>THUMBNAIL</th>
                            <th>GENERATED ALT TEXT</th>
                            <th>STATUS</th>
                            <th>APPROVER ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tr">
                            <td className="td">
                                <img className="thumb" src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=80&q=80" alt="thumb-1" />
                            </td>
                            <td className="td">
                                <input className="input w-100" defaultValue="A fluffy cat sitting on a mat." />
                            </td>
                            <td className="td"><span className="pill pill-ok"><FaCheckCircle /> Reviewed</span></td>
                            <td className="td">
                                <select className="input" defaultValue="Approved">
                                    <option>Approved</option><option>Not Approved</option>
                                </select>
                            </td>
                        </tr>

                        <tr className="tr">
                            <td className="td">
                                <img className="thumb" src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=80&q=80" alt="thumb-2" />
                            </td>
                            <td className="td">
                                <input className="input w-100" style={{ borderColor: "#ffd2d2", background: "#fff5f5" }}
                                    defaultValue="A playful dog running in the park." />
                            </td>
                            <td className="td"><span className="pill pill-warn"><FaTimesCircle /> Needs Fix</span></td>
                            <td className="td">
                                <select className="input" defaultValue="Not Approved">
                                    <option>Not Approved</option><option>Approved</option>
                                </select>
                            </td>
                        </tr>

                        <tr className="tr">
                            <td className="td">
                                <img className="thumb" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&q=80" alt="thumb-3" />
                            </td>
                            <td className="td">
                                <input className="input w-100" defaultValue="A colorful bird perched on a branch." />
                            </td>
                            <td className="td"><span className="pill pill-ok"><FaCheckCircle /> Reviewed</span></td>
                            <td className="td">
                                <select className="input" defaultValue="Approved">
                                    <option>Approved</option><option>Not Approved</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* LOWER TWO COLUMNS — EXACT STYLE LIKE YOUR TARGET IMAGE */}
            <div className="row g-3">
                {/* Collaboration Tools */}
                <div className="col-lg-6">
                    <div className="card chat-card">
                        <div className="chat-title"><FaComments /> Collaboration Tools</div>

                        <div className="chat-list">
                            {/* Sarah */}
                            <div className="chat-row">
                                <div className="avatar">
                                    <img
                                        src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=80&q=80"
                                        alt="Sarah"
                                    />
                                </div>
                                <div className="msg">
                                    <div className="msg-head">
                                        <span className="name">Sarah (Reviewer)</span>
                                        <span className="when">2 days ago</span>
                                    </div>
                                    <div className="msg-text">
                                        For image 2, can we add more sensory details? @Mark, what do you think?
                                    </div>
                                </div>
                            </div>

                            {/* Mark */}
                            <div className="chat-row">
                                <div className="avatar">
                                    <img
                                        src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&q=80"
                                        alt="Mark"
                                    />
                                </div>
                                <div className="msg">
                                    <div className="msg-head">
                                        <span className="name">Mark (Creator)</span>
                                        <span className="when">1 day ago</span>
                                    </div>
                                    <div className="msg-text">
                                        Good point! I’ve updated it to “A playful golden retriever with a bright red ball,
                                        joyfully running through a sun-drenched park.”
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="chat-input">
                            <input className="input flex-grow-1" placeholder="Add a comment or @mention someone…" />
                            <button className="chat-send"><FaPaperPlane /> Send</button>
                        </div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="col-lg-6">
                    <div className="card tl-card">
                        <div className="tl-title"><FaClock /> Activity Timeline</div>

                        <div className="tl-list">
                            <div className="tl-item">
                                <div className="tl-dot"><FaUpload size={12} /></div>
                                <div className="tl-text">
                                    Mark uploaded the document <span className="tl-when">(2 days ago)</span>
                                </div>
                            </div>

                            <div className="tl-item">
                                <div className="tl-dot"><FaCheck size={12} /></div>
                                <div className="tl-text">
                                    Sarah reviewed all the alt texts <span className="tl-when">(1 day ago)</span>
                                </div>
                            </div>

                            <div className="tl-item">
                                <div className="tl-dot"><FaUserEdit size={12} /></div>
                                <div className="tl-text">
                                    Mark updated the alt text for Image 2 <span className="tl-when">(1 day ago)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* export */}
            <div className="mt-4 text-center">
                <div
                    className="h6 h-title mb-2"
                    style={{ fontSize: "1rem" }}
                >
                    Final Export / Next Step
                </div>
                <div className="export d-flex gap-2 justify-content-center">
                    <Link to="/dashboard/exports" className="btn btn-teal">
                        Proceed to Export →
                    </Link>
                </div>
            </div>

        </div>
    );
}
