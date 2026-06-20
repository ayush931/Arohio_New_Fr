import { useEffect, useMemo, useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCopy,
  FiMail,
} from "react-icons/fi";

export default function AdminNewsletters() {
  const INK = "#0f172a",
    TEAL = "#21c7b8",
    LINE = "#e6edf4",
    BG = "#f6f8fb";

  // ---- API base ----
  const API_ROOT = `${import.meta.env.VITE_API_BASE}`;

  // ---- State ----
  const [filter, setFilter] = useState("All"); // All, Subscribed, Unsubscribed, Bounced
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [openRow, setOpenRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({
    name: "",
    status: "subscribed",
    source: "",
    token: "",
  });

  // ---- Helpers ----
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

  const toPillClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "subscribed") return "s-resolved"; // green
    if (s === "unsubscribed") return "s-progress"; // amber
    if (s === "bounced") return "s-escalated"; // red
    return "s-open"; // default blue-ish
  };

  const statusDate = (row) => {
    const s = (row.status || "").toLowerCase();
    if (s === "subscribed") return formatDate(row.subscribed_at);
    if (s === "unsubscribed") return formatDate(row.unsubscribed_at);
    return "—";
  };

  // ---- Fetch newsletters ----
  const fetchList = async (statusFilter = null) => {
    setLoading(true);
    setError("");
    try {
      const url = new URL(`${API_ROOT}/newsletters/`);
      if (statusFilter) url.searchParams.set("status_filter", statusFilter);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load newsletters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load on mount with current filter
    if (filter === "All") fetchList(null);
    else fetchList(filter.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // ---- Counts cache (load all once) ----
  const [allRows, setAllRows] = useState([]);
  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await fetch(`${API_ROOT}/newsletters/`);
        if (!res.ok) return;
        const data = await res.json();
        setAllRows(Array.isArray(data) ? data : []);
      } catch {}
    };
    loadAll();
  }, []);

  const countFor = (tab) => {
    if (tab === "All") return allRows.length;
    const s = tab.toLowerCase();
    return allRows.filter((r) => (r.status || "").toLowerCase() === s).length;
  };

  // Already filtered by server per tab
  const tableRows = useMemo(() => rows, [rows]);

  // ---- Actions ----
  const onView = (r) => {
    setOpenRow(r);
    setIsEditing(false);
    setEdit({
      name: r.name || "",
      status: (r.status || "subscribed").toLowerCase(),
      source: r.source || "",
      token: r.token || "",
    });
  };
  const onEdit = (r) => {
    setOpenRow(r);
    setIsEditing(true);
    setEdit({
      name: r.name || "",
      status: (r.status || "subscribed").toLowerCase(),
      source: r.source || "",
      token: r.token || "",
    });
  };

  const onSave = async () => {
    if (!openRow) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: edit.name,
        status: edit.status,
        source: edit.source,
        token: edit.token,
      };
      const res = await fetch(`${API_ROOT}/newsletters/${openRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setAllRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setOpenRow(updated);
      setIsEditing(false);
    } catch (e) {
      setError(e?.message || "Failed to update subscriber");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (r) => {
    if (!window.confirm("Delete this subscriber?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_ROOT}/newsletters/${r.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setRows((prev) => prev.filter((x) => x.id !== r.id));
      setAllRows((prev) => prev.filter((x) => x.id !== r.id));
      if (openRow?.id === r.id) setOpenRow(null);
    } catch (e) {
      setError(e?.message || "Failed to delete subscriber");
    } finally {
      setDeleting(false);
    }
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email || "");
      alert("Email copied: " + (email || "—"));
    } catch {
      alert("Copy failed");
    }
  };

  const copyAllSubscribedEmails = async () => {
    try {
      const list = allRows
        .filter((x) => (x.status || "").toLowerCase() === "subscribed")
        .map((x) => x.email)
        .filter(Boolean);
      if (!list.length) {
        alert("No subscribed emails to copy.");
        return;
      }
      await navigator.clipboard.writeText(list.join(", "));
      alert("Copied " + list.length + " subscribed emails.");
    } catch {
      alert("Copy failed");
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
        .s-open{background:#e0f2fe;color:#0369a1}
        .s-progress{background:#fef9c3;color:#854d0e}
        .s-resolved{background:#dcfce7;color:#15803d}
        .s-escalated{background:#fee2e2;color:#dc2626}
        .actions{display:flex;gap:12px;align-items:center}
        .action-btn{cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700}
        .action-view{color:#0ea5e9}
        .action-edit{color:#16a34a}
        .action-del{color:#ef4444}
        .action-copy{color:#334155}
        .toolbar{display:flex;gap:10px;align-items:center;margin:10px 0 16px 0}
        .btn-lite{border:1px solid var(--line);background:#fff;padding:6px 10px;border-radius:6px;cursor:pointer}
        /* modal */
        .modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,.5);display:flex;align-items:center;justify-content:center;z-index:9999}
        .modal-card{width:min(800px,95vw);background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 20px 40px rgba(2,8,23,.2)}
        .modal-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line)}
        .modal-body{padding:16px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .label{font-size:.8rem;color:#64748b;margin-bottom:4px}
        .val{font-weight:700}
        .field{display:flex;flex-direction:column;margin-bottom:12px}
        .xbtn{background:transparent;border:none;color:#334155;cursor:pointer}
        .divider{height:1px;background:var(--line);margin:16px 0}
      `}</style>

      <h1 className="h5 title mb-1">Newsletter Subscribers</h1>
      <div className="muted mb-3">View, update, or export your subscriber list.</div>

      {/* Tabs */}
      <div className="tabs">
        {["All", "Subscribed", "Unsubscribed", "Bounced"].map((t) => (
          <div
            key={t}
            className={`tab ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t}{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              ({countFor(t)})
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button className="btn-lite" onClick={() => fetchList(filter === "All" ? null : filter.toLowerCase())}>
          Refresh
        </button>
        <button className="btn-lite" onClick={copyAllSubscribedEmails}>
          Copy all subscribed emails
        </button>
      </div>

      {/* Error/Loading */}
      {error && (
        <div className="card" style={{ borderColor: "#fecaca", marginBottom: 12 }}>
          <div style={{ padding: 12, color: "#b91c1c" }}>Error: {error}</div>
        </div>
      )}
      {loading && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ padding: 12 }}>Loading subscribers…</div>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.name || "—"}</td>
                <td>
                  {r.email || "—"}{" "}
                  {r.email && (
                    <span
                      className="action-btn action-copy"
                      title="Copy email"
                      onClick={() => copyEmail(r.email)}
                    >
                      <FiCopy />
                    </span>
                  )}
                </td>
                <td>
                  <span className={`pill ${toPillClass(r.status)}`}>
                    {(r.status || "subscribed").replace("_", " ")}
                  </span>
                </td>
                <td>{r.source || "—"}</td>
                <td>{statusDate(r)}</td>
                <td>
                  <div className="actions">
                    <span className="action-btn action-view" onClick={() => onView(r)} title="View">
                      <FiEye />
                    </span>
                    <span className="action-btn action-edit" onClick={() => onEdit(r)} title="Update">
                      <FiEdit2 />
                    </span>
                    <span
                      className="action-btn action-del"
                      onClick={() => onDelete(r)}
                      title="Delete"
                      style={{ opacity: deleting ? 0.6 : 1, pointerEvents: deleting ? "none" : "auto" }}
                    >
                      <FiTrash2 />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && tableRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: "#64748b", padding: 16 }}>
                  No subscribers in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View/Update Modal */}
      {openRow && (
        <div className="modal-backdrop" onClick={() => setOpenRow(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div style={{ fontWeight: 900, color: INK }}>
                {isEditing ? "Edit Subscriber" : "View Subscriber"} #{openRow.id}
              </div>
              <button className="xbtn" onClick={() => setOpenRow(null)} aria-label="Close">
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="grid-2">
                {/* LEFT always read-only info */}
                <div>
                  <div className="field">
                    <div className="label">Email</div>
                    <div className="val" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <FiMail />
                      {openRow.email || "—"}
                    </div>
                  </div>

                  <div className="field">
                    <div className="label">Subscribed At</div>
                    <div className="val">{formatDate(openRow.subscribed_at)}</div>
                  </div>

                  <div className="field">
                    <div className="label">Unsubscribed At</div>
                    <div className="val">{formatDate(openRow.unsubscribed_at)}</div>
                  </div>

                  <div className="field">
                    <div className="label">Token</div>
                    <div className="val" style={{ wordBreak: "break-all" }}>{openRow.token || "—"}</div>
                  </div>
                </div>

                {/* RIGHT: view vs edit */}
                <div>
                  {isEditing ? (
                    <>
                      <div className="field">
                        <div className="label">Name</div>
                        <input
                          className="form-control"
                          value={edit.name}
                          onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                          placeholder="Subscriber name"
                        />
                      </div>
                      <div className="field">
                        <div className="label">Status</div>
                        <select
                          className="form-select"
                          value={edit.status}
                          onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}
                        >
                          {["subscribed", "unsubscribed", "bounced"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <div className="label">Source</div>
                        <input
                          className="form-control"
                          value={edit.source}
                          onChange={(e) => setEdit((s) => ({ ...s, source: e.target.value }))}
                          placeholder="e.g., signup form, import"
                        />
                      </div>
                      <div className="field">
                        <div className="label">Token</div>
                        <input
                          className="form-control"
                          value={edit.token}
                          onChange={(e) => setEdit((s) => ({ ...s, token: e.target.value }))}
                          placeholder="(optional)"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="field">
                        <div className="label">Name</div>
                        <div className="val">{openRow.name || "—"}</div>
                      </div>
                      <div className="field">
                        <div className="label">Status</div>
                        <div className="val">{(openRow.status || "subscribed").replace("_", " ")}</div>
                      </div>
                      <div className="field">
                        <div className="label">Source</div>
                        <div className="val">{openRow.source || "—"}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="divider" />

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                {!isEditing ? (
                  <>
                    <button className="btn btn-outline-teal-slim" onClick={() => setOpenRow(null)}>
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
