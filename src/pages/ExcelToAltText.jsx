import { useRef, useState, useMemo, useEffect } from "react";

/* ---------- Icons ---------- */
function Icon({ name, size = 20 }) {
  const c = "currentColor";
  switch (name) {
    case "upload":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M5 20h14v-6h2v8H3v-8h2z" />
          <path fill={c} d="M11 16h2V8.83l2.59 2.58L17 10l-5-5-5 5 1.41 1.41L11 8.83z" />
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
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={c} d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      );
    case "zoom":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill={c}
            d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      );
    default:
      return null;
  }
}

const brand = "#21c7b8";

function InlineSpinner() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="spinner" size={16} />
    </span>
  );
}

/* ---------- Storage helpers ---------- */
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

function Toasts({ toasts, onClose }) {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 2000, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            minWidth: 280,
            maxWidth: 420,
            borderRadius: 6,
            padding: "12px 14px",
            background: t.type === "error" ? "#fff3f3" : "#ecfffb",
            border: `1px solid ${t.type === "error" ? "#ffb3b3" : "#bff0ea"}`,
          }}
        >
          <div style={{ fontWeight: 600, color: t.type === "error" ? "#b40000" : "#0e6e66", display: "flex", justifyContent: "space-between" }}>
            {t.title}
            <button onClick={() => onClose(t.id)} style={{ background: "none", border: "none", color: "#666" }}>
              ×
            </button>
          </div>
          {t.message && <div style={{ fontSize: 13, marginTop: 4 }}>{t.message}</div>}
        </div>
      ))}
    </div>
  );
}

function readStore(key) {
  try {
    const s = typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    if (s != null) return s;
  } catch { }
  try {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null;
  } catch { }
  return null;
}

function getUserId() {
  try {
    const raw = readStore("auth_user");
    if (!raw) return "";
    const obj = JSON.parse(raw);
    if (obj && (obj.id || obj.user_id)) return String(obj.id ?? obj.user_id);
  } catch { }
  return "";
}

function getToken() {
  const t = readStore("auth_token");
  return t || "";
}

/* ====================================================================== */

