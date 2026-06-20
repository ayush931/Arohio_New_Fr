import { useState } from "react";
import {
  FaShieldAlt,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function SecuritySettings() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";

  const [twoFA, setTwoFA] = useState("app");

  const sessions = [
    { id: 1, device: "Desktop", ip: "192.168.1.100", location: "New York, NY", lastSeen: "2 hours ago" },
    { id: 2, device: "Mobile", ip: "10.0.0.5", location: "Los Angeles, CA", lastSeen: "1 hour ago" },
    { id: 3, device: "Tablet", ip: "172.16.0.2", location: "Chicago, IL", lastSeen: "30 minutes ago" },
  ];

  const history = [
    { id: 1, status: "success", ip: "192.168.1.100", time: "2025-03-10 10:30 AM" },
    { id: 2, status: "failed", ip: "10.0.0.5", time: "2025-03-10 09:40 PM" },
    { id: 3, status: "success", ip: "172.16.0.2", time: "2025-03-10 02:00 PM" },
  ];

  return (
    <div className="container py-4" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:800;color:var(--ink)}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;
              box-shadow:0 6px 16px rgba(2,8,23,.04);padding:20px;margin-bottom:20px}
        .muted{color:#64748b;font-size:.88rem}
        .radio-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .radio-card{border:1px solid var(--line);border-radius:3px;padding:16px;
                    cursor:pointer;display:flex;align-items:flex-start;gap:12px;transition:.2s}
        .radio-card.active{border:2px solid var(--teal);background:#f0fdfa}
        .radio-card:hover{border-color:var(--teal)}
        .btn{border:none;border-radius:2px;padding:10px 18px;font-weight:700;
             background:var(--teal);color:#fff;cursor:pointer;transition:.2s}
        .btn:hover{filter:brightness(.97)}
        .table{width:100%;border-collapse:collapse;margin-top:8px}
        .table th,.table td{padding:12px;text-align:left;border-bottom:1px solid var(--line);font-size:.9rem}
        .terminate{color:#dc2626;cursor:pointer;font-weight:700}
        .login-item{display:flex;align-items:center;gap:8px;font-size:.9rem;margin-bottom:8px}
        .success{color:#16a34a}
        .failed{color:#dc2626}
      `}</style>

      <h1 className="h5 title mb-3 text-start"><FaShieldAlt /> Security Settings</h1>

      {/* 2FA */}
      <div className="card text-start">
        <h6 className="title" style={{ fontSize:"1rem" }}>Two-Factor Authentication</h6>
        <div className="muted mb-3">Add an extra layer of security to your account.</div>
        <div className="radio-row">
          <div
            className={`radio-card ${twoFA==="app"?"active":""}`}
            onClick={()=>setTwoFA("app")}
          >
            <FaMobileAlt color={twoFA==="app"?TEAL:"#64748b"} size={20}/>
            <div>
              <div className="fw-bold">Authenticator App</div>
              <div className="muted">Use Google Authenticator or Authy.</div>
            </div>
          </div>
          <div
            className={`radio-card ${twoFA==="sms"?"active":""}`}
            onClick={()=>setTwoFA("sms")}
          >
            <FaMobileAlt color={twoFA==="sms"?TEAL:"#64748b"} size={20}/>
            <div>
              <div className="fw-bold">SMS</div>
              <div className="muted">Receive verification codes by text message.</div>
            </div>
          </div>
        </div>
        <button className="btn mt-3">Enable 2FA</button>
      </div>

      {/* Session Management */}
      <div className="card text-start">
        <h6 className="title" style={{ fontSize:"1rem" }}>Session Management</h6>
        <div className="muted mb-2">Manage your active sessions and terminate any you don’t recognize.</div>
        <table className="table">
          <thead>
            <tr><th>Device</th><th>IP</th><th>Location</th><th>Last Seen</th><th>Action</th></tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td>
                  {s.device==="Desktop" && <FaDesktop />}
                  {s.device==="Mobile" && <FaMobileAlt />}
                  {s.device==="Tablet" && <FaTabletAlt />}
                  {" "}{s.device}
                </td>
                <td>{s.ip}</td>
                <td>{s.location}</td>
                <td>{s.lastSeen}</td>
                <td><span className="terminate">Terminate</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Login History */}
      <div className="card text-start">
        <h6 className="title" style={{ fontSize:"1rem" }}>Login History</h6>
        <div className="muted mb-2">Review your recent login activity for unauthorized access.</div>
        {history.map(h => (
          <div key={h.id} className={`login-item ${h.status==="success"?"success":"failed"}`}>
            {h.status==="success" ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>
              {h.status==="success" ? "Successful login" : "Failed login attempt"} from <strong>{h.ip}</strong> — {h.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
