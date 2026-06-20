import { useState } from "react";
import { FaCheckCircle, FaClock, FaHourglassHalf, FaCommentDots } from "react-icons/fa";

export default function CollaborationWorkflow() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";

  const steps = [
    { key: "upload",    label: "Upload",        status: "Completed"   },
    { key: "ai",        label: "AI Generation", status: "In Progress" },
    { key: "review",    label: "Review",        status: "Pending"     },
    { key: "approval",  label: "Approval",      status: "Pending"     },
    { key: "export",    label: "Export",        status: "Pending"     },
  ];

  const runs = [
    { run: "Run 1", status: "Completed",   user: "Sophia Clark",  time: "2023-09-15 10:00 AM", comments: "Approved" },
    { run: "Run 2", status: "In Progress", user: "Ethan Carter",  time: "2023-09-14 02:30 PM", comments: "Reviewing" },
    { run: "Run 3", status: "Pending",     user: "Olivia Bennett",time: "2023-09-13 09:45 AM", comments: "Awaiting AI Generation" },
  ];

  const logs = [
    { user: "Sophia Clark", action: "approved the document",          time: "2023-09-15 10:00 AM" },
    { user: "Ethan Carter", action: "started the review process",     time: "2023-09-14 02:30 PM" },
    { user: "Olivia Bennett", action:"uploaded the document",         time: "2023-09-13 09:45 AM" },
  ];

  const [activeTab, setActiveTab] = useState("activity");

  // helpers
  const statusIcon = (s) =>
    s === "Completed" ? <FaCheckCircle/> : s === "In Progress" ? <FaHourglassHalf/> : <FaClock/>;
  const statusClass = (s) =>
    s === "Completed" ? "completed" : s === "In Progress" ? "progress" : "pending";

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 24px rgba(2,8,23,.05)}
        .panel{padding:16px}

        /* TIMELINE */
        .flow{
          display:grid;
          grid-template-columns: repeat(5,1fr);
          gap:18px;
          position:relative;
        }
        /* connectors */
        .flow:before{
          content:"";
          position:absolute;left:0;right:0;top:31px; /* middle of circles */
          height:2px;background:#e5e7eb;z-index:0;
        }
        .dot{
          width:62px;height:62px;border-radius:50%;
          display:grid;place-items:center;position:relative;z-index:1;
          border:2px solid var(--line); background:#fff; color:#64748b;
          box-shadow:0 6px 14px rgba(2,8,23,.05);
          font-size:1.25rem;
        }
        .dot.completed{background:#ecfdf5;color:#16a34a;border-color:#bbf7d0}
        .dot.progress{background:#f0f9ff;color:#0284c7;border-color:#bae6fd}
        .dot.pending{background:#f9fafb;color:#94a3b8;border-color:#e5e7eb}
        .step{display:flex;flex-direction:column;align-items:center;gap:6px}
        .slabel{font-weight:900;color:var(--ink);text-align:center}
        .sstatus{font-size:.78rem;color:#94a3b8;font-weight:800}

        /* TABLE */
        .table{width:100%;border-collapse:separate;border-spacing:0}
        .table thead th{
          padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff
        }
        .table tbody td{padding:12px;border-bottom:1px solid var(--line)}
        .table tbody tr:hover{background:#fbfdff}
        .chip{padding:5px 10px;border-radius:999px;font-weight:800;font-size:.75rem;display:inline-block;border:1px solid}
        .chip.completed{background:#ecfdf5;color:#16a34a;border-color:#bbf7d0}
        .chip.progress{background:#eff6ff;color:#0284c7;border-color:#bfdbfe}
        .chip.pending{background:#fefce8;color:#a16207;border-color:#fde68a}

        /* TABS */
        .tabs{display:flex;gap:16px;border-bottom:1px solid var(--line);margin-bottom:12px}
        .tab{padding:10px 12px;font-weight:900;color:#64748b;cursor:pointer;position:relative}
        .tab.active{color:var(--teal)}
        .tab.active:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--teal);border-radius:2px}

        /* LOGS */
        .log{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px dashed #e2e8f0}
        .log:last-child{border-bottom:none}
        .log-icon{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#f1f5f9;border:1px solid #e2e8f0}
        .log .user{font-weight:900;color:var(--ink)}
        .log .time{font-size:.8rem;color:#94a3b8}

        /* ACTIONS (optional slot ready) */
        .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:2px;padding:8px 12px;font-weight:800}
        .btn-teal{background:var(--teal);border:none;color:#fff}
      `}</style>

      <h1 className="h5 title mb-1">Collaboration Workflow</h1>
      <div className="muted mb-3">Visualize and manage your document’s journey from start to finish.</div>

      <div className="row g-3">
        {/* LEFT: Timeline + Runs */}
        <div className="col-lg-8">
          <div className="card p-3 mb-3">
            <h6 className="mb-3" style={{fontWeight:900,color:INK}}>Workflow Visualization</h6>

            <div className="flow">
              {steps.map((s) => (
                <div key={s.key} className="step">
                  <div className={`dot ${statusClass(s.status)}`}>
                    {statusIcon(s.status)}
                  </div>
                  <div className="slabel">{s.label}</div>
                  <div className="sstatus">{s.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <h6 className="mb-3" style={{fontWeight:900,color:INK}}>Past Runs</h6>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Run</th>
                    <th>Status</th>
                    <th>Initiated By</th>
                    <th>Time</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.run}>
                      <td style={{fontWeight:800,color:INK}}>{r.run}</td>
                      <td>
                        <span className={`chip ${statusClass(r.status)}`}>{r.status}</span>
                      </td>
                      <td>{r.user}</td>
                      <td>{r.time}</td>
                      <td>{r.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Activity / Comments */}
        <div className="col-lg-4">
          <div className="card panel">
            <div className="tabs">
              <div
                className={`tab ${activeTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveTab("activity")}
              >
                Activity Log
              </div>
              <div
                className={`tab ${activeTab === "comments" ? "active" : ""}`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </div>
            </div>

            {activeTab === "activity" ? (
              <div>
                {logs.map((l, i) => (
                  <div key={i} className="log">
                    <div className="log-icon">
                      <FaCheckCircle color={TEAL} />
                    </div>
                    <div>
                      <div><span className="user">{l.user}</span> {l.action}</div>
                      <div className="time">{l.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted" style={{display:"flex",alignItems:"center",gap:10}}>
                <FaCommentDots/> No comments yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
