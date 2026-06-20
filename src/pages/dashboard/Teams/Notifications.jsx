import { useMemo, useState } from "react";
import { FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";

export default function Notifications() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";

  // seed data
  const seed = useMemo(
    () => [
      { id: "n1", tab: "All",     kind: "system",  icon: "file", title: "PDF uploaded by Alex",         time: "10:30 AM",         read: false },
      { id: "n2", tab: "All",     kind: "team",    icon: "ok",   title: "Alt text approved by Reviewer",time: "Yesterday",        read: false },
      { id: "n3", tab: "All",     kind: "billing", icon: "warn",  title: "Credits running low",          time: "2 days ago",       read: false },
      { id: "n4", tab: "System",  kind: "system",  icon: "file", title: "New model deployed",           time: "3 days ago",       read: true  },
      { id: "n5", tab: "Team",    kind: "team",    icon: "ok",   title: "Ethan commented on a job",     time: "4 days ago",       read: true  },
      { id: "n6", tab: "Billing", kind: "billing", icon: "warn",  title: "Invoice INV-2025-03 generated", time: "5 days ago",      read: true  },
    ],
    []
  );

  const TABS = ["All", "System", "Team", "Billing"];

  const [active, setActive] = useState("All");
  const [items, setItems] = useState(seed);
  const [prefs, setPrefs] = useState({ inApp: true, email: true, digest: false });
  const [query, setQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const counts = useMemo(() => {
    const base = Object.fromEntries(TABS.map(t => [t, 0]));
    const unread = Object.fromEntries(TABS.map(t => [t, 0]));
    for (const n of items) {
      const tabsFor = n.tab === "All" ? ["All"] : [n.tab];
      for (const t of tabsFor) {
        base[t] = (base[t] || 0) + 1;
        if (!n.read) unread[t] = (unread[t] || 0) + 1;
      }
      // “All” tab should include everything
      base["All"] = (base["All"] || 0) + (n.tab === "All" ? 0 : 0); // noop; we handle All via separate filter
    }
    // Count for All is simply all items
    base["All"] = items.length;
    unread["All"] = items.filter(i => !i.read).length;
    return { total: base, unread };
  }, [items]);

  const visible = useMemo(() => {
    const inTab = items.filter(i => (active === "All" ? true : i.tab === active || i.tab === "All"));
    const byQuery = query.trim()
      ? inTab.filter(i => i.title.toLowerCase().includes(query.trim().toLowerCase()))
      : inTab;
    const byUnread = onlyUnread ? byQuery.filter(i => !i.read) : byQuery;
    return byUnread;
  }, [items, active, query, onlyUnread]);

  const Icon = ({ type }) => {
    if (type === "file") return <FaFileAlt />;
    if (type === "ok") return <FaCheckCircle />;
    return <FaExclamationTriangle />;
  };

  const markOne = (id) =>
    setItems(arr => arr.map(n => (n.id === id ? { ...n, read: true } : n)));

  const markAll = () =>
    setItems(arr =>
      arr.map(n =>
        (active === "All" ? true : n.tab === active || n.tab === "All") ? { ...n, read: true } : n
      )
    );

  const clearHistory = () => {
    if (!window.confirm(`Clear ${active === "All" ? "all notifications" : `${active} notifications`} from history?`)) return;
    setItems(arr => arr.filter(n => !(active === "All" ? true : n.tab === active)));
  };

  const togglePref = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}

        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 10px 24px rgba(2,8,23,.06)}
        .pane{padding:16px}

        /* Tabs */
        .tabs{display:flex;gap:18px;border-bottom:1px solid var(--line);padding:0 16px}
        .tab{padding:12px 4px;font-weight:900;color:#64748b;cursor:pointer;position:relative;display:flex;align-items:center;gap:8px}
        .tab .count{font-size:.75rem;border:1px solid #e2e8f0;background:#f8fafc;border-radius:999px;padding:2px 8px;color:#475569;font-weight:800}
        .tab .dot{width:8px;height:8px;border-radius:999px;background:#ef4444;display:inline-block}
        .tab.active{color:var(--teal)}
        .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--teal)}

        /* Toolbar (sticky) */
        .list-head{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);z-index:2;padding:10px 16px;display:flex;gap:10px;align-items:center;justify-content:space-between;border-top-left-radius:16px;border-top-right-radius:16px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:12px;background:#fff;padding:8px 12px;min-width:260px}
        .search input{border:none;outline:none;background:#fff;color:#0f172a;width:200px}
        .filter{display:flex;align-items:center;gap:8px}
        .filter .chk{appearance:none;width:18px;height:18px;border:2px solid #cbd5e1;border-radius:4px;display:inline-grid;place-items:center;cursor:pointer}
        .filter .chk:checked{background:var(--teal);border-color:var(--teal)}
        .filter .chk:checked::after{content:"";width:10px;height:10px;background:#fff;border-radius:2px}

        /* Rows */
        .rowy{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line);transition:background .12s}
        .rowy:hover{background:#fbfdff}
        .item{display:flex;align-items:center;gap:12px;min-width:0}
        .ico{width:36px;height:36px;border-radius:2px;display:grid;place-items:center;flex:0 0 auto}
        .ico.file{background:#eef2ff;color:#4338ca}
        .ico.ok{background:#ecfdf5;color:#16a34a}
        .ico.warn{background:#fff7ed;color:#ea580c}
        .main{min-width:0}
        .title-line{display:flex;align-items:center;gap:8px}
        .n-title{font-weight:900;color:var(--ink);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:48vw}
        .badge{font-size:.7rem;background:#e2f0ff;color:#0369a1;border:1px solid #bfdbfe;border-radius:999px;padding:2px 6px;font-weight:800}
        .unread{width:8px;height:8px;background:#10b981;border-radius:999px}
        .meta{font-size:.85rem;color:#94a3b8}

        .link{font-weight:900;cursor:pointer;color:#0f172a}
        .link:hover{color:var(--teal)}
        .actions{display:flex;gap:10px;justify-content:flex-end;padding:12px 16px}
        .btn{border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:3px;padding:10px 14px;font-weight:800;cursor:pointer}
        .btn-ghost{background:#f8fafc}
        .btn:hover{border-color:#cbd5e1}

        /* Settings */
        .settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--line)}
        .settings-row:last-child{border-bottom:none}

        /* Accessible switch */
        .switch{display:inline-flex;align-items:center;gap:10px}
        .switch input{position:absolute;opacity:0;pointer-events:none}
        .track{width:48px;height:26px;border-radius:999px;background:#e2e8f0;position:relative;transition:.2s}
        .thumb{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:999px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.12);transition:.2s}
        .switch input:checked + .track{background:var(--teal)}
        .switch input:checked + .track .thumb{left:25px}
      `}</style>

      <h1 className="h5 title mb-3">Notifications</h1>

      {/* Notifications List */}
      <div className="card mb-3" role="region" aria-label="Notifications">
        <div className="tabs" role="tablist" aria-label="Notification categories">
          {TABS.map(t => (
            <div
              key={t}
              role="tab"
              aria-selected={active === t}
              tabIndex={0}
              onKeyDown={(e)=> (e.key === "Enter" || e.key === " ") && setActive(t)}
              className={`tab ${active === t ? "active" : ""}`}
              onClick={()=>setActive(t)}
            >
              <span>{t}</span>
              <span className="count">{counts.total[t] ?? 0}</span>
              {counts.unread[t] > 0 && <span className="dot" title={`${counts.unread[t]} unread`} />}
            </div>
          ))}
        </div>

        {/* sticky header tools */}
        <div className="list-head">
          <div className="search">
            <FaSearch size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search notifications…"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              aria-label="Search notifications"
            />
          </div>
          <label className="filter">
            <input
              type="checkbox"
              className="chk"
              checked={onlyUnread}
              onChange={()=>setOnlyUnread(v => !v)}
              aria-label="Show only unread"
            />
            <span className="muted">Unread only</span>
          </label>
        </div>

        <div className="pane" style={{padding:0}}>
          {visible.length === 0 ? (
            <div className="muted" style={{padding:"24px 16px"}}>No notifications.</div>
          ) : (
            visible.map(n => (
              <div key={n.id} className="rowy">
                <div className="item">
                  <div className={`ico ${n.icon}`} aria-hidden>
                    <Icon type={n.icon} />
                  </div>
                  <div className="main">
                    <div className="title-line">
                      <div className="n-title">{n.title}</div>
                      {n.kind && <span className="badge">{n.kind}</span>}
                      {!n.read && <span className="unread" title="Unread" />}
                    </div>
                    <div className="meta">{n.time}</div>
                  </div>
                </div>
                {!n.read ? (
                  <div className="link" role="button" tabIndex={0}
                       onClick={()=>markOne(n.id)}
                       onKeyDown={(e)=> (e.key==="Enter"||e.key===" ") && markOne(n.id)}>
                    Mark as read
                  </div>
                ) : (
                  <span className="muted" style={{fontWeight:800}}>Read</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={markAll}>Mark all as read</button>
          <button className="btn" onClick={clearHistory}>Clear history</button>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <div className="pane" style={{paddingBottom:0}}>
          <div style={{fontWeight:900,color:INK,marginBottom:8}}>Notification Settings</div>
          <div className="muted" style={{marginBottom:8}}>Choose where and how you want to be notified.</div>
        </div>

        <div className="settings-row">
          <div>
            <div style={{fontWeight:800,color:INK}}>In-App Alerts</div>
            <div className="muted">Show real-time notifications inside the app.</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.inApp} onChange={()=>togglePref("inApp")} aria-label="In-App Alerts"/>
            <span className="track"><span className="thumb" /></span>
          </label>
        </div>

        <div className="settings-row">
          <div>
            <div style={{fontWeight:800,color:INK}}>Email Alerts</div>
            <div className="muted">Receive critical updates by email.</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.email} onChange={()=>togglePref("email")} aria-label="Email Alerts"/>
            <span className="track"><span className="thumb" /></span>
          </label>
        </div>

        <div className="settings-row">
          <div>
            <div style={{fontWeight:800,color:INK}}>Daily Digest</div>
            <div className="muted">A summary of activity delivered once per day.</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.digest} onChange={()=>togglePref("digest")} aria-label="Daily Digest"/>
            <span className="track"><span className="thumb" /></span>
          </label>
        </div>
      </div>
    </div>
  );
}
