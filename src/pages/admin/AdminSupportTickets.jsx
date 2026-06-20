import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function AdminSupportTickets() {
  const INK = "#0f172a",
    TEAL = "#21c7b8",
    LINE = "#e6edf4",
    BG = "#f6f8fb";

  // ---- API base ----
  const API_BASE = import.meta.env.VITE_API_BASE;


  // ---- State ----
  const [filter, setFilter] = useState("All");
  const [tickets, setTickets] = useState([]); // from backend
  const [usersMap, setUsersMap] = useState({}); // { id: {first_name,last_name,email} }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Modal state for View/Update
  const [openTicket, setOpenTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({
    status: "",
    priority: "",
    assigned_to: null,
    is_resolved: false,
    resolution_notes: "",
  });

  // ---- Status helpers (ONLY 3 states) ----
  const getDerivedStatus = (t) => {
    if (t?.is_resolved) return "resolved";
    const raw = (t?.status || "").toLowerCase();
    if (raw === "resolved") return "resolved";
    if (raw === "in_progress") return "in_progress";
    return "open";
  };

  const toPillClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "resolved") return "s-resolved";
    if (s === "in_progress") return "s-progress";
    return "s-open";
  };

  // ---- Filtering/Counting uses DERIVED status ----
  const statusFilterMatch = (t) => {
    const s = getDerivedStatus(t);
    if (filter === "All") return true;
    if (filter === "Open") return s === "open";
    if (filter === "In Progress") return s === "in_progress";
    if (filter === "Resolved") return s === "resolved";
    return true;
  };

  const filteredTickets = useMemo(() => tickets.filter(statusFilterMatch), [tickets, filter]);

  const tabCounts = (tab) =>
    tickets.filter((x) => {
      const s = getDerivedStatus(x);
      return tab === "All"
        ? true
        : tab === "Open"
        ? s === "open"
        : tab === "In Progress"
        ? s === "in_progress"
        : s === "resolved";
    }).length;

  // ---- Compose display strings ----
  const displayUser = (ticket) => {
    if (ticket.user_id && usersMap[ticket.user_id]) {
      const u = usersMap[ticket.user_id];
      const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
      return full || u.email || ticket.name || "—";
    }
    if (ticket.name) return ticket.name;
    if (ticket.email) return ticket.email;
    return "—";
  };

  const displayStaff = (ticket) => {
    if (ticket.assigned_to && usersMap[ticket.assigned_to]) {
      const u = usersMap[ticket.assigned_to];
      const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
      return full || u.email || `#${ticket.assigned_to}`;
    }
    return "—";
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return String(iso).slice(0, 10);
    }
  };

  // ---- Fetch tickets & users ----
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // 1) Get tickets
        const res = await fetch(`${API_BASE}/contact-support/?page=1&page_size=200`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setTickets(list);

        // 2) Collect unique user ids (user_id + assigned_to)
        const ids = new Set();
        for (const t of list) {
          if (t.user_id) ids.add(t.user_id);
          if (t.assigned_to) ids.add(t.assigned_to);
        }

        // 3) Fetch users per id (replace with batch if you have it)
        const map = {};
        const fetchOne = async (id) => {
          try {
            const r = await fetch(`${API_BASE}/users/${id}`);
            if (!r.ok) return;
            const u = await r.json();
            map[id] = {
              id: u.id ?? id,
              first_name: u.first_name ?? "",
              last_name: u.last_name ?? "",
              email: u.email ?? "",
            };
          } catch {}
        };
        await Promise.all([...ids].map((id) => fetchOne(id)));
        setUsersMap(map);
      } catch (e) {
        setError(e?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---- Open modal (View) ----
  const openFor = (t, editing = false) => {
    setOpenTicket(t);
    setIsEditing(editing);
    const derived = getDerivedStatus(t);
    setEdit({
      status: derived, // normalize to 3-state status
      priority: t.priority || "",
      assigned_to: t.assigned_to || null,
      is_resolved: derived === "resolved" || !!t.is_resolved,
      resolution_notes: t.resolution_notes || "",
    });
  };

  const onView = (t) => openFor(t, false);
  const onEdit = (t) => openFor(t, true);

  // ---- Keep select and checkbox in sync ----
  const setStatus = (newStatus) =>
    setEdit((s) => ({
      ...s,
      status: newStatus,
      is_resolved: newStatus === "resolved" ? true : false,
    }));

  const setResolvedChecked = (checked) =>
    setEdit((s) => ({
      ...s,
      is_resolved: checked,
      status: checked ? "resolved" : s.status === "resolved" ? "open" : s.status, // if unchecking from resolved -> open
    }));

  // ---- Update (PATCH) ----
  const onSave = async () => {
    if (!openTicket) return;
    setSaving(true);
    setError("");
    try {
      // ensure both fields are consistent
      const finalStatus = edit.is_resolved ? "resolved" : edit.status || "open";
      const finalResolved = finalStatus === "resolved";

      const res = await fetch(`${API_BASE}/contact-support/${openTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: finalStatus,
          priority: edit.priority || null,
          assigned_to: edit.assigned_to || null,
          is_resolved: finalResolved,
          resolution_notes: edit.resolution_notes || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setTickets((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setOpenTicket(updated);
      setIsEditing(false); // back to view mode
    } catch (e) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const onDelete = async (t) => {
    if (!window.confirm("Delete this ticket?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/contact-support/${t.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setTickets((prev) => prev.filter((x) => x.id !== t.id));
      if (openTicket?.id === t.id) setOpenTicket(null);
    } catch (e) {
      setError(e?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // ---- UI ----
  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .tabs{display:flex;gap:20px;margin:16px 0;font-weight:700}
        .tab{cursor:pointer;color:#64748b}
        .tab.active{color:var(--teal);border-bottom:2px solid var(--teal);padding-bottom:4px}
        .card{background:#fff;border:1px solid var(--line);border-radius:3px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .table{width:100%;border-collapse:separate;border-spacing:0}
        .table thead th{padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff;text-align:left}
        .table tbody td{padding:12px;border-bottom:1px solid var(--line);font-size:.9rem;vertical-align:top}
        .pill{font-size:.75rem;font-weight:800;border-radius:999px;padding:4px 10px;display:inline-block}
        .p-high{background:#fee2e2;color:#dc2626}
        .p-medium{background:#fef3c7;color:#a16207}
        .p-low{background:#dcfce7;color:#15803d}
        .s-open{background:#e0f2fe;color:#0369a1}
        .s-progress{background:#fef9c3;color:#854d0e}
        .s-resolved{background:#dcfce7;color:#15803d}
        .s-escalated{background:#fee2e2;color:#dc2626}
        .footer{margin-top:30px;text-align:center;font-size:.85rem;color:#94a3b8}
        .footer a{color:#64748b;text-decoration:none;margin:0 6px}
        .actions{display:flex;gap:10px;align-items:center}
        .action-btn{cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700}
        .action-view{color:#0ea5e9}
        .action-edit{color:#16a34a}
        .action-del{color:#ef4444}
        /* modal */
        .modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,.5);display:flex;align-items:center;justify-content:center;z-index:9999}
        .modal-card{width:min(900px,95vw);background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 20px 40px rgba(2,8,23,.2)}
        .modal-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line)}
        .modal-body{padding:16px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .label{font-size:.8rem;color:#64748b;margin-bottom:4px}
        .val{font-weight:700}
        .field{display:flex;flex-direction:column;margin-bottom:12px}
        .xbtn{background:transparent;border:none;color:#334155;cursor:pointer}
        .divider{height:1px;background:var(--line);margin:16px 0}
      `}</style>

      <h1 className="h5 title mb-1">Support Ticket Management</h1>
      <div className="muted mb-3">Assign, track, and resolve customer issues.</div>

      {/* Tabs */}
      <div className="tabs">
        {["All", "Open", "In Progress", "Resolved"].map((t) => (
          <div key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
            {t}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              ({tabCounts(t)})
            </span>
          </div>
        ))}
      </div>

      {/* Error/Loading */}
      {error && (
        <div className="card" style={{ borderColor: "#fecaca", marginBottom: 12 }}>
          <div style={{ padding: 12, color: "#b91c1c" }}>Error: {error}</div>
        </div>
      )}
      {loading && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ padding: 12 }}>Loading tickets…</div>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Staff</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => {
              const s = getDerivedStatus(t);
              return (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{displayUser(t)}</td>
                  <td>{t.subject || "—"}</td>
                  <td>
                    <span
                      className={`pill ${
                        (t.priority || "").toLowerCase() === "high"
                          ? "p-high"
                          : (t.priority || "").toLowerCase() === "medium"
                          ? "p-medium"
                          : "p-low"
                      }`}
                    >
                      {t.priority || "Low"}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${toPillClass(s)}`}>{s.replace("_", " ")}</span>
                  </td>
                  <td>{displayStaff(t)}</td>
                  <td>{formatDate(t.updated_at || t.created_at)}</td>
                  <td>
                    <div className="actions">
                      <span className="action-btn action-view" onClick={() => onView(t)} title="View">
                        <FiEye />
                      </span>
                      <span className="action-btn action-edit" onClick={() => onEdit(t)} title="Update">
                        <FiEdit2 />
                      </span>
                      <span
                        className="action-btn action-del"
                        onClick={() => onDelete(t)}
                        title="Delete"
                        style={{ opacity: deleting ? 0.6 : 1, pointerEvents: deleting ? "none" : "auto" }}
                      >
                        <FiTrash2 />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filteredTickets.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: "#64748b", padding: 16 }}>
                  No tickets in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View/Update Modal */}
      {openTicket && (
        <div className="modal-backdrop" onClick={() => setOpenTicket(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div style={{ fontWeight: 900, color: INK }}>
                {isEditing ? "Edit Ticket" : "View Ticket"} #{openTicket.id} — {openTicket.subject || "No subject"}
              </div>
              <button className="xbtn" onClick={() => setOpenTicket(null)} aria-label="Close">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="grid-2">
                {/* LEFT: always read info */}
                <div>
                  <div className="field">
                    <div className="label">From</div>
                    <div className="val">
                      {displayUser(openTicket)}
                      {openTicket.email ? (
                        <span className="muted" style={{ marginLeft: 8, fontWeight: 500 }}>
                          &lt;{openTicket.email}&gt;
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">Category</div>
                    <div className="val">{openTicket.category || "—"}</div>
                  </div>
                  <div className="field">
                    <div className="label">Message</div>
                    <div className="val" style={{ whiteSpace: "pre-wrap" }}>
                      {openTicket.message || "—"}
                    </div>
                  </div>
                </div>

                {/* RIGHT: conditional — read-only for View, inputs for Edit */}
                <div>
                  {isEditing ? (
                    <>
                      <div className="field">
                        <div className="label">Status</div>
                        <select
                          className="form-select"
                          value={edit.status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {["open", "in_progress", "resolved"].map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <div className="label">Priority</div>
                        <select
                          className="form-select"
                          value={edit.priority}
                          onChange={(e) => setEdit((s) => ({ ...s, priority: e.target.value }))}
                        >
                          {["low", "medium", "high"].map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <div className="label">Assigned To</div>
                        <select
                          className="form-select"
                          value={edit.assigned_to || ""}
                          onChange={(e) =>
                            setEdit((s) => ({
                              ...s,
                              assigned_to: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                        >
                          <option value="">—</option>
                          {Object.values(usersMap).map((u) => {
                            const full =
                              [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
                              u.email ||
                              `#${u.id}`;
                            return (
                              <option key={u.id} value={u.id}>
                                {full}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="field">
                        <label className="form-check-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={edit.is_resolved}
                            onChange={(e) => setResolvedChecked(e.target.checked)}
                          />
                          Mark as resolved
                        </label>
                      </div>
                      <div className="field">
                        <div className="label">Resolution Notes</div>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Add resolution notes…"
                          value={edit.resolution_notes}
                          onChange={(e) => setEdit((s) => ({ ...s, resolution_notes: e.target.value }))}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="field">
                        <div className="label">Status</div>
                        <div className="val">{getDerivedStatus(openTicket).replace("_", " ")}</div>
                      </div>
                      <div className="field">
                        <div className="label">Priority</div>
                        <div className="val">{openTicket.priority || "low"}</div>
                      </div>
                      <div className="field">
                        <div className="label">Assigned To</div>
                        <div className="val">{displayStaff(openTicket)}</div>
                      </div>
                      <div className="field">
                        <div className="label">Resolved?</div>
                        <div className="val">{openTicket.is_resolved ? "Yes" : "No"}</div>
                      </div>
                      <div className="field">
                        <div className="label">Resolution Notes</div>
                        <div className="val" style={{ whiteSpace: "pre-wrap" }}>
                          {openTicket.resolution_notes || "—"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="divider" />

              <div className="grid-2">
                <div className="field">
                  <div className="label">Created At</div>
                  <div className="val">{formatDate(openTicket.created_at)}</div>
                </div>
                <div className="field">
                  <div className="label">Updated At</div>
                  <div className="val">{formatDate(openTicket.updated_at)}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                {!isEditing ? (
                  <>
                    <button className="btn btn-outline-teal-slim" onClick={() => setOpenTicket(null)}>
                      Close
                    </button>
                    <button className="btn btn-teal-slim" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline-teal-slim" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-teal-slim"
                      onClick={onSave}
                      disabled={saving}
                      style={{ opacity: saving ? 0.7 : 1 }}
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
