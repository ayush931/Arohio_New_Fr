import { NavLink } from "react-router-dom";

const isExternal = (href = "") => /^https?:\/\//i.test(href);

export default function FeatureCard({ feature, Icon }) {
  if (!feature) return null;

  return (
    <div className="fcard-pro h-100 d-flex flex-column">

      <div className="fmeta">
        <span className={`fbadge ${feature.badge === "Pro" ? "fbadge-pro" : ""}`}>
          {feature.badge}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="ficon-lg">
          <Icon name={feature.icon} />
        </div>

        <h3 className="ftitle m-0">
          {feature.title}
        </h3>
      </div>

      {feature?.desc ? (
        <p className="fdesc">
          {feature.desc}
        </p>
      ) : null}

      {Array.isArray(feature?.bullets) && feature.bullets.length > 0 ? (
        <ul className="fbullets">

          {feature.bullets.map((b, i) => (
            <li className="fbullet" key={i}>
              <span className="fbullet-tick">✓</span>
              <span>{b}</span>
            </li>
          ))}

        </ul>
      ) : null}

      <div className="mt-auto">

        {isExternal(feature?.href) ? (
          <a href={feature.href} className="fmore">
            Use This Tool
          </a>
        ) : (
          <NavLink to={feature?.href || "#"} className="fmore">
            Use This Tool
          </NavLink>
        )}

      </div>

    </div>
  );
}