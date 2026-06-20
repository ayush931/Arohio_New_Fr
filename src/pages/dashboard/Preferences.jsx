import { useState } from "react";
import { FaArrowRight, FaSlidersH } from "react-icons/fa";

export default function Preferences() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";

  const [pref, setPref] = useState({
    language: "English",
    englishVariant: "US",
    englishVariantEnabled: false,
    exportFormat: "PDF",
    styleTone: "Friendly",
    defaultFolder: "Marketing Reports",
    timezone: "Asia/Kolkata",
    notifyOnSuccess: true,
    notifyOnFailure: true,
    scheduleDefault: "Weekly",
    // OCR / conversion
    ocrEngine: "Auto",
    ocrQuality: "Balanced",
    pageSize: "A4",
    dpi: 150,
    imageCompression: "Medium",
    includeCaptions: true,
    detectTables: true,
    mathOCR: false,
    multilingualDetect: true,
    translateToLanguage: false,
    outputFilePattern: "{project}_{date}_{title}",
    altTextVerbosity: "Concise",
    watermark: false,
    embedMetadata: true,
  });

  const set = (k, v) => setPref((s) => ({ ...s, [k]: v }));
  const toggle = (k) => setPref((s) => ({ ...s, [k]: !s[k] }));

  const save = (e) => {
    e.preventDefault();
    // TODO: wire to API
    alert("Preferences saved (hook to API).");
  };

  return (
    <div className="container py-4" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 12px 26px rgba(2,8,23,.04)}
        .title{font-weight:800;color:var(--ink)}
        .muted{color:#64748b}
        .label{font-size:.9rem;font-weight:800;color:#0f172a;margin:0 0 6px}
        .input,.select{width:100%;background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;
                       color:#0f172a;outline:none}
        .input::placeholder{color:#94a3b8}
        .input:focus,.select:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,.15)}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        @media(max-width:992px){ .grid3{grid-template-columns:1fr 1fr} }
        @media(max-width:768px){ .grid2,.grid3{grid-template-columns:1fr} }
        .hr{height:1px;background:var(--line);margin:18px 0}
        .chip-row{display:flex;flex-wrap:wrap;gap:8px}
        .chip{padding:8px 12px;border:1px solid var(--line);border-radius:999px;font-weight:800;color:#0f172a;background:#fff;cursor:pointer}
        .chip.active{background:var(--teal);color:#fff;border-color:transparent}
        .switch{position:relative;width:46px;height:26px;background:#e2e8f0;border-radius:999px;cursor:pointer;transition:.2s}
        .switch.on{background:var(--teal)}
        .switch .knob{position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:999px;transition:.2s;box-shadow:0 2px 6px rgba(0,0,0,.15)}
        .switch.on .knob{left:23px}
        .btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:3px;padding:12px 16px;background:var(--teal);color:#fff;font-weight:800;cursor:pointer}
        .btn:hover{filter:brightness(.98)}
        .help{font-size:.85rem;color:#64748b}
      `}</style>

      <h1 className="h5 title mb-3 text-start"><FaSlidersH /> Preferences</h1>

      <form className="card p-3 p-md-4 text-start" onSubmit={save}>
        <div className="title" style={{ fontSize: "1rem" }}>Customization</div>
        <div className="grid2 mt-2">
          <div>
            <label className="label">Output Language</label>
            <select className="select" value={pref.language} onChange={(e)=>set("language", e.target.value)}>
              {["English","Hindi","Spanish","German","French","Arabic","Chinese","Japanese"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Default Export Format</label>
            <select className="select" value={pref.exportFormat} onChange={(e)=>set("exportFormat", e.target.value)}>
              {["PDF","DOCX","TXT","CSV","XLSX","JSON"].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="label">Style & Tone</label>
          <div className="chip-row">
            {["Friendly","SEO-Optimized","Academic","Professional","Concise"].map(c => (
              <button type="button" key={c} className={`chip ${pref.styleTone===c?'active':''}`} onClick={()=>set("styleTone", c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid2 mt-3 align-items-center">
          <div>
            <label className="label">English Variant</label>
            <div className="help">Toggle for US ↔ UK English spelling/grammar.</div>
          </div>
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <select className="select" style={{maxWidth:160}} value={pref.englishVariant} onChange={(e)=>set("englishVariant", e.target.value)} disabled={!pref.englishVariantEnabled}>
              <option>US</option><option>UK</option>
            </select>
            <div className={`switch ${pref.englishVariantEnabled?'on':''}`} onClick={()=>toggle("englishVariantEnabled")}>
              <div className="knob" />
            </div>
          </div>
        </div>

        <div className="hr" />

        <div className="title" style={{ fontSize: "1rem" }}>Conversions & OCR</div>
        <div className="grid3 mt-2">
          <div>
            <label className="label">OCR Engine</label>
            <select className="select" value={pref.ocrEngine} onChange={(e)=>set("ocrEngine", e.target.value)}>
              <option>Auto</option><option>Fast</option><option>Accurate</option>
            </select>
          </div>
          <div>
            <label className="label">OCR Quality</label>
            <select className="select" value={pref.ocrQuality} onChange={(e)=>set("ocrQuality", e.target.value)}>
              <option>Speed</option><option>Balanced</option><option>High</option>
            </select>
          </div>
          <div>
            <label className="label">Default Page Size</label>
            <select className="select" value={pref.pageSize} onChange={(e)=>set("pageSize", e.target.value)}>
              {["A4","Letter","Legal"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Output DPI</label>
            <input className="input" type="number" min={72} max={600} step={1} value={pref.dpi} onChange={(e)=>set("dpi", Number(e.target.value))}/>
          </div>
          <div>
            <label className="label">Image Compression</label>
            <select className="select" value={pref.imageCompression} onChange={(e)=>set("imageCompression", e.target.value)}>
              <option>None</option><option>Light</option><option>Medium</option><option>Aggressive</option>
            </select>
          </div>
          <div>
            <label className="label">Alt-Text Verbosity</label>
            <select className="select" value={pref.altTextVerbosity} onChange={(e)=>set("altTextVerbosity", e.target.value)}>
              <option>Concise</option><option>Balanced</option><option>Detailed</option>
            </select>
          </div>
        </div>

        <div className="grid3 mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Include Captions</div>
            <div className={`switch ${pref.includeCaptions?'on':''}`} onClick={()=>toggle("includeCaptions")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Detect Tables</div>
            <div className={`switch ${pref.detectTables?'on':''}`} onClick={()=>toggle("detectTables")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Math OCR</div>
            <div className={`switch ${pref.mathOCR?'on':''}`} onClick={()=>toggle("mathOCR")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Multilingual Detection</div>
            <div className={`switch ${pref.multilingualDetect?'on':''}`} onClick={()=>toggle("multilingualDetect")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Auto-translate to Output Language</div>
            <div className={`switch ${pref.translateToLanguage?'on':''}`} onClick={()=>toggle("translateToLanguage")}><div className="knob"/></div>
          </div>
          <div>
            <label className="label">File Naming Pattern</label>
            <input className="input" value={pref.outputFilePattern} onChange={(e)=>set("outputFilePattern", e.target.value)} />
            <div className="help mt-1">Tokens: {"{project} {date} {title} {lang}"}</div>
          </div>
        </div>

        <div className="hr" />

        <div className="title" style={{ fontSize: "1rem" }}>Defaults & Notifications</div>
        <div className="grid3 mt-2">
          <div>
            <label className="label">Default Folder/Project</label>
            <select className="select" value={pref.defaultFolder} onChange={(e)=>set("defaultFolder", e.target.value)}>
              <option>Marketing Reports</option><option>Finance Invoices</option><option>Research Data</option>
            </select>
          </div>
          <div>
            <label className="label">Timezone</label>
            <select className="select" value={pref.timezone} onChange={(e)=>set("timezone", e.target.value)}>
              <option>Asia/Kolkata</option><option>UTC</option><option>America/New_York</option><option>Europe/London</option>
            </select>
          </div>
          <div>
            <label className="label">Default Schedule</label>
            <select className="select" value={pref.scheduleDefault} onChange={(e)=>set("scheduleDefault", e.target.value)}>
              <option>Daily</option><option>Weekly</option><option>Monthly</option>
            </select>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Notify on Success</div>
            <div className={`switch ${pref.notifyOnSuccess?'on':''}`} onClick={()=>toggle("notifyOnSuccess")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Notify on Failure</div>
            <div className={`switch ${pref.notifyOnFailure?'on':''}`} onClick={()=>toggle("notifyOnFailure")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Embed Metadata</div>
            <div className={`switch ${pref.embedMetadata?'on':''}`} onClick={()=>toggle("embedMetadata")}><div className="knob"/></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="label m-0">Watermark Exports</div>
            <div className={`switch ${pref.watermark?'on':''}`} onClick={()=>toggle("watermark")}><div className="knob"/></div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn" type="submit">Save Preferences <FaArrowRight/></button>
        </div>
      </form>
    </div>
  );
}
