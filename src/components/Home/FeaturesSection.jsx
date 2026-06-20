import FeatureCard from "./FeatureCard";

export default function FeaturesSection({ features, Icon }) {
  if (!features) return null;

  return (
    <section className="py-5">
      <div className="container">

        {features?.title ? (
          <h2 className="fs-4 fw-bold text-center section-title">
            {features.title}
          </h2>
        ) : null}

        {features?.subtitle ? (
          <p className="text-muted text-center mb-4">
            {features.subtitle}
          </p>
        ) : null}

        <div className="row g-3 g-md-4 mt-2">

          {(features?.cards || []).map((f, i) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={`${f.title}-${i}`}
            >
              <FeatureCard
                feature={f}
                Icon={Icon}
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}