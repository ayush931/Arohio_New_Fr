import { NavLink } from "react-router-dom";

const isExternal = (href = "") => /^https?:\/\//i.test(href);

const classForVariant = (v = "primary") =>
  v === "outline"
    ? "btn btn-outline-teal-slim btn-lg"
    : "btn btn-teal-slim btn-lg";

export default function HeroSection({ hero }) {
  if (!hero) return null;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-4">

          <div className="col-12 col-lg-6 text-start">

            <h1 className="hero-title fw-bold">
              {hero?.title?.includes("Accessible Alt Text") ? (
                <>
                  Turn PDFs into <br />
                  Accessible Alt Text <span className="d-inline">with AI.</span>
                </>
              ) : (
                hero?.title
              )}
            </h1>

            {hero?.subtitle ? (
              <p className="text-muted hero-sub mb-4">{hero.subtitle}</p>
            ) : null}

            <div className="d-flex flex-wrap gap-3 hero-btns">

              {(hero?.ctas || []).map((c, i) => {
                const cls = classForVariant(c?.variant);
                const to = c?.href || "#";

                if (isExternal(to)) {
                  return (
                    <a key={i} href={to} className={cls}>
                      {c?.label || "Learn more"}
                    </a>
                  );
                }

                return (
                  <NavLink key={i} to={to} className={cls}>
                    {c?.label || "Learn more"}
                  </NavLink>
                );
              })}

            </div>

            {Array.isArray(hero?.points) && hero.points.length > 0 ? (
              <ul className="list-unstyled d-grid gap-2 mt-4 hero-points">

                {hero.points.map((p, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <span className="badge bg-light text-teal rounded-pill">✔</span>
                    <span>{p}</span>
                  </li>
                ))}

              </ul>
            ) : null}

          </div>

          <div className="col-12 col-lg-6 text-center">
            <div className="hero-art hero-sm shadow-sm rounded-4 overflow-hidden mx-auto">

              <img
                src={hero?.image?.url || ""}
                alt={hero?.image?.alt || "Hero"}
                className="img-fluid"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}