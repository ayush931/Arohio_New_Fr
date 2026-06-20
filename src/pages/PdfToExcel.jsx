import { useRef, useState, useMemo, useEffect } from "react";
const API_BASE =
  (import.meta?.env?.VITE_API_BASE && import.meta.env.VITE_API_BASE.replace(/\/+$/, "")) ||
  "http://localhost:8000";
/* ---------- Icons ---------- */
function Icon({ name, size = 20 }) {
  const c = "currentColor";
  switch (name) {
    case "pdf":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path fill={c} d="M13 2v6h6" />
          <path fill={c} d="M7.5 16h2a1.5 1.5 0 0 0 0-3h-2v3zm0-4h2a2.5 2.5 0 0 1 0 5h-2v-5zm6.5 4h-2v1h-1v-5h3a1.5 1.5 0 0 1 0 3h-2v1h2zM17 12h-1v5h1v-2h1.2v-1H17v-1h1.4v-1H17z" />
        </svg>
      );
    case "upload":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M5 20h14v-6h2v8H3v-8h2z" />
          <path fill={c} d="M11 16h2V8.83l2.59 2.58L17 10l-5-5-5 5 1.41 1.41L11 8.83z" />
        </svg>
      );
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      );
    case "zoom":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
        </svg>
      );
    case "xlsx":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path fill={c} d="M14 2v6h6" />
          <path fill={c} d="M7.5 16l2-3 2 3m0-3l-2 3" />
        </svg>
      );
    case "csv":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M4 4h16v16H4z" />
          <path fill="#fff" d="M6 8h12v2H6zM6 12h8v2H6zM6 16h6v2H6z" />
        </svg>
      );
    case "epub":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M5 3h11l3 3v15H5z" />
          <path fill="#fff" d="M8 8h8v1H8zM8 11h8v1H8zM8 14h6v1H8z" />
        </svg>
      );
    case "mobi":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M6 2h9l3 3v17H6z" />
          <path fill="#fff" d="M8 7h5v1H8zM8 10h7v1H8zM8 13h6v1H8zM8 16h7v1H8z" />
        </svg>
      );
    case "spinner":
      return (
        <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true" role="img">
          <circle cx="25" cy="25" r="20" fill="none" stroke={c} strokeWidth="6" opacity="0.2" />
          <path d="M45 25a20 20 0 0 1-20 20" fill="none" stroke={c} strokeWidth="6">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.8s" repeatCount="indefinite" />
          </path>
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Tiny UI helpers (spinner + toast) ---------- */
const brand = "#21c7b8";

function InlineSpinner({ size = 16 }) {
  return (
    <span className="d-inline-flex align-items-center justify-content-center" style={{ width: size, height: size }}>
      <Icon name="spinner" size={size} />
    </span>
  );
}

function Toasts({ toasts, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="shadow"
          style={{
            minWidth: 280,
            maxWidth: 420,
            borderRadius: 10,
            padding: "12px 14px",
            background: t.type === "error" ? "#fff3f3" : "#ecfffb",
            border: `1px solid ${t.type === "error" ? "#ffb3b3" : "#bff0ea"}`,
            color: "#111",
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="fw-semibold" style={{ color: t.type === "error" ? "#b40000" : "#0e6e66" }}>
              {t.title}
            </div>
            <button
              onClick={() => onClose(t.id)}
              className="btn btn-sm btn-link p-0 ms-3"
              style={{ textDecoration: "none", color: "#666" }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          {t.message ? <div className="small mt-1">{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */
function prettySize(bytes) {
  if (!bytes && bytes !== 0) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

function readJsonFromStorage(key) {
  try {
    const v1 = localStorage.getItem(key);
    if (v1) return JSON.parse(v1);
  } catch { }
  try {
    const v2 = sessionStorage.getItem(key);
    if (v2) return JSON.parse(v2);
  } catch { }
  return null;
}

function readStringFromStorage(key) {
  const v1 = localStorage.getItem(key);
  if (v1) return v1;
  const v2 = sessionStorage.getItem(key);
  if (v2) return v2;
  return "";
}

function getUserIdFromStorages() {
  const au = readJsonFromStorage("auth_user");
  if (au?.id) return String(au.id);
  if (au?.user?.id) return String(au.user.id);
  const token = readStringFromStorage("auth_token");
  try {
    if (token && token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.sub) return String(payload.sub);
      if (payload?.id) return String(payload.id);
      if (payload?.user?.id) return String(payload.user.id);
    }
  } catch { }
  return "";
}

function getAuthToken() {
  return readStringFromStorage("auth_token");
}

/* Save to 8000 */
async function saveJsonFileViaBackend({ userId, pdfStem, manifest, resultUrl, token }) {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  fd.append("json_file", blob, `${pdfStem}.json`);
  fd.append("user_id", userId);
  fd.append("pdf_stem", pdfStem);
  fd.append("result_url", resultUrl || "");
  const res = await fetch(`${API_BASE}/uploads/save-json`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function fetchServerManifest({ userId, pdfStem, token }) {
  const url = `${API_BASE}/uploads/json/${encodeURIComponent(userId)}/${encodeURIComponent(pdfStem)}`
  const res = await fetch(url, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* Prefer HTTP URL fields; ignore Windows paths. Also accept relative web_path and prefix with origin */
function toHttpUrl(v) {
  if (typeof v !== "string" || !v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("/")) return `${window.location.origin}${v}`;
  return "";
}

function resolveImageSrc(item) {
  const cands = [
    item.web_path,
    item.public_url,
    item.image_url,
    item.url,
    item.http_url,
    item.web_url,
    item.imagePath,
    item.image_path,
  ].filter(Boolean);

  for (const v of cands) {
    const u = toHttpUrl(v);
    if (u) return u;
  }
  return "";
}

/* ---------- Component ---------- */
export default function PdfToExcel() {
  const inputRef = useRef(null);

  // step 0: upload; step 1/2: process UI; step 3: export
  const [step, setStep] = useState(0);

  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false); // main loader (upload/extract overlay)
  const [error, setError] = useState("");

  const [resultUrl, setResultUrl] = useState("");
  const [pdfStem, setPdfStem] = useState("");
  const [extractRaw, setExtractRaw] = useState(false);

  const [saveMsg, setSaveMsg] = useState("");
  const userData = JSON.parse(sessionStorage.getItem("auth_user"));
  const userId = userData?.id;
  const [itemsByPage, setItemsByPage] = useState({});
  const [activePage, setActivePage] = useState(null);

  // in-app preview
  const [previewSrc, setPreviewSrc] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // projects (step 3)
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // per-button loading flags
  const [isImporting, setIsImporting] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [exportingKey, setExportingKey] = useState(""); // "xlsx" | "epub" | "mobi" while exporting

  // toasts
  const [toasts, setToasts] = useState([]);

  const openPreview = (src) => {
    if (!src) return;
    setPreviewSrc(src);
    setIsPreviewOpen(true);
  };
  const closePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewSrc(""), 150);
  };

  const exportFormats = useMemo(
    () => [
      { key: "xlsx", label: "Excel (.xlsx)", icon: "xlsx" },
      { key: "epub", label: "EPUB (.epub)", icon: "epub" },
      { key: "mobi", label: "MOBI (.mobi)", icon: "mobi" },
    ],
    []
  );

  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [pdfLeft, setPdfLeft] = useState(0);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("auth_user"));
        const userId = userData?.id;

        if (!userId) return;

        const res = await fetch(`${API_BASE}/user-plans/user/${userId}`);
        const data = await res.json();

        const activePlan = data.find(p => p.is_active);

        if (activePlan) {
          const remainingPdf =
            Number(activePlan.pdf_limit || 0) -
            Number(activePlan.pdf_used || 0);

          setPdfLeft(remainingPdf);
          setHasActivePlan(remainingPdf > 0);
        } else {
          setPdfLeft(0);
          setHasActivePlan(false);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const onKey = (e) => e.key === "Escape" && closePreview();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPreviewOpen]);

  // body scroll lock on preview
  useEffect(() => {
    if (!isPreviewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isPreviewOpen]);

  // toast helpers
  function showToast({ title, message = "", type = "success", ttl = 3000 }) {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, ttl);
  }
  function closeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // restore step 1 if needed
  useEffect(() => {
    const savedStep = parseInt(localStorage.getItem("uploadPdfStep") || "0", 10);
    const lastStem = localStorage.getItem("lastPdfStem") || "";
    const userId = getUserIdFromStorages();
    const token = getAuthToken();

    async function restoreIfPossible() {
      if (savedStep === 1 && userId && lastStem) {
        try {
          setStep(1);
          setPdfStem(lastStem);
          const server = await fetchServerManifest({ userId, pdfStem: lastStem, token });
          const serverManifest = server?.manifest || server || {};
          if (serverManifest.extraction_mode) {
            setExtractRaw(serverManifest.extraction_mode === "raw");
          }
          const serverItems = Array.isArray(serverManifest.items) ? serverManifest.items : [];

          const uiItems = serverItems
            .filter((it) => (it?.index ?? 0) > 0)
            .map((it) => ({ ...it, include: it.is_visible !== false }));

          const map = {};
          for (const it of uiItems) {
            const p = Number(it.page) || 1;
            if (!map[p]) map[p] = [];
            map[p].push(it);
          }
          Object.keys(map).forEach((p) => {
            map[p].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
          });

          setItemsByPage(map);
          setActivePage(Number(Object.keys(map)[0] || 1));
          showToast({ title: "Session restored", message: `Loaded ${Object.values(map).flat().length} images.` });
        } catch {
          setStep(0);
        }
      }
    }
    restoreIfPossible();
  }, []);

  // load projects at step 3
  useEffect(() => {
    if (step !== 3) return;
    const userId = getUserIdFromStorages();
    const token = getAuthToken();
    if (!userId) return;

    setProjectsLoading(true);
    fetch(`${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}/projects`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        const list = Array.isArray(data?.projects) ? data.projects : [];
        setProjects(list);
        if (list.length) {
          setSelectedProjectId(String(list[0].id));
          setCreateNew(false);
        } else {
          setCreateNew(true);
        }
      })
      .catch((e) => {
        setSaveMsg(e.message || "Failed to load projects");
        showToast({ title: "Couldn’t load projects", message: e.message, type: "error" });
      })
      .finally(() => setProjectsLoading(false));
  }, [step, API_BASE]);

  const accept = useMemo(() => ".pdf,application/pdf", []);
  const onPick = () => inputRef.current?.click();

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.pdf$/i.test(f.name)) return;
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (file) return;
    setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    if (!/\.pdf$/i.test(f.name)) return;
    setFile(f);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (file) return;
    if (e.type === "dragenter" || e.type === "dragover") setDrag(true);
    if (e.type === "dragleave") setDrag(false);
  };

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true); // full-screen overlay starts
    setError("");
    setSaveMsg("");
    setItemsByPage({});
    setActivePage(null);

    const userId = getUserIdFromStorages();
    if (!userId) {
      setLoading(false);
      setError("User ID missing in storage for this origin.");
      showToast({ title: "Upload failed", message: "User ID missing", type: "error" });
      return;
    }

    const uploadUrl = extractRaw
      ? `${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}/raw`
      : `${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}`;

    const fd = new FormData();
    fd.append("file", file, file.name);

    const token = getAuthToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(uploadUrl, { method: "POST", headers, body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Upload failed (${res.status})`);
      }
      const data = await res.json();

      const u = data.result_url || "";
      if (u) setResultUrl(u);

      const stem = (file?.name && file.name.replace(/\.pdf$/i, "")) || "document";
      setPdfStem(stem);
      localStorage.setItem("lastPdfStem", stem);

      let rawManifest = data.manifest || {};
      if (Array.isArray(rawManifest.items)) {
        rawManifest = {
          ...rawManifest,
          items: rawManifest.items.filter((it) => (it?.index ?? 0) > 0),
        };
      }

      try {
        await saveJsonFileViaBackend({
          userId,
          pdfStem: stem,
          manifest: rawManifest,
          resultUrl: u,
          token,
        });
        setSaveMsg("Manifest saved to public/OngoingJson.");
      } catch (err) {
        setSaveMsg(err?.message || "Save to public failed.");
      }

      const server = await fetchServerManifest({ userId, pdfStem: stem, token });
      const serverManifest = server?.manifest || server || {};
      if (serverManifest.extraction_mode) {
        setExtractRaw(serverManifest.extraction_mode === "raw");
      }
      const serverItems = Array.isArray(serverManifest.items) ? serverManifest.items : [];

      const uiItems = serverItems
        .filter((it) => (it?.index ?? 0) > 0)
        .map((it) => ({ ...it, include: it.is_visible !== false }));

      const map = {};
      for (const it of uiItems) {
        const p = Number(it.page) || 1;
        if (!map[p]) map[p] = [];
        map[p].push(it);
      }
      Object.keys(map).forEach((p) => {
        map[p].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      });

      setItemsByPage(map);
      setActivePage(Number(Object.keys(map)[0] || 1));

      localStorage.setItem("uploadPdfStep", "1");
      setStep(1);
      showToast({ title: "PDF processed", message: "Images extracted successfully." });
    } catch (e) {
      setError(e?.message || "Upload failed.");
      showToast({ title: "Upload failed", message: e?.message || "", type: "error" });
    } finally {
      setLoading(false); // overlay ends
    }
  };

  const pages = useMemo(() => {
    const list = Object.keys(itemsByPage)
      .map((n) => Number(n))
      .sort((a, b) => a - b);
    return list;
  }, [itemsByPage]);

  const pageItems = useMemo(() => {
    if (!activePage) return [];
    return itemsByPage[activePage] || [];
  }, [itemsByPage, activePage]);

  const totalSelected = useMemo(() => {
    let n = 0;
    Object.values(itemsByPage).forEach((arr) =>
      arr.forEach((it) => {
        if (it.include) n++;
      })
    );
    return n;
  }, [itemsByPage]);

  const selectedOnPage = useMemo(
    () => pageItems.filter((it) => it.include).length,
    [pageItems]
  );

  const toggleInclude = (page, idxInPage) => {
    setItemsByPage((prev) => {
      const copy = { ...prev };
      copy[page] = copy[page].map((it, i) =>
        i === idxInPage ? { ...it, include: !it.include } : it
      );
      return copy;
    });
  };

  const setIncludeAllOnPage = (page, include) => {
    setItemsByPage((prev) => {
      const copy = { ...prev };
      copy[page] = copy[page].map((it) => ({ ...it, include }));
      return copy;
    });
  };

  const onGenerateAltText = async () => {
    const userId = getUserIdFromStorages();
    const token = getAuthToken();
    if (!userId || !pdfStem) {
      setSaveMsg("Missing user or pdf");
      showToast({ title: "Action blocked", message: "Missing user or PDF", type: "error" });
      return;
    }

    const items = [];
    Object.entries(itemsByPage).forEach(([p, arr]) => {
      arr.forEach((it) => {
        items.push({ file_name: it.file_name, is_visible: !!it.include });
      });
    });

    setIsImporting(true);
    try {
      const res = await fetch(
        `${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}/update-visibility`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ pdf_stem: pdfStem, items }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data?.status === "updated") {
        setStep(3);
        localStorage.setItem("uploadPdfStep", "3");
        sessionStorage.setItem("uploadPdfStep", "3");
        setSaveMsg("");
        showToast({ title: "Images imported", message: "Proceed to export." });
      } else {
        setSaveMsg("Unexpected response");
        showToast({ title: "Unexpected response", type: "error" });
      }
    } catch (e) {
      setSaveMsg(e.message || "Failed");
      showToast({ title: "Import failed", message: e.message || "", type: "error" });
    } finally {
      setIsImporting(false);
    }
  };

  // create project (now requires name + description)
  async function handleCreateProjectInline() {
    const userId = getUserIdFromStorages();
    const token = getAuthToken();
    if (!userId) {
      showToast({ title: "Missing user", type: "error" });
      return setSaveMsg("Missing user");
    }
    if (!newProjectName.trim()) {
      showToast({ title: "Project name required", type: "error" });
      return setSaveMsg("Project name is required");
    }
    if (!newProjectDesc.trim()) {
      showToast({ title: "Project description required", type: "error" });
      return setSaveMsg("Project description is required");
    }

    setIsSavingProject(true);
    try {
      const res = await fetch(
        `${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: newProjectName.trim(),
            description: newProjectDesc.trim(),
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json(); // {id, name, description}

      const newList = [created, ...projects];
      setProjects(newList);
      setSelectedProjectId(String(created.id));
      setCreateNew(false);
      setNewProjectName("");
      setNewProjectDesc("");
      setSaveMsg("Project created");
      showToast({ title: "Project created", message: created?.name ? `“${created.name}”` : "" });
    } catch (e) {
      setSaveMsg(e.message || "Failed to create project");
      showToast({ title: "Create project failed", message: e.message || "", type: "error" });
    } finally {
      setIsSavingProject(false);
    }
  }

  // export disabled until project selected / valid new project
  const canExport = useMemo(() => {
    if (createNew) {
      return Boolean(newProjectName.trim() && newProjectDesc.trim());
    }
    return Boolean(selectedProjectId);
  }, [createNew, newProjectName, newProjectDesc, selectedProjectId]);

  const onExport = async (formatKey) => {
    const userId = getUserIdFromStorages();
    const token = getAuthToken();
    if (!userId || !pdfStem) {
      setSaveMsg("Missing user or pdf");
      showToast({ title: "Export failed", message: "Missing user or PDF", type: "error" });
      return;
    }

    if (!canExport) {
      setSaveMsg("Please add/select a project first");
      showToast({ title: "Select a project", message: "Add or choose a project to continue", type: "error" });
      return;
    }

    const payload = {
      pdf_stem: pdfStem,
      format: formatKey,
    };

    if (createNew) {
      if (!newProjectName.trim()) {
        showToast({ title: "Project name required", type: "error" });
        return setSaveMsg("Project name is required");
      }
      if (!newProjectDesc.trim()) {
        showToast({ title: "Project description required", type: "error" });
        return setSaveMsg("Project description is required");
      }
      payload.project_name = newProjectName.trim();
      payload.project_description = newProjectDesc.trim();
    } else if (selectedProjectId) {
      payload.project_id = Number(selectedProjectId);
    } else {
      showToast({ title: "Select a project", type: "error" });
      return setSaveMsg("Please add/select a project first");
    }

    const url = `${API_BASE}/uploads-pdf-images/${encodeURIComponent(userId)}/export`;

    setExportingKey(formatKey);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const ct = res.headers.get("content-type") || "";
      if (
        ct.includes("application/") ||
        ct.includes("text/csv") ||
        ct.includes("application/vnd.openxmlformats-officedocument")
      ) {
        const blob = await res.blob();
        const urlObj = URL.createObjectURL(blob);
        const a = document.createElement("a");

        const disp = res.headers.get("content-disposition") || "";
        const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disp);
        const fname = decodeURIComponent(m?.[1] || m?.[2] || `${pdfStem}.${formatKey}`);

        a.href = urlObj;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(urlObj);

        setSaveMsg(`Exported ${fname}`);
        showToast({ title: "Export complete", message: fname });

        // redirect to dashboard/projects after success
        setTimeout(() => {
          window.location.assign("/dashboard/projects");
        }, 650);
        return;
      }

      try {
        const data = await res.json();
        setSaveMsg(data?.message || "Export complete");
        showToast({ title: "Export complete" });
      } catch {
        setSaveMsg("Export complete");
        showToast({ title: "Export complete" });
      }

      setTimeout(() => {
        window.location.assign("/dashboard/projects");
      }, 650);
    } catch (e) {
      setSaveMsg(e.message || "Export failed");
      showToast({ title: "Export failed", message: e.message || "", type: "error" });
    } finally {
      setExportingKey("");
    }
  };

  /* ---------- Render: step 1/2 ---------- */
  if (step === 1 || step === 2) {
    return (
      <>
        {/* Toasts */}
        <Toasts toasts={toasts} onClose={closeToast} />

        {/* Full-screen overlay loader when needed (usually only during upload step) */}
        {loading && (
          <div
            role="status"
            aria-label="Processing your PDF"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1500,
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: 86,
                height: 86,
                borderRadius: "50%",
                background: "rgba(33,199,184,0.12)",
                boxShadow: "0 10px 30px rgba(33,199,184,0.25)",
              }}
            >
              <Icon name="spinner" size={44} />
            </div>
            <div className="fw-semibold" style={{ color: "#0e6e66" }}>
              We’re processing your PDF…
            </div>
            <div className="text-muted small">Extracting images — you’ll see them here shortly.</div>
          </div>
        )}

        <div className="container py-4">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div>
              <h1 className="fw-bold mb-1">Process Your PDF</h1>
              <div className="d-flex align-items-center gap-2 flex-wrap text-muted">
                <span>Review extracted images and choose which ones you want to import.</span>
                <span className="badge text-white px-2 py-1" style={{ background: "#21c7b8", borderRadius: 4, fontSize: "0.8rem" }}>
                  Mode: {extractRaw ? "Raw Extraction" : "Smart Bounding Boxes"}
                </span>
              </div>
            </div>

            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded"
              style={{ background: "#e9fbf8", border: "1px solid #21c7b87a" }}
            >
              <Icon name="check" size={18} />
              <div className="fw-semibold">
                {totalSelected} image{totalSelected !== 1 ? "s" : ""} selected for import.
              </div>
            </div>
          </div>

          <div className="row g-3">
            {/* Left: PDF Pages */}
            <div className="col-12 col-lg-3">
              <div className="border rounded p-3">
                <div className="fw-semibold mb-2">PDF Pages</div>
                <div className="list-group">
                  {pages.map((p) => {
                    const pageSel = (itemsByPage[p] || []).filter((it) => it.include).length;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between ${p === activePage ? "active" : ""
                          }`}
                        onClick={() => setActivePage(p)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>Page {p}</span>
                        <span className={`badge ${p === activePage ? "bg-light text-dark" : "bg-secondary"}`}>
                          {pageSel}/{(itemsByPage[p] || []).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle: Images grid */}
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="text-muted">
                  <span className="fw-semibold">{selectedOnPage}</span> selected on Page {activePage}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => setIncludeAllOnPage(activePage, true)}>
                    Select All
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => setIncludeAllOnPage(activePage, false)}>
                    Clear All
                  </button>

                  <button
                    className="btn"
                    style={{ background: brand, color: "#fff", minWidth: 180, position: "relative" }}
                    onClick={onGenerateAltText}
                    disabled={isImporting}
                    aria-disabled={isImporting}
                  >
                    {isImporting ? (
                      <span className="d-inline-flex align-items-center gap-2">
                        <InlineSpinner />
                        Importing…
                      </span>
                    ) : (
                      "Import Selected Images"
                    )}
                  </button>
                </div>
              </div>

              {pageItems.length === 0 ? (
                <div className="text-muted border rounded p-4 text-center">No images on this page.</div>
              ) : (
                <div className="row g-3">
                  {pageItems.map((it, i) => {
                    const src = resolveImageSrc(it);
                    return (
                      <div className="col-12 col-md-6" key={`${activePage}-${i}`}>
                        <div className="card h-100 shadow-sm">
                          <div className="ratio ratio-16x9">
                            {src ? (
                              <img
                                src={src}
                                alt={it.file_name || ""}
                                className="card-img-top"
                                style={{ objectFit: "cover" }}
                                onError={(e) => {
                                  e.currentTarget.style.objectFit = "contain";
                                }}
                              />
                            ) : (
                              <div className="d-flex align-items-center justify-content-center bg-light">
                                <span className="text-muted small px-2">Image URL unavailable</span>
                              </div>
                            )}
                          </div>

                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`inc-${activePage}-${i}`}
                                  checked={!!it.include}
                                  onChange={() => toggleInclude(activePage, i)}
                                />
                                <label className="form-check-label" htmlFor={`inc-${activePage}-${i}`}>
                                  Include
                                </label>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-light text-dark border">P{it.page}.{it.index}</span>
                                {src && (
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    title="Preview"
                                    onClick={() => openPreview(src)}
                                  >
                                    <Icon name="zoom" size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!!saveMsg && <div className="small text-muted mt-3">{saveMsg}</div>}
            </div>

            {/* Right: Tips */}
            <div className="col-12 col-lg-3">
              <div className="border rounded p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold">Tips for Best Results</span>
                </div>

                <ul
                  className="text-muted small mb-0"
                  style={{
                    lineHeight: 1.7,
                    listStyleType: "disc",
                    listStylePosition: "outside",
                    paddingLeft: "1.2rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {[
                    "If your PDF is too large, upload it in smaller chunks for faster processing.",
                    "For long PDFs, such as 200 pages, split them into chunks of around 30–40 pages each.",
                    "Check all extracted images carefully before importing them into the next step.",
                    "Some small images may be missed or may not appear clearly in the dashboard preview.",
                    "Use the view option to inspect each image before selecting it for alt text generation.",
                    "If an image is not properly framed, use the crop option from the dashboard before continuing.",
                    "Select only the required images for the next step. Avoid duplicate, irrelevant, or decorative images.",
                    "Choosing fewer and more relevant images helps generate cleaner alt text and improves processing speed.",
                  ].map((tip, index) => (
                    <li
                      key={index}
                      style={{
                        display: "list-item",
                        marginBottom: "8px",
                        paddingLeft: "2px",
                      }}
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {isPreviewOpen && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) closePreview();
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1055,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <div
              className="position-relative d-flex align-items-center justify-content-center"
              style={{
                maxWidth: "95vw",
                maxHeight: "95vh",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                borderRadius: 8,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <button
                aria-label="Close preview"
                onClick={closePreview}
                className="btn btn-light position-absolute"
                style={{
                  top: 10,
                  right: 10,
                  borderRadius: "9999px",
                  padding: "6px 10px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>

              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Preview"
                  style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain", display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-white d-flex align-items-center justify-content-center" style={{ width: "80vw", height: "80vh" }}>
                  Loading…
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }


  if (step === 3) {
    return (
      <>
        <Toasts toasts={toasts} onClose={closeToast} />

        <div className="container py-5">
          {/* Clean professional header */}
          <div className="text-center mb-4">
            <h1 className="fw-bold display-5 mb-2 text-dark">Finalize Export</h1>
            <p className="text-muted fs-5">Add project details and select an export format.</p>
          </div>

          {/* Project section */}
          <div className="mb-4">
            <h2 className="h6 fw-semibold mb-2">Project</h2>

            {projectsLoading ? (
              <div className="text-muted small">Loading projects…</div>
            ) : (
              <>
                {(createNew || projects.length === 0) ? (
                  <div className="card p-3" style={{ maxWidth: 640 }}>
                    <div className="mb-2 fw-semibold">Add Project</div>

                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Project name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Project description"
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ background: brand, color: "#fff", minWidth: 120 }}
                        onClick={handleCreateProjectInline}
                        disabled={isSavingProject}
                      >
                        {isSavingProject ? (
                          <span className="d-inline-flex align-items-center gap-2">
                            <InlineSpinner />
                            Saving…
                          </span>
                        ) : (
                          "Save project"
                        )}
                      </button>

                      {projects.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setCreateNew(false);
                            setNewProjectName("");
                            setNewProjectDesc("");
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-3 align-items-center flex-wrap">
                    <select
                      className="form-select"
                      style={{ maxWidth: 420 }}
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setCreateNew(true);
                        setSelectedProjectId("");
                      }}
                    >
                      + Add project
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Export formats */}
          <div className="mb-3">
            <h2 className="h5 fw-semibold">Export formats</h2>
            <div className="text-muted small">Pick a format that best fits your workflow.</div>
          </div>

          <div className="row g-3 mb-4">
            {exportingKey && (
              <div className="col-12">
                <div
                  className="alert"
                  style={{
                    background: "#f4fffd",
                    border: "1px solid #d9f5f1",
                    color: "#0e6e66",
                    borderRadius: 8,
                  }}
                >
                  <span className="me-2 align-middle">
                    <InlineSpinner />
                  </span>
                  Exporting {exportingKey.toUpperCase()}…
                </div>
              </div>
            )}
            {exportFormats.map((f) => (
              <div className="col-12 col-sm-6 col-lg-4" key={f.key}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-inline-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(33,199,184,0.12)" }}
                      >
                        <Icon name={f.icon} size={20} />
                      </div>
                      <div className="fw-semibold">{f.label}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        background: canExport ? brand : "#9fded8",
                        color: "#fff",
                        cursor: canExport ? "pointer" : "not-allowed",
                        opacity: canExport ? 1 : 0.8,
                        minWidth: 110,
                      }}
                      disabled={!canExport || !!exportingKey}
                      aria-disabled={!canExport || !!exportingKey}
                      title={canExport ? "Export" : "Add/select a project first"}
                      onClick={() => canExport && onExport(f.key)}
                    >
                      {exportingKey === f.key ? (
                        <span className="d-inline-flex align-items-center gap-2">
                          <InlineSpinner />
                          Exporting…
                        </span>
                      ) : (
                        "Export"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back to selections */}
          <div className="text-center">
            <button
              type="button"
              className="btn px-4 py-2 fw-semibold"
              style={{
                background: brand,
                color: "#fff",
                borderRadius: 4,
                boxShadow: "0 4px 10px rgba(33,199,184,0.25)",
                minWidth: 200,
              }}
              onClick={() => {
                setStep(2);
                localStorage.setItem("uploadPdfStep", "2");
                sessionStorage.setItem("uploadPdfStep", "2");
              }}
            >
              Adjust selections
            </button>
          </div>

          {!!saveMsg && <div className="small text-muted mt-3 text-center">{saveMsg}</div>}
        </div>
      </>
    );
  }

  return (
    <>
      <Toasts toasts={toasts} onClose={closeToast} />

      {/* Full-screen overlay only when uploading from step 0 */}
      {loading && (
        <div
          role="status"
          aria-label="Processing your PDF"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1500,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              background: "rgba(33,199,184,0.12)",
              boxShadow: "0 10px 30px rgba(33,199,184,0.25)",
            }}
          >
            <Icon name="spinner" size={44} />
          </div>
          <div className="fw-semibold" style={{ color: "#0e6e66" }}>
            We’re processing your PDF…
          </div>
          <div className="text-muted small">Extracting images — you’ll see them here shortly.</div>
        </div>
      )}

      <div className="container py-5 text-center">
        <h1 className="fw-bold display-5 mb-2 text-dark">Upload PDF for Image Extraction</h1>
        <p className="text-muted fs-5 mb-4">
          Select the PDF that contains the visuals. After upload, Arohio extracts all images and opens the review screen.
        </p>
        <div className="mb-4 text-center" style={{ minHeight: 24 }}>
          {planLoading ? (
            <div
              style={{
                width: 220,
                height: 16,
                margin: "0 auto",
                borderRadius: 6,
                background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
                backgroundSize: "400% 100%",
                animation: "skeleton 1.4s ease infinite"
              }}
            />
          ) : hasActivePlan ? (
            <span style={{ color: "#067d4f", fontWeight: 500 }}>
              Remaining limit: {pdfLeft}
            </span>
          ) : (
            <span style={{ color: "#d8000c", fontWeight: 500 }}>
              No active plan or limit exhausted
            </span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div
          className="mx-auto p-4 p-md-5"
          onDrop={onDrop}
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          style={{
            maxWidth: 820,
            border: "2px dashed var(--bs-border-color,#dee2e6)",
            borderRadius: 12,
            background: drag ? "rgba(33,199,184,0.06)" : "transparent",
            transition: "background .15s ease",
          }}
        >
          {!file ? (
            <div className="d-flex align-items-center justify-content-center">
              <button
                type="button"
                onClick={() => {
                  if (!hasActivePlan) return;
                  onPick();
                }}
                disabled={!hasActivePlan}
                className="btn btn-outline-teal-slim btn-lg px-5 py-3 fw-semibold d-inline-flex align-items-center gap-2"
                style={{
                  borderColor: brand,
                  color: hasActivePlan ? brand : "#999",
                  opacity: hasActivePlan ? 1 : 0.6,
                  cursor: hasActivePlan ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!hasActivePlan) return;
                  e.currentTarget.style.background = brand;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!hasActivePlan) return;
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = brand;
                }}
              >
                <Icon name="pdf" size={22} />
                Upload PDF
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <div
                className="d-inline-flex align-items-center gap-3 px-4 py-3 border"
                style={{ background: "#f9fdfd", borderColor: "#21c7b86b", borderRadius: 10 }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(33,199,184,0.12)" }}
                >
                  <Icon name="upload" size={18} />
                </div>
                <div className="text-start">
                  <div className="fw-semibold text-dark">{file.name}</div>
                  <div className="text-muted small">{prettySize(file.size)}</div>
                </div>
              </div>

              {/* Extraction Mode selector (Light Mode Custom Premium Cards) */}
              <div className="mt-4 text-start mx-auto" style={{ maxWidth: 480 }}>
                <div className="fw-bold mb-2 text-secondary" style={{ fontSize: "0.85rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>Image Extraction Mode</div>
                <div className="d-flex flex-column gap-2">
                  <div
                    onClick={() => setExtractRaw(false)}
                    style={{
                      cursor: "pointer",
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: !extractRaw ? "1px solid #21c7b8" : "1px solid #e2e8f0",
                      background: !extractRaw ? "rgba(33, 199, 184, 0.04)" : "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: !extractRaw ? "0 4px 12px rgba(33, 199, 184, 0.08)" : "none"
                    }}
                    className="d-flex align-items-start gap-3"
                  >
                    <input
                      type="radio"
                      name="extractionMode"
                      checked={!extractRaw}
                      onChange={() => setExtractRaw(false)}
                      style={{ cursor: "pointer", marginTop: "3px", accentColor: "#21c7b8" }}
                    />
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>Smart Bounding Boxes</div>
                      <div className="text-muted small mt-1">Automatically detects and crops visual regions such as charts, tables, diagrams, and figures.</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setExtractRaw(true)}
                    style={{
                      cursor: "pointer",
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: extractRaw ? "1px solid #21c7b8" : "1px solid #e2e8f0",
                      background: extractRaw ? "rgba(33, 199, 184, 0.04)" : "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: extractRaw ? "0 4px 12px rgba(33, 199, 184, 0.08)" : "none"
                    }}
                    className="d-flex align-items-start gap-3"
                  >
                    <input
                      type="radio"
                      name="extractionMode"
                      checked={extractRaw}
                      onChange={() => setExtractRaw(true)}
                      style={{ cursor: "pointer", marginTop: "3px", accentColor: "#21c7b8" }}
                    />
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>Raw Image Extraction</div>
                      <div className="text-muted small mt-1">Extracts exact embedded image files directly from the PDF without cropping or bounding box math.</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-teal mt-4 px-4 py-2 fw-semibold"
                style={{
                  background: brand,
                  color: "#fff",
                  borderRadius: 4,
                  boxShadow: "0 4px 10px rgba(33,199,184,0.25)",
                  minWidth: 160,
                  position: "relative",
                }}
                onClick={async () => {
                  const stem = (file?.name && file.name.replace(/\.pdf$/i, "")) || "document";
                  setPdfStem(stem);
                  await onSubmit();
                }}
                disabled={loading}
              >
                {loading ? (
                  <span className="d-inline-flex align-items-center gap-2">
                    <InlineSpinner />
                    Uploading…
                  </span>
                ) : (
                  "Continue"
                )}
              </button>

              {error && (
                <div className="text-danger mt-3" style={{ maxWidth: 640 }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
