export default function StepsSection({ steps, Icon }) {
  if (!steps) return null;

  return (
    <section className="py-5 full-bleed bg-light-subtle">
      <div className="container">

        {steps?.title ? (
          <h2 className="fs-4 fw-bold section-title text-center">
            {steps.title}
          </h2>
        ) : null}

        <div className="steps-pro mx-auto mt-4">

          {(steps?.items || []).map((s, idx) => (
            <div className="step-card" key={`${s.title}-${idx}`}>

              <div className="spt-icon text-teal">
                <Icon name={s.icon} />
              </div>

              <div className="spt-title">
                {s.title}
              </div>

              {s?.desc ? (
                <p className="spt-desc">
                  {s.desc}
                </p>
              ) : null}

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}