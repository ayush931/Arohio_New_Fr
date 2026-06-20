// src/pages/Home.jsx
import { NavLink } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import HeroSection from "../components/Home/HeroSection";
import StepsSection from "../components/Home/StepsSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import TrustedBySection from "../components/Home/TrustedBySection";

const HOME_URL = `${import.meta.env.VITE_API_BASE}/home/`;

console.log("ENV BASE:", import.meta.env.VITE_API_BASE);


const isExternal = (href = "") => /^https?:\/\//i.test(href);
const classForVariant = (v = "primary") =>
  v === "outline" ? "btn btn-outline-teal-slim btn-lg" : "btn btn-teal-slim btn-lg";

function safeContent(server) {
  const c = server?.content || {};
  const hero = {
    title: c.hero?.title ?? "Turn PDFs into Accessible Alt Text with AI.",
    subtitle:
      c.hero?.subtitle ??
      "Generate fast, accurate, WCAG-compliant captions for every image in your documents. Arohio extracts figures, charts, and tables, then writes clear, context-aware alt text you can review and export.",
    image: {
      url:
        c.hero?.image?.url ??
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
      alt: c.hero?.image?.alt ?? "Illustration of PDF document being processed",
    },
    points: Array.isArray(c.hero?.points)
      ? c.hero.points
      : [
        "Extracts figures, charts & tables automatically",
        "Human-editable captions with quality checks",
        "Supports image→text, image→PDF, and PDF→Excel",
      ],
    ctas: Array.isArray(c.hero?.ctas)
      ? c.hero.ctas.map((x) => ({
        label: x?.label ?? "",
        href: x?.href ?? x?.to ?? "#",
        variant: x?.variant ?? x?.style ?? "primary",
      }))
      : [
        { label: "Get Started", href: "/signup", variant: "primary" },
        { label: "Try Free Credits", href: "/signup", variant: "outline" },
      ],
  };
  const steps = {
    title: c.steps?.title ?? "From PDF to Alt Text in 3 Steps",
    items: Array.isArray(c.steps?.items)
      ? c.steps.items.map((s) => ({
        icon: s?.icon ?? "upload",
        title: s?.title ?? "",
        desc: s?.desc ?? s?.description ?? "",
      }))
      : [],
  };
  const features = {
    title: c.features?.title ?? "Key Features",
    subtitle:
      c.features?.subtitle ??
      "Everything you need to turn complex PDFs into accessible, WCAG-ready documents.",
    cards: Array.isArray(c.features?.cards)
      ? c.features.cards.map((f) => ({
        badge: f?.badge ?? "Core",
        icon: f?.icon ?? "shield",
        title: f?.title ?? "",
        desc: f?.desc ?? f?.description ?? "",
        bullets: Array.isArray(f?.bullets) ? f.bullets : [],
        href: f?.href ?? f?.learn_more_to ?? "#",
      }))
      : [],
  };
  const testimonials = {
    title: c.testimonials?.title ?? "Loved by Accessibility Experts",
    per_page_desktop:
      typeof c.testimonials?.per_page_desktop === "number" && c.testimonials.per_page_desktop > 0
        ? c.testimonials.per_page_desktop
        : 3,
    items: Array.isArray(c.testimonials?.items) ? c.testimonials.items : [],
  };
  const trusted_by = {
    title: c.trusted_by?.title ?? "TRUSTED BY",
    avatars: Array.isArray(c.trusted_by?.avatars)
      ? c.trusted_by.avatars
      : [
        "https://i.pravatar.cc/96?img=5",
        "https://i.pravatar.cc/96?img=12",
        "https://i.pravatar.cc/96?img=23",
        "https://i.pravatar.cc/96?img=34",
        "https://i.pravatar.cc/96?img=45",
        "https://i.pravatar.cc/96?img=52",
        "https://i.pravatar.cc/96?img=61",
        "https://i.pravatar.cc/96?img=11",
        "https://i.pravatar.cc/96?img=19",
        "https://i.pravatar.cc/96?img=27",
      ],
  };
  return { hero, steps, features, testimonials, trusted_by, theme: c.theme || { brand_teal: "#21c7b8" } };
}

