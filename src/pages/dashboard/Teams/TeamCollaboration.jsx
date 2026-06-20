import { useState, useMemo } from "react";
import { FaPaperPlane, FaSearch, FaEnvelopeOpenText } from "react-icons/fa";

export default function TeamCollaboration() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";

  const [activeTab, setActiveTab] = useState("board"); // "board" | "members"

  // ---------- Comments ----------
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "Reviewer 1", role: "Reviewer", time: "2 hours ago", text: "This document needs some revisions before approval. Can we adjust the margins? @Approver1" },
    { id: 2, user: "Approver 1", role: "Approver", time: "1 hour ago", text: "I agree with the reviewer’s comments. Please address them." },
    { id: 3, user: "Reviewer 2", role: "Reviewer", time: "30 minutes ago", text: "The image quality is excellent. No changes needed.", approved: true },
  ]);

  const addComment = () => {
    if (!comment.trim()) return;
    setComments((c) => [...c, { id: Date.now(), user: "You", role: "Member", time: "Just now", text: comment }]);
    setComment("");
  };

  // ---------- Members ----------
  const [query, setQuery] = useState("");
  const [members] = useState([
    { id: "u1", name: "Ethan Harper",   email: "ethan.harper@example.com",   role: "Approver",  status: "Active" },
    { id: "u2", name: "Olivia Bennett", email: "olivia.bennett@example.com", role: "Viewer",    status: "Active" },
    { id: "u3", name: "Liam Carter",    email: "liam.carter@example.com",    role: "Reviewer",  status: "Pending" },
    { id: "u4", name: "Sophia Davis",   email: "sophia.davis@example.com",   role: "Creator",   status: "Suspended" },
    { id: "u5", name: "Noah Evans",     email: "noah.evans@example.com",     role: "Creator",   status: "Active" },
    { id: "u6", name: "Chloe Foster",   email: "chloe.foster@example.com",   role: "Reviewer",  status: "Active" },
    { id: "u7", name: "Daniel Gray",    email: "daniel.gray@example.com",    role: "Viewer",    status: "Pending" },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  }, [query, members]);

  // avatar initials (JS-safe)
  const initials = useMemo(() => (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map(s => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, []);

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}

        /* tabs */
        .tabs{display:flex;gap:18px;border-bottom:1px solid var(--line);margin-bottom:16px}
        .tab{padding:12px 2px;font-weight:800;color:#64748b;cursor:pointer;position:relative;user-select:none}
        .tab.active{color:var(--teal)}
        .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--teal);border-radius:2px}

        /* board layout */
        .board{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        @media(max-width:1100px){.board{grid-template-columns:1fr 1fr}}
        @media(max-width:640px){.board{grid-template-columns:1fr}}

        .lane{
          background:#fff;border:1px solid var(--line);border-radius:4px;
          padding:12px;min-height:120px;display:flex;flex-direction:column;gap:10px
        }
        .lane-head{display:flex;align-items:center;justify-content:space-between}
        .lane-title{font-weight:900;color:var(--ink)}
        .lane-count{font-size:.76rem;font-weight:800;color:#64748b;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:999px;padding:2px 8px}

        /* task cards */
        .cardy{
          background:#fff;border:1px solid var(--line);border-radius:3px;padding:12px;
          box-shadow:0 8px 16px rgba(2,8,23,.04); display:flex; flex-direction:column; gap:6px;
          transition:transform .08s ease, box-shadow .12s ease;
        }
        .cardy:hover{transform:translateY(-1px);box-shadow:0 10px 18px rgba(2,8,23,.06)}
        .file{font-weight:800;color:var(--ink);line-height:1.25}
        .meta{display:flex;gap:10px;flex-wrap:wrap;color:#64748b;font-size:.85rem}
        .pill{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;font-weight:800;padding:4px 8px;border-radius:999px;border:1px solid}
        .pill.pending{color:#a16207;background:#fffbeb;border-color:#fde68a}
        .pill.approved{color:#16a34a;background:#ecfdf5;border-color:#bbf7d0}
        .pill.complete{color:#334155;background:#eef2f7;border-color:#e2e8f0}
        .pill.neutral{color:#475569;background:#f8fafc;border-color:#e2e8f0}

        .btn-primary{
          background:var(--teal);border:none;color:#fff;border-radius:2px;
          padding:10px 16px;font-weight:800;cursor:pointer
        }
        .toolbar{display:flex;gap:10px;margin-top:6px}

        /* right panel (comments) */
        .side{
          background:#fff;border:1px solid var(--line);border-radius:4px;padding:16px;
          box-shadow:0 10px 24px rgba(2,8,23,.05)
        }
        .c-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed #e2e8f0}
        .c-item:last-child{border-bottom:none}
        .avatar{
          width:36px;height:36px;border-radius:50%;background:#e6fffb;color:#0b5d56;
          font-weight:900;display:grid;place-items:center;border:1px solid #bff0ea
        }
        .c-head{display:flex;align-items:center;gap:8px}
        .c-name{font-weight:900;color:var(--ink)}
        .c-role{font-size:.72rem;font-weight:800;color:#64748b;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:999px;padding:2px 8px}
        .c-time{margin-left:auto;font-size:.78rem;color:#94a3b8}
        .c-text{
          margin-top:6px;color:#0f172a;font-size:.95rem;line-height:1.5;
          background:#f9fafb;border:1px solid var(--line);border-radius:2px;padding:10px
        }
        .c-approved{margin-top:6px;font-size:.78rem;font-weight:800;color:#16a34a}

        .composer{display:flex;gap:10px;margin-top:14px}
        .composer input{
          flex:1;border:1px solid var(--line);border-radius:3px;padding:12px 14px;outline:none;
          background:#ffffff; color:#0f172a;
        }
        .composer input::placeholder{color:#94a3b8}
        .composer input:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,.15)}
        .composer button{
          width:44px;height:44px;border:none;border-radius:3px;background:var(--teal);
          color:#fff;display:grid;place-items:center;cursor:pointer
        }

        .hint{font-size:.78rem;color:#94a3b8}

        /* Members list */
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 18px rgba(2,8,23,.05)}
        .pane{padding:14px}
        .searchbar{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:3px;background:#fff;padding:10px 12px}
        .searchbar input{border:none;outline:none;flex:1;background:#fff;color:#0f172a}
        .rowy{display:flex;align-items:center;gap:12px;justify-content:space-between}
        .mlist{margin-top:12px}
        .mrow{display:grid;grid-template-columns:1.4fr 1.8fr .9fr .9fr .9fr;gap:12px;align-items:center;
              padding:12px;border-bottom:1px solid #eef2f7}
        @media(max-width:900px){.mrow{grid-template-columns:1.6fr 1.6fr 1fr}}
        @media(max-width:600px){.mrow{grid-template-columns:1fr}}
        .mname{display:flex;align-items:center;gap:10px;font-weight:900;color:var(--ink)}
        .memail{color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .chip{font-size:.75rem;font-weight:800;border:1px solid #e2e8f0;border-radius:999px;padding:4px 10px;background:#f8fafc;color:#475569}
        .status{font-size:.75rem;font-weight:800;border-radius:999px;padding:4px 10px;border:1px solid;display:inline-block}
        .s-active{color:#16a34a;background:#ecfdf5;border-color:#bbf7d0}
        .s-pend{color:#a16207;background:#fffbeb;border-color:#fde68a}
        .s-susp{color:#dc2626;background:#fef2f2;border-color:#fecaca}
        .mact{display:flex;gap:8px;justify-content:flex-end}
        .btn-ghost{background:#fff;border:1px solid var(--line);border-radius:2px;padding:8px 10px;font-weight:800;cursor:pointer;color:#0f172a;  }
      `}</style>

      <h1 className="h5 title mb-3">Team Collaboration</h1>

      {/* Tabs */}
      <div className="tabs mb-4">
        <div
          className={`tab ${activeTab === "board" ? "active" : ""}`}
          onClick={() => setActiveTab("board")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("board")}
        >
          Shared Project Board
        </div>
        <div
          className={`tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("members")}
        >
          Team Members
        </div>
      </div>

      {activeTab === "board" ? (
        <div className="row g-3">
          {/* Left: Board */}
          <div className="col-lg-8">
            <div className="board">
              {/* Lane: To Do */}
              <div className="lane">
                <div className="lane-head">
                  <div className="lane-title">To Do</div>
                  <span className="lane-count">3</span>
                </div>

                <div className="cardy">
                  <div className="file">Annual-Report-2024.pdf</div>
                  <div className="meta">
                    <span className="hint">Due: Tomorrow</span>
                    <span className="pill neutral">Task Assigned</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">Client-Presentation.pptx</div>
                  <div className="meta">
                    <span className="hint">Due: In 3 days</span>
                    <span className="pill neutral">2 members active</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">Brand-Guidelines-v1.docx</div>
                  <div className="meta">
                    <span className="hint">Due: Next week</span>
                    <span className="pill neutral">Awaiting brief</span>
                  </div>
                </div>
              </div>

              {/* Lane: In Review */}
              <div className="lane">
                <div className="lane-head">
                  <div className="lane-title">In Review</div>
                  <span className="lane-count">3</span>
                </div>

                <div className="cardy">
                  <div className="file">Website-Mockup-v2.fig</div>
                  <div className="meta">
                    <span className="hint">Submitted: 2 hours ago</span>
                    <span className="pill pending">Pending Review</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">HR-Policy-Update.pdf</div>
                  <div className="meta">
                    <span className="hint">Submitted: 1 day ago</span>
                    <span className="pill pending">Reviewer assigned</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">Marketing-Plan-Q4.xlsx</div>
                  <div className="meta">
                    <span className="hint">Submitted: 3 hours ago</span>
                    <span className="pill pending">Feedback requested</span>
                  </div>
                </div>
              </div>

              {/* Lane: Approved */}
              <div className="lane">
                <div className="lane-head">
                  <div className="lane-title">Approved</div>
                  <span className="lane-count">3</span>
                </div>

                <div className="cardy">
                  <div className="file">logo-final-dark.svg</div>
                  <div className="meta">
                    <span className="hint">Approved: 1 day ago</span>
                    <span className="pill approved">Approved</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">Privacy-Notice-v3.pdf</div>
                  <div className="meta">
                    <span className="hint">Approved: Today</span>
                    <span className="pill approved">Approved</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">New-Onboarding-Flow.mp4</div>
                  <div className="meta">
                    <span className="hint">Approved: Yesterday</span>
                    <span className="pill approved">Approved</span>
                  </div>
                </div>
              </div>

              {/* Lane: Exported */}
              <div className="lane">
                <div className="lane-head">
                  <div className="lane-title">Exported</div>
                  <span className="lane-count">3</span>
                </div>

                <div className="cardy">
                  <div className="file">Marketing-Assets.zip</div>
                  <div className="meta">
                    <span className="hint">Exported: 5 days ago</span>
                    <span className="pill complete">Completed</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">Invoices-July.csv</div>
                  <div className="meta">
                    <span className="hint">Exported: 2 days ago</span>
                    <span className="pill complete">Completed</span>
                  </div>
                </div>

                <div className="cardy">
                  <div className="file">QA-Report-Run-12.pdf</div>
                  <div className="meta">
                    <span className="hint">Exported: Today</span>
                    <span className="pill complete">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="toolbar">
              <button className="btn-primary">Open Chat →</button>
            </div>
          </div>

          {/* Right: Comments */}
          <div className="col-lg-4">
            <div className="side">
              <h6 className="mb-2" style={{fontWeight:900,color:INK}}>Real-time Comments</h6>
              <div className="hint mb-2">Mention teammates with @name. Decisions are logged automatically.</div>

              {comments.map(c => (
                <div key={c.id} className="c-item">
                  <div className="avatar">{initials(c.user)}</div>
                  <div style={{flex:1}}>
                    <div className="c-head">
                      <span className="c-name">{c.user}</span>
                      <span className="c-role">{c.role}</span>
                      <span className="c-time">{c.time}</span>
                    </div>
                    <div className="c-text">{c.text}</div>
                    {c.approved && <div className="c-approved">✔ Approver approved this item</div>}
                  </div>
                </div>
              ))}

              <div className="composer">
                <input
                  placeholder="Write a comment…  (Use @ to mention)"
                  value={comment}
                  onChange={(e)=>setComment(e.target.value)}
                  onKeyDown={(e)=>{ if(e.key==="Enter") addComment(); }}
                />
                <button aria-label="Send comment" onClick={addComment}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // -------- Team Members Tab --------
        <div className="card pane">
          <div className="rowy">
            <div className="title" style={{fontSize:"1rem"}}>Team Members</div>
            <div className="searchbar" style={{minWidth:280}}>
              <FaSearch size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by name, email, role, status…"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mlist">
            {/* header row */}
            <div className="mrow" style={{fontWeight:900,color:"#475569"}}>
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div className="text-end">Actions</div>
            </div>

            {filtered.map(m => (
              <div key={m.id} className="mrow">
                <div className="mname">
                  <div className="avatar" style={{width:32,height:32}}>{initials(m.name)}</div>
                  {m.name}
                </div>
                <div className="memail">{m.email}</div>
                <div><span className="chip">{m.role}</span></div>
                <div>
                  {m.status === "Active" &&  <span className="status s-active">Active</span>}
                  {m.status === "Pending" && <span className="status s-pend">Pending</span>}
                  {m.status === "Suspended" && <span className="status s-susp">Suspended</span>}
                </div>
                <div className="mact">
                  <button className="btn-ghost"><FaEnvelopeOpenText size={13}/> Message</button>
                  <button className="btn-ghost">View</button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{padding:"18px", color:"#64748b"}}>No members found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
