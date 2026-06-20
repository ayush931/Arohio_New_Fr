import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------- tiny helpers -------------------- */
const API_BASE = `${import.meta.env.VITE_API_BASE}/home`;

const Row = ({ children }) => <div className="row g-3">{children}</div>;
const Col = ({ children, md = 6 }) => <div className={`col-12 col-md-${md}`}>{children}</div>;
const Label = ({ children }) => <label className="form-label fw-semibold">{children}</label>;

const Field = ({ label, ...props }) => (
  <div className="mb-3">
    <Label>{label}</Label>
    <input className="form-control" {...props} />
  </div>
);

const TextArea = ({ label, rows = 4, ...props }) => (
  <div className="mb-3">
    <Label>{label}</Label>
    <textarea className="form-control" rows={rows} {...props} />
  </div>
);

function UpDown({ onUp, onDown, disabledUp, disabledDown }) {
  return (
    <div className="btn-group">
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onUp} disabled={disabledUp}>↑</button>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onDown} disabled={disabledDown}>↓</button>
    </div>
  );
}

function SectionHeader({ title, actions }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="fw-bold mb-0">{title}</h5>
      <div className="d-flex gap-2">{actions}</div>
    </div>
  );
}

/* shared toasts */
const ok = (m) => toast.success(m, { autoClose: 2000 });
const err = (m) => toast.error(m, { autoClose: 3000 });

/* -------------------- server<->ui bridges -------------------- */
function serverToLocal(serverJson) {
  const meta = serverJson?.meta || {};
  const c = serverJson?.content || {};

  const heroCtas =
    (c.hero?.ctas || []).map((x) => ({
      label: x.label ?? "",
      to: x.href ?? x.to ?? "",
      style: x.variant ?? x.style ?? "primary",
    })) || [];

  const stepsItems =
    (c.steps?.items || []).map((s) => ({
      icon: s.icon ?? "upload",
      title: s.title ?? "",
      description: s.desc ?? s.description ?? "",
    })) || [];

  const featureCards =
    (c.features?.cards || []).map((f) => ({
      badge: f.badge ?? "Core",
      icon: f.icon ?? "shield",
      title: f.title ?? "",
      description: f.desc ?? f.description ?? "",
      bullets: Array.isArray(f.bullets) ? f.bullets : [],
      learn_more_to: f.href ?? f.learn_more_to ?? "#",
    })) || [];

  return {
    meta: {
      version: 1,
      locale: "en",
      page: "home",
      updated_at: "",
      ...meta,
    },
    theme: {
      brand_teal: "#21c7b8",
      ...(c.theme || {}),
    },
    hero: {
      title: c.hero?.title ?? "",
      subtitle: c.hero?.subtitle ?? "",
      image: {
        url: c.hero?.image?.url ?? "",
        alt: c.hero?.image?.alt ?? "",
      },
      points: Array.isArray(c.hero?.points) ? c.hero.points : [],
      ctas: heroCtas,
    },
    steps: {
      title: c.steps?.title ?? "",
      items: stepsItems,
    },
    features: {
      title: c.features?.title ?? "",
      subtitle: c.features?.subtitle ?? "",
      cards: featureCards,
    },
    testimonials: {
      title: c.testimonials?.title ?? "",
      per_page_desktop: typeof c.testimonials?.per_page_desktop === "number" ? c.testimonials.per_page_desktop : 3,
      items: Array.isArray(c.testimonials?.items) ? c.testimonials.items : [],
    },
    trusted_by: {
      title: c.trusted_by?.title ?? "TRUSTED BY",
      avatars: Array.isArray(c.trusted_by?.avatars) ? c.trusted_by.avatars : [],
    },
  };
}