export default function ExcelToAltText() {
  const inputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const [itemsByPage, setItemsByPage] = useState({});
  const [activePage, setActivePage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [shortLimit, setShortLimit] = useState(125);
  const [longLimit, setLongLimit] = useState(250);
  const [excelStem, setExcelStem] = useState("");
  const [altTexts, setAltTexts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [modalCaption, setModalCaption] = useState("");
  const [expandedPages, setExpandedPages] = useState({});
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [exportingKey, setExportingKey] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [imageLeft, setImageLeft] = useState(0);
  const [planLoading, setPlanLoading] = useState(true);
  const totalImages = Object.values(itemsByPage)
    .flat()
    .filter(it => it.is_visible !== false)
    .length;

  const remainingImages = imageLeft;

  const isLimitExceeded = totalImages > remainingImages;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const showToast = (obj) => {
    const id = Date.now().toString();
    setToasts((p) => [...p, { id, ...obj }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const togglePage = (p) => setExpandedPages((prev) => ({ ...prev, [p]: !prev[p] }));

  const accept = useMemo(() => ".xlsx,.xls,.csv", []);
  const onPick = () => inputRef.current?.click();
  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };
  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDrag(true);
    if (e.type === "dragleave") setDrag(false);
  };

  const openPreview = (src, caption = "") => {
    setModalSrc(src || "");
    setModalCaption(caption || "");
    setModalOpen(true);
  };
  const closePreview = () => setModalOpen(false);

  function groupByPage(items) {
    const map = {};
    for (const it of items) {
      const p = Number(it.page ?? it.Page ?? 1);
      const copy = { ...it };
      if (typeof copy.is_visible === "undefined") copy.is_visible = true;
      map[p] = map[p] ? [...map[p], copy] : [copy];
    }
    return map;
  }

  async function onSubmit() {
    if (!file) return;
    const userId = getUserId();
    const token = getToken();
    if (!userId) {
      showToast({ title: "Missing user", type: "error" });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/uploads-excel-to-alttext/file/${userId}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      const grouped = groupByPage(items);
      const pages = Object.keys(grouped)
        .map((n) => Number(n))
        .sort((a, b) => a - b);
      setItemsByPage(grouped);
      setActivePage(pages[0] ?? 1);
      setActiveIndex(0);
      const stem = (data.result_url || "").split("/").pop()?.replace(/\.json$/i, "") || "";
      setExcelStem(stem);
      setStep(1);
      showToast({ title: "Excel uploaded", message: `${items.length} rows processed.` });
    } catch (e) {
      setError(e.message);
      showToast({ title: "Upload failed", message: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const pages = useMemo(
    () => Object.keys(itemsByPage).map((n) => Number(n)).sort((a, b) => a - b),
    [itemsByPage]
  );
  const pageItems = useMemo(() => itemsByPage[activePage] || [], [itemsByPage, activePage]);
  const activeItem = useMemo(() => pageItems[activeIndex] || null, [pageItems, activeIndex]);

  function toggleInclude(item) {
    setItemsByPage((prev) => {
      const p = Number(item.page ?? activePage ?? 1);
      const arr = prev[p] ? [...prev[p]] : [];
      const sameAs = (x) =>
        item === x ||
        (item.row != null && x.row === item.row) ||
        (item.index != null && x.index === item.index) ||
        (item.file_name && x.file_name === item.file_name) ||
        ((item.image_url || item.url) && (x.image_url || x.url) === (item.image_url || item.url));
      const newArr = arr.map((x) => (sameAs(x) ? { ...x, is_visible: !x.is_visible } : x));
      return { ...prev, [p]: newArr };
    });
  }

  function selectAll(on = true) {
    setItemsByPage((prev) => {
      const p = Number(activePage ?? 1);
      const arr = prev[p] ? prev[p].map((x) => ({ ...x, is_visible: on })) : [];
      return { ...prev, [p]: arr };
    });
  }

  async function onGenerateAll() {
    const userId = getUserId();
    const token = getToken();

    const selected = [];
    for (const p of Object.keys(itemsByPage)) {
      for (const it of itemsByPage[p]) selected.push(it);
    }

    if (selected.length === 0) {
      showToast({ title: "Nothing to generate", type: "error" });
      return;
    }

    if (!excelStem) {
      showToast({ title: "Missing context", type: "error", message: "Retry upload step." });
      return;
    }

    try {
      setLoading(true);
      setStep(3);

      const res = await fetch(`${API_BASE}/uploads-excel-to-alttext/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: userId,
          excel_stem: excelStem,
          short_limit: shortLimit,
          long_limit: longLimit,
          items: selected,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const generatedItems = Array.isArray(data.items) ? data.items : [];

      const grouped = groupByPage(generatedItems);
      const map = {};

      for (const it of generatedItems) {
        const p = Number(it.page ?? it.Page ?? 1);
        if (!map[p]) map[p] = {};

        const idx = it.index ?? it.row ?? 0;

        map[p][idx] = {
          short_alt: it.short_alt || it.short_alt_text || "",
          long_alt: it.long_alt || it.long_alt_text || "",
          image_url: it.image_url || (Array.isArray(it.image_urls) ? it.image_urls[0] : "") || "",
          file_name: it.file_name || "",
        };
      }

      const pages = Object.keys(grouped)
        .map((n) => Number(n))
        .sort((a, b) => a - b);

      setItemsByPage(grouped);
      setAltTexts(map);
      setActivePage(pages[0] ?? 1);
      setActiveIndex(0);
      setExpandedPages((prev) => ({
        ...prev,
        [pages[0] ?? 1]: true,
      }));

      setStep(2);

      showToast({
        title: "Alt text generated",
        message: `${data.generated_items ?? generatedItems.length} items processed.`,
        type: "success",
      });
    } catch (e) {
      setStep(1);
      showToast({ title: "Alt text failed", message: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function onRegenerateOne() {
    if (!activeItem) return;

    const userId = getUserId();
    const token = getToken();

    if (!userId || !excelStem) {
      showToast({ title: "Missing context", message: "User or excel stem not found. Re-upload the file.", type: "error" });
      return;
    }

    const page = Number(activePage ?? 1);
    const idx = activeItem.index != null ? Number(activeItem.index) : Number(activeIndex) + 1;

    try {
      setRegenLoading(true);

      const res = await fetch(`${API_BASE}/uploads-excel-to-alttext/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: userId,
          excel_stem: excelStem,
          page,
          index: idx,
          short_limit: shortLimit,
          long_limit: longLimit,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setAltTexts((prev) => ({
        ...prev,
        [page]: {
          ...(prev[page] || {}),
          [idx]: {
            ...(prev[page]?.[idx] || {}),
            short_alt: data.short_alt || "",
            long_alt: data.long_alt || "",
          },
        },
      }));

      showToast({ title: "Regenerated", message: `Page ${page}, Figure ${idx}`, type: "success" });
    } catch (e) {
      showToast({ title: "Regenerate failed", message: String(e), type: "error" });
    } finally {
      setRegenLoading(false);
    }
  }

  /* ---------- EXPORT HELPERS ---------- */

  const exportFormats = useMemo(
    () => [
      { key: "xlsx", label: "Excel (.xlsx)", icon: "check" },
      { key: "epub", label: "EPUB (.epub)", icon: "check" },
      { key: "mobi", label: "MOBI (.mobi)", icon: "check" },
    ],
    []
  );

  const canExport = useMemo(() => {
    if (createNew) return Boolean(newProjectName.trim() && newProjectDesc.trim());
    return Boolean(selectedProjectId);
  }, [createNew, newProjectName, newProjectDesc, selectedProjectId]);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const extFor = (formatKey) => {
    switch (formatKey) {
      case "csv": return "csv";
      case "xlsx": return "xlsx";
      case "epub": return "epub";
      case "mobi": return "mobi";
      case "json":
      default: return "json";
    }
  };

  // Build a single JSON manifest from current UI state
  const buildExportManifest = () => {
    const items = [];
    const pageNums = Object.keys(itemsByPage).map((n) => Number(n)).sort((a, b) => a - b);

    for (const p of pageNums) {
      const arr = itemsByPage[p] || [];
      arr.forEach((it, localIdx) => {
        const idx = it.index ?? it.row ?? localIdx + 1;
        const at = altTexts?.[p]?.[idx] || {};
        items.push({
          page: p,
          index: idx,
          file_name: it.file_name || it["File Name"] || "",
          image_url: it.image_url || it.url || "",
          is_visible: it.is_visible !== false,
          short_alt: at.short_alt || "",
          long_alt: at.long_alt || "",
        });
      });
    }

    return {
      excel_stem: excelStem,
      short_limit: shortLimit,
      long_limit: longLimit,
      items,
      exported_at: new Date().toISOString(),
      // Optional: quick stats
      stats: {
        pages: pageNums.length,
        total_rows: items.length,
        included: items.filter((x) => x.is_visible).length,
      },
    };
  };

  const onExportFormat = async (formatKey) => {
    if (!canExport) {
      showToast({ title: "Select a project", message: "Add or choose a project first", type: "error" });
      return;
    }

    const uid = getUserId() || getUserIdFromStorages();
    const token = getToken() || getAuthToken();

    if (!uid || !excelStem) {
      showToast({ title: "Export failed", message: "Missing user or excel stem", type: "error" });
      return;
    }

    const manifest = buildExportManifest();

    const triggerDownload = (url, filename) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    setExportingKey(formatKey);

    try {
      const res = await fetch(`${API_BASE}/uploads-excel-to-alttext/export-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: uid,
          excel_stem: excelStem,
          format: formatKey,
          selected_type: formatKey,
          manifest,
          project_id: createNew ? undefined : selectedProjectId || undefined,
          project_name: createNew ? newProjectName.trim() : undefined,
          project_description: createNew ? newProjectDesc.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Export failed");
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();

        if (data?.download_url) {
          triggerDownload(data.download_url, `${excelStem}.${extFor(formatKey)}`);
          setSaveMsg(`Exported ${excelStem}.${extFor(formatKey)}`);
          showToast({ title: "Export complete", message: `${excelStem}.${extFor(formatKey)}` });
        } else if (data?.file_base64) {
          const ext = extFor(formatKey);
          const byteStr = atob(data.file_base64);
          const bytes = new Uint8Array(byteStr.length);
          for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
          downloadBlob(new Blob([bytes]), `${excelStem}.${ext}`);
          setSaveMsg(`Exported ${excelStem}.${ext}`);
          showToast({ title: "Export complete", message: `${excelStem}.${ext}` });
        } else if (data?.ok) {
          if (formatKey === "json") {
            triggerDownload(
              `${API_BASE}/uploads/${uid}/${excelStem}.json`,
              `${excelStem}.json`
            );
            setSaveMsg(`Exported ${excelStem}.json`);
            showToast({ title: "Export complete", message: `${excelStem}.json` });
          } else {
            showToast({ title: "Export ready", message: "File prepared on server", type: "success" });
          }
        } else {
          throw new Error("Unexpected export response");
        }
      } else {
        const blob = await res.blob();
        const ext = extFor(formatKey);
        downloadBlob(blob, `${excelStem}.${ext}`);
        setSaveMsg(`Exported ${excelStem}.${ext}`);
        showToast({ title: "Export complete", message: `${excelStem}.${ext}` });
        setTimeout(() => {
          window.location.href = "/dashboard/projects";
        }, 1000);
      }
    } catch (e) {
      showToast({ title: "Export failed", message: String(e), type: "error" });
    } finally {
      setExportingKey("");
    }
  };

  const handleCreateProjectInline = async () => {
    const userId = getUserIdFromStorages() || getUserId();
    const token = getAuthToken();
    if (!userId) {
      showToast({ title: "Missing user", type: "error" });
      setSaveMsg("Missing user");
      return;
    }
    if (!newProjectName.trim()) {
      showToast({ title: "Project name required", type: "error" });
      setSaveMsg("Project name is required");
      return;
    }
    if (!newProjectDesc.trim()) {
      showToast({ title: "Project description required", type: "error" });
      setSaveMsg("Project description is required");
      return;
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
  };

  useEffect(() => {
    if (step !== 4) return;

    const userId = getUserId();
    const token = getToken();
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

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const userId = getUserId();

        if (!userId) {
          setHasActivePlan(false);
          setImageLeft(0);
          return;
        }

        const token = getToken();

        const res = await fetch(`${API_BASE}/user-plans/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user plan");
        }

        const data = await res.json();

        const activePlan = Array.isArray(data)
          ? data.find((p) => p.is_active)
          : data?.is_active
            ? data
            : null;

        if (activePlan) {
          const remainingImages =
            Number(activePlan.image_limit ?? 0) - Number(activePlan.image_used ?? 0);

          setImageLeft(Math.max(0, remainingImages));
          setHasActivePlan(remainingImages > 0);
        } else {
          setImageLeft(0);
          setHasActivePlan(false);
        }
      } catch (err) {
        console.error(err);
        setImageLeft(0);
        setHasActivePlan(false);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchUserPlan();
  }, []);

  // Step 0: Upload
  if (step === 0) {
    return (
      <>
        <Toasts toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-5 mb-2 text-dark">Upload Excel or CSV</h1>
          <p className="text-muted fs-5 mb-4">Upload an Excel (.xlsx, .xls) or CSV file that lists images and we’ll prepare them for alt text generation.</p>
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
                Remaining image limit: {imageLeft}
              </span>
            ) : (
              <span style={{ color: "#d8000c", fontWeight: 500 }}>
                No active plan or image limit exhausted
              </span>
            )}
          </div>
          <input ref={inputRef} type="file" accept={accept} onChange={onChange} style={{ display: "none" }} />
          <div
            onDrop={onDrop}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            style={{
              maxWidth: 800,
              margin: "0 auto",
              border: "2px dashed #21c7b8",
              borderRadius: 6,
              padding: 40,
              background: drag ? "rgba(33,199,184,0.06)" : "transparent",
            }}
          >
            {!file ? (
              <button
                type="button"
                onClick={() => {
                  if (!hasActivePlan) return;
                  onPick();
                }}
                disabled={!hasActivePlan}
                className="btn btn-lg px-4 py-3 fw-semibold"
                style={{
                  borderColor: brand,
                  borderWidth: 2,
                  borderStyle: "solid",
                  color: hasActivePlan ? brand : "#999",
                  background: "rgba(33,199,184,0.18)",
                  borderRadius: 12,
                  opacity: hasActivePlan ? 1 : 0.6,
                  cursor: hasActivePlan ? "pointer" : "not-allowed",
                  minWidth: 240,

                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                <Icon name="upload" size={20} />
                <span>Upload Excel / CSV</span>
              </button>
            ) : (
              <div>
                <div className="fw-semibold">{file.name}</div>
                <button className="btn mt-3" style={{ background: brand, color: "#fff", borderRadius: 10, padding: "10px 18px" }} onClick={onSubmit} disabled={loading}>
                  {loading ? <InlineSpinner /> : "Continue"}
                </button>
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Step 1: Review images
  if (step === 1) {
    return (
      <>
        <Toasts toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

        <div
          className={`position-fixed top-0 start-0 w-100 h-100 ${modalOpen ? "" : "d-none"}`}
          style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.45)", zIndex: 2000 }}
          onClick={closePreview}
        >
          <div className="h-100 d-flex flex-column align-items-center justify-content-center" onClick={(e) => e.stopPropagation()}>
            <div className="position-absolute top-0 end-0 p-3">
              <button className="btn btn-light" onClick={closePreview}>×</button>
            </div>
            <div className="container">
              <img
                src={modalSrc}
                alt=""
                style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 8px 30px rgba(0,0,0,.4)" }}
              />
              {modalCaption ? <div className="text-center text-light mt-3">{modalCaption}</div> : null}
            </div>
          </div>
        </div>

        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="fw-bold mb-0">Review Images</h1>
            <div style={{ background: "#e9fbf8", border: "1px solid #21c7b87a", borderRadius: 4, padding: "6px 12px" }}>
              <Icon name="check" size={16} /> {pages.reduce((n, p) => n + (itemsByPage[p]?.length || 0), 0)} rows loaded
            </div>
          </div>

          {isLimitExceeded && (
            <div className="text-danger text-center mb-3">
              You are trying to process {totalImages} images but only {remainingImages} allowed in your plan.
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-lg-3">
              <div className="border rounded p-2">
                <div className="fw-semibold mb-2">Pages</div>
                <div className="list-group">
                  {pages.map((p) => (
                    <button
                      key={p}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${p === activePage ? "active" : ""}`}
                      onClick={() => setActivePage(p)}
                      style={p === activePage ? { background: brand, borderColor: brand } : {}}
                    >
                      <span>Page {p}</span>
                      <span className="badge bg-light text-dark">{itemsByPage[p]?.length || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border rounded p-3 mt-3">
                <div className="fw-semibold mb-2">Alt Text Limits</div>
                <div className="mb-2">
                  <label className="form-label small text-muted mb-1">Short Alt Text</label>
                  <input type="number" min={30} max={300} className="form-control" value={shortLimit} onChange={(e) => setShortLimit(Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label small text-muted mb-1">Long Alt Text</label>
                  <input type="number" min={100} max={600} className="form-control" value={longLimit} onChange={(e) => setLongLimit(Number(e.target.value))} />
                </div>
              </div>

              <div className="border rounded p-3 mt-3">
                <div className="fw-semibold mb-2">Bulk Actions</div>
                <div className="row g-2 align-items-center">
                  <div className="col-6 d-grid">
                    <button className="btn btn-sm" style={{ background: brand, color: "#fff" }} onClick={() => selectAll(true)}>
                      Select All
                    </button>
                  </div>
                  <div className="col-6 d-grid">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => selectAll(false)}>
                      Deselect All
                    </button>
                  </div>
                  <div className="col-12 d-flex justify-content-center mt-2">
                    <button
                      className="btn px-4 py-2 fw-semibold"
                      style={{
                        background: !isLimitExceeded ? brand : "#999",
                        color: "#fff",
                        cursor: !isLimitExceeded ? "pointer" : "not-allowed",
                        opacity: !isLimitExceeded ? 1 : 0.6
                      }}
                      onClick={onGenerateAll}
                      disabled={loading || isLimitExceeded}
                    >
                      {loading ? <InlineSpinner /> : "Generate Alt Text"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-9">
              {pageItems.length === 0 ? (
                <div className="border rounded p-4 text-center text-muted">No images on this page.</div>
              ) : (
                <div className="row g-3">
                  {pageItems.map((it, i) => (
                    <div className="col-12 col-md-6 col-lg-4" key={i}>
                      <div className="card h-100 shadow-sm">
                        <div style={{ position: "relative" }}>
                          <img
                            src={it.image_url || it.url}
                            alt=""
                            style={{
                              width: "100%",
                              height: 180,
                              objectFit: "cover",
                              cursor: "zoom-in",
                              filter: it.is_visible ? "none" : "grayscale(100%) opacity(0.5)",
                            }}
                            onClick={() => openPreview(it.image_url || it.url, it.file_name || `Image ${i + 1}`)}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              background: "rgba(0,0,0,0.55)",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          >
                            Row {it.row ?? it.index ?? i + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => openPreview(it.image_url || it.url, it.file_name || `Image ${i + 1}`)}
                            className="btn btn-sm"
                            style={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              background: "rgba(255,255,255,0.95)",
                              borderRadius: 20,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Icon name="zoom" size={16} /> View
                          </button>
                        </div>
                        <div className="card-body">
                          <div className="fw-semibold small mb-2">{it.file_name || it["File Name"] || `Image ${i + 1}`}</div>
                          <div className="form-check d-flex align-items-center justify-content-between">
                            <div>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={!!it.is_visible}
                                onChange={() => toggleInclude(it)}
                                id={`inc-${activePage}-${i}`}
                              />
                              <label className="form-check-label ms-2" htmlFor={`inc-${activePage}-${i}`}>
                                Include
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => openPreview(it.image_url || it.url, it.file_name || `Image ${i + 1}`)}
                              className="btn btn-link p-0 d-inline-flex align-items-center"
                            >
                              <Icon name="zoom" size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 2) {
    const onExportClick = () => {
      const url = `${API_BASE}/uploads/${getUserId()}/${excelStem}.json`;
      setStep(4);
    };

    return (
      <>
        <Toasts toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="fw-bold mb-0">Review Alt Text</h1>
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn fw-semibold px-4 py-2"
                style={{ background: brand, color: "#fff" }}
                onClick={onExportClick}
              >
                Export
              </button>

              <div style={{ background: "#e9fbf8", border: "1px solid #21c7b87a", borderRadius: 4, padding: "6px 12px" }}>
                <Icon name="check" size={16} /> Prepared — review and export
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-3">
              <div className="border rounded p-2">
                <div className="fw-semibold mb-2">Pages</div>
                {pages.map((p) => {
                  const visibleItems = (itemsByPage[p] || []).filter((it) => it.is_visible);
                  const isActivePage = p === activePage;
                  const expanded = !!expandedPages[p];

                  return (
                    <div key={p} className="mb-2">
                      <button
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActivePage ? "active" : ""}`}
                        onClick={() => {
                          setActivePage(p);
                          setActiveIndex(0);
                          togglePage(p);
                        }}
                        style={isActivePage ? { background: brand, borderColor: brand } : {}}
                      >
                        <span>Page {p}</span>
                        <span className="small">{expanded ? "▲" : "▼"}</span>
                      </button>

                      {expanded && visibleItems.length > 0 && (
                        <div className="list-group mt-1">
                          {visibleItems.map((it, idx) => (
                            <button
                              key={idx}
                              className={`list-group-item list-group-item-action py-1 ${idx === activeIndex && isActivePage ? "active" : ""}`}
                              onClick={() => {
                                setActivePage(p);
                                setActiveIndex(idx);
                              }}
                              style={idx === activeIndex && isActivePage ? { background: brand, borderColor: brand } : {}}
                            >
                              Figure {idx + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-12 col-lg-9">
              {!activeItem ? (
                <div className="border rounded p-4 text-center text-muted">Pick a page and figure to review.</div>
              ) : (
                <div className="card shadow-sm">
                  <div className="row g-0">
                    <div className="col-12 col-xl-6 p-3">
                      <img
                        src={activeItem.image_url || activeItem.url}
                        alt=""
                        style={{ width: "100%", maxHeight: 460, objectFit: "contain", borderRadius: 8 }}
                      />
                      <div className="text-muted small mt-2">
                        {activeItem.file_name || `Page ${activePage} • Figure ${activeIndex + 1}`}
                      </div>
                    </div>

                    <div className="col-12 col-xl-6 p-3">
                      <div className="mb-3">
                        <div className="fw-semibold mb-1">Short Alt Text</div>
                        <div className="form-control" style={{ background: "#f7fffd", minHeight: 56, whiteSpace: "pre-wrap" }}>
                          {altTexts[activePage]?.[activeItem.index ?? activeIndex + 1]?.short_alt || ""}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="fw-semibold mb-1">Long Alt Text</div>
                        <div className="form-control" style={{ background: "#f7fffd", minHeight: 120, whiteSpace: "pre-wrap" }}>
                          {altTexts[activePage]?.[activeItem.index ?? activeIndex + 1]?.long_alt || ""}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn fw-semibold"
                          style={{ background: brand, color: "#fff" }}
                          onClick={onRegenerateOne}
                          disabled={regenLoading}
                        >
                          {regenLoading ? <InlineSpinner /> : "Regenerate Alt Text"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Toasts toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
        <div className="container py-4">
          <div className="row g-3">
            <div className="col-12 col-lg-3">
              <div className="border rounded p-2">
                <div className="fw-semibold mb-2">Pages</div>
                <div className="list-group">
                  {pages.map((p) => (
                    <button
                      key={p}
                      className={`list-group-item list-group-item-action ${p === activePage ? "active" : ""}`}
                      onClick={() => {
                        setActivePage(p);
                        setActiveIndex(0);
                      }}
                      style={p === activePage ? { background: brand, borderColor: brand } : {}}
                    >
                      Page {p}
                    </button>
                  ))}
                </div>
                {pageItems.length > 0 && (
                  <div className="mt-3">
                    <div className="fw-semibold small mb-1">Indexes</div>
                    <div className="list-group">
                      {pageItems.map((_, idx) => (
                        <button
                          key={idx}
                          className={`list-group-item list-group-item-action py-1 ${idx === activeIndex ? "active" : ""}`}
                          onClick={() => setActiveIndex(idx)}
                          style={idx === activeIndex ? { background: brand, borderColor: brand } : {}}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-9 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 420 }}>
              <Icon name="spinner" size={60} />
              <div className="mt-3 fw-semibold" style={{ color: "#0e6e66" }}>
                Generating Alt Text…
              </div>
              <div className="text-muted small">
                Short {shortLimit} chars · Long {longLimit} chars
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        <Toasts toasts={toasts} onClose={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

        <div className="container py-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold display-5 mb-2 text-dark">Export Complete</h1>
            <p className="text-muted fs-5">Choose (or add) a project and export your package.</p>
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
          <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="h5 fw-semibold mb-0">Export formats</h2>
              <div className="text-muted small">Pick a format that best fits your workflow.</div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            {exportingKey && (
              <div className="col-12">
                <div
                  className="alert"
                  style={{ background: "#f4fffd", border: "1px solid #d9f5f1", color: "#0e6e66", borderRadius: 8 }}
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
                      onClick={() => canExport && onExportFormat(f.key)}
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

          {/* Back to review */}
          <div className="text-center">
            <button
              type="button"
              className="btn px-4 py-2 fw-semibold"
              style={{ background: brand, color: "#fff", borderRadius: 4, boxShadow: "0 4px 10px rgba(33,199,184,0.25)", minWidth: 200 }}
              onClick={() => {
                setStep(2);
                localStorage.setItem("uploadPdfStep", "2");
                sessionStorage.setItem("uploadPdfStep", "2");
              }}
            >
              Back to Review
            </button>
          </div>

          {!!saveMsg && <div className="small text-muted mt-3 text-center">{saveMsg}</div>}
        </div>
      </>
    );
  }

  return null;
}
