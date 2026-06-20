export default function TestimonialsSection({
  testimonials,
  TestimonialsCarousel
}) {
  if (!testimonials) return null;

  return (
    <section className="py-5 bg-light-subtle full-bleed">
      <div className="container">

        {testimonials?.title ? (
          <h2 className="fs-5 fw-bold text-center section-title">
            {testimonials.title}
          </h2>
        ) : null}

        <TestimonialsCarousel
          testimonials={testimonials?.items || []}
          perPage={Math.max(1, testimonials?.per_page_desktop || 3)}
        />

      </div>
    </section>
  );
}