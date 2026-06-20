import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbPhoto, TbZoomIn, TbInfoCircle, TbChevronLeft, TbChevronRight } from "react-icons/tb";

export default function DashboardProcessPdf() {
  const THEME = "#21c7b8";
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock PDF pages with real thumbs
  const initial = useMemo(
    () => [
      {
        page: 1,
        images: [
          { id: "1-1", src: "https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=700&q=80", include: true },
          { id: "1-2", src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80", include: true },
          { id: "1-3", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80", include: true },
          { id: "1-4", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&q=80", include: false },
          { id: "1-5", src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80", include: true },
          { id: "1-6", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&q=80", include: true },
          { id: "1-7", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80", include: false },
          { id: "1-8", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80", include: true },
          { id: "1-9", src: "https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=700&q=80", include: false },
        ],
      },
      {
        page: 2,
        images: [
          { id: "2-3", src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=700&q=80", include: true },
          { id: "2-4", src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=700&q=80", include: true },
          { id: "2-5", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80", include: false },
          { id: "2-6", src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80", include: true },
          { id: "2-7", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80", include: true },
          { id: "2-8", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&q=80", include: false },
        ],
      },
      {
        page: 3,
        images: [{ id: "3-1", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80", include: true }],
      },
      {
        page: 4,
        images: [{ id: "4-1", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700&q=80", include: false }],
      },
      {
        page: 5,
        images: [{ id: "5-1", src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80", include: true }],
      },
    ],
    []
  );

  const [pages, setPages] = useState(initial);
  const [activePage, setActivePage] = useState(1);
  const [genState, setGenState] = useState("idle");

  const cur = pages.find((p) => p.page === activePage) || pages[0];
  const totalSelected = pages.reduce((sum, p) => sum + p.images.filter((im) => im.include).length, 0);

  const toggleInclude = (imgId) => {
    setPages((prev) =>
      prev.map((p) =>
        p.page !== activePage ? p : { ...p, images: p.images.map((im) => (im.id === imgId ? { ...im, include: !im.include } : im)) }
      )
    );
  };

  // circle click = select-all toggle for that page
  const toggleAllOnPage = (page) => {
    setPages((prev) =>
      prev.map((p) =>
        p.page !== page
          ? p
          : {
              ...p,
              images: p.images.map((im) => ({ ...im, include: !p.images.every((i) => i.include) })),
            }
      )
    );
  };

  const generateAltText = () => {
    if (totalSelected === 0) return;
    setGenState("running");
    setTimeout(() => {
      setGenState("done");
      navigate(`/dashboard/uploads/${id}/alt-text`);
    }, 1300);
  };

  const discardUnused = () => {
    setPages((prev) => prev.map((p) => ({ ...p, images: p.images.filter((im) => im.include) })));
  };

  // pagination
  const nextPage = () => setActivePage((p) => Math.min(p + 1, pages.length));
  const prevPage = () => setActivePage((p) => Math.max(p - 1, 1));

  return (
    <div className="container py-4 text-start" style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <style>{`
        .title{font-weight:800;color:#0f172a;}
        .subtle{color:#6b7280;}
        .panel{background:#fff;border:1px solid #e8eef5;border-radius:3px;}
        .page-pill{
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 12px;border-radius:2px;border:1px solid #e6edf5;background:#fff;color:#0f172a;
          cursor:pointer;transition:all .15s ease;
        }
        .page-pill:hover{ box-shadow:0 4px 12px rgba(15,23,42,.06); }
        .page-pill.active{border-color:${THEME}; background:#f0fdfa;}
        .circle{
          width:20px;height:20px;border-radius:50%;border:2px solid #94a3b8;
          display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;
        }
        .circle.checked{background:${THEME};border-color:${THEME};}
        .img-card{background:#fff;border:1px solid #e8eef5;border-radius:3px;overflow:hidden;
          box-shadow:0 2px 10px rgba(15,23,42,.05);}
        .thumb{width:100%;height:150px;object-fit:cover;}
        .tile-footer{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;}
        .chip{border-radius:999px;padding:.18rem .55rem;font-size:.72rem;font-weight:700;}
        .chip-info{background:#eaf7ff;border:1px solid #cde8ff;color:#1b61b0;}
        .btn{border-radius:2px;font-weight:700;}
        .btn-teal{background:${THEME};color:#fff;border:none;}
        .btn-outline{background:#fff;border:1px solid #d9e3ee;color:#0f172a;}
        .alert{border-radius:2px;padding:10px 12px;font-size:.9rem;display:flex;align-items:center;gap:8px;
          background:#e7f9f4;border:1px solid #b8e8dd;color:#0b7a65;}
        .pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;}
        .page-btn{
          border:1px solid #cbd5e1;background:#eef2f7;color:#0f172a;
          padding:6px 12px;border-radius:2px;cursor:pointer;font-weight:700;
        }
        .page-btn:hover{filter:brightness(.96);}
        .page-btn[disabled]{opacity:.5;cursor:not-allowed;}
        .page-btn.active{background:${THEME};color:#fff;border-color:${THEME};}
      `}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h1 className="h5 title mb-0">Process Your PDF</h1>
        <Link to="/dashboard/uploads" className="text-decoration-none" style={{ color: THEME, fontWeight: 700 }}>
          <TbChevronLeft size={18} /> Back to Uploads
        </Link>
      </div>
      <div className="subtle mb-3">Review extracted images and choose which ones need AI-generated alt text.</div>

      <div className="row g-4">
        {/* Sidebar pages (always show 5) */}
        <div className="col-12 col-md-3 col-lg-2">
          <div className="panel p-2">
            <div className="subtle small px-2 pt-2 pb-1">PDF Pages</div>
            <div className="d-flex flex-column gap-2 p-2">
              {pages.slice(0, 5).map((p) => {
                const allChecked = p.images.every((im) => im.include);
                return (
                  <div
                    key={p.page}
                    className={`page-pill ${activePage === p.page ? "active" : ""}`}
                    onClick={() => setActivePage(p.page)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`circle ${allChecked ? "checked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAllOnPage(p.page);
                        }}
                        title={allChecked ? "Unselect all on this page" : "Select all on this page"}
                      >
                        {allChecked ? "✓" : ""}
                      </div>
                      <span>Page {p.page}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="col-12 col-md-6 col-lg-7">
          {/* ONE top message */}
          <div className="alert mb-3">
            <TbInfoCircle size={18} />
            {totalSelected} image{totalSelected !== 1 ? "s" : ""} selected for alt-text generation.
          </div>

          {/* Top Controls */}
          <div className="d-flex flex-wrap align-items-center mb-3">
            <div className="subtle small">
              {(cur?.images || []).filter((i) => i.include).length} selected on Page {activePage}
            </div>
            <div className="ms-auto d-flex gap-2">
              <button className="btn btn-teal" onClick={generateAltText} disabled={genState === "running" || totalSelected === 0}>
                {genState === "running" ? "Generating…" : "Generate Alt Text"}
              </button>
              <button className="btn btn-outline" onClick={discardUnused}>
                Discard Unused
              </button>
            </div>
          </div>

          {/* Image tiles */}
          <div className="row g-3">
            {(cur?.images || []).map((im, idx) => (
              <div className="col-6 col-sm-4" key={im.id}>
                <div className="img-card">
                  <img className="thumb" src={im.src} alt="" />
                  <div className="tile-footer">
                    <label className="d-flex align-items-center gap-1 m-0">
                      <input type="checkbox" checked={im.include} onChange={() => toggleInclude(im.id)} />
                      <span className="subtle">Include</span>
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <span className="chip chip-info">P{activePage}.{idx + 1}</span>
                      <button className="btn btn-outline" title="Zoom" onClick={() => window.open(im.src, "_blank")}>
                        <TbZoomIn size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination with higher contrast */}
          <div className="pagination">
            <button className="page-btn" onClick={prevPage} disabled={activePage === 1}>
              <TbChevronLeft />
            </button>
            {pages.slice(0, 5).map((p) => (
              <button
                key={p.page}
                className={`page-btn ${activePage === p.page ? "active" : ""}`}
                onClick={() => setActivePage(p.page)}
              >
                {p.page}
              </button>
            ))}
            <button className="page-btn" onClick={nextPage} disabled={activePage === pages.length}>
              <TbChevronRight />
            </button>
          </div>
        </div>

        {/* Right tips */}
        <div className="col-12 col-md-3">
          <div className="panel p-3 p-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <TbPhoto size={20} />
              <div className="tips-title" style={{ color: "#0f172a", fontWeight: 700 }}>
                Tips for Best Results
              </div>
            </div>
            <ul className="subtle mb-3">
              <li>Only include figures (avoid decorative images).</li>
              <li>Avoid logos for alt text generation.</li>
              <li>Use high-resolution images.</li>
              <li>Multiple languages supported.</li>
            </ul>
            <Link to="#" className="text-decoration-none" style={{ color: THEME, fontWeight: 700 }}>
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
