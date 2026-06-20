import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserPlus, FaCheck } from "react-icons/fa";

/* -------- auth helpers -------- */
function getAuthFromStorage() {
  const keys = ["auth_user", "user"];
  const stores = [window.sessionStorage, window.localStorage];
  for (const store of stores) {
    if (!store) continue;
    for (const k of keys) {
      const raw = store.getItem(k);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return parsed?.user || parsed;
        } catch {}
      }
    }
  }
  return null;
}
function getAuthToken() {
  const s = sessionStorage?.getItem("auth_token");
  const l = localStorage?.getItem("auth_token");
  return s || l || "";
}
function authHeaders() {
  const tok = getAuthToken();
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

export default function AdminUserManagement() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [checked, setChecked] = useState({});
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [modal, setModal] = useState({ type: null, user: null }); // 'view' | 'edit' | 'delete' | 'create'
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", role_id: null, is_active: true, password: "" });

  const { ToastViewport, pushToast } = useToasts();

  useEffect(() => {
    const auth = getAuthFromStorage();
    setCurrentUser(auth);
    loadRoles();
    loadUsers(auth?.id);
  }, []);

  async function loadRoles() {
    try {
      const res = await fetch(`${API_BASE}/roles`, { headers: { ...authHeaders() } });
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const map = {};
      items.forEach(r => { map[r.id] = r.name; });
      setRoles(map);
    } catch {}
  }

  async function loadUsers(skipUserId) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ include_inactive: "true", include_deleted: "false", page: "1", page_size: "200" });
      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, { headers: { ...authHeaders() } });
      if (!res.ok) throw new Error(`List failed (${res.status})`);
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const filtered = items.filter(u => !skipUserId || u.id !== skipUserId);
      setUsers(filtered);
      setSelected(filtered[0] || null);
    } catch (e) {
      pushToast({ title: "Load failed", description: e.message || "Unable to fetch users.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .map(u => ({
        ...u,
        plan: "Free",
        status: u.is_active ? "Active" : "Suspended",
        avatar: u.avatar_url || "",
        name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
        joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : "—",
        role_name: u.role_id != null ? (roles[u.role_id] || `#${u.role_id}`) : "—",
      }))
      .filter(u =>
        (!q || u.name.toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)) &&
        (planFilter === "All" || u.plan === planFilter) &&
        (statusFilter === "All" || u.status === statusFilter)
      );
  }, [users, roles, query, planFilter, statusFilter]);

  const allChecked = filtered.length > 0 && filtered.every(u => checked[u.id]);
  const toggleAll = () => {
    const next = {};
    if (!allChecked) filtered.forEach(u => (next[u.id] = true));
    setChecked(next);
  };
  const toggleOne = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const usagePath = useMemo(() => {
    const pts = selected?.usage || [5,7,6,8,6,7,8,9,7,8,9,7];
    const w = 260, h = 90, pad = 4;
    const max = Math.max(...pts, 1), min = Math.min(...pts, 0);
    const nx = (i) => pad + (i * (w - pad * 2)) / Math.max(pts.length - 1, 1);
    const ny = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return pts.map((v, i) => `${i === 0 ? "M" : "L"}${nx(i)},${ny(v)}`).join(" ");
  }, [selected]);

  function openModal(type, user) {
    setModal({ type, user });
    if (type === "edit" && user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role_id: user.role_id ?? null,
        is_active: !!user.is_active,
        password: "",
      });
    }
    if (type === "create") {
      setForm({ first_name: "", last_name: "", email: "", role_id: null, is_active: true, password: "" });
    }
  }
  function closeModal() {
    setModal({ type: null, user: null });
  }

  async function saveEdit() {
    const id = modal.user.id;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          role_id: form.role_id,
          is_active: form.is_active,
          ...(form.password ? { password: form.password } : {}), // if your API expects password
        }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      pushToast({ title: "User updated", description: "Changes saved successfully.", variant: "success" });
      closeModal();
      loadUsers(currentUser?.id);
    } catch (e) {
      pushToast({ title: "Update failed", description: e.message || "Unable to update user.", variant: "error" });
    }
  }

  async function createUser() {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role_id: form.role_id,
        is_active: form.is_active,
        password: form.password,
      }),
    });

    const data = await res.json();  // <-- always parse body

    if (!res.ok) {
      // backend may have {"detail":"Email already exists"}
      throw new Error(data.detail || `Create failed (${res.status})`);
    }

    pushToast({
      title: "User created",
      description: `User ${data.first_name} ${data.last_name} created successfully`, // or any field
      variant: "success",
    });

    closeModal();
    loadUsers(currentUser?.id);
  } catch (e) {
    pushToast({
      title: "Create failed",
      description: e.message || "Unable to create user.",
      variant: "error",
    });
  }
}


  async function confirmDelete() {
    const id = modal.user.id;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed (${res.status})`);
      pushToast({ title: "User deleted", description: "The user was removed.", variant: "warning" });
      closeModal();
      loadUsers(currentUser?.id);
    } catch (e) {
      pushToast({ title: "Delete failed", description: e.message || "Unable to delete user.", variant: "error" });
    }
  }

  return (
    <div className="container py-3 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .grid{display:grid;grid-template-columns:2fr 1fr;gap:16px}
        @media(max-width:1100px){.grid{grid-template-columns:1fr}}
        .toolbar{display:flex;gap:10px;align-items:center}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:3px;background:#fff;padding:8px 12px;min-width:280px}
        .search input{border:none;outline:none;background:#fff;color:#0f172a;flex:1}
        .btn{border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:2px;padding:8px 12px;font-weight:800;cursor:pointer}
        .btn-ghost{background:#f8fafc;color:#111}
        .btn-teal{background:${TEAL};color:#fff;border:none;padding:10px 14px;border-radius:6px;font-weight:800}
        .select{border:1px solid var(--line);border-radius:2px;padding:8px 10px;background:#fff;color:#0f172a}
        .table{width:100%;border-collapse:separate;border-spacing:0}
        .table thead th{padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff}
        .table tbody td{padding:12px;border-bottom:1px solid var(--line);vertical-align:middle}
        .table tbody tr:hover{background:#fbfdff}
        .chk{width:16px;height:16px;border-radius:4px;background:#fff;accent-color: var(--teal);border:1px solid #cbd5e1;cursor:pointer;background:#cbd5e1}
        .namecell{display:flex;align-items:center;gap:10px}
        .avatar{width:30px;height:30px;border-radius:50%;object-fit:cover;border:1px solid #e2e8f0;background:#fff;display:inline-grid;place-items:center;font-weight:900;color:#334155}
        .pill{font-size:.75rem;font-weight:800;border:1px solid #e2e8f0;border-radius:999px;padding:4px 10px;background:#f8fafc;color:#475569}
        .status{font-size:.75rem;font-weight:800;border-radius:999px;padding:4px 10px;border:1px solid}
        .s-active{color:#16a34a;background:#ecfdf5;border-color:#bbf7d0}
        .s-suspended{color:#dc2626;background:#fef2f2;border-color:#fecaca}
        .actionbtn{border:1px solid var(--line);background:#fff;color: var(--ink);border-radius:2px;width:28px;height:28px;display:grid;place-items:center}
        .actionbtn svg{color: var(--ink);}
        .side{position:sticky;top:12px}
        .profile{display:flex;align-items:center;gap:12px}
        .bigav{width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid #e2e8f0;background:#fff;display:inline-grid;place-items:center;font-weight:900;color:#334155}
        .spark{height:110px}
        .link{font-weight:900;cursor:pointer;color:#0f172a}
        .link:hover{color:var(--teal)}
        .listy{display:flex;flex-direction:column;gap:8px}
        .rowy{display:flex;align-items:center;justify-content:space-between}

        /* Right top banner */
        .add-banner{
          background:${TEAL};
          color:#fff;
          border-radius:8px;
          padding:14px 16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:12px;
          box-shadow:0 6px 18px rgba(2,8,23,.10);
        }
        .add-left{display:flex;gap:10px;align-items:center;font-weight:900}
        .add-icon{
          width:32px;height:32px;border-radius:999px;
          background:rgba(255,255,255,.18);
          display:grid;place-items:center;
        }

        /* Modal */
        .modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:1080;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#fff;border-radius:6px;box-shadow:0 18px 36px rgba(2,8,23,.15);width:100%;max-width:540px;border:1px solid var(--line)}
        .modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--line)}
        .modal-body{padding:18px;display:grid;gap:12px}
        .modal-foot{padding:16px 18px;border-top:1px solid var(--line);display:flex;gap:10px;justify-content:flex-end}
        .field{background:#fff;color:#000;border:1px solid var(--line);border-radius:6px;padding:10px 12px;width:100%}
        .label{font-size:.9rem;color:#475569;font-weight:700}

        /* Toasts */
        .toast-viewport{position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:10px;z-index:2000}
        .toast{min-width:260px;max-width:360px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start;padding:12px 14px;border:1px solid rgba(148,163,184,.35);background:rgba(255,255,255,.9);backdrop-filter:saturate(1.8) blur(6px);border-radius:12px;box-shadow:0 10px 28px rgba(15,23,42,.12);animation:toast-in .18s ease-out}
        .toast-title{font-weight:800;color:#0f172a}
        .toast-desc{font-size:.88rem;color:#475569;margin-top:2px}
        .toast-success{border-color:rgba(16,185,129,.35)} .toast-success .dot{background:#10b981}
        .toast-error{border-color:rgba(239,68,68,.35)} .toast-error .dot{background:#ef4444}
        .toast-info{border-color:rgba(59,130,246,.35)} .toast-info .dot{background:#3b82f6}
        .toast-warning{border-color:rgba(234,179,8,.45)} .toast-warning .dot{background:#eab308}
        .dot{width:10px;height:10px;border-radius:999px;margin-top:6px}
        .toast-close{border:none;background:transparent;color:#334155;font-weight:800;cursor:pointer}
        @keyframes toast-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

   <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
  <h1 className="h5 title" style={{margin:0}}>User Management</h1>
  <button 
    onClick={() => openModal("create", null)} 
    style={{
      background:'#21c7b8',
      color:'#fff',
      border:'none',
      padding:'10px 14px',
      borderRadius:'6px',
      fontWeight:800,
      display:'flex',
      alignItems:'center',
      cursor:'pointer'
    }}
  >
    <FaUserPlus style={{marginRight:8}} /> Add New User
  </button>
</div>

<div className="muted mb-3">Search, filter, and manage all users.</div>

      <div className="grid">
        {/* LEFT: list */}
        <div className="card pane">
          <div className="toolbar mb-2" style={{flexWrap:"wrap"}}>
            <div className="search">
              <FaSearch size={14} color="#94a3b8" />
              <input
                placeholder="Search by name or email…"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
            </div>
            {/* <button className="btn btn-ghost" disabled>Block</button>
            <button className="btn" disabled>Unblock</button>
            <button className="btn" disabled>Delete</button> */}
            <div style={{marginLeft:"auto",display:"flex",gap:8}}>
              <select className="select" value={planFilter} onChange={(e)=>setPlanFilter(e.target.value)}>
                <option>All</option><option>Free</option>
              </select>
              <select className="select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                <option>All</option><option>Active</option><option>Suspended</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{width:30}}><input className="chk" type="checkbox" checked={allChecked} onChange={toggleAll}/></th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th style={{width:90}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="muted" style={{padding:"18px"}}>Loading…</td></tr>
                )}
                {!loading && filtered.map(u => (
                  <tr key={u.id} onClick={()=>setSelected(u)} style={{cursor:"pointer"}}>
                    <td>
                      <input
                        className="chk"
                        type="checkbox"
                        checked={!!checked[u.id]}
                        onChange={(e)=>{e.stopPropagation(); toggleOne(u.id);}}
                      />
                    </td>
                    <td>
                      <div className="namecell">
                        {u.avatar ? (
                          <img className="avatar" src={u.avatar} alt="" />
                        ) : (
                          <div className="avatar">{(u.first_name?.[0] || u.name?.[0] || "?").toUpperCase()}</div>
                        )}
                        <div>
                          <div style={{fontWeight:900,color:INK}}>{u.name}</div>
                          <div className="muted" style={{fontSize:".85rem"}}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="pill">{u.role_name}</span></td>
                    <td><span className="pill">{u.plan}</span></td>
                    <td>
                      {u.status === "Active"    && <span className="status s-active">Active</span>}
                      {u.status === "Suspended" && <span className="status s-suspended">Inactive</span>}
                    </td>
                    <td className="text-end" onClick={(e)=>e.stopPropagation()}>
                      <div style={{display:"flex",gap:6}}>
                        <button className="actionbtn" title="View" onClick={()=>openModal("view", u)}><FaEye size={12}/></button>
                        <button className="actionbtn" title="Edit" onClick={()=>openModal("edit", u)}><FaEdit size={12}/></button>
                        <button className="actionbtn" title="Delete" onClick={()=>openModal("delete", u)}><FaTrash size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="muted" style={{padding:"18px"}}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: detail + new banner */}
        <div className="side">

          <div className="card pane mb-3">
            <div className="profile">
              {currentUser?.avatar_url ? (
                <img className="bigav" src={currentUser.avatar_url} alt="avatar" />
              ) : (
                <div className="bigav">{(currentUser?.first_name?.[0] || currentUser?.email?.[0] || "?").toUpperCase()}</div>
              )}
              <div>
                <div style={{fontWeight:900,color:INK}}>
                  {currentUser ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() || currentUser.email : "—"}
                </div>
                <div className="muted" style={{fontSize:".9rem"}}>{currentUser?.email || "—"}</div>
                <div className="muted" style={{fontSize:".8rem"}}>Signed up on {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : "—"}</div>
              </div>
            </div>
          </div>

          <div className="card pane mb-3">
            <div className="rowy" style={{marginBottom:6}}>
              <div style={{fontWeight:900,color:INK}}>Credit Usage</div>
              <span className="pill">Last 28 days</span>
            </div>
            <div style={{fontSize:"1.4rem",fontWeight:900,color:INK,marginBottom:4}}>
              {selected?.credits ?? "—"}
            </div>
            <svg className="spark" viewBox="0 0 260 90" preserveAspectRatio="none" aria-label="Usage trend">
              <path d={usagePath} fill="none" stroke={TEAL} strokeWidth="3" />
              <defs>
                <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TEAL} stopOpacity="0.12"/>
                  <stop offset="100%" stopColor={TEAL} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={`${usagePath} L260,90 L0,90 Z`} fill="url(#usageFill)"/>
            </svg>
          </div>

          <div className="card pane mb-3">
            <div style={{fontWeight:900,color:INK,marginBottom:8}}>Subscription History</div>
            <div className="listy">
              <div className="rowy">
                <div>
                  <div className="muted" style={{fontSize:".8rem"}}>Current Plan</div>
                  <div style={{fontWeight:900,color:INK}}>{selected?.plan || "Free"}</div>
                </div>
                <div className="pill">Active</div>
              </div>
              <div className="rowy">
                <div>
                  <div className="muted" style={{fontSize:".8rem"}}>Subscribed date</div>
                  <div style={{fontWeight:900,color:INK}}>{selected?.joined || "—"}</div>
                </div>
                <div className="muted" style={{fontSize:".85rem"}}>Renews monthly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View modal */}
      {modal.type === "view" && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{fontWeight:900,color:INK}}>User Details</div>
              <button className="btn-ghost" onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
              <div className="label">Name</div>
              <div style={{fontWeight:900,color:INK}}>
                {`${modal.user.first_name || ""} ${modal.user.last_name || ""}`.trim() || modal.user.email}
              </div>
              <div className="label">Email</div>
              <div className="muted">{modal.user.email || "—"}</div>
              <div className="label">Role</div>
              <div className="muted">{modal.user.role_id != null ? (roles[modal.user.role_id] || `#${modal.user.role_id}`) : "—"}</div>
              <div className="label">Status</div>
              <div className="muted">{modal.user.is_active ? "Active" : "Inactive"}</div>
              <div className="label">Joined</div>
              <div className="muted">{modal.user.created_at ? new Date(modal.user.created_at).toLocaleString() : "—"}</div>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {modal.type === "edit" && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{fontWeight:900,color:INK}}>Edit User</div>
              <button className="btn-ghost" onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
              <div>
                <div className="label">First name</div>
                <input className="field" value={form.first_name} onChange={(e)=>setForm(f=>({...f, first_name: e.target.value}))}/>
              </div>
              <div>
                <div className="label">Last name</div>
                <input className="field" value={form.last_name} onChange={(e)=>setForm(f=>({...f, last_name: e.target.value}))}/>
              </div>
              <div>
                <div className="label">Email</div>
                <input className="field" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))}/>
              </div>
              <div>
                <div className="label">Role</div>
                <select className="field" value={form.role_id ?? ""} onChange={(e)=>setForm(f=>({...f, role_id: e.target.value ? Number(e.target.value) : null}))}>
                  <option value="">— None —</option>
                  {Object.entries(roles).map(([id,name])=>(
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Password (optional)</div>
                <input type="password" className="field" value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))}/>
              </div>
              <label className="label" style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" className="chk" checked={form.is_active} onChange={(e)=>setForm(f=>({...f, is_active: e.target.checked}))}/>
                Active
              </label>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn-teal" onClick={saveEdit} disabled={!form.email || (!form.first_name && !form.last_name)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
     {modal.type === "create" && (
  <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-head">
        <div style={{ fontWeight: 900, color: INK }}>Add New User</div>
        <button className="btn-ghost" onClick={closeModal}>Close</button>
      </div>
      <div className="modal-body">
        <div>
          <div className="label">First name</div>
          <input
            className="field"
            placeholder="Enter first name"
            value={form.first_name}
            onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))}
          />
        </div>
        <div>
          <div className="label">Last name</div>
          <input
            className="field"
            placeholder="Enter last name"
            value={form.last_name}
            onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))}
          />
        </div>
        <div>
          <div className="label">Email</div>
          <input
            className="field"
            placeholder="Enter email address"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <div className="label">Password</div>
          <input
            type="password"
            className="field"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div>
          <div className="label">Role</div>
          <select
            className="field"
            value={form.role_id ?? ""}
            onChange={(e) =>
              setForm(f => ({ ...f, role_id: e.target.value ? Number(e.target.value) : null }))
            }
          >
            <option value="">— Select Role —</option>
            {Object.entries(roles).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <label className="label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            className="chk"
            checked={form.is_active}
            onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
          />
          Active
        </label>
      </div>
      <div className="modal-foot">
        <button className="btn-ghost" onClick={closeModal}>Cancel</button>
        <button
          className="btn-teal"
          onClick={createUser}
          disabled={!form.email || !form.password || !form.first_name}
        >
          Create User
        </button>
      </div>
    </div>
  </div>
)}


      {/* Delete modal */}
      {modal.type === "delete" && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{fontWeight:900,color:INK}}>Delete User</div>
              <button className="btn-ghost" onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
              <div className="muted" style={{fontSize:".95rem"}}>
                Are you sure you want to delete{" "}
                <strong style={{color:INK}}>
                  {`${modal.user.first_name || ""} ${modal.user.last_name || ""}`.trim() || modal.user.email}
                </strong>
                ?
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn" style={{background:"#fee2e2", borderColor:"#fecaca", color:"#b91c1c"}} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastViewport />
    </div>
  );
}

/* ---------------- Toast system ---------------- */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const pushToast = ({ title, description, variant = "info", duration = 2200 }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, title, description, variant }]);
    const timer = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      clearTimeout(timer);
    }, duration);
  };
  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const ToastViewport = () => (
    <div className="toast-viewport">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.variant}`}>
          <span className="dot" />
          <div>
            <div className="toast-title">{t.title}</div>
            {t.description ? <div className="toast-desc">{t.description}</div> : null}
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
  return { ToastViewport, pushToast };
}
