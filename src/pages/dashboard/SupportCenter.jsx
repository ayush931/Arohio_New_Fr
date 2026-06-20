import { useMemo, useState } from "react";
import {
  FaPlus, FaSearch, FaPaperclip, FaTag, FaExclamationTriangle,
  FaCircle, FaFilter, FaTimes
} from "react-icons/fa";

export default function SupportCenter() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const tickets = useMemo(() => ([
    { id: "S-1035", subject: "Bulk export timing out",                project: "Reports",       category: "API",           priority: "High",   status: "Open",         created: "2025-03-12" },
    { id: "S-1034", subject: "Incorrect language in output (FR)",     project: "Project Beta",  category: "AI/Model",      priority: "Medium", status: "In Progress",  created: "2025-03-12" },
    { id: "S-1033", subject: "Webhook signature mismatch",            project: "Integrations",  category: "API",           priority: "High",   status: "Open",         created: "2025-03-11" },
    { id: "S-1032", subject: "Can’t invite teammates",                 project: "Workspace",     category: "Other",         priority: "Low",    status: "Resolved",     created: "2025-03-11" },
    { id: "S-1031", subject: "Alt text not applied to some pages",    project: "Project Alpha", category: "Accessibility",  priority: "High",   status: "Open",         created: "2025-03-10" },
    { id: "S-1030", subject: "Invoice for Feb not received",          project: "Billing",       category: "Billing",       priority: "Low",    status: "Resolved",     created: "2025-03-08" },
    { id: "S-1029", subject: "OCR quality degradation",               project: "Docs OCR",      category: "AI/Model",      priority: "Medium", status: "In Progress",  created: "2025-03-07" },
    { id: "S-1028", subject: "Webhooks timing out",                   project: "Integrations",  category: "API",           priority: "High",   status: "Open",         created: "2025-03-05" },
    { id: "S-1027", subject: "Exported PDF missing pages",            project: "Reports",       category: "Accessibility",  priority: "High",   status: "Open",         created: "2025-03-04" },
    { id: "S-1026", subject: "Slack notifications duplicated",        project: "Workspace",     category: "Other",         priority: "Low",    status: "Resolved",     created: "2025-03-02" },
    { id: "S-1025", subject: "Alt text suggestions in Spanish",       project: "Project Beta",  category: "AI/Model",      priority: "Medium", status: "In Progress",  created: "2025-03-01" },
  ]), []);

  const [form, setForm] = useState({
    subject: "",
    category: "Accessibility",
    priority: "Medium",
    project: "Project Alpha",
    description: "",
    file: null,
  });
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const filtered = tickets.filter(t => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      [t.id, t.subject, t.project, t.category, t.priority, t.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return matchesStatus && matchesQuery;
  });

  const createTicket = () => {
    if (!form.subject.trim() || !form.description.trim()) {
      alert("Please fill Subject and Description.");
      return;
    }
    // TODO: call your API
    alert(`Ticket submitted: ${form.subject}`);
    setShowModal(false);
    setForm({
      subject: "",
      category: "Accessibility",
      priority: "Medium",
      project: "Project Alpha",
      description: "",
      file: null,
    });
  };

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .btn{border:1px solid var(--line);background:#fff;border-radius:3px;padding:10px 14px;font-weight:800;display:inline-flex;align-items:center;gap:8px;cursor:pointer;color:#0f172a}
        .btn-teal{background:var(--teal);color:#fff;border:none}
        .toolbar{display:flex;gap:10px;align-items:center}
        .search{flex:1;display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:3px;padding:10px 12px;background:#fff}
        .search input{border:none;outline:none;flex:1;background:#fff;color:#0f172a}
        .filter{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:3px;padding:10px 12px;background:#fff}
        .chip{font-size:.75rem;padding:6px 10px;border-radius:999px;font-weight:800;border:1px solid var(--line);background:#fff}
        .chip.open{color:#0ea5e9;background:#eff6ff;border-color:#c7e0ff}
        .chip.progress{color:#a16207;background:#fffbeb;border-color:#fde68a}
        .chip.resolved{color:#16a34a;background:#ecfdf5;border-color:#bbf7d0}
        .table{width:100%;border-collapse:separate;border-spacing:0 10px}
        .table thead th{padding:10px 12px;color:#334155;font-size:.9rem;font-weight:900}
        .table tbody tr{background:#fff;box-shadow:0 4px 14px rgba(2,8,23,.04)}
        .table td{padding:14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .table td:first-child{border-left:1px solid var(--line);border-top-left-radius:12px;border-bottom-left-radius:12px}
        .table td:last-child{border-right:1px solid var(--line);border-top-right-radius:12px;border-bottom-right-radius:12px}

        /* ---- Custom Modal (avoid Bootstrap conflicts) ---- */
        .as-overlay{position:fixed;inset:0;background:rgba(2,8,23,.45);backdrop-filter:blur(3px);
                    display:grid;place-items:center;z-index:1000}
        .as-modal{width:min(760px,92vw);background:#ffffff;border-radius:4px;border:1px solid var(--line);
                  box-shadow:0 18px 40px rgba(2,8,23,.25);padding:18px}
        .as-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .as-close{border:none;background:transparent;color:#0f172a;cursor:pointer}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:768px){ .grid2{grid-template-columns:1fr} }
        .label{font-size:.85rem;color:#0f172a;font-weight:800;margin:0 0 6px}
        .input,.select,textarea{appearance:none;background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;
                       color:#0f172a;outline:none;width:100%}
        .input:focus,.select:focus,textarea:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,0.15)}
        .upload{border:1px dashed var(--line);border-radius:3px;padding:12px;display:flex;gap:10px;align-items:center;justify-content:center;background:#f9fafb}
        .pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#f7fafc;border-radius:999px;padding:6px 10px;font-size:.8rem;font-weight:800}
      `}</style>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h5 title m-0">Support Center</h1>
          <div className="muted">Track your requests and get help from our team.</div>
        </div>
        <div className="toolbar" style={{minWidth:280}}>
          <button className="btn" title="Filters"><FaFilter /> Filters</button>
          <button className="btn btn-teal" onClick={()=>setShowModal(true)}><FaPlus/> New Ticket</button>
        </div>
      </div>

      {/* Search & Status filter */}
      <div className="d-flex gap-2 mb-3">
        <div className="search flex-grow-1">
          <FaSearch color="#94a3b8" />
          <input placeholder="Search tickets…" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="filter">
          <FaTag color={TEAL}/> 
          <select className="select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Subject</th>
              <th>Project</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{fontWeight:900,color:INK}}>{t.id}</td>
                <td>{t.subject}</td>
                <td>{t.project}</td>
                <td>{t.category}</td>
                <td>
                  <span className="pill">
                    <FaExclamationTriangle color={t.priority==="High" ? "#dc2626" : t.priority==="Medium" ? "#d97706" : "#16a34a"} />
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span className={`chip ${t.status==="Open"?"open":t.status==="In Progress"?"progress":"resolved"}`}>
                    <FaCircle style={{fontSize:8}}/> {t.status}
                  </span>
                </td>
                <td className="muted">{t.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Modal: New Ticket ===== */}
      {showModal && (
        <div className="as-overlay" onClick={(e)=>{ if(e.target === e.currentTarget) setShowModal(false); }}>
          <div className="as-modal" role="dialog" aria-modal="true">
            <div className="as-modal-head">
              <h5 className="m-0 title" style={{fontSize:"1.05rem"}}>Create Support Ticket</h5>
              <button className="as-close" onClick={()=>setShowModal(false)} aria-label="Close"><FaTimes/></button>
            </div>

            <div className="grid2">
              <div>
                <label className="label">Subject</label>
                <input className="input" placeholder="Brief issue title" value={form.subject} onChange={(e)=>set("subject",e.target.value)}/>
              </div>
              <div>
                <label className="label">Project</label>
                <select className="select" value={form.project} onChange={(e)=>set("project",e.target.value)}>
                  <option>Project Alpha</option>
                  <option>Project Beta</option>
                  <option>Billing</option>
                  <option>Integrations</option>
                  <option>Reports</option>
                  <option>Workspace</option>
                </select>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={(e)=>set("category",e.target.value)}>
                  <option>Accessibility</option>
                  <option>AI/Model</option>
                  <option>API</option>
                  <option>Billing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="select" value={form.priority} onChange={(e)=>set("priority",e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div style={{gridColumn:"1/-1"}}>
                <label className="label">Attachment (optional)</label>
                <label className="upload" htmlFor="ticketFile" style={{cursor:"pointer"}}>
                  <FaPaperclip/> {form.file ? form.file.name : "Attach screenshots or a PDF"}
                </label>
                <input id="ticketFile" type="file" style={{display:"none"}} onChange={(e)=>set("file", e.target.files?.[0] || null)} />
              </div>

              <div style={{gridColumn:"1/-1"}}>
                <label className="label">Description</label>
                <textarea rows={6} placeholder="Describe the problem, steps to reproduce, expected vs actual result…"
                  value={form.description} onChange={(e)=>set("description",e.target.value)} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-teal" onClick={createTicket}>Submit Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