function localToServer(local) {
  const ctas = (local.hero?.ctas || []).map((x) => ({
    label: x.label ?? "",
    href: x.to ?? "",
    variant: x.style ?? "primary",
  }));

  const stepsItems = (local.steps?.items || []).map((s) => ({
    icon: s.icon ?? "upload",
    title: s.title ?? "",
    desc: s.description ?? "",
  }));

  const featureCards = (local.features?.cards || []).map((f) => ({
    badge: f.badge ?? "Core",
    icon: f.icon ?? "shield",
    title: f.title ?? "",
    desc: f.description ?? "",
    bullets: Array.isArray(f.bullets) ? f.bullets : [],
    href: f.learn_more_to ?? "#",
  }));

  const content = {
    theme: { brand_teal: local.theme?.brand_teal ?? "#21c7b8" },
    hero: {
      title: local.hero?.title ?? "",
      subtitle: local.hero?.subtitle ?? "",
      image: {
        url: local.hero?.image?.url ?? "",
        alt: local.hero?.image?.alt ?? "",
      },
      points: Array.isArray(local.hero?.points) ? local.hero.points : [],
      ctas,
    },
    steps: {
      title: local.steps?.title ?? "",
      items: stepsItems,
    },
    features: {
      title: local.features?.title ?? "",
      subtitle: local.features?.subtitle ?? "",
      cards: featureCards,
    },
    testimonials: {
      title: local.testimonials?.title ?? "",
      per_page_desktop:
        typeof local.testimonials?.per_page_desktop === "number"
          ? local.testimonials.per_page_desktop
          : 3,
      items: Array.isArray(local.testimonials?.items) ? local.testimonials.items : [],
    },
    trusted_by: {
      title: local.trusted_by?.title ?? "TRUSTED BY",
      avatars: Array.isArray(local.trusted_by?.avatars) ? local.trusted_by.avatars : [],
    },
  };

  const meta = {
    ...(local.meta || {}),
    page: "home",
    version: 1,
    updated_at: new Date().toISOString(),
  };

  return { meta, content };
}

