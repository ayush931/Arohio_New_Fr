import { useState } from "react";
import { FaShieldAlt, FaTrashAlt, FaDownload } from "react-icons/fa";

export default function PrivacySettings() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";

  const [prefs, setPrefs] = useState({
    autodelete: false,
    storeHistory: false,
    telemetry: false,
  });
  const toggle = (k) => setPrefs((s) => ({ ...s, [k]: !s[k] }));

  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const exportData = () => {
    alert("Preparing your data export (ZIP).");
  };
  const confirmDelete = () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm.");
      return;
    }
    setShowDelete(false);
    alert("Account deletion requested.");
  };

  return (
    <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:800;color:var(--ink)}
        .sub{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;
              box-shadow:0 10px 24px rgba(2,8,23,.04);padding:20px;margin-bottom:20px}
        .rowy{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .label{font-weight:800;color:#0f172a}
        .help{font-size:.88rem;color:#64748b}
        .switch{position:relative;width:46px;height:26px;background:#e2e8f0;border-radius:999px;
                cursor:pointer;transition:.2s}
        .switch.on{background:var(--teal)}
        .switch .knob{position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;
                      border-radius:999px;transition:.2s;box-shadow:0 2px 6px rgba(0,0,0,.15)}
        .switch.on .knob{left:23px}
        .btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:3px;
             padding:10px 14px;font-weight:700;cursor:pointer}
        .btn-primary{background:var(--teal);color:#fff}
        .btn-danger{background:#ef4444;color:#fff}
        .btn-light{background:#fff;border:1px solid var(--line);color:#0f172a}
        .danger-card{border:1px solid #fecaca;background:#fff1f2}
        .link{color:var(--teal);text-decoration:none;font-weight:800}
        /* modal */
        .as-overlay{position:fixed;inset:0;background:rgba(2,8,23,.45);backdrop-filter:blur(3px);
                    display:grid;place-items:center;z-index:1000}
        .as-modal{width:min(560px,92vw);background:#fff;border:1px solid var(--line);
                  border-radius:4px;box-shadow:0 18px 40px rgba(2,8,23,.25);padding:20px}
      `}</style>

      <h1 className="h5 title mb-1"><FaShieldAlt /> Privacy Settings</h1>
      <div className="sub mb-3">Manage your data and privacy preferences.</div>

      {/* Toggles */}
      <div className="card text-start">
        <div className="rowy">
          <div>
            <div className="label">Auto-delete PDFs & images after processing</div>
            <div className="help">Automatically remove uploads from our servers after processing.</div>
          </div>
          <div className={`switch ${prefs.autodelete?'on':''}`} onClick={()=>toggle('autodelete')}>
            <div className="knob" />
          </div>
        </div>
        <div style={{height:14}}/>
        <div className="rowy">
          <div>
            <div className="label">Store processed results in history</div>
            <div className="help">Keep a record of outputs for easy re-download and auditing.</div>
          </div>
          <div className={`switch ${prefs.storeHistory?'on':''}`} onClick={()=>toggle('storeHistory')}>
            <div className="knob" />
          </div>
        </div>
        <div style={{height:14}}/>
        <div className="rowy">
          <div>
            <div className="label">Share anonymous usage analytics</div>
            <div className="help">Help Arohio improve OCR and alt-text quality. No personal content stored.</div>
          </div>
          <div className={`switch ${prefs.telemetry?'on':''}`} onClick={()=>toggle('telemetry')}>
            <div className="knob" />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card text-start">
        <div className="label mb-2">Data Management</div>
        <div className="sub mb-3">Export your personal data.</div>
        <button className="btn btn-light" onClick={exportData}>
          <FaDownload /> Download My Data (ZIP)
        </button>
      </div>

      {/* Account Deletion */}
      <div className="card danger-card text-start">
        <div className="label mb-1">Account Deletion</div>
        <div className="sub mb-2">
          Permanently delete your account and all associated data. This action cannot be undone.
        </div>
        <button className="btn btn-danger" onClick={()=>setShowDelete(true)}>
          <FaTrashAlt /> Request Account Deletion
        </button>
      </div>

      {/* Compliance */}
      <div className="card text-start">
        <div className="label mb-1">Compliance Notice</div>
        <div className="sub">
          We’re committed to protecting your privacy and complying with regulations such as GDPR and CCPA.
          For more details, please read our <a href="/privacy" className="link">Privacy Policy</a>.
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showDelete && (
        <div className="as-overlay" onClick={(e)=>{ if(e.target===e.currentTarget) setShowDelete(false); }}>
          <div className="as-modal text-start">
            <div className="label" style={{fontSize:"1.05rem"}}>Confirm Account Deletion</div>
            <div className="sub mt-1">
              This will delete your account and all data, including processed results and history. 
              Type <b>DELETE</b> to continue.
            </div>
            <input
              className="mt-2"
              style={{width:"100%",padding:"10px 12px",border:"1px solid var(--line)",borderRadius:12,outline:"none"}}
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e)=>setConfirmText(e.target.value)}
            />
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-light" onClick={()=>setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
