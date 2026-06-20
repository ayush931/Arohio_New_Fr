import { useEffect, useMemo, useState } from "react";

/**
 * AdminAuditLogs
 * - GET /api/v1/admin/audits?viewer_user_id=...  (preferred)
 *   returns array (or { items: [...] }) and may include:
 *   actor_name, actor_email, actor_role_name, message_for_viewer
 *
 * Fallback message rule:
 *   if audit.actor_user_id === auth_user.id  -> show audit.actor_message
 *   else                                      show audit.custom_message
 */
export default function AdminAuditLogs() {
  const INK = "#0f172a", LINE = "#e2e8f0", BG = "#f9fafb";

  // ---------- API base ----------
  const API_BASE = useMemo(
    () =>
      (import.meta.env.VITE_API_BASE &&
        String(import.meta.env.VITE_API_BASE).trim()) ||
      "http://127.0.0.1:8000",
    []
  );
  const AUDITS_URL = `${API_BASE}/admin/audits`; // admin audits route

  // ---------- state ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audits, setAudits] = useState([]);
  const [query, setQuery] = useState("");

  // ---------- helpers ----------
  const getStored = (k) => {
    const ls = window.localStorage.getItem(k);
    const ss = window.sessionStorage.getItem(k);
    return ls ?? ss ?? null;
  };

  // Try both keys: "auth_user"/"auth_token" and "_user"/"_token"
  const getAuth = () => {
    let user = null;
    const rawUser = getStored("auth_user") || getStored("_user");
    try { user = JSON.parse(rawUser || "null"); } catch {}
    const token = getStored("auth_token") || getStored("_token") || null;
    return { user, token };
  };

  const fmtDT = (iso) => {
    if (!iso) return "";
    try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
  };

  // ---------- data load ----------
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      const { user: authUser, token } = getAuth();
      const viewerId = authUser?.id ? Number(authUser.id) : undefined;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      try {
        const url = viewerId ? `${AUDITS_URL}?viewer_user_id=${viewerId}` : AUDITS_URL;

        const aRes = await fetch(url, { headers });
        if (!aRes.ok) {
          const msg = (await aRes.text().catch(() => "")) || "Failed to fetch audits";
          throw new Error(msg);
        }
        const data = await aRes.json().catch(() => []);
        const items = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
        setAudits(items);
      } catch (e) {
        setError(String(e?.message || e) || "Unable to load audit logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []); // load once

  // ---------- table rows ----------
  const { user: authUser } = getAuth();
  const rows = useMemo(() => {
    return (audits || []).map((a) => {
      // Prefer server-provided actor name/email if present
      const actorId = a.actor_user_id ?? a.user_id ?? null;
      const actorName =
        a.actor_name ||
        [a.actor_first_name, a.actor_last_name].filter(Boolean).join(" ").trim() ||
        a.actor_email ||
        (actorId ? `User #${actorId}` : "System");

      // Prefer backend role name resolved from users.role_id -> roles.name
      const role =
        a.actor_role_name ||                  // <-- NEW preferred field
        a.actor_role ||
        a.meta?.actor_role ||
        a.role || a.role_name ||
        (a.role_id ? `Role ${a.role_id}` : "");

      // Prefer server-computed message_for_viewer; fallback to local rule
      const fallbackMsg =
        actorId && authUser?.id && Number(actorId) === Number(authUser.id)
          ? (a.actor_message || a.custom_message || "")
          : (a.custom_message || a.actor_message || "");
      const message = a.message_for_viewer ?? fallbackMsg;

      // Resource hint
      const resource =
        a.meta?.email ||
        a.meta?.entity ||
        a.meta?.source ||
        a.meta?.status ||
        a.entity_type ||
        "-";

      // status pill by action
      const status = (() => {
        const act = String(a.action || "").toLowerCase();
        if (["subscribe","resubscribe","created","published","success","ok"].some(x => act.includes(x))) return "Success";
        if (["unsubscribe","deleted","unpublished","removed"].some(x => act.includes(x))) return "Warning";
        if (["error","failed","fail"].some(x => act.includes(x))) return "Error";
        return "Info";
      })();

      return {
        id: a.id,
        ts: fmtDT(a.created_at || a.updated_at),
        user: actorName,
        role,
        action: a.action || "-",
        resource,
        status,
        message,
      };
    });
  }, [audits, authUser]);

  // ---------- filtering ----------
  const filtered = rows.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.user.toLowerCase().includes(q) ||
      (r.role || "").toLowerCase().includes(q) ||
      (r.action || "").toLowerCase().includes(q) ||
      (r.resource || "").toLowerCase().includes(q) ||
      (r.message || "").toLowerCase().includes(q)
    );
  });

  const statusClass = (s) => {
    if (s === "Success") return "s-success";
    if (s === "Error") return "s-error";
    if (s === "Warning") return "s-warning";
    if (s === "Info") return "s-info";
    return "";
  };

  return (
    <div className="container py-4" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        .title { font-weight: 900; color: ${INK}; }
        .muted { color: #475569; }
        .card { background: #fff; border: 1px solid ${LINE}; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05); }
        .pane { padding: 16px; }

        .toolbar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px; }
        .search { flex:1; min-width:240px; border:1px solid ${LINE}; border-radius:8px; padding:8px 12px; background:#fff; color:#000; }
        .search input { border:none; outline:none; width:100%; background:transparent; color:${INK}; font-weight:500; }

        .table { width:100%; border-collapse:separate; border-spacing:0; text-align:left; }
        .table thead th { padding:10px; text-align:left; font-weight:700; color:#0f172a; background:#f8fafc; border-bottom:1px solid ${LINE}; }
        .table tbody td { padding:10px; border-bottom:1px solid ${LINE}; font-size:.9rem; color:#0f172a; text-align:left; vertical-align:top; }

        .pill { font-size:.75rem; font-weight:700; border-radius:999px; padding:3px 10px; display:inline-block; }
        .s-success { color:#16a34a; background:#ecfdf5; border:1px solid #bbf7d0; }
        .s-error   { color:#dc2626; background:#fef2f2; border:1px solid #fecaca; }
        .s-warning { color:#d97706; background:#fffbeb; border:1px solid #fde68a; }
        .s-info    { color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; }

        .msg { color:#334155; font-size:.88rem; }
      `}</style>

      <h1 className="h5 title text-start">Audit Logs</h1>
      <div className="muted mb-3 text-start">Track every admin & user action for transparency.</div>

      <div className="card pane text-start">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search">
            <input
              placeholder="Search logs, actions, messages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search logs"
            />
          </div>
        </div>

        {/* Loading / Error */}
        {loading && <div className="muted">Loading audits…</div>}
        {!loading && error && <div className="text-danger">{error}</div>}

        {/* Table */}
        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{minWidth:160}}>Timestamp</th>
                  <th style={{minWidth:160}}>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th style={{minWidth:160}}>Resource</th>
                  <th>Status</th>
                  <th style={{minWidth:340}}>Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.ts}</td>
                    <td>{r.user}</td>
                    <td>{r.role || "—"}</td>
                    <td>{r.action}</td>
                    <td>{r.resource}</td>
                    <td><span className={`pill ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td className="msg">{r.message || "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="muted">No logs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="muted mt-2" style={{ fontSize: ".85rem" }}>
          Logs retained for 12 months under GDPR/CCPA.
        </div>
      </div>
    </div>
  );
}