/* -------------------- main component -------------------- */
export default function AdminHomeManagement() {
  const [loading, setLoading] = useState(true);
  const [home, setHome] = useState(null);
  const [tab, setTab] = useState("hero"); // hero | steps | features | testimonials | trusted_by | theme | raw
  const [saving, setSaving] = useState(false);

  // per-section dirty flags
  const [dirty, setDirty] = useState({
    hero: false,
    steps: false,
    features: false,
    testimonials: false,
    trusted_by: false,
    theme: false,
  });

  // load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_BASE, { headers: { "Content-Type": "application/json" } });
        if (!res.ok) throw new Error(`GET /home failed (${res.status})`);
        const serverData = await res.json();
        const uiData = serverToLocal(serverData);
        setHome(uiData);
        ok("Home data loaded");
      } catch (e) {
        console.error(e);
        err("Failed to load home.json");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // generic PUT (saves whole content so other sections aren’t lost)
  const saveAllToServer = async (uiState) => {
    const payload = localToServer(uiState);
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `PUT /home failed (${res.status})`);
    }
    const savedServer = await res.json();
    return serverToLocal(savedServer);
  };

  // section save wrappers
  const saveSection = async (sectionKey) => {
    if (!home) return;
    setSaving(true);
    try {
      const updated = await saveAllToServer(home);
      setHome(updated);
      setDirty((d) => ({ ...d, [sectionKey]: false }));
      ok(`${labelFor(sectionKey)} saved`);
    } catch (e) {
      console.error(e);
      err("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const labelFor = (key) =>
    ({ hero: "Hero", steps: "Steps", features: "Features", testimonials: "Testimonials", trusted_by: "Trusted By", theme: "Theme" }[key] ||
      key);

  const onSaveAll = async () => {
    if (!home) return;
    setSaving(true);
    try {
      const updated = await saveAllToServer(home);
      setHome(updated);
      setDirty({ hero: false, steps: false, features: false, testimonials: false, trusted_by: false, theme: false });
      ok("All changes saved");
    } catch (e) {
      console.error(e);
      err("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = useMemo(
    () => [
      { key: "hero", label: "Hero" },
      { key: "steps", label: "Steps" },
      { key: "features", label: "Features" },
      { key: "testimonials", label: "Testimonials" },
      { key: "trusted_by", label: "Trusted By" },
      { key: "theme", label: "Theme" },
      { key: "raw", label: "Raw JSON" },
    ],
    []
  );

  if (loading) return <div className="container py-4">Loading…</div>;
  if (!home) return <div className="container py-4">No data.</div>;

  /* ---------- local mutators (no “added” toasts) ---------- */
  const markDirty = (key) => setDirty((d) => ({ ...d, [key]: true }));

  const moveInArray = (arr, i, dir) => {
    const next = [...arr];
    const j = i + dir;
    if (j < 0 || j >= next.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  // Hero
  const addHeroPoint = () => {
    setHome((h) => {
      const pts = [...(h.hero.points || []), ""];
      return { ...h, hero: { ...h.hero, points: pts } };
    });
    markDirty("hero");
  };
  const deleteHeroPoint = (i) => {
    setHome((h) => {
      const pts = [...(h.hero.points || [])];
      pts.splice(i, 1);
      return { ...h, hero: { ...h.hero, points: pts } };
    });
    markDirty("hero");
  };
  const addCTA = () => {
    setHome((h) => {
      const ctas = [...(h.hero.ctas || []), { label: "", to: "", style: "primary" }];
      return { ...h, hero: { ...h.hero, ctas } };
    });
    markDirty("hero");
  };
  const deleteCTA = (i) => {
    setHome((h) => {
      const ctas = [...(h.hero.ctas || [])];
      ctas.splice(i, 1);
      return { ...h, hero: { ...h.hero, ctas } };
    });
    markDirty("hero");
  };

  // Steps
  const addStep = () => {
    setHome((h) => ({
      ...h,
      steps: { ...h.steps, items: [...(h.steps.items || []), { icon: "upload", title: "", description: "" }] },
    }));
    markDirty("steps");
  };
  const deleteStep = (i) => {
    setHome((h) => {
      const items = [...(h.steps.items || [])];
      items.splice(i, 1);
      return { ...h, steps: { ...h.steps, items } };
    });
    markDirty("steps");
  };

  // Features
  const addFeature = () => {
    setHome((h) => ({
      ...h,
      features: {
        ...h.features,
        cards: [
          ...(h.features.cards || []),
          { badge: "Core", icon: "shield", title: "", description: "", bullets: [], learn_more_to: "#" },
        ],
      },
    }));
    markDirty("features");
  };
  const deleteFeature = (i) => {
    setHome((h) => {
      const cards = [...(h.features.cards || [])];
      cards.splice(i, 1);
      return { ...h, features: { ...h.features, cards } };
    });
    markDirty("features");
  };

  // Testimonials
  const addTestimonial = () => {
    setHome((h) => ({
      ...h,
      testimonials: {
        ...h.testimonials,
        items: [...(h.testimonials.items || []), { quote: "", name: "", role: "", avatar: "" }],
      },
    }));
    markDirty("testimonials");
  };
  const deleteTestimonial = (i) => {
    setHome((h) => {
      const items = [...(h.testimonials.items || [])];
      items.splice(i, 1);
      return { ...h, testimonials: { ...h.testimonials, items } };
    });
    markDirty("testimonials");
  };

  // Trusted by
  const addAvatar = () => {
    setHome((h) => ({
      ...h,
      trusted_by: { ...h.trusted_by, avatars: [...(h.trusted_by.avatars || []), ""] },
    }));
    markDirty("trusted_by");
  };
  const deleteAvatar = (i) => {
    setHome((h) => {
      const avatars = [...(h.trusted_by.avatars || [])];
      avatars.splice(i, 1);
      return { ...h, trusted_by: { ...h.trusted_by, avatars } };
    });
    markDirty("trusted_by");
  };

  return (
    <div className="container py-3 text-start" style={{ maxWidth: 1100 }}>
      <ToastContainer position="top-right" newestOnTop />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h5 fw-bold mb-0">Home Page Management</h1>
          <div className="text-muted small">Edit all sections that render on the public Home page.</div>
        </div>
        <button
          className="btn"
          style={{ backgroundColor: home.theme?.brand_teal || "#21c7b8", color: "#fff" }}
          onClick={onSaveAll}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save All"}
        </button>
      </div>

      {/* tabs */}
      <ul className="nav nav-pills mb-3 flex-wrap">
        {tabs.map((t) => (
          <li className="nav-item" key={t.key}>
            <button
              className={`nav-link ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {dirty[t.key] ? <span className="ms-1 badge bg-warning text-dark">unsaved</span> : null}
            </button>
          </li>
        ))}
      </ul>

      {/* panels */}
      {tab === "hero" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Hero"
            actions={
              <button
                className="btn btn-sm btn-success"
                onClick={() => saveSection("hero")}
                disabled={!dirty.hero || saving}
              >
                {saving && dirty.hero ? "Saving…" : "Save Hero"}
              </button>
            }
          />
          <Row>
            <Col md={6}>
              <Field
                label="Title"
                value={home.hero.title || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, hero: { ...h.hero, title: e.target.value } }));
                  markDirty("hero");
                }}
              />
            </Col>
            <Col md={6}>
              <Field
                label="Hero Image URL"
                value={home.hero.image?.url || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, hero: { ...h.hero, image: { ...(h.hero.image || {}), url: e.target.value } } }));
                  markDirty("hero");
                }}
              />
            </Col>
            <Col md={6}>
              <TextArea
                label="Subtitle"
                rows={5}
                value={home.hero.subtitle || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, hero: { ...h.hero, subtitle: e.target.value } }));
                  markDirty("hero");
                }}
              />
            </Col>
            <Col md={6}>
              <Field
                label="Hero Image Alt"
                value={home.hero.image?.alt || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, hero: { ...h.hero, image: { ...(h.hero.image || {}), alt: e.target.value } } }));
                  markDirty("hero");
                }}
              />
              <div className="mt-2">
                {home.hero.image?.url ? (
                  <img
                    src={home.hero.image.url}
                    alt={home.hero.image.alt || "Hero"}
                    className="img-fluid rounded border"
                  />
                ) : (
                  <div className="text-muted small">No image preview</div>
                )}
              </div>
            </Col>
          </Row>

          {/* Points */}
          <div className="border rounded p-3 mt-2">
            <SectionHeader
              title="Hero Points"
              actions={<button className="btn btn-sm btn-outline-secondary" onClick={addHeroPoint}>+ Add Point</button>}
            />
            {(home.hero.points || []).map((p, i) => (
              <div key={i} className="d-flex gap-2 align-items-center mb-2">
                <input
                  className="form-control"
                  value={p}
                  onChange={(e) =>
                    setHome((h) => {
                      const pts = [...(h.hero.points || [])];
                      pts[i] = e.target.value;
                      markDirty("hero");
                      return { ...h, hero: { ...h.hero, points: pts } };
                    })
                  }
                />
                <UpDown
                  onUp={() =>
                    setHome((h) => {
                      const pts = moveInArray(h.hero.points || [], i, -1);
                      markDirty("hero");
                      return { ...h, hero: { ...h.hero, points: pts } };
                    })
                  }
                  onDown={() =>
                    setHome((h) => {
                      const pts = moveInArray(h.hero.points || [], i, +1);
                      markDirty("hero");
                      return { ...h, hero: { ...h.hero, points: pts } };
                    })
                  }
                  disabledUp={i === 0}
                  disabledDown={i === (home.hero.points || []).length - 1}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteHeroPoint(i)}>Delete</button>
              </div>
            ))}
            {(!home.hero.points || home.hero.points.length === 0) && (
              <div className="text-muted small">No points yet.</div>
            )}
          </div>

          {/* CTAs */}
          <div className="border rounded p-3 mt-3">
            <SectionHeader
              title="CTAs"
              actions={<button className="btn btn-sm btn-outline-secondary" onClick={addCTA}>+ Add CTA</button>}
            />
            {(home.hero.ctas || []).map((c, i) => (
              <div key={i} className="row g-2 align-items-end mb-2">
                <div className="col-12 col-md-4">
                  <Field
                    label="Label"
                    value={c.label || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const ctas = [...(h.hero.ctas || [])];
                        ctas[i] = { ...ctas[i], label: e.target.value };
                        markDirty("hero");
                        return { ...h, hero: { ...h.hero, ctas } };
                      })
                    }
                  />
                </div>
                <div className="col-12 col-md-5">
                  <Field
                    label="Link (to)"
                    value={c.to || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const ctas = [...(h.hero.ctas || [])];
                        ctas[i] = { ...ctas[i], to: e.target.value };
                        markDirty("hero");
                        return { ...h, hero: { ...h.hero, ctas } };
                      })
                    }
                  />
                </div>
                <div className="col-8 col-md-2">
                  <div className="mb-3">
                    <Label>Style</Label>
                    <select
                      className="form-select"
                      value={c.style || "primary"}
                      onChange={(e) =>
                        setHome((h) => {
                          const ctas = [...(h.hero.ctas || [])];
                          ctas[i] = { ...ctas[i], style: e.target.value };
                          markDirty("hero");
                          return { ...h, hero: { ...h.hero, ctas } };
                        })
                      }
                    >
                      <option value="primary">primary</option>
                      <option value="outline">outline</option>
                    </select>
                  </div>
                </div>
                <div className="col-4 col-md-1">
                  <div className="d-flex gap-1">
                    <UpDown
                      onUp={() =>
                        setHome((h) => {
                          const ctas = moveInArray(h.hero.ctas || [], i, -1);
                          markDirty("hero");
                          return { ...h, hero: { ...h.hero, ctas } };
                        })
                      }
                      onDown={() =>
                        setHome((h) => {
                          const ctas = moveInArray(h.hero.ctas || [], i, +1);
                          markDirty("hero");
                          return { ...h, hero: { ...h.hero, ctas } };
                        })
                      }
                      disabledUp={i === 0}
                      disabledDown={i === ((home.hero.ctas || []).length - 1)}
                    />
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCTA(i)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
            {(!home.hero.ctas || home.hero.ctas.length === 0) && (
              <div className="text-muted small">No CTAs yet.</div>
            )}
          </div>
        </div>
      )}

      {tab === "steps" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Steps"
            actions={
              <>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={addStep}>+ Add Step</button>
                <button className="btn btn-sm btn-success" onClick={() => saveSection("steps")} disabled={!dirty.steps || saving}>
                  {saving && dirty.steps ? "Saving…" : "Save Steps"}
                </button>
              </>
            }
          />
          <Field
            label="Section Title"
            value={home.steps.title || ""}
            onChange={(e) => {
              setHome((h) => ({ ...h, steps: { ...h.steps, title: e.target.value } }));
              markDirty("steps");
            }}
          />
          {(home.steps.items || []).map((s, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <Row>
                <Col md={3}>
                  <div className="mb-3">
                    <Label>Icon</Label>
                    <select
                      className="form-select"
                      value={s.icon || "upload"}
                      onChange={(e) =>
                        setHome((h) => {
                          const items = [...(h.steps.items || [])];
                          items[i] = { ...items[i], icon: e.target.value };
                          markDirty("steps");
                          return { ...h, steps: { ...h.steps, items } };
                        })
                      }
                    >
                      {["upload", "cog", "wand", "shield", "check", "doc", "ocr", "pdf", "excel", "tune", "stack"].map(
                        (opt) => (
                          <option value={opt} key={opt}>{opt}</option>
                        )
                      )}
                    </select>
                  </div>
                </Col>
                <Col md={4}>
                  <Field
                    label="Title"
                    value={s.title || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.steps.items || [])];
                        items[i] = { ...items[i], title: e.target.value };
                        markDirty("steps");
                        return { ...h, steps: { ...h.steps, items } };
                      })
                    }
                  />
                </Col>
                <Col md={5}>
                  <TextArea
                    label="Description"
                    rows={3}
                    value={s.description || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.steps.items || [])];
                        items[i] = { ...items[i], description: e.target.value };
                        markDirty("steps");
                        return { ...h, steps: { ...h.steps, items } };
                      })
                    }
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                <UpDown
                  onUp={() =>
                    setHome((h) => {
                      const items = moveInArray(h.steps.items || [], i, -1);
                      markDirty("steps");
                      return { ...h, steps: { ...h.steps, items } };
                    })
                  }
                  onDown={() =>
                    setHome((h) => {
                      const items = moveInArray(h.steps.items || [], i, +1);
                      markDirty("steps");
                      return { ...h, steps: { ...h.steps, items } };
                    })
                  }
                  disabledUp={i === 0}
                  disabledDown={i === (home.steps.items || []).length - 1}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteStep(i)}>Delete Step</button>
              </div>
            </div>
          ))}
          {(!home.steps.items || home.steps.items.length === 0) && (
            <div className="text-muted small">No steps yet.</div>
          )}
        </div>
      )}

      {tab === "features" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Features"
            actions={
              <>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={addFeature}>+ Add Feature</button>
                <button className="btn btn-sm btn-success" onClick={() => saveSection("features")} disabled={!dirty.features || saving}>
                  {saving && dirty.features ? "Saving…" : "Save Features"}
                </button>
              </>
            }
          />
          <Row>
            <Col md={6}>
              <Field
                label="Section Title"
                value={home.features.title || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, features: { ...h.features, title: e.target.value } }));
                  markDirty("features");
                }}
              />
            </Col>
            <Col md={6}>
              <Field
                label="Section Subtitle"
                value={home.features.subtitle || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, features: { ...h.features, subtitle: e.target.value } }));
                  markDirty("features");
                }}
              />
            </Col>
          </Row>

          {(home.features.cards || []).map((f, i) => (
            <div key={i} className="border rounded p-2 mb-3">
              <Row>
                <Col md={3}>
                  <div className="mb-3">
                    <Label>Badge</Label>
                    <select
                      className="form-select"
                      value={f.badge || "Core"}
                      onChange={(e) =>
                        setHome((h) => {
                          const cards = [...(h.features.cards || [])];
                          cards[i] = { ...cards[i], badge: e.target.value };
                          markDirty("features");
                          return { ...h, features: { ...h.features, cards } };
                        })
                      }
                    >
                      <option value="Core">Core</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <Label>Icon</Label>
                    <select
                      className="form-select"
                      value={f.icon || "shield"}
                      onChange={(e) =>
                        setHome((h) => {
                          const cards = [...(h.features.cards || [])];
                          cards[i] = { ...cards[i], icon: e.target.value };
                          markDirty("features");
                          return { ...h, features: { ...h.features, cards } };
                        })
                      }
                    >
                      {["upload", "cog", "wand", "shield", "check", "doc", "ocr", "pdf", "excel", "tune", "stack"].map(
                        (opt) => (
                          <option value={opt} key={opt}>{opt}</option>
                        )
                      )}
                    </select>
                  </div>
                </Col>
                <Col md={6}>
                  <Field
                    label="Title"
                    value={f.title || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const cards = [...(h.features.cards || [])];
                        cards[i] = { ...cards[i], title: e.target.value };
                        markDirty("features");
                        return { ...h, features: { ...h.features, cards } };
                      })
                    }
                  />
                </Col>
                <Col md={12}>
                  <TextArea
                    label="Description"
                    rows={3}
                    value={f.description || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const cards = [...(h.features.cards || [])];
                        cards[i] = { ...cards[i], description: e.target.value };
                        markDirty("features");
                        return { ...h, features: { ...h.features, cards } };
                      })
                    }
                  />
                </Col>
                <Col md={8}>
                  <TextArea
                    label="Bullets (one per line)"
                    rows={3}
                    value={(f.bullets || []).join("\n")}
                    onChange={(e) =>
                      setHome((h) => {
                        const cards = [...(h.features.cards || [])];
                        cards[i] = {
                          ...cards[i],
                          bullets: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean),
                        };
                        markDirty("features");
                        return { ...h, features: { ...h.features, cards } };
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <Field
                    label="Learn More Link"
                    value={f.learn_more_to || "#"}
                    onChange={(e) =>
                      setHome((h) => {
                        const cards = [...(h.features.cards || [])];
                        cards[i] = { ...cards[i], learn_more_to: e.target.value };
                        markDirty("features");
                        return { ...h, features: { ...h.features, cards } };
                      })
                    }
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-between">
                <UpDown
                  onUp={() =>
                    setHome((h) => {
                      const cards = moveInArray(h.features.cards || [], i, -1);
                      markDirty("features");
                      return { ...h, features: { ...h.features, cards } };
                    })
                  }
                  onDown={() =>
                    setHome((h) => {
                      const cards = moveInArray(h.features.cards || [], i, +1);
                      markDirty("features");
                      return { ...h, features: { ...h.features, cards } };
                    })
                  }
                  disabledUp={i === 0}
                  disabledDown={i === (home.features.cards || []).length - 1}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteFeature(i)}>Delete Feature</button>
              </div>
            </div>
          ))}
          {(!home.features.cards || home.features.cards.length === 0) && (
            <div className="text-muted small">No feature cards yet.</div>
          )}
        </div>
      )}

      {tab === "testimonials" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Testimonials"
            actions={
              <>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={addTestimonial}>+ Add Testimonial</button>
                <button className="btn btn-sm btn-success" onClick={() => saveSection("testimonials")} disabled={!dirty.testimonials || saving}>
                  {saving && dirty.testimonials ? "Saving…" : "Save Testimonials"}
                </button>
              </>
            }
          />
          <Row>
            <Col md={8}>
              <Field
                label="Section Title"
                value={home.testimonials.title || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, testimonials: { ...h.testimonials, title: e.target.value } }));
                  markDirty("testimonials");
                }}
              />
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <Label>Per Page (Desktop)</Label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={home.testimonials.per_page_desktop ?? 3}
                  onChange={(e) =>
                    setHome((h) => ({
                      ...h,
                      testimonials: {
                        ...h.testimonials,
                        per_page_desktop: Math.max(1, Number(e.target.value || 1)),
                      },
                    }))
                  }
                  onBlur={() => markDirty("testimonials")}
                />
              </div>
            </Col>
          </Row>

          {(home.testimonials.items || []).map((t, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <Row>
                <Col md={6}>
                  <TextArea
                    label="Quote"
                    rows={3}
                    value={t.quote || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.testimonials.items || [])];
                        items[i] = { ...items[i], quote: e.target.value };
                        markDirty("testimonials");
                        return { ...h, testimonials: { ...h.testimonials, items } };
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Field
                    label="Name"
                    value={t.name || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.testimonials.items || [])];
                        items[i] = { ...items[i], name: e.target.value };
                        markDirty("testimonials");
                        return { ...h, testimonials: { ...h.testimonials, items } };
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Field
                    label="Role"
                    value={t.role || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.testimonials.items || [])];
                        items[i] = { ...items[i], role: e.target.value };
                        markDirty("testimonials");
                        return { ...h, testimonials: { ...h.testimonials, items } };
                      })
                    }
                  />
                </Col>
                <Col md={9}>
                  <Field
                    label="Avatar URL"
                    value={t.avatar || ""}
                    onChange={(e) =>
                      setHome((h) => {
                        const items = [...(h.testimonials.items || [])];
                        items[i] = { ...items[i], avatar: e.target.value };
                        markDirty("testimonials");
                        return { ...h, testimonials: { ...h.testimonials, items } };
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <Label>Preview</Label>
                    <div className="border rounded p-2 d-flex align-items-center gap-2">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name || "avatar"} width={40} height={40} className="rounded-circle" />
                      ) : (
                        <div className="text-muted small">No image</div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                <UpDown
                  onUp={() =>
                    setHome((h) => {
                      const items = moveInArray(h.testimonials.items || [], i, -1);
                      markDirty("testimonials");
                      return { ...h, testimonials: { ...h.testimonials, items } };
                    })
                  }
                  onDown={() =>
                    setHome((h) => {
                      const items = moveInArray(h.testimonials.items || [], i, +1);
                      markDirty("testimonials");
                      return { ...h, testimonials: { ...h.testimonials, items } };
                    })
                  }
                  disabledUp={i === 0}
                  disabledDown={i === (home.testimonials.items || []).length - 1}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTestimonial(i)}>Delete</button>
              </div>
            </div>
          ))}
          {(!home.testimonials.items || home.testimonials.items.length === 0) && (
            <div className="text-muted small">No testimonials yet.</div>
          )}
        </div>
      )}

      {tab === "trusted_by" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Trusted By"
            actions={
              <>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={addAvatar}>+ Add Avatar</button>
                <button className="btn btn-sm btn-success" onClick={() => saveSection("trusted_by")} disabled={!dirty.trusted_by || saving}>
                  {saving && dirty.trusted_by ? "Saving…" : "Save Trusted By"}
                </button>
              </>
            }
          />
          <Row>
            <Col md={6}>
              <Field
                label="Section Title"
                value={home.trusted_by.title || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, trusted_by: { ...h.trusted_by, title: e.target.value } }));
                  markDirty("trusted_by");
                }}
              />
            </Col>
          </Row>

          {(home.trusted_by.avatars || []).map((src, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-2">
              <input
                className="form-control"
                value={src || ""}
                placeholder="https://…"
                onChange={(e) =>
                  setHome((h) => {
                    const avatars = [...(h.trusted_by.avatars || [])];
                    avatars[i] = e.target.value;
                    markDirty("trusted_by");
                    return { ...h, trusted_by: { ...h.trusted_by, avatars } };
                  })
                }
              />
              <UpDown
                onUp={() =>
                  setHome((h) => {
                    const avatars = moveInArray(h.trusted_by.avatars || [], i, -1);
                    markDirty("trusted_by");
                    return { ...h, trusted_by: { ...h.trusted_by, avatars } };
                  })
                }
                onDown={() =>
                  setHome((h) => {
                    const avatars = moveInArray(h.trusted_by.avatars || [], i, +1);
                    markDirty("trusted_by");
                    return { ...h, trusted_by: { ...h.trusted_by, avatars } };
                  })
                }
                disabledUp={i === 0}
                disabledDown={i === (home.trusted_by.avatars || []).length - 1}
              />
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAvatar(i)}>Delete</button>
            </div>
          ))}
          {(!home.trusted_by.avatars || home.trusted_by.avatars.length === 0) && (
            <div className="text-muted small">No avatars yet.</div>
          )}
        </div>
      )}

      {tab === "theme" && (
        <div className="card shadow-sm p-3">
          <SectionHeader
            title="Theme"
            actions={
              <button className="btn btn-sm btn-success" onClick={() => saveSection("theme")} disabled={!dirty.theme || saving}>
                {saving && dirty.theme ? "Saving…" : "Save Theme"}
              </button>
            }
          />
          <Row>
            <Col md={6}>
              <Field
                label="Brand Teal (hex)"
                value={home.theme?.brand_teal || ""}
                onChange={(e) => {
                  setHome((h) => ({ ...h, theme: { ...(h.theme || {}), brand_teal: e.target.value } }));
                  markDirty("theme");
                }}
              />
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Label>Preview</Label>
                <div
                  className="rounded"
                  style={{
                    height: 40,
                    background: home.theme?.brand_teal || "#21c7b8",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      )}

      {tab === "raw" && (
        <div className="card shadow-sm p-3">
          <SectionHeader title="Raw JSON (advanced)" />
          <TextArea
            rows={24}
            value={JSON.stringify(home, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setHome(parsed);
              } catch {
                // allow typing invalid JSON temporarily
              }
            }}
          />
          <div className="text-muted small">
            Tip: You can paste the whole JSON here to overwrite, then click a section’s Save or “Save All”.
          </div>
        </div>
      )}
    </div>
  );
}
