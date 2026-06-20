import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

function pageItems(total, current, max = 7) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const side = Math.floor((max - 3) / 2);
  const left = Math.max(2, current - side);
  const right = Math.min(total - 1, current + side);
  const items = [1];
  if (left > 2) items.push("…");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("…");
  items.push(total);
  return items;
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All categories");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/blogs`);
        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const uniq = (arr) => [...new Set(arr)];
  const allCategories = ["All categories", ...uniq(posts.map((p) => p.category))];
  const allTags = uniq(posts.flatMap((p) => p.tags || [])).sort();

  const toggleTag = (t) =>
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const filtered = useMemo(() => {
    let arr = [...posts];
    if (q.trim()) {
      const needle = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          (p.tags || []).join(" ").toLowerCase().includes(needle)
      );
    }
    if (cat !== "All categories") arr = arr.filter((p) => p.category === cat);
    if (selectedTags.length) {
      arr = arr.filter((p) => selectedTags.every((t) => (p.tags || []).includes(t)));
    }
    if (sort === "latest") arr.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") arr.sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "popular") arr.sort((a, b) => (b.readMin || 0) - (a.readMin || 0));
    return arr;
  }, [posts, q, cat, selectedTags, sort]);

  const featured = useMemo(
    () => (page === 1 ? filtered.find((p) => p.featured) || filtered[0] : null),
    [filtered, page]
  );

  const source =
    page === 1 && featured ? filtered.filter((p) => p.id !== featured.id) : filtered;

  const pageCount = Math.max(1, Math.ceil(source.length / perPage));
  const start = (page - 1) * perPage;
  const current = source.slice(start, start + perPage);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          Resources &amp; Updates
        </h1>
        <p className="text-muted m-0">
          Stay informed with the latest insights, tips, and updates on web accessibility and SEO.
        </p>
      </div>

      <div className="row g-4">
        <aside className="col-12 col-lg-3">
          <div className="filter-card shadow-sm">
            <div className="mb-3">
              <label className="form-label small">Search resources</label>
              <input
                className="form-control"
                placeholder="Search articles…"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Category</label>
              <select
                className="form-select"
                value={cat}
                onChange={(e) => {
                  setPage(1);
                  setCat(e.target.value);
                }}
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small">Tags</label>
              <div className="d-flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`chip ${selectedTags.includes(t) ? "active" : ""}`}
                    onClick={() => {
                      setPage(1);
                      toggleTag(t);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label small">Sort by</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most read</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="col-12 col-lg-9">
          {loading && (
            <div className="text-center text-muted py-5">Loading blogs…</div>
          )}

          {!loading && featured && (
            <article className="bcard feature shadow-sm mb-3">
              <div className="row g-0 align-items-stretch">
                <div className="col-12 col-md-6">
                  <div className="bimg bimg-feature">
                    <img src={featured.image} alt={featured.title} />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 p-md-4 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle">
                        Featured
                      </span>
                      <span className="badge bg-light text-dark border">{featured.category}</span>
                    </div>
                    <h2 className="h4 fw-bold">{featured.title}</h2>
                    <p className="text-muted mb-2">{featured.excerpt}</p>
                    <ul className="feature-bullets text-start ps-3">
                      <li>Actionable checklists and code snippets</li>
                      <li>Common pitfalls and how to avoid them</li>
                      <li>Tools to automate and verify compliance</li>
                    </ul>
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                      <div className="meta d-flex align-items-center gap-2 small text-muted">
                        <img className="avatar" src={featured.author.avatar} alt={featured.author.name} />
                        <span>{featured.author.name}</span>
                        <span>•</span>
                        <time>{new Date(featured.date).toLocaleDateString()}</time>
                        <span>•</span>
                        <span>{featured.readMin} min read</span>
                      </div>
                      <NavLink to={`/blog-details/${featured.id}`} className="btn btn-outline-teal-slim">
                        Read the guide
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="row g-3 g-md-4">
            {current.map((p) => (
              <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                <article className="bcard shadow-sm h-100 d-flex flex-column">
                  <div className="bimg bimg-thumb">
                    <img src={p.image} alt={p.title} />
                  </div>
                  <div className="p-3 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-light text-dark border">{p.category}</span>
                      {(p.tags || []).slice(0, 2).map((t) => (
                        <span key={t} className="btag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="h6 fw-bold m-0">{p.title}</h3>
                    <p className="text-muted small mt-1 mb-2">{p.excerpt}</p>
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                      <div className="meta d-flex align-items-center gap-2 small text-muted">
                        <img className="avatar" src={p.author.avatar} alt={p.author.name} />
                        <span>{p.author.name}</span>
                        <span>•</span>
                        <span>{p.readMin} min</span>
                      </div>
                      <NavLink to={`/blog-details/${p.id}`} className="link-teal small text-decoration-none">
                        Read →
                      </NavLink>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {!loading && source.length === 0 && (
            <div className="text-center text-muted py-5">No posts match your filters.</div>
          )}

          {pageCount > 1 && (
            <nav className="mt-4 d-flex justify-content-end" aria-label="Blog pagination">
              <ul className="pagination pagination-md m-0 blog-pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    « Prev
                  </button>
                </li>
                {pageItems(pageCount, page, 7).map((it, idx) =>
                  it === "…" ? (
                    <li key={`e${idx}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={it} className={`page-item ${page === it ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(it)}>
                        {it}
                      </button>
                    </li>
                  )
                )}
                <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                    Next »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
