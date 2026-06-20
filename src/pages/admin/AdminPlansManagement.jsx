import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiChevronRight, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPlansManagement() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";
  const API_BASE = import.meta.env.VITE_API_BASE;


  const [mode, setMode] = useState("list"); // list | view | edit | create
  const [selected, setSelected] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const empty = {
    name: "",
    slug: "",
    plan_type: "subscription",
    meta_line: "",
    price_monthly: "",
    price_yearly: "",
    currency: "USD",
    status: "active",
    features: [], // dynamic rows (strings)
  };
  const [edit, setEdit] = useState(empty);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/plans`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filteredPlans = useMemo(
    () => [...plans].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [plans]
  );

  const parseFeaturesToArray = (f) => {
    if (!f) return [];
    try {
      const parsed = typeof f === "string" ? JSON.parse(f) : f;
      if (Array.isArray(parsed)) return parsed.map(x => String(x));
      if (parsed && typeof parsed === "object") {
        return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`);
      }
      return [];
    } catch {
      return [];
    }
  };

  // openers
  const openView = (p) => {
    setSelected(p);
    setMode("view");
  };
  const openEdit = (p) => {
    setSelected(p || null);
    if (!p) {
      setEdit(empty);
      setMode("create");
      return;
    }
    setEdit({
      name: p.name || "",
      slug: p.slug || "",
      plan_type: p.plan_type || "subscription",
      meta_line: p.meta_line || "",
      price_monthly: p.price_monthly || "",
      price_yearly: p.price_yearly || "",
      currency: p.currency || "USD",
      status: p.status || "active",
      features: parseFeaturesToArray(p.features),
    });
    setMode("edit");
  };
  const closePanel = () => {
    setMode("list");
    setSelected(null);
    setEdit(empty);
  };

  // features handlers
  const addFeature = () => setEdit((s) => ({ ...s, features: [...(s.features || []), ""] }));
  const updateFeature = (idx, val) => {
    const next = [...(edit.features || [])];
    next[idx] = val;
    setEdit((s) => ({ ...s, features: next }));
  };
  const removeFeature = (idx) => {
    const next = [...(edit.features || [])];
    next.splice(idx, 1);
    setEdit((s) => ({ ...s, features: next }));
  };

  // payload
  const toPayload = (state) => ({
    name: state.name,
    slug: state.slug,
    plan_type: state.plan_type,
    meta_line: state.meta_line,
    price_monthly: state.price_monthly ? Number(state.price_monthly) : null,
    price_yearly: state.price_yearly ? Number(state.price_yearly) : null,
    currency: state.currency,
    status: state.status,
    features: (state.features || []).map(x => String(x).trim()).filter(Boolean),
  });

  // save/delete
  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (mode === "edit" && selected?.id) {
        const res = await fetch(`${API_BASE}/api/v1/plans/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPayload(edit)),
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setPlans((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setSelected(updated);
        setMode("view");
        toast.success("Plan updated", { autoClose: 3000 });
      } else if (mode === "create") {
        const res = await fetch(`${API_BASE}/api/v1/plans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPayload(edit)),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setPlans((prev) => [created, ...prev]);
        setSelected(created);
        setMode("view");
        toast.success("Plan created", { autoClose: 3000 });
      }
    } catch (e) {
      setError(e?.message || "Save failed");
      toast.error("Save failed", { autoClose: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!window.confirm("Delete this plan?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/plans/${p.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setPlans((prev) => prev.filter((x) => x.id !== p.id));
      closePanel();
      toast.success("Plan deleted", { autoClose: 3000 });
    } catch (e) {
      setError(e?.message || "Delete failed");
      toast.error("Delete failed", { autoClose: 3000 });
    } finally {
      setDeleting(false);
    }
  };

  // UI
  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <ToastContainer position="top-right" newestOnTop />

      <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .layout{display:grid;grid-template-columns: 2fr 1fr;gap:16px}
        @media (max-width: 992px){ .layout{grid-template-columns: 1fr} }
        .card{background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;margin:12px 0}
        .table{width:100%;border-collapse:collapse;table-layout:fixed}
        .table thead th{padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff;text-align:left}
        .table tbody td{padding:12px;border-bottom:1px solid var(--line);font-size:.9rem;vertical-align:middle}
        .actions{display:flex;gap:10px;align-items:center}
        .action-btn{cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700}
        .action-view{color:#0ea5e9}
        .action-edit{color:#16a34a}
        .action-del{color:#ef4444}
        .side-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .crumbs{display:flex;align-items:center;gap:8px;font-weight:700;margin-bottom:8px}
        .crumb{cursor:pointer;color:#334155}
        .crumb-active{color:var(--teal)}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .label{font-size:.8rem;color:#64748b;margin-bottom:4px}
        .feature-row{display:flex;gap:8px;align-items:center;margin-bottom:6px}
        .btn-mini{padding:6px 10px;font-size:.85rem}
      `}</style>

      <h1 className="h5 title mb-1">Plans Management</h1>
      <div className="muted mb-3">Create, update, and manage subscription plans.</div>

      <div className="layout">
        {/* LEFT: LIST */}
        <div className="card pane">
          <div className="toolbar">
            <div />
            <button className="btn btn-teal-slim d-inline-flex align-items-center gap-2" onClick={() => openEdit(null)}>
              <FiPlus /> New Plan
            </button>
          </div>

          {error && (
            <div className="card" style={{ borderColor: "#fecaca", marginBottom: 12 }}>
              <div className="pane" style={{ color: "#b91c1c" }}>Error: {error}</div>
            </div>
          )}
          {loading && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="pane">Loading plans…</div>
            </div>
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Meta Line</th>
                <th>Monthly Price</th>
                <th>Status</th>
                <th style={{width:120}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.meta_line || "—"}</td>
                  <td>{p.price_monthly ? `${p.price_monthly} ${p.currency}` : "—"}</td>
                  <td>{p.status}</td>
                  <td>
                    <div className="actions">
                      <span className="action-btn action-view" onClick={() => openView(p)} title="View"><FiEye /></span>
                      <span className="action-btn action-edit" onClick={() => openEdit(p)} title="Edit"><FiEdit2 /></span>
                      <span className="action-btn action-del" onClick={() => onDelete(p)} title="Delete" style={{ opacity: deleting ? 0.6 : 1, pointerEvents: deleting ? "none" : "auto" }}><FiTrash2 /></span>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "#64748b", padding: 16 }}>No plans available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT: SIDE PANEL */}
        <div className="card pane" style={{ position: "sticky", top: 16, alignSelf: "start", minHeight: 200 }}>
          <div className="side-head">
            <div className="crumbs">
              <span className="crumb" onClick={closePanel}>Plans</span>
              <FiChevronRight />
              <span className="crumb-active">
                {mode === "create" ? "New" : mode === "edit" ? (selected?.name || "Edit") : mode === "view" ? (selected?.name || "Plan") : "—"}
              </span>
            </div>
            {mode !== "list" && (
              <button className="btn btn-light btn-sm" onClick={closePanel} title="Close">
                <FiX />
              </button>
            )}
          </div>

          {mode === "list" && (
            <div className="muted">Select a plan to view/edit, or click “New Plan”.</div>
          )}

          {mode === "view" && selected && (
            <>
              <div className="grid-2">
                <div>
                  <div className="label">Name</div>
                  <div style={{ fontWeight: 800 }}>{selected.name}</div>
                </div>
                <div>
                  <div className="label">Status</div>
                  <div>{selected.status}</div>
                </div>
                <div>
                  <div className="label">Meta Line</div>
                  <div>{selected.meta_line || "—"}</div>
                </div>
                <div>
                  <div className="label">Monthly Price</div>
                  <div>{selected.price_monthly ? `${selected.price_monthly} ${selected.currency}` : "—"}</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="label">Features</div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {parseFeaturesToArray(selected.features).length
                    ? parseFeaturesToArray(selected.features).map((f, i) => <li key={i}>{f}</li>)
                    : <li>—</li>}
                </ul>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <button className="btn btn-teal-slim btn-nowrap" onClick={() => openEdit(selected)}>Edit</button>
                <button className="btn btn-danger btn-nowrap" onClick={() => onDelete(selected)} disabled={deleting} style={{ opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </>
          )}

          {(mode === "edit" || mode === "create") && (
            <>
              <div className="grid-2">
                <div>
                  <div className="label">Name</div>
                  <input className="form-control" value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Slug</div>
                  <input className="form-control" value={edit.slug} onChange={(e) => setEdit((s) => ({ ...s, slug: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Meta Line</div>
                  <input className="form-control" value={edit.meta_line} onChange={(e) => setEdit((s) => ({ ...s, meta_line: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Plan Type</div>
                  <select className="form-select" value={edit.plan_type} onChange={(e) => setEdit((s) => ({ ...s, plan_type: e.target.value }))}>
                    <option value="subscription">subscription</option>
                    <option value="one_time">one_time</option>
                  </select>
                </div>
                <div>
                  <div className="label">Monthly Price</div>
                  <input type="number" className="form-control" value={edit.price_monthly} onChange={(e) => setEdit((s) => ({ ...s, price_monthly: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Yearly Price</div>
                  <input type="number" className="form-control" value={edit.price_yearly} onChange={(e) => setEdit((s) => ({ ...s, price_yearly: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Currency</div>
                  <input className="form-control" value={edit.currency} onChange={(e) => setEdit((s) => ({ ...s, currency: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Status</div>
                  <select className="form-select" value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}>
                    {["active", "inactive", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Features dynamic rows */}
              <div style={{ marginTop: 12 }}>
                <div className="label">Features</div>
                {(edit.features || []).map((f, idx) => (
                  <div key={idx} className="feature-row">
                    <input
                      className="form-control"
                      placeholder={`Feature #${idx + 1}`}
                      value={f}
                      onChange={(e) => updateFeature(idx, e.target.value)}
                    />
                    <button type="button" className="btn btn-danger btn-mini" onClick={() => removeFeature(idx)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline-teal-slim btn-mini" onClick={addFeature}>
                  + Add Feature
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <button className="btn btn-outline-teal-slim btn-nowrap" onClick={closePanel}>
                  Cancel
                </button>
                <button className="btn btn-teal-slim btn-nowrap" onClick={onSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving…" : mode === "create" ? "Create Plan" : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