function TestimonialsCarousel({ testimonials, perPage = 3 }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil((testimonials?.length || 0) / Math.max(1, perPage)));
  const visible = useMemo(() => {
    const list = testimonials || [];
    const n = Math.max(1, perPage);
    if (list.length === 0) return [];
    const start = (page * n) % list.length;
    const slice1 = list.slice(start, start + n);
    const slice2 = start + n > list.length ? list.slice(0, start + n - list.length) : [];
    return [...slice1, ...slice2];
  }, [testimonials, page, perPage]);
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <>
      <div className="row g-3 g-md-4 mt-2">
        {visible.map((t, idx) => (
          <div className="col-12 col-md-4" key={`${t?.name || "t"}-${idx}`}>
            <div className="tcard shadow-sm h-100">
              <div className="d-flex align-items-center gap-2">
                {t?.avatar ? <img src={t.avatar} className="avatar" alt={t?.name || "avatar"} /> : null}
                <div>
                  <div className="fw-semibold">{t?.name || ""}</div>
                  <div className="text-muted small">{t?.role || ""}</div>
                </div>
              </div>
              {t?.quote ? <p className="mt-3">“{t.quote}”</p> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end mt-3 gap-2">
        <button type="button" className="ts-arrow" onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)} aria-label="Previous testimonials">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M15.5 19 8.5 12l7-7 1.4 1.4L11.3 12l5.6 5.6z" />
          </svg>
        </button>
        <button type="button" className="ts-arrow" onClick={() => setPage((p) => (p + 1) % totalPages)} aria-label="Next testimonials">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M8.5 5 15.5 12l-7 7-1.4-1.4L12.7 12 7.1 6.4z" />
          </svg>
        </button>
      </div>
    </>
  );
}

function Icon({ name, size = 22 }) {
  const c = "currentColor";
  switch (name) {
    case "upload":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M19 14v5H5v-5H3v7h18v-7z" /><path fill={c} d="M7 9l1.4 1.4 2.6-2.6V17h2V7.8l2.6 2.6L17 9l-5-5z" /></svg>);
    case "cog":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="m19.14 12.94.02-.94-.02-.94 2.03-1.58-1.92-3.32-2.39.96a6.9 6.9 0 0 0-1.63-.94L14.89 3h-5.8l-.34 2.18a6.9 6.9 0 0 0-1.63.94l-2.39-.96L2.8 7.48l2.03 1.58-.02.94.02.94L2.8 14.52l1.92 3.32 2.39-.96c.5.4 1.05.71 1.63.94L9.09 21h5.8l.34-2.18c.58-.23 1.13-.54 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" /></svg>);
    case "wand":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M2 20.59 20.59 2 22 3.41 3.41 22zM14 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM3 9l.67 2 2 .67-2 .67L3 15l-.67-2-2-.67 2-.67z" /></svg>);
    case "shield":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5z" /></svg>);
    case "check":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="m9 16.17-3.88-3.88L3.7 13.7 9 19l12-12-1.41-1.41z" /></svg>);
    case "doc":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8z" /><path fill={c} d="M14 2v6h6" /></svg>);
    case "ocr":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M5 3H3v4h2V5h2V3H5zm12 0v2h2v2h2V3h-4zM3 17v4h4v-2H5v-2H3zm18 2h-2v2h4v-4h-2z" /><circle cx="12" cy="12" r="3" fill={c} /></svg>);
    case "pdf":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6z" /><path fill={c} d="M15 2v5h5" /></svg>);
    case "excel":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M4 4h12l4 4v12H4z" /><path fill={c} d="m9.5 16-2-4 2-4h2l-2 4 2 4zM14 8h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z" /></svg>);
    case "tune":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M3 6h6v2H3zM3 16h6v2H3zM11 4h2v6h-2zM11 14h2v6h-2zM15 10h6v2h-6zM15 20h6v2h-6z" /></svg>);
    case "stack":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="m12 2 10 5-10 5L2 7zM2 11l10 5 10-5v6l-10 5L2 17z" /></svg>);
    default:
      return null;
  }
}
export default function Home() {
  const [data, setData] = useState(null);
  const [warn, setWarn] = useState("");

  useEffect(() => {
    let mounted = true;
    console.log("[Home] fetching:", HOME_URL);
    (async () => {
      try {
        const res = await fetch(HOME_URL, { headers: { Accept: "application/json" } });
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          throw new Error(`[Home] ${res.status} ${res.statusText} | content-type=${ct} | url=${res.url} | body=${text.slice(0, 160)}`);
        }
        const json = await res.json();
        if (mounted) setData(safeContent(json));
        console.log("[Home] loaded OK");
      } catch (e) {
        console.error("[Home] fetch error:", e);
        if (mounted) {
          setWarn("Failed to load content from server. Rendering defaults.");
          setData(safeContent({}));
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hero = data?.hero;
  const steps = data?.steps;
  const features = data?.features;
  const testimonials = data?.testimonials;
  const trusted_by = data?.trusted_by;

  const loading = !data;

  return (
    <div className="home-page">
      {warn ? (
        <div className="container pt-3">
          <div className="alert alert-warning py-2 mb-0">{warn}</div>
        </div>
      ) : null}

      <HeroSection hero={hero} loading={loading} />

      <StepsSection steps={steps} Icon={Icon} loading={loading} />

      <FeaturesSection features={features} Icon={Icon} loading={loading} />

      <TestimonialsSection
        testimonials={testimonials}
        TestimonialsCarousel={TestimonialsCarousel}
        loading={loading}
      />

      <TrustedBySection trusted_by={trusted_by} loading={loading} />
    </div>
  );
}
