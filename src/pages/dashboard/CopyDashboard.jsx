import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardUploads() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // [{id, file, name, size, valid, reason, progress, status}]
  const [dragOver, setDragOver] = useState(false);

  const MAX_MB = 25;
  const THEME = "#21c7b8";

  // ---- helpers
  const fmtSize = (bytes) => {
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + " KB";
    return bytes + " B";
  };
  const isPdf = (f) =>
    f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");

  const validate = (f) => {
    if (!isPdf(f)) return { valid: false, reason: "Invalid type" };
    if (f.size > MAX_MB * 1024 * 1024) return { valid: false, reason: "Too large" };
    return { valid: true, reason: "Valid" };
  };

  // ---- add files
  const addFiles = useCallback((list) => {
    const arr = Array.from(list || []);
    const withMeta = arr.map((f) => {
      const v = validate(f);
      return {
        id: crypto.randomUUID(),
        file: f,
        name: f.name,
        size: f.size,
        valid: v.valid,
        reason: v.reason,
        progress: 0,
        status: v.valid ? "Queued" : "Invalid",
        paused: false,
        timer: null,
      };
    });
    setFiles((prev) => [...withMeta, ...prev]);
  }, []);

  // ---- upload simulation
  const startUpload = (id) => {
    setFiles((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        if (!x.valid) return x;
        if (x.status === "Completed") return x;
        if (x.timer) return x; // already running
        const timer = setInterval(() => {
          setFiles((cur) =>
            cur.map((y) => {
              if (y.id !== id) return y;
              if (y.paused) return y;
              const next = Math.min(100, y.progress + (10 + Math.random() * 20));
              if (next >= 100) {
                clearInterval(y.timer);
                return { ...y, progress: 100, status: "Completed", timer: null };
              }
              return { ...y, progress: next, status: "Uploading" };
            })
          );
        }, 500);
        return { ...x, status: "Uploading", timer };
      })
    );
  };

  const pauseResume = (id) =>
    setFiles((prev) =>
      prev.map((x) => (x.id === id ? { ...x, paused: !x.paused } : x))
    );

  const retry = (id) => {
    setFiles((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, progress: 0, status: "Queued" } : x
      )
    );
    setTimeout(() => startUpload(id), 150);
  };

  const removeOne = (id) => {
    setFiles((prev) => {
      prev.forEach((x) => {
        if (x.id === id && x.timer) clearInterval(x.timer);
      });
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    setFiles((prev) => {
      prev.forEach((x) => x.timer && clearInterval(x.timer));
      return [];
    });
  };

  // ---- redirect on "Upload All"
  const uploadAll = () => {
    const firstFile = files.find((f) => f.valid && f.status !== "Completed");
    if (!firstFile) return;
    startUpload(firstFile.id);
    // redirect to processing screen for the first valid file
    navigate(`/dashboard/uploads/${firstFile.id}/process`);
  };

  // cleanup on unmount
  useEffect(() => {
    return () =>
      setFiles((prev) => {
        prev.forEach((x) => x.timer && clearInterval(x.timer));
        return prev;
      });
  }, []);

  // ---- drag events
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="container py-4" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <style>{`
        .h-title{font-weight:800;color:#0f172a;}
        .subtle{color:#6b7280;}
        .dropzone{
          border:2px dashed #cfe8e5; border-radius:4px; background:#ffffff;
          padding:28px; display:flex; align-items:center; justify-content:center;
          transition:border-color .15s ease, background .15s ease;
          min-height:160px;
        }
        .dropzone.hover{ border-color:${THEME}; background:#f0fdfa; }
        .dz-cta{ color:${THEME}; font-weight:700; cursor:pointer; text-decoration:none; }
        .badge-soft{border-radius:999px; padding:.2rem .55rem; font-size:.7rem; font-weight:700;}
        .valid{background:#e7f9f4; color:#0b7a65;}
        .invalid{background:#ffecec; color:#b42318;}
        .chip{border-radius:999px; padding:.2rem .55rem; font-size:.75rem; font-weight:700;}
        .chip-up{background:#eaf7ff; color:#1b61b0; border:1px solid #cde8ff;}
        .chip-done{background:#e7f9f4; color:#0b7a65; border:1px solid #b8e8dd;}
        .chip-fail{background:#ffecec; color:#b42318; border:1px solid #ffd2d2;}
        .file-row{ background:#fff; border:1px solid #e8eef5; border-radius:3px; padding:12px 14px; }
        .progress-wrap{ height:8px; background:#edf7f6; border-radius:999px; overflow:hidden; }
        .progress-fill{ height:100%; background:${THEME}; }
        .btn-teal{ background:${THEME}; color:#fff; border:none; font-weight:700; border-radius:2px; }
        .btn-teal:hover{ background:${THEME}; color:#fff; filter:brightness(.95);border:none; }
        .btn-lightpill{ background:#e0f7f6; color:#0f172a; border:none; font-weight:700; border-radius:3px; }
        .card-soft{ background:#ffffff; border:1px solid #e8eef5; border-radius:4px; }
      `}</style>

      {/* Header */}
      <div className="mb-3">
        <h1 className="h5 h-title mb-1">Upload PDFs for Processing</h1>
        <div className="subtle">
          Drag and drop your files or select from your computer. Arohio will automatically extract images and generate alt text.
        </div>
      </div>

      <div className="row g-4">
        {/* Left: Dropzone + Files */}
        <div className="col-12 col-lg-8">
          <div
            className={`dropzone ${dragOver ? "hover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
          >
            <div className="text-center">
              <div style={{ fontSize: 28, marginBottom: 6 }}>⬆️</div>
              <div>
                <span>Drag &amp; Drop PDFs here or </span>
                <span className="dz-cta">Click to Browse</span>
              </div>
              <div className="subtle small mt-1">Max size {MAX_MB}MB per file, Formats: PDF only.</div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="d-none"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* Files list */}
          <div className="mt-3 d-flex flex-column gap-2">
            {files.length === 0 && <div className="subtle small">No files added yet.</div>}

            {files.map((f) => (
              <div key={f.id} className="file-row d-flex align-items-center justify-content-between gap-3">
                {/* left info */}
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <div style={{ fontSize: 22 }}>📄</div>
                  <div className="me-auto">
                    <div className="fw-semibold" style={{ color: "#0f172a" }}>{f.name}</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge-soft ${f.valid ? "valid" : "invalid"}`}>{f.reason}</span>
                      <span className="subtle small">{fmtSize(f.size)}</span>
                    </div>
                  </div>
                </div>

                {/* middle progress + status */}
                <div style={{ minWidth: 240 }}>
                  <div className="progress-wrap mb-1">
                    <div className="progress-fill" style={{ width: `${f.progress.toFixed(0)}%` }} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="subtle small">{f.progress.toFixed(0)}%</span>
                    <span className="small">
                      {f.status === "Uploading" && <span className="chip chip-up">Uploading</span>}
                      {f.status === "Completed" && <span className="chip chip-done">Completed</span>}
                      {f.status === "Failed" && <span className="chip chip-fail">Failed</span>}
                      {f.status === "Queued" && <span className="subtle">Queued</span>}
                      {f.status === "Invalid" && <span className="chip chip-fail">Invalid</span>}
                    </span>
                  </div>
                </div>

                {/* right actions */}
                <div className="d-flex align-items-center gap-2" style={{ minWidth: 180 }}>
                  {f.valid && f.status !== "Completed" && (
                    <>
                      <button
                        className="btn btn-sm btn-lightpill"
                        onClick={() => pauseResume(f.id)}
                        title={f.paused ? "Resume" : "Pause"}
                      >
                        {f.paused ? "Resume" : "Pause"}
                      </button>
                      {f.status === "Queued" && (
                        <button
                          className="btn btn-sm btn-teal"
                          onClick={() => {
                            startUpload(f.id);
                            navigate(`/dashboard/uploads/${f.id}/process`); // row-wise redirect
                          }}
                        >
                          Upload
                        </button>
                      )}
                      {f.status === "Failed" && (
                        <button
                          className="btn btn-sm btn-teal"
                          onClick={() => {
                            retry(f.id);
                            navigate(`/dashboard/uploads/${f.id}/process`);
                          }}
                        >
                          Retry
                        </button>
                      )}
                    </>
                  )}
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => removeOne(f.id)} title="Remove">🗑️</button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-teal" onClick={uploadAll}>Upload All</button>
            <button className="btn btn-outline-secondary" onClick={clearAll}>Clear All</button>
          </div>
        </div>

        {/* Right: Tips */}
        <div className="col-12 col-lg-4 text-start">
          <div className="card-soft p-3 p-md-4">
            <div className="fw-bold" style={{ color: "#0f172a" }}>Tips for Better Uploads</div>
            <ul className="mt-3 subtle">
              <li>Keep PDFs under {MAX_MB}MB for faster processing.</li>
              <li>Ensure any figures or images within the PDF are high resolution.</li>
              <li>Use batch mode by selecting multiple documents at once.</li>
            </ul>
            <a href="#learn" className="text-decoration-none" style={{ color: THEME, fontWeight: 700 }}>
              Learn how Arohio processes PDFs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
