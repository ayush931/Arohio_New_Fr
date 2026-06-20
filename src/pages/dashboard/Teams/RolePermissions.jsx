import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

export default function RolePermissions() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");            // <-- selected role

  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({});            // { [moduleId]: { [permissionId]: {checked, id} } }
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  // Initial boot: load roles, modules, permissions; then load mappings for default role
  useEffect(() => {
    (async () => {
      try {
        setBooting(true);
        const [rolesRes, modsRes, permsRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/roles`).then(r => r.json()),
          fetch(`${API_BASE}/api/v1/modules`).then(r => r.json()),
          fetch(`${API_BASE}/api/v1/permissions`).then(r => r.json()),
        ]);

        const rs = rolesRes.items || rolesRes;
        const mods = modsRes.items || modsRes;
        const perms = permsRes.items || permsRes;

        setRoles(rs || []);
        setModules(mods || []);
        setPermissions(perms || []);

        // pick first active role by default (if any)
        const firstRoleId = (rs && rs.length) ? (rs.find(r => r.is_active)?.id ?? rs[0].id) : "";
        setRoleId(firstRoleId || "");
        if (firstRoleId) {
          await loadData(firstRoleId, mods, perms);
        } else {
          // still build empty matrix so UI renders nicely
          setMatrix(buildEmptyMatrix(mods, perms));
        }
      } catch (e) {
        console.error(e);
        alert("Failed to load initial data.");
      } finally {
        setBooting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When role changes, reload mappings for that role
  useEffect(() => {
    if (!booting && roleId) {
      loadData(roleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  const buildEmptyMatrix = (mods = modules, perms = permissions) => {
    const m = {};
    (mods || []).forEach(mod => {
      m[mod.id] = {};
      (perms || []).forEach(p => {
        m[mod.id][p.id] = { checked: false, id: null };
      });
    });
    return m;
  };

  const loadData = async (rId = roleId, mods = modules, perms = permissions) => {
    if (!rId) {
      setMatrix(buildEmptyMatrix(mods, perms));
      return;
    }
    setLoading(true);
    try {
      const mapRes = await fetch(`${API_BASE}/api/v1/role-permissions?role_id=${rId}`).then(r => r.json());
      const mappings = mapRes.items || mapRes || [];

      const m = buildEmptyMatrix(mods, perms);
      mappings.forEach(row => {
        if (m[row.module_id]?.[row.permission_id]) {
          m[row.module_id][row.permission_id] = {
            checked: !!row.is_allowed,
            id: row.id,
          };
        }
      });
      setMatrix(m);
    } catch (e) {
      console.error(e);
      alert("Failed to load role permission mappings.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCell = async (modId, permId) => {
    if (!roleId) return;
    const cell = matrix?.[modId]?.[permId];
    if (!cell) return;

    try {
      if (cell.id) {
        await fetch(`${API_BASE}/api/v1/role-permissions/${cell.id}/toggle`, { method: "POST" });
      } else {
        await fetch(`${API_BASE}/api/v1/role-permissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role_id: Number(roleId),
            module_id: modId,
            permission_id: permId,
            is_allowed: true,
          }),
        });
      }
      await loadData(roleId);
    } catch (e) {
      console.error(e);
      alert("Update failed.");
    }
  };

  const saveAll = async () => {
    if (!roleId) return;
    try {
      const entries = [];
      Object.entries(matrix).forEach(([modId, perms]) => {
        Object.entries(perms).forEach(([permId, cell]) => {
          entries.push({
            role_id: Number(roleId),
            module_id: Number(modId),
            permission_id: Number(permId),
            is_allowed: !!cell.checked,
          });
        });
      });

      await fetch(`${API_BASE}/api/v1/role-permissions/bulk-assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: Number(roleId),
          module_id: null,
          permission_ids: [],
          entries,
        }),
      });
      alert("Permissions saved");
      await loadData(roleId);
    } catch (e) {
      console.error(e);
      alert("Bulk save failed.");
    }
  };

  const roleOptions = (roles?.length ? roles : []).map(r => (
    <option key={r.id} value={r.id}>
      {r.name} {r.is_active === false ? "(inactive)" : ""}
    </option>
  ));

  const disabled = !roleId || loading || booting;

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
        .select{padding:10px 12px;border:1px solid var(--line);border-radius:6px;min-width:240px;background:#fff;font-weight:600;color:#000;}
        .pill{font-size:.85rem;padding:6px 10px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#334155}
        .table-wrap{overflow:auto}
        table.perm{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}
        table.perm thead th{padding:14px 12px;color:#334155;font-size:.92rem;font-weight:900;border-bottom:1px solid var(--line);text-align:center}
        table.perm thead th:first-child{text-align:left}
        table.perm tbody td{padding:14px 12px;border-bottom:1px solid var(--line);vertical-align:middle;text-align:center}
        table.perm tbody td:first-child{text-align:left}
        .feature-title{font-weight:800;color:var(--ink)}
        .feature-hint{font-size:.85rem;color:#94a3b8;margin-top:4px}
        .cb-wrap{display:inline-block}
        .cb{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid #cbd5e1;border-radius:4px;background:#fff;cursor:pointer;display:inline-grid;place-items:center;transition:border-color .15s, background .15s;outline:none;}
        .cb:focus{box-shadow:0 0 0 3px rgba(33,199,184,.18);border-color:var(--teal)}
        .cb:hover{border-color:var(--teal)}
        .cb-svg{width:13px;height:13px;opacity:0;transform:scale(.8);transition:opacity .12s ease, transform .12s ease;}
        .cb:checked{background:var(--teal);border-color:var(--teal);}
        .cb:checked + svg.cb-svg{opacity:1;transform:scale(1);}
        .actions{display:flex;justify-content:flex-end;margin-top:12px}
        .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:3px;padding:10px 14px;font-weight:800;cursor:pointer}
        .btn-teal{background:var(--teal);border:none;color:#fff}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .dim{opacity:.5;pointer-events:none}
      `}</style>

      <h1 className="h5 title mb-1">Role Permissions</h1>
      <div className="muted mb-3">Select a role to view and edit its module-wise permissions.</div>

      <div className="card pane">
        <div className="toolbar">
          <select
            className="select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="" disabled>Select role…</option>
            {roleOptions}
          </select>

          <span className="pill">
            {booting ? "Booting…" : loading ? "Loading…" : roleId ? "Ready" : "Pick a role"}
          </span>
        </div>

        <div className={`table-wrap ${disabled ? "dim" : ""}`}>
          <table className="perm">
            <colgroup>
              <col style={{ width: "36%" }} />
              {permissions.map(() => (
                <col key={crypto.randomUUID?.() || Math.random()} style={{ width: `${64/Math.max(1, permissions.length)}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="text-start">Module</th>
                {permissions.map(p => <th key={p.id}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={permissions.length+1}>Loading…</td></tr>
              )}
              {!loading && modules.map(mod => (
                <tr key={mod.id}>
                  <td>
                    <div className="feature-title">{mod.name}</div>
                    <div className="feature-hint">{mod.description}</div>
                  </td>
                  {permissions.map(p => {
                    const cell = matrix[mod.id]?.[p.id] || {checked:false,id:null};
                    const id = `${mod.id}_${p.id}`;
                    return (
                      <td key={p.id}>
                        <label className="cb-wrap" htmlFor={id}>
                          <input
                            id={id}
                            className="cb"
                            type="checkbox"
                            checked={!!cell.checked}
                            onChange={() => toggleCell(mod.id, p.id)}
                            disabled={!roleId}
                          />
                          <svg className="cb-svg" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 10.5l3.5 3.5L15 7.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {!loading && !modules.length && (
                <tr><td colSpan={permissions.length+1}>No modules found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button className="btn btn-teal" onClick={saveAll} disabled={!roleId || loading || booting}>
            <FaSave /> Save All
          </button>
        </div>
      </div>
    </div>
  );
}
