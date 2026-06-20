// src/pages/About.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Icon({ name, size = 20 }) {
  const c = "currentColor";
  switch (name) {
    case "vision":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" /></svg>);
    case "mission":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M6 2h2v20H6z" /><path fill={c} d="M8 3h10l-2.5 3L18 9H8z" /></svg>);
    case "bulb":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M9 21h6v-1H9v1zm3-19a7 7 0 0 0-4 12.9V17h8v-2.1A7 7 0 0 0 12 2z" /></svg>);
    case "handshake":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M2 12l4-4 6 6-2 2-4-4-2 2zm20 0-4-4-6 6 2 2 4-4 2 2z" /></svg>);
    case "shield":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5z" /></svg>);
    case "star":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="m12 2 3.1 6.3 6.9 1-5 4.8L18.2 22 12 18.7 5.8 22 7 14.1 2 9.3l6.9-1z" /></svg>);
    case "heart":
      return (<svg width={size} height={size} viewBox="0 0 24 24"><path fill={c} d="M12 21s-7-4.35-9.33-7.38C.86 10.63 2.07 6.9 5.4 6.2A5.2 5.2 0 0 1 12 9.2a5.2 5.2 0 0 1 6.6-3c3.33.7 4.54 4.43 2.73 7.42C19 16.65 12 21 12 21z" /></svg>);
    default:
      return null;
  }
}

export default function About() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const API = `${import.meta.env.VITE_API_BASE}/about`;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(API);
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        if (mounted) setData(j);
      } catch (e) {
        setErr(e?.message || "Failed to load");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (err) return <div className="container py-5 text-danger">{err}</div>;
  if (!data) return <div className="container py-5">Loading…</div>;

  const hero = data.hero || {};
  const sections = Array.isArray(data.sections) ? data.sections.filter(s => s?.visible !== false) : [];

  const Card = ({ icon, title, subtitle, bullets, chips }) => (
    <div className="am-card h-100">
      <div className="d-flex align-items-center gap-2 mb-1">
        {icon ? <span className="am-ico"><Icon name={icon} /></span> : null}
        <h3 className="m-0">{title}</h3>
      </div>
      {subtitle ? <p className="am-sub mb-2">{subtitle}</p> : null}
      <div className="am-sep" />
      {Array.isArray(bullets) && bullets.length ? (
        <ul className="am-bullets mb-3">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      ) : null}
      {Array.isArray(chips) && chips.length ? (
        <div className="am-meta d-flex flex-wrap gap-2">
          {chips.map((c, i) => <span key={i} className="chip">{c}</span>)}
        </div>
      ) : null}
    </div>
  );

  const SectionRenderer = ({ s }) => {
    if (s.type === "card") {
      return (
        <section className="py-5">
          <div className="container">
            <div className="row g-3 g-md-4">
              <div className="col-12 col-lg-6">
                <Card icon={s.icon} title={s.title} subtitle={s.subtitle} bullets={s.bullets} chips={s.chips} />
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (s.type === "card_grid") {
      return (
        <section className="py-5">
          <div className="container">
            {s.title ? <h2 className="fs-4 fw-bold text-center about-section-title">{s.title}</h2> : null}
            {s.subtitle ? <p className="text-muted text-center mb-3">{s.subtitle}</p> : null}
            <div className="row g-3 g-md-4 mt-2 text-start">
              {(s.cards || []).map((c, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="vcard pro h-100 d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {c.icon ? <span className="vico"><Icon name={c.icon} /></span> : null}
                      <h3 className="vtitle m-0">{c.title}</h3>
                    </div>
                    {c.description ? <p className="vdesc">{c.description}</p> : null}
                    {Array.isArray(c.bullets) && c.bullets.length ? (
                      <ul className="vbullets mt-auto">
                        {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    ) : null}
                    {Array.isArray(c.chips) && c.chips.length ? (
                      <div className="vchips mt-2">
                        {c.chips.map((x, i) => <span className="chip" key={i}>{x}</span>)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    if (s.type === "split") {
      const imgSideRight = (s.image_side || "right") === "right";
      return (
        <section className="py-5">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className={`col-12 col-lg-6 text-start ${imgSideRight ? "" : "order-lg-2"}`}>
                {s.eyebrow ? <div className="about-eyebrow mb-1">{s.eyebrow}</div> : null}
                {s.title ? <h2 className="fs-4 fw-bold about-section-title m-0">{s.title}</h2> : null}
                {s.body ? <p className="text-muted mt-2 mb-3">{s.body}</p> : null}
                {Array.isArray(s.bullets) && s.bullets.length ? (
                  <ul className="about-bullets">
                    {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                ) : null}
                {Array.isArray(s.chips) && s.chips.length ? (
                  <div className="about-chips mt-3 d-flex flex-wrap gap-2">
                    {s.chips.map((x, i) => <span key={i} className="chip">{x}</span>)}
                  </div>
                ) : null}
              </div>
              <div className={`col-12 col-lg-6 ${imgSideRight ? "" : "order-lg-1"}`}>
                <div className="am-illustration sm shadow-sm rounded-4 overflow-hidden mx-auto">
                  {s.image?.url ? (
                    <img className="img-fluid" src={s.image.url} alt={s.image.alt || ""} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    if (s.type === "team_grid") {
      return (
        <section className="py-5">
          <div className="container">
            {s.title ? <h2 className="fs-5 fw-bold text-center about-section-title">{s.title}</h2> : null}
            <div className="team-grid mt-3">
              {(s.members || []).map((m) => (
                <div className="team-card text-center" key={m.name}>
                  {m.avatar ? <img className="team-avatar" src={m.avatar} alt={m.name} /> : null}
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className="about-page">
      {hero?.visible !== false && (
        <section className="about-hero full-bleed text-white mt-0 py-0">
          <div className="container py-5">
            <h1 className="display-6 fw-bold about-title">{hero.title || "About"}</h1>
            {hero.lead ? <p className="lead mb-2">{hero.lead}</p> : null}
            {hero.body ? <p className="mb-4">{hero.body}</p> : null}
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {(hero.ctas || []).map((c, i) =>
                c.style === "outline" ? (
                  <NavLink key={i} to={c.to || "#"} className="btn btn-outline-light btn-lg px-4">
                    {c.label}
                  </NavLink>
                ) : (
                  <NavLink key={i} to={c.to || "#"} className="btn btn-teal-slim btn-lg px-4">
                    {c.label}
                  </NavLink>
                )
              )}
            </div>
            {Array.isArray(hero.highlights) && hero.highlights.length ? (
              <ul className="about-highlights list-unstyled d-flex flex-wrap gap-3 justify-content-center mt-4 mb-0">
                {hero.highlights.map((h, i) => (
                  <li key={i}><span className="hi-check">✓</span> {h}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      )}

      {sections.map((s) => (
        <SectionRenderer key={s.id || Math.random()} s={s} />
      ))}
    </div>
  );
}
