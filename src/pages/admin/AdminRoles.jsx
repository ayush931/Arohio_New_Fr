import { useEffect, useMemo, useRef, useState } from "react";

export default function AdminRoles() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";
  const BG = "#f6f8fb";

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", is_active: true });
  const [saving, setSaving] = useState(false);

  const controllerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const API = `${API_BASE}/api/v1/roles`;

  const resetForm = () => {
    setForm({ name: "", description: "", is_active: true });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditing(role);
    setForm({
      name: role.name || "",
      description: role.description || "",
      is_active: !!role.is_active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    resetForm();
  };

  const debouncedQ = useDebounced(q, 350);

  const load = async () => {
    try {
      setErr("");
      setLoading(true);
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));
      if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
      if (includeInactive) params.set("include_inactive", "true");
      const url = `${API}?${params.toString()}`;
      const res = await fetch(url, { signal: controllerRef.current.signal });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const t = await safeText(res);
        throw new Error(`List failed (${res.status}): ${t}`);
      }
      if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`Non-JSON response (${ct}). First bytes: ${t.slice(0, 120)}`);
      }
      const data = await res.json();
      setRoles(Array.isArray(data.items) ? data.items : data);
      setTotal(typeof data.total === "number" ? data.total : Array.isArray(data) ? data.length : 0);
    } catch (e) {
      if (e.name !== "AbortError") {
        setErr(e.message || "Failed to load roles");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [debouncedQ, page, pageSize, includeInactive]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ]);

  const createRole = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const t = await safeText(res);
        throw new Error(`Create failed (${res.status}): ${t}`);
      }
      if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`Non-JSON response (${ct}). First bytes: ${t.slice(0, 120)}`);
      }
      await res.json();
      setShowModal(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (id) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const t = await safeText(res);
        throw new Error(`Update failed (${res.status}): ${t}`);
      }
      if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`Non-JSON response (${ct}). First bytes: ${t.slice(0, 120)}`);
      }
      await res.json();
      setShowModal(false);
      resetForm();
      await load();
    } catch (e) {
      alert(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/toggle`, { method: "POST" });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const t = await safeText(res);
        throw new Error(`Toggle failed (${res.status}): ${t}`);
      }
      if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`Non-JSON response (${ct}). First bytes: ${t.slice(0, 120)}`);
      }
      await res.json();
      await load();
    } catch (e) {
      alert(e.message || "Toggle failed");
    }
  };

  const softDelete = async (id) => {
    if (!confirm("Delete this role? You can restore via API if needed.")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const t = await safeText(res);
        throw new Error(`Delete failed (${res.status}): ${t}`);
      }
      await load();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const pageCount = useMemo(() => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}

        /* Tighter radii everywhere */
        .card{background:#fff;border:1px solid var(--line);border-radius:6px;box-shadow:0 6px 18px rgba(2,8,23,.05)}
        .toolbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin:12px 0 16px}
        .btn-teal{background:${TEAL};color:#fff;border:none;padding:10px 14px;border-radius:6px;font-weight:800}
        .btn-ghost{background:#fff;color:#0f172a;border:1px solid #e2e8f0;padding:10px 14px;border-radius:6px;font-weight:700}

        .table{width:100%;border-collapse:separate;border-spacing:0}
        .table thead th{padding:14px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff;text-align:left}
        .table tbody td{padding:14px;border-bottom:1px solid var(--line);font-size:.95rem;vertical-align:top;background:#fff}

        .pill{font-size:.78rem;font-weight:800;border-radius:999px;padding:6px 12px;display:inline-block}
        .a-yes{background:#dcfce7;color:#15803d}
        .a-no{background:#fee2e2;color:#dc2626}

        .input{background:#fff;color:#000;border:1px solid var(--line);border-radius:6px;padding:10px 12px;min-width:260px}
        .select{background:#fff;color:#000;border:1px solid var(--line);border-radius:6px;padding:10px 12px;margin-left:10px}

        .pagination{display:flex;gap:8px;align-items:center}
        .pager{padding:8px 12px;border:1px solid var(--line);border-radius:6px;background:#fff;cursor:pointer;color:#0f172a;font-weight:700}
        .pager[disabled]{opacity:.55;cursor:not-allowed}

        .link{color:${TEAL};font-weight:800;cursor:pointer}

        .modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:1080;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#fff;border-radius:4px;box-shadow:0 18px 36px rgba(2,8,23,.15);width:100%;max-width:520px}
        .modal-head{display:flex;align-items:center;gap:10px;padding:18px 22px;border-bottom:1px solid var(--line)}
        .modal-body{padding:18px 22px;display:grid;gap:14px}
        .modal-foot{padding:16px 22px;border-top:1px solid var(--line);display:flex;gap:10px;justify-content:flex-end}
        .label{font-size:.9rem;color:#475569;font-weight:700}
        .field{background:#fff;color:#000;border:1px solid var(--line);border-radius:6px;padding:10px 12px;width:100%}
        .switch{display:inline-flex;align-items:center;gap:8px;cursor:pointer}

        .error-card{padding:14px;margin-bottom:12px;border-left:4px solid #ef4444;background:#fff;border-radius:6px}
        .error-title{color:#ef4444;font-weight:800}

        /* Actions as icon buttons with tooltip */
        .actions{display:flex;gap:10px;align-items:center}
        .icon-btn{
          border:1px solid var(--line);
          background:#fff;
          color:#0f172a;
          width:34px; height:34px;
          display:inline-flex; align-items:center; justify-content:center;
          border-radius:6px;
          cursor:pointer;
        }
        .icon-btn:hover{box-shadow:0 2px 8px rgba(2,8,23,.08)}
        .icon-btn[data-tip] { position:relative; }
        .icon-btn[data-tip]:hover::after{
          content:attr(data-tip);
          position:absolute;
          bottom:calc(100% + 8px);
          white-space:nowrap;
          left:50%;
          transform:translateX(-50%);
          background:#0f172a;
          color:#fff;
          padding:6px 8px;
          font-size:.75rem;
          border-radius:6px;
          box-shadow:0 4px 12px rgba(2,8,23,.2);
          pointer-events:none;
          z-index:2;
        }
        .icon{display:block}
      `}</style>

      <h1 className="h5 title mb-1">Roles Management</h1>
      <div className="muted mb-3">Create, edit, activate/deactivate and delete roles.</div>

      <div className="toolbar">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder="Search roles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="switch">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            <span className="muted">Include inactive</span>
          </label>
        </div>

        <button className="btn-teal" onClick={openCreate}>+ New Role</button>
      </div>

      {err && (
        <div className="error-card">
          <div className="error-title">Error</div>
          <div className="muted">{err}</div>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: 120 }}>Active</th>
              <th style={{ width: 160 }}>Created</th>
              <th style={{ width: 160 }}>Updated</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 18 }} className="muted">Loading…</td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 18 }} className="muted">No roles found.</td>
              </tr>
            ) : (
              roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td style={{ fontWeight: 800, color: INK }}>{r.name}</td>
                  <td className="muted">{r.description || "—"}</td>
                  <td>
                    <span className={`pill ${r.is_active ? "a-yes" : "a-no"}`}>
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="muted">{fmtDate(r.created_at)}</td>
                  <td className="muted">{fmtDate(r.updated_at)}</td>
                  <td>
                    <div className="actions">
                      {/* Edit */}
                      <button
                        className="icon-btn"
                        title="Edit"
                        data-tip="Edit"
                        onClick={() => openEdit(r)}
                        aria-label="Edit role"
                      >
                        <EditIcon />
                      </button>
                      {/* Toggle Active */}
                      <button
                        className="icon-btn"
                        title={r.is_active ? "Deactivate" : "Activate"}
                        data-tip={r.is_active ? "Deactivate" : "Activate"}
                        onClick={() => toggleActive(r.id)}
                        aria-label={r.is_active ? "Deactivate role" : "Activate role"}
                      >
                        {r.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </button>
                      {/* Delete */}
                      <button
                        className="icon-btn"
                        title="Delete"
                        data-tip="Delete"
                        onClick={() => softDelete(r.id)}
                        aria-label="Delete role"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom toolbar: left = Showing + Page info; right = pager (black text) */}
      <div className="toolbar" style={{ marginTop: 12 }}>
        <div className="muted">
          Showing <strong>{roles.length}</strong> of <strong>{total}</strong>
          <span className="muted"> • </span>
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
          <select
            className="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
        <div className="pagination">
          <button className="pager" disabled={page <= 1} onClick={() => setPage(1)}>« First</button>
          <button className="pager" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
          <div className="muted">Page <strong>{page}</strong> / {pageCount}</div>
          <button className="pager" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Next ›</button>
          <button className="pager" disabled={page >= pageCount} onClick={() => setPage(pageCount)}>Last »</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-head">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 36, height: 36, background: "linear-gradient(135deg, #2EC4B6 0%, #1BA3A2 100%)", color: "#fff", fontWeight: 800, borderRadius: "50%" }}
              >
                {editing ? "✎" : "+"}
              </div>
              <div style={{ fontWeight: 900, color: INK }}>{editing ? "Edit Role" : "Create Role"}</div>
            </div>

            <div className="modal-body">
              <div>
                <div className="label">Name</div>
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., admin"
                />
              </div>

              <div>
                <div className="label">Description</div>
                <textarea
                  className="field"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What can this role do?"
                />
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                />
                <span>Active</span>
              </label>
            </div>

            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn-teal" onClick={() => (editing ? updateRole(editing.id) : createRole())} disabled={saving || !form.name.trim()}>
                {saving ? "Saving…" : editing ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Icons (inline SVG, no extra deps) ---------- */
function EditIcon(props) {
  return (
    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14.06 4.94l3.75 3.75 1.69-1.69a1.5 1.5 0 0 0 0-2.12l-1.63-1.63a1.5 1.5 0 0 0-2.12 0l-1.69 1.69z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}
function ToggleOnIcon(props) {
  return (
    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="12" r="3.5" fill="currentColor"/>
    </svg>
  );
}
function ToggleOffIcon(props) {
  return (
    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="8" cy="12" r="3.5" fill="currentColor"/>
    </svg>
  );
}
function TrashIcon(props) {
  return (
    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

/* ---------- utils ---------- */
function useDebounced(val, delay) {
  const [d, setD] = useState(val);
  useEffect(() => {
    const id = setTimeout(() => setD(val), delay || 300);
    return () => clearTimeout(id);
  }, [val, delay]);
  return d;
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "(no body)";
  }
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleString();
  } catch {
    return String(d);
  }
}
