import { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiStar, FiChevronRight } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminBlogsManagement() {
  const INK = "#0f172a", TEAL = "#21c7b8", LINE = "#e6edf4", BG = "#f6f8fb";
  const API_BASE = import.meta.env.VITE_API_BASE;


  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const empty = {
    title: "",
    excerpt: "",
    category: "",
    tagsText: "",
    date: "",
    readMin: "",
    author_name: "",
    author_avatar: "",
    image: "",
    featured: false,
    status: "draft",
    content_body: ""
  };
  const [edit, setEdit] = useState(empty);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/blogs?include_unpublished=true`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const rows = Array.isArray(data.posts) ? data.posts : [];
      setBlogs(rows);
    } catch (e) {
      setError(e?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const tabCounts = (tab) =>
    blogs.filter((b) => {
      if (tab === "All") return true;
      if (tab === "Published") return (b.status || "").toLowerCase() === "published";
      if (tab === "Drafts") return (b.status || "").toLowerCase() === "draft";
      if (tab === "Archived") return (b.status || "").toLowerCase() === "archived";
      return true;
    }).length;

  const filteredBlogs = useMemo(() => {
    let list = blogs.filter((b) => {
      if (filter === "All") return true;
      if (filter === "Published") return (b.status || "").toLowerCase() === "published";
      if (filter === "Drafts") return (b.status || "").toLowerCase() === "draft";
      if (filter === "Archived") return (b.status || "").toLowerCase() === "archived";
      return true;
    });
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(n) ||
          (b.excerpt || "").toLowerCase().includes(n) ||
          (b.category || "").toLowerCase().includes(n) ||
          (b.tags || []).join(" ").toLowerCase().includes(n)
      );
    }
    return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [blogs, filter, q]);

  const openView = (b) => {
    setSelected(b);
    setMode("view");
  };

  const openEdit = (b) => {
    setSelected(b || null);
    setMode(b ? "edit" : "create");
    if (!b) {
      setEdit(empty);
      return;
    }
    setEdit({
      title: b.title || "",
      excerpt: b.excerpt || "",
      category: b.category || "",
      tagsText: (b.tags || []).join(", "),
      date: b.date || "",
      readMin: b.readMin || "",
      author_name: b.author?.name || "",
      author_avatar: b.author?.avatar || "",
      image: b.image || "",
      featured: !!b.featured,
      status: b.status || "draft",
      content_body: b.content?.body || ""
    });
  };

  const backToList = () => {
    setMode("list");
    setSelected(null);
    setEdit(empty);
  };

  const toPayload = (state) => {
    const tags = state.tagsText
      ? state.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    return {
      title: state.title,
      excerpt: state.excerpt,
      category: state.category || null,
      tags,
      date: state.date || null,
      readMin: state.readMin ? Number(state.readMin) : null,
      author: { name: state.author_name || "", avatar: state.author_avatar || "" },
      image: state.image || null,
      featured: !!state.featured,
      status: state.status || "draft",
      content: { format: "markdown", body: state.content_body || "" }
    };
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (mode === "edit" && selected?.id) {
        const res = await fetch(`${API_BASE}/api/v1/blogs/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPayload(edit))
        });
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        setBlogs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setSelected(updated);
        setMode("view");
        toast.success("Blog updated", { autoClose: 3000 });
      } else if (mode === "create") {
        const res = await fetch(`${API_BASE}/api/v1/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toPayload(edit))
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setBlogs((prev) => [created, ...prev]);
        setSelected(created);
        setMode("view");
        toast.success("Blog created", { autoClose: 3000 });
      }
    } catch (e) {
      setError(e?.message || "Save failed");
      toast.error("Save failed", { autoClose: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (b) => {
    if (!window.confirm("Delete this blog?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/blogs/${b.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setBlogs((prev) => prev.filter((x) => x.id !== b.id));
      backToList();
      toast.success("Blog deleted", { autoClose: 3000 });
    } catch (e) {
      setError(e?.message || "Delete failed");
      toast.error("Delete failed", { autoClose: 3000 });
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (b) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/blogs/reorder/featured`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog_id: b.id, featured: !b.featured })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setBlogs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      if (selected?.id === updated.id) setSelected(updated);
      toast.success("Featured updated", { autoClose: 3000 });
    } catch (e) {
      setError(e?.message || "Failed to toggle featured");
      toast.error("Failed to toggle featured", { autoClose: 3000 });
    }
  };

  const compactTags = (tags = []) => {
    const shown = tags.slice(0, 2);
    const extra = tags.length - shown.length;
    return { shown, extra };
  };

  return (
    <div className="container py-4 text-start" style={{ background: BG, minHeight: "100vh" }}>
      <ToastContainer position="top-right" newestOnTop />
      <style>{`
        :root { --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;margin:12px 0}
        .search{max-width:360px;width:100%}
        .tabs{display:flex;gap:20px;margin:16px 0;font-weight:700}
        .tab{cursor:pointer;color:#64748b}
        .tab.active{color:var(--teal);border-bottom:2px solid var(--teal);padding-bottom:4px}
        .card{background:#fff;border:1px solid var(--line);border-radius:6px;box-shadow:0 8px 22px rgba(2,8,23,.05)}
        .table{width:100%;border-collapse:collapse;table-layout:fixed}
        .table thead th{padding:12px;color:#334155;font-weight:900;border-bottom:1px solid var(--line);background:#fafcff;text-align:left;vertical-align:middle}
        .table tbody td{padding:12px;border-bottom:1px solid var(--line);font-size:.9rem;vertical-align:middle;height:72px}
        .pill{font-size:.75rem;font-weight:800;border-radius:999px;padding:4px 10px;display:inline-block;white-space:nowrap}
        .s-draft{background:#f1f5f9;color:#334155}
        .s-published{background:#dcfce7;color:#15803d}
        .s-archived{background:#fee2e2;color:#dc2626}
        .btag{font-size:.7rem;color:#334155;background:#f1f5f9;border:1px solid var(--line);border-radius:999px;padding:2px 8px;white-space:nowrap}
        .actions{display:flex;gap:10px;align-items:center;justify-content:flex-start;white-space:nowrap}
        .action-btn{cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700}
        .action-view{color:#0ea5e9}
        .action-edit{color:#16a34a}
        .action-del{color:#ef4444}
        .thumb{width:72px;height:48px;object-fit:cover;border-radius:4px;border:1px solid var(--line);flex-shrink:0}
        .postcell{display:flex;gap:10px;align-items:center;min-height:48px}
        .tagsline{display:flex;gap:6px;align-items:center;flex-wrap:nowrap;overflow:hidden}
        .tagsline .more{color:#94a3b8;white-space:nowrap}
        .nowrap{white-space:nowrap}
        .breadcrumbs{display:flex;align-items:center;gap:8px;margin:4px 0 16px 0;color:#0f172a;font-weight:700}
        .crumb{cursor:pointer;color:#334155}
        .crumb.active{color:var(--teal)}
        .page{background:#fff;border:1px solid var(--line);border-radius:6px;padding:16px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .label{font-size:.8rem;color:#64748b;margin-bottom:4px}
        .btn-nowrap{white-space:nowrap}
      `}</style>

      {mode === "list" && (
        <>
          <h1 className="h5 title mb-1">Blog Management</h1>
          <div className="muted mb-3">Create, update, feature, and publish blog posts.</div>

          <div className="toolbar">
            <input className="form-control search" placeholder="Search by title, tag, category…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn btn-teal-slim d-inline-flex align-items-center gap-2 btn-nowrap" onClick={() => openEdit(null)}>
              <FiPlus /> New Blog
            </button>
          </div>

          <div className="tabs">
            {["All", "Published", "Drafts", "Archived"].map((t) => (
              <div key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
                {t} <span className="muted" style={{ fontWeight: 400 }}>({tabCounts(t)})</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="card" style={{ borderColor: "#fecaca", marginBottom: 12 }}>
              <div style={{ padding: 12, color: "#b91c1c" }}>Error: {error}</div>
            </div>
          )}
          {loading && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ padding: 12 }}>Loading blogs…</div>
            </div>
          )}

          <div className="card">
            <table className="table">
              <colgroup>
                <col style={{ width: "36%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((b) => {
                  const { shown, extra } = compactTags(b.tags || []);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="postcell">
                          <img src={b.image} alt="" className="thumb" />
                          <div className="nowrap">
                            <div style={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
                            <div className="muted" style={{ fontSize: ".8rem", overflow: "hidden", textOverflow: "ellipsis" }}>{b.author?.name || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="nowrap" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{b.category || "—"}</td>
                      <td>
                        <div className="tagsline">
                          {shown.map((t) => <span key={t} className="btag">{t}</span>)}
                          {extra > 0 && <span className="more">+{extra}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`pill ${
                          (b.status || "draft").toLowerCase() === "published" ? "s-published" :
                          (b.status || "draft").toLowerCase() === "archived" ? "s-archived" : "s-draft"
                        }`}>
                          {(b.status || "draft")}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-teal-slim d-inline-flex align-items-center gap-1 btn-nowrap" onClick={() => toggleFeatured(b)}>
                          <FiStar /> {b.featured ? "Yes" : "No"}
                        </button>
                      </td>
                      <td>
                        <div className="actions">
                          <span className="action-btn action-view" onClick={() => openView(b)} title="View"><FiEye /></span>
                          <span className="action-btn action-edit" onClick={() => openEdit(b)} title="Edit"><FiEdit2 /></span>
                          <span className="action-btn action-del" onClick={() => onDelete(b)} title="Delete" style={{ opacity: deleting ? 0.6 : 1, pointerEvents: deleting ? "none" : "auto" }}><FiTrash2 /></span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filteredBlogs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: "#64748b", padding: 16 }}>No blogs in this view.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {mode !== "list" && (
        <>
          <div className="breadcrumbs">
            <span className="crumb" onClick={backToList}>Blogs</span>
            <FiChevronRight />
            <span className="crumb active">
              {mode === "create" ? "New" : selected?.title || "Blog"}
            </span>
          </div>

          {error && (
            <div className="card" style={{ borderColor: "#fecaca", marginBottom: 12 }}>
              <div style={{ padding: 12, color: "#b91c1c" }}>Error: {error}</div>
            </div>
          )}

          {mode === "view" && selected && (
            <div className="page">
              <div className="grid-2">
                <div>
                  <div className="label">Title</div>
                  <div style={{ fontWeight: 800, marginBottom: 12 }}>{selected.title || "—"}</div>
                </div>
                <div>
                  <div className="label">Status</div>
                  <div>{selected.status || "draft"}</div>
                </div>
                <div>
                  <div className="label">Category</div>
                  <div>{selected.category || "—"}</div>
                </div>
                <div>
                  <div className="label">Date</div>
                  <div>{selected.date || "—"}</div>
                </div>
                <div>
                  <div className="label">Featured</div>
                  <div>{selected.featured ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="label">Author</div>
                  <div>{selected.author?.name || "—"}</div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="label">Excerpt</div>
                <div>{selected.excerpt || "—"}</div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="label">Tags</div>
                <div className="tagsline">
                  {(selected.tags || []).map((t) => <span key={t} className="btag">{t}</span>)}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="label">Image</div>
                {selected.image ? (
                  <img src={selected.image} alt="" style={{ width: 240, height: 150, objectFit: "cover", borderRadius: 6, border: `1px solid ${LINE}` }} />
                ) : "—"}
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="label">Content</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{selected.content?.body || "—"}</div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                <button className="btn btn-outline-teal-slim btn-nowrap" onClick={() => toggleFeatured(selected)}>
                  <FiStar style={{ marginRight: 6 }} />
                  {selected.featured ? "Unfeature" : "Make Featured"}
                </button>
                <button className="btn btn-teal-slim btn-nowrap" onClick={() => openEdit(selected)}>Edit</button>
                <button className="btn btn-danger btn-nowrap" onClick={() => onDelete(selected)} disabled={deleting} style={{ opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          )}

          {(mode === "edit" || mode === "create") && (
            <div className="page">
              <div className="grid-2">
                <div>
                  <div className="label">Title</div>
                  <input className="form-control" value={edit.title} onChange={(e) => setEdit((s) => ({ ...s, title: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Status</div>
                  <select className="form-select" value={edit.status} onChange={(e) => setEdit((s) => ({ ...s, status: e.target.value }))}>
                    {["draft", "published", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <div className="label">Category</div>
                  <input className="form-control" value={edit.category} onChange={(e) => setEdit((s) => ({ ...s, category: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Date</div>
                  <input type="date" className="form-control" value={edit.date} onChange={(e) => setEdit((s) => ({ ...s, date: e.target.value }))} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28 }}>
                  <input type="checkbox" className="form-check-input" checked={edit.featured} onChange={(e) => setEdit((s) => ({ ...s, featured: e.target.checked }))} />
                  <div className="label" style={{ margin: 0 }}>Featured</div>
                </div>
                <div>
                  <div className="label">Author Name</div>
                  <input className="form-control" value={edit.author_name} onChange={(e) => setEdit((s) => ({ ...s, author_name: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Author Avatar URL</div>
                  <input className="form-control" value={edit.author_avatar} onChange={(e) => setEdit((s) => ({ ...s, author_avatar: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Image URL</div>
                  <input className="form-control" value={edit.image} onChange={(e) => setEdit((s) => ({ ...s, image: e.target.value }))} />
                </div>
                <div>
                  <div className="label">Tags (comma separated)</div>
                  <input className="form-control" value={edit.tagsText} onChange={(e) => setEdit((s) => ({ ...s, tagsText: e.target.value }))} />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="label">Excerpt</div>
                <textarea className="form-control" rows={2} value={edit.excerpt} onChange={(e) => setEdit((s) => ({ ...s, excerpt: e.target.value }))} />
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="label">Content (Markdown)</div>
                <textarea className="form-control" rows={10} value={edit.content_body} onChange={(e) => setEdit((s) => ({ ...s, content_body: e.target.value }))} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <button className="btn btn-outline-teal-slim btn-nowrap" onClick={() => (selected ? setMode("view") : backToList())}>
                  Cancel
                </button>
                <button className="btn btn-teal-slim btn-nowrap" onClick={onSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving…" : mode === "create" ? "Create Blog" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
