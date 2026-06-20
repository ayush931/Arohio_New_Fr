import { useMemo } from "react";
import { FaArrowUp, FaArrowDown, FaCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function AdminDashboard() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";

  // --- demo data
  const kpis = [
    { label: "Total Users", value: "12,345", delta: "+5%" },
    { label: "PDFs Processed (this month)", value: "8,765", delta: "+12%" },
    { label: "Active Subscriptions", value: "2,468", delta: "+3%" },
    { label: "Monthly Revenue", value: "$15,789", delta: "+12%" },
  ];

  const revenuePoints = [12, 9, 11, 8, 10, 7, 13, 9, 8, 12, 11, 15]; // mock
  const processedByWeek = [11, 10, 12, 14]; // W1..W4
  const plans = [
    { name: "Free", count: 820 },
    { name: "Starter", count: 1240 },
    { name: "Pro", count: 320 },
    { name: "Enterprise", count: 88 },
  ];
  const recent = [
    { id: "#8253", msg: "uploaded a big file", when: "1 hour ago", type: "ok" },
    { id: "", msg: "Server load spike detected", when: "4 hours ago", type: "warn" },
    { id: "#8729", msg: "signed up", when: "6 hours ago", type: "ok" },
  ];
  const system = {
    uptime: "99.2%",
    errors: 3,
    overall: "Optimal",
    dbLoad: 0.23, // 0..1
    serverLoad: 0.35,
  };

  // --- helpers
  const revenuePath = useMemo(() => {
    const w = 260, h = 90, pad = 4;
    const max = Math.max(...revenuePoints), min = Math.min(...revenuePoints);
    const normX = (i) => pad + (i * (w - pad * 2)) / (revenuePoints.length - 1);
    const normY = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return revenuePoints.map((v, i) => `${i === 0 ? "M" : "L"}${normX(i)},${normY(v)}`).join(" ");
  }, [revenuePoints]);

  const planTotal = plans.reduce((a, b) => a + b.count, 0);

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .pane{padding:16px}
        .grid{display:grid;gap:16px}
        .kpis{grid-template-columns:repeat(4,1fr)}
        .middle{grid-template-columns:2fr 1.3fr 1.3fr}
        .bottom{grid-template-columns:2fr 1fr}
        @media(max-width:1200px){.kpis{grid-template-columns:repeat(2,1fr)}.middle{grid-template-columns:1fr}.bottom{grid-template-columns:1fr}}
        .kpi{display:flex;flex-direction:column;gap:6px}
        .kpi .lab{font-size:.85rem;color:#64748b}
        .kpi .val{font-size:1.55rem;font-weight:900;color:var(--ink)}
        .delta{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;font-weight:800;border-radius:999px;padding:3px 8px;border:1px solid #d1fae5;background:#ecfdf5;color:#16a34a}
        .spark{height:110px}
        .mini{display:flex;align-items:flex-end;gap:8px;height:110px}
        .bar{flex:1;background:#e5f5f3;border:1px solid #d7efec;border-radius:2px 8px 0 0;position:relative}
        .bar>span{position:absolute;bottom:0;left:0;right:0;background:var(--teal);border-radius:2px 8px 0 0;height:30%}
        .legend{display:flex;justify-content:space-between;font-size:.8rem;color:#94a3b8;margin-top:6px}
        .rowy{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .chip{font-size:.75rem;font-weight:800;border:1px solid #e2e8f0;background:#f8fafc;color:#475569;border-radius:999px;padding:4px 8px}
        .status{display:flex;align-items:center;gap:8px}
        .line{height:6px;border-radius:999px;background:#eef2f7;overflow:hidden}
        .line>span{display:block;height:100%;background:var(--teal)}
        .activity-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)}
        .activity-item:last-child{border-bottom:none}
        .icon-ok{color:#16a34a}
        .icon-warn{color:#ef4444}
        .metric{font-weight:900;color:var(--ink)}
        .tiny{font-size:.8rem;color:#94a3b8}
        .donut{width:150px;height:150px}
        .legend-vert{display:flex;flex-direction:column;gap:6px}
        .dot{width:8px;height:8px;border-radius:999px;display:inline-block;margin-right:6px}
      `}</style>

      <h1 className="h5 title mb-1">Admin Dashboard</h1>
      <div className="muted mb-3">Monitor platform health & performance.</div>

      {/* KPIs */}
      <div className="grid kpis mb-3">
        {kpis.map((k, i) => (
          <div key={i} className="card pane">
            <div className="kpi">
              <div className="lab">{k.label}</div>
              <div className="val">{k.value}</div>
              <span className="delta"><FaArrowUp/>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid middle mb-3">
        {/* Revenue Growth */}
        <div className="card pane">
          <div className="rowy" style={{justifyContent:"space-between", marginBottom:6}}>
            <div className="metric">Revenue Growth</div>
            <span className="chip">By Month</span>
          </div>
          <svg className="spark" viewBox="0 0 260 90" preserveAspectRatio="none" aria-label="Revenue trend">
            <path d={revenuePath} fill="none" stroke={TEAL} strokeWidth="3" />
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity="0.12"/>
                <stop offset="100%" stopColor={TEAL} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`${revenuePath} L260,90 L0,90 Z`} fill="url(#revFill)"/>
          </svg>
        </div>

        {/* PDFs Processed (mini bars) */}
        <div className="card pane">
          <div className="rowy" style={{justifyContent:"space-between", marginBottom:6}}>
            <div className="metric">PDFs Processed</div>
            <span className="chip">Per Week</span>
          </div>
          <div className="mini">
            {processedByWeek.map((v, i) => {
              const pct = Math.max(0.12, Math.min(1, v / Math.max(...processedByWeek)));
              return (
                <div className="bar" key={i}><span style={{height: `${pct*100}%`}}/></div>
              );
            })}
          </div>
          <div className="legend"><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div>
        </div>

        {/* Plan Distribution */}
        <div className="card pane">
          <div className="rowy" style={{justifyContent:"space-between", marginBottom:6}}>
            <div className="metric">Plan Distribution</div>
            <span className="chip">By Subscription Tier</span>
          </div>
          <div className="d-flex" style={{display:"flex",gap:16,alignItems:"center"}}>
            {/* donut */}
            <svg className="donut" viewBox="0 0 42 42" aria-label="Plan distribution chart">
              {/* background circle */}
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="#eef2f7" strokeWidth="6"/>
              {(() => {
                const colors = ["#0ea5e9","#21c7b8","#8b5cf6","#f59e0b"];
                let acc = 0;
                return plans.map((p, idx) => {
                  const frac = p.count / planTotal;
                  const dash = frac * 100;
                  const el = (
                    <circle
                      key={p.name}
                      cx="21" cy="21" r="15.915" fill="none"
                      stroke={colors[idx % colors.length]} strokeWidth="6"
                      strokeDasharray={`${dash} ${100 - dash}`}
                      strokeDashoffset={100 - acc}
                    />
                  );
                  acc += dash;
                  return el;
                })
              })()}
            </svg>

            {/* legend + total */}
            <div>
              <div className="metric" style={{marginBottom:6}}>{(kpis[2].value)}</div>
              <div className="tiny" style={{marginBottom:10}}>Active subscriptions</div>
              <div className="legend-vert">
                {plans.map((p, i) => {
                  const colors = ["#0ea5e9","#21c7b8","#8b5cf6","#f59e0b"];
                  return (
                    <div key={p.name} className="muted">
                      <span className="dot" style={{background:colors[i%4]}}></span>
                      {p.name} · <strong style={{color:INK}}>{p.count}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid bottom">
        {/* Recent Activity */}
        <div className="card pane">
          <div className="metric" style={{marginBottom:8}}>Recent Activity</div>
          {recent.map((r, i) => (
            <div key={i} className="activity-item">
              {r.type === "ok" ? <FaCheckCircle className="icon-ok"/> : <FaExclamationTriangle className="icon-warn"/>}
              <div>
                <div style={{fontWeight:800,color:INK}}>
                  {r.id ? <>User <span style={{color:TEAL}}>{r.id}</span></> : "System"}
                  {" "}{r.msg}
                </div>
                <div className="tiny">{r.when}</div>
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="card pane">
          <div className="metric" style={{marginBottom:8}}>System Status</div>

          <div className="rowy" style={{justifyContent:"space-between"}}>
            <div>
              <div className="muted tiny">Uptime</div>
              <div style={{fontWeight:900,color:INK}}>{system.uptime}</div>
            </div>
            <div>
              <div className="muted tiny">Recent Errors</div>
              <div style={{fontWeight:900,color:INK}}>{system.errors}</div>
            </div>
            <div>
              <div className="muted tiny">Overall</div>
              <div style={{fontWeight:900,color:INK}}>{system.overall}</div>
            </div>
          </div>

          <div style={{marginTop:12}}>
            <div className="muted tiny" style={{marginBottom:6}}>Server Load</div>
            <div className="line"><span style={{width:`${system.serverLoad*100}%`}}/></div>
          </div>

          <div style={{marginTop:12}}>
            <div className="muted tiny" style={{marginBottom:6}}>Database Load</div>
            <div className="line"><span style={{width:`${system.dbLoad*100}%`}}/></div>
          </div>
        </div>
      </div>
    </div>
  );
}
