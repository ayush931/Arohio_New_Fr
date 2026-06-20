import { useMemo, useState } from "react";
import { FaUserPlus, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function TeamManagement() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";

  // Invite form
  const [invite, setInvite] = useState({ email: "", role: "Viewer" });

  // Pending invites
  const [pending, setPending] = useState([
    { id: "p1", email: "chloe.foster@example.com", role: "Viewer" },
    { id: "p2", email: "daniel.gray@example.com", role: "Viewer" },
  ]);

  // Team members table
  const [members, setMembers] = useState([
    { id: "u1", name: "Ethan Harper",  email: "ethan.harper@example.com",  role: "Approver", status: "Active" },
    { id: "u2", name: "Olivia Bennett",email: "olivia.bennett@example.com", role: "Viewer",   status: "Active" },
    { id: "u3", name: "Liam Carter",   email: "liam.carter@example.com",   role: "Reviewer",  status: "Pending" },
    { id: "u4", name: "Sophia Davis",  email: "sophia.davis@example.com",  role: "Viewer",    status: "Suspended" },
    { id: "u5", name: "Noah Evans",    email: "noah.evans@example.com",    role: "Creator",   status: "Active" },
  ]);

  // Updated roles
  const roles = useMemo(() => ["Creator", "Reviewer", "Approver", "Viewer"], []);

  const inviteMember = () => {
    if (!invite.email.trim()) return alert("Enter an email address.");
    setPending((p) => [{ id: `p${Date.now()}`, email: invite.email.trim(), role: invite.role }, ...p]);
    setInvite({ email: "", role: "Viewer" });
    alert("Invite sent.");
  };

  const revokeInvite = (id) => {
    setPending((p) => p.filter((x) => x.id !== id));
  };

  const resendInvite = (email) => {
    alert(`Resent invite to ${email}.`);
  };

  const changeRole = (id, role) => {
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .grid{display:grid;grid-template-columns:2fr 1fr;gap:16px}
        @media(max-width:1100px){.grid{grid-template-columns:1fr}}
        .label{font-size:.85rem;color:#0f172a;font-weight:800;margin:0 0 6px}
        .input,.select{appearance:none;background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;color:#0f172a;outline:none;width:100%}
        .input:focus,.select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,.15)}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:2px;padding:9px 12px;font-weight:800;cursor:pointer;line-height:1}
        .btn-teal{background:var(--teal);border:none;color:#fff}
        .btn-ghost{background:#fff;border:1px solid var(--line)}
        .btn-sm{padding:8px 10px;font-size:.9rem}
        .stack{display:grid;grid-template-columns:1fr 220px 160px;gap:10px}
        @media(max-width:768px){.stack{grid-template-columns:1fr}}
        /* RIGHT COLUMN SHOULD BE CONTENT-HEIGHT ONLY */
        .right-card{ /* removed height:100% so it shrinks to content */ }

        .pill{font-size:.75rem;padding:6px 10px;border-radius:999px;font-weight:800;border:1px solid var(--line);background:#fff;white-space:nowrap}
        .b-active{background:#ecfdf5;color:#16a34a;border-color:#bbf7d0}
        .b-pending{background:#fffbeb;color:#a16207;border-color:#fde68a}
        .b-suspended{background:#fef2f2;color:#dc2626;border-color:#fecaca}

        .table{width:100%;border-collapse:separate;border-spacing:0 10px}
        .table thead th{padding:10px 12px;color:#334155;font-size:.9rem;font-weight:900}
        .table tbody tr{background:#fff;box-shadow:0 4px 14px rgba(2,8,23,.04)}
        .table td{padding:14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:middle}
        .table td:first-child{border-left:1px solid var(--line);border-top-left-radius:12px;border-bottom-left-radius:12px}
        .table td:last-child{border-right:1px solid var(--line);border-top-right-radius:12px;border-bottom-right-radius:12px}
        .link{color:var(--teal);font-weight:800;cursor:pointer;text-decoration:none}
        .link:hover{text-decoration:underline}

        .rowy{display:flex;align-items:center;justify-content:space-between;gap:10px}

        /* Pending list: keep actions tidy and never overflow */
        .pending-item{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--line);border-radius:3px;padding:12px;background:#fff;gap:12px}
        .pending-info{min-width:0}
        .pending-email{font-weight:800;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:320px}
        @media(max-width:480px){.pending-email{max-width:180px}}
        .pending-actions{display:grid;grid-auto-flow:column;grid-auto-columns:max-content;gap:8px}
        /* make both buttons same size/height */
        .pending-actions .btn{min-width:106px;height:38px}
      `}</style>

      <h1 className="h5 title mb-3">Team Management</h1>

      <div className="grid">
        {/* Left column */}
        <div className="d-flex flex-column gap-3">
          {/* Invite Member */}
          <div className="card pane">
            <div className="rowy mb-2">
              <div className="title" style={{ fontSize: "1rem" }}>Invite Member</div>
            </div>
            <div className="stack">
              <div>
                <label className="label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="e.g., alex@example.com"
                  value={invite.email}
                  onChange={(e) => setInvite((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  className="select"
                  value={invite.role}
                  onChange={(e) => setInvite((s) => ({ ...s, role: e.target.value }))}
                >
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="d-flex align-items-end">
                <button className="btn btn-teal w-100" onClick={inviteMember}>
                  <FaUserPlus /> Invite Member
                </button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="card pane">
            <div className="title mb-2" style={{ fontSize: "1rem" }}>Team Members</div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 800, color: INK }}>{m.name}</td>
                      <td className="muted">{m.email}</td>
                      <td>
                        <select
                          className="select"
                          value={m.role}
                          onChange={(e) => changeRole(m.id, e.target.value)}
                        >
                          {roles.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </td>
                      <td>
                        {m.status === "Active" && <span className="pill b-active">● Active</span>}
                        {m.status === "Pending" && (
                          <div className="d-flex align-items-center gap-2">
                            <span className="pill b-pending">● Pending</span>
                            <span className="link" onClick={() => resendInvite(m.email)}>Resend Invite</span>
                          </div>
                        )}
                        {m.status === "Suspended" && <span className="pill b-suspended">● Suspended</span>}
                      </td>
                      <td>
                        <span className="link">Edit</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column (content-height only) */}
        <div className="card pane right-card">
          <div className="title mb-2" style={{ fontSize: "1rem" }}>Pending Invites</div>
          <div className="d-flex flex-column gap-2">
            {pending.length === 0 && <div className="muted">No pending invites.</div>}

            {pending.map((p) => (
              <div key={p.id} className="pending-item">
                <div className="pending-info">
                  <div className="pending-email">{p.email}</div>
                  <div className="muted" style={{ fontSize: ".9rem" }}>{p.role}</div>
                </div>
                <div className="pending-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => resendInvite(p.email)} title="Resend">
                    <FaPaperPlane /> Resend
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => revokeInvite(p.id)} title="Revoke">
                    <FaTimes /> Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
