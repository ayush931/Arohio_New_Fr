import { useState } from "react";
import {
  FaCalendarAlt,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

export default function AutomationScheduling() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";

  const [showModal, setShowModal] = useState(false);
  const [weeklyEmail, setWeeklyEmail] = useState(true);

  const [jobs, setJobs] = useState([
    { id: 1, name: "Weekly Report Generation", folder: "Marketing Reports", frequency: "Weekly", nextRun: "2024-03-15 09:00", status: "Active" },
    { id: 2, name: "Monthly Invoice Processing", folder: "Finance Invoices", frequency: "Monthly", nextRun: "2024-04-01 10:00", status: "Paused" },
    { id: 3, name: "Daily Data Extraction", folder: "Research Data", frequency: "Daily", nextRun: "2024-03-12 14:00", status: "Failed" },
  ]);

  const [detail] = useState({
    name: "Weekly Report Generation",
    runs: [
      { id: 1, time: "2024-03-10 09:00", status: "success" },
      { id: 2, time: "2024-03-03 09:00", status: "success" },
      { id: 3, time: "2024-02-24 09:00", status: "success" },
    ],
    logs: "Job started successfully. Processing files… Job completed with no errors.",
  });

  const [form, setForm] = useState({
    name: "",
    folder: "Marketing Reports",
    frequency: "Weekly",
    date: "",
    time: "",
    output: "Export PDF",
    notifications: "Dashboard alerts",
    file: null,
  });

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const saveJob = () => {
    if (!form.name || !form.date || !form.time) return alert("Please fill Job Name, Date, and Time.");
    const nextRun = `${form.date} ${form.time}`;
    setJobs((j) => [
      ...j,
      { id: j.length + 1, name: form.name, folder: form.folder, frequency: form.frequency, nextRun, status: "Active" },
    ]);
    setShowModal(false);
    setForm((s) => ({ ...s, name: "", date: "", time: "", file: null }));
  };

  return (
    <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:800;color:var(--ink)}
        .muted{color:#677489}
        .card{background:#fff;border:1px solid var(--line);border-radius:3px;box-shadow:0 6px 18px rgba(15,23,42,0.04)}
        .btn{border:1px solid var(--line);background:#fff;border-radius:2px;padding:10px 14px;font-weight:700;display:inline-flex;align-items:center;gap:8px;cursor:pointer;color:#0f172a}
        .btn:hover{box-shadow:0 6px 16px rgba(15,23,42,0.06)}
        .btn-teal{background:var(--teal);color:#fff;border:none}
        .btn-teal:hover{filter:brightness(0.98)}
        .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#f7fafc;border-radius:999px;padding:6px 10px;font-size:.8rem;font-weight:800}
        .table{width:100%;border-collapse:separate;border-spacing:0 10px}
        .table thead th{padding:10px 14px;color:#334155;font-size:.9rem;font-weight:800}
        .table tbody tr{background:#fff;box-shadow:0 4px 12px rgba(2,8,23,0.04)}
        .table td{padding:14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .table td:first-child{border-left:1px solid var(--line);border-top-left-radius:10px;border-bottom-left-radius:10px}
        .table td:last-child{border-right:1px solid var(--line);border-top-right-radius:10px;border-bottom-right-radius:10px}
        .badge{font-size:.75rem;padding:6px 10px;border-radius:999px;font-weight:800}
        .badge.active{background:#e8fbf1;color:#126c45}
        .badge.paused{background:#fff7e6;color:#8f6a0a}
        .badge.failed{background:#fde8e8;color:#a94442}
        .wizard{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
        .label{font-size:.85rem;color:#0f172a;font-weight:800;margin:0 0 6px}
        .control{display:flex;flex-direction:column}
        .input,.select{appearance:none;background:#fff;border:1px solid var(--line);border-radius:2px;padding:10px 12px;color:#0f172a;outline:none}
        .input::placeholder{color:#94a3b8}
        .input:focus,.select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,0.15)}
        .actions a{color:#0f172a;text-decoration:none;font-weight:800}
        .actions a:hover{color:var(--teal)}
        .logbox{background:#f9fafc;border:1px solid var(--line);border-radius:2px;padding:12px;font-size:.92rem;color:#0f172a}

        /* ====== RENAMED to avoid Bootstrap conflicts ====== */
        .as-overlay{position:fixed;inset:0;background:rgba(2,8,23,0.45);backdrop-filter:blur(3px);
                    display:grid;place-items:center;z-index:1000}
        .as-modal{width:min(720px,92vw);background:#ffffff;color:#0f172a;border-radius:4px;border:1px solid var(--line);
                  box-shadow:0 18px 40px rgba(2,8,23,.25);padding:24px;position:relative;z-index:1001}
        .as-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .as-close{border:none;background:transparent;color:#0f172a;cursor:pointer}
        .as-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:768px){ .as-grid2{grid-template-columns:1fr} }
        .upload{border:1px dashed var(--line);border-radius:3px;padding:16px;display:flex;gap:10px;align-items:center}
      `}</style>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex flex-column gap-1">
          <h1 className="h5 title m-0"><FaCalendarAlt /> Automation & Scheduling</h1>
          <div className="muted">Run PDF processing automatically on your schedule.</div>
        </div>
        <button className="btn btn-teal" onClick={() => setShowModal(true)}>
          <FaPlus /> New Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="card p-3 mb-4">
        <table className="table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Folder</th>
              <th>Frequency</th>
              <th>Next Run</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.name}</td>
                <td>{job.folder}</td>
                <td>{job.frequency}</td>
                <td>{job.nextRun}</td>
                <td><span className={`badge ${job.status.toLowerCase()}`}>{job.status}</span></td>
                <td className="actions text-end">
                  <a href="#" onClick={(e)=>e.preventDefault()}>View Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wizard (quick presets) */}
      <div className="card p-3 mb-4">
        <h6 className="mb-3">+ New Job Wizard</h6>
        <div className="wizard">
          <div className="control">
            <label className="label">Step 1: Folder/Project</label>
            <select className="select" defaultValue="Marketing Reports">
              <option>Marketing Reports</option>
              <option>Finance Invoices</option>
              <option>Research Data</option>
            </select>
          </div>
          <div className="control">
            <label className="label">Step 2: Frequency</label>
            <select className="select" defaultValue="Weekly">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="control">
            <label className="label">Step 3: Output</label>
            <select className="select" defaultValue="Export PDF">
              <option>Export PDF</option>
              <option>Export CSV</option>
              <option>Export XLSX</option>
            </select>
          </div>
          <div className="control">
            <label className="label">Step 4: Notifications</label>
            <select className="select" defaultValue="Dashboard alerts">
              <option>Dashboard alerts</option>
              <option>Email</option>
              <option>Slack</option>
            </select>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="card p-3 mb-4">
        <h6 className="mb-3">Job Detail View: {detail.name}</h6>
        {detail.runs.map(run => (
          <div key={run.id} className="d-flex align-items-center gap-2 mb-2">
            {run.status === "success" ? <FaCheckCircle color="#16a34a" /> : <FaTimesCircle color="#dc2626" />}
            <span>Run {run.id} completed on {run.time}</span>
          </div>
        ))}
        <div className="logbox mt-3">{detail.logs}</div>
        <div className="d-flex gap-2 mt-3">
          <span className="chip">Weekly Email: {weeklyEmail ? "On" : "Off"}</span>
          <button className="btn btn-teal">Save & Activate</button>
        </div>
      </div>

      {/* ===== Modal (renamed classes) ===== */}
      {showModal && (
        <div className="as-overlay" onClick={(e)=>{ if(e.target === e.currentTarget) setShowModal(false); }}>
          <div className="as-modal" role="dialog" aria-modal="true">
            <div className="as-modal-head">
              <h5 className="m-0 title" style={{fontSize:"1.05rem"}}>Create New Scheduled Job</h5>
              <button className="as-close" onClick={()=>setShowModal(false)} aria-label="Close">
                <FaTimes size={18}/>
              </button>
            </div>

            <div className="as-grid2">
              <div className="control">
                <label className="label">Job Name</label>
                <input className="input" placeholder="e.g., Weekly Marketing PDF"
                  value={form.name} onChange={(e)=>onChange("name", e.target.value)} />
              </div>

              <div className="control">
                <label className="label">Folder/Project</label>
                <select className="select" value={form.folder} onChange={(e)=>onChange("folder", e.target.value)}>
                  <option>Marketing Reports</option>
                  <option>Finance Invoices</option>
                  <option>Research Data</option>
                </select>
              </div>

              <div className="control">
                <label className="label">Frequency</label>
                <select className="select" value={form.frequency} onChange={(e)=>onChange("frequency", e.target.value)}>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="control">
                <label className="label">Output</label>
                <select className="select" value={form.output} onChange={(e)=>onChange("output", e.target.value)}>
                  <option>Export PDF</option>
                  <option>Export CSV</option>
                  <option>Export XLSX</option>
                </select>
              </div>

              <div className="control">
                <label className="label">Start Date</label>
                <input type="date" className="input" value={form.date} onChange={(e)=>onChange("date", e.target.value)} />
              </div>

              <div className="control">
                <label className="label">Start Time</label>
                <input type="time" className="input" value={form.time} onChange={(e)=>onChange("time", e.target.value)} />
              </div>

              <div className="control">
                <label className="label">Notifications</label>
                <select className="select" value={form.notifications} onChange={(e)=>onChange("notifications", e.target.value)}>
                  <option>Dashboard alerts</option>
                  <option>Email</option>
                  <option>Slack</option>
                </select>
              </div>

              <div className="control">
                <label className="label">Upload Source PDF (optional)</label>
                <label className="upload" htmlFor="jobFile" style={{cursor:"pointer"}}>
                  <FaUpload /> <span style={{color:"#334155"}}>{form.file ? form.file.name : "Click to select a PDF"}</span>
                </label>
                <input id="jobFile" type="file" accept="application/pdf" style={{ display: "none" }}
                  onChange={(e)=>onChange("file", e.target.files?.[0] || null)} />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-teal" onClick={saveJob}>Save & Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
