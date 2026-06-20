import { useState } from "react";

/* tiny inline icons */
function Icon({ name, size = 18 }) {
  const c = "currentColor";
  switch (name) {
    case "mail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
        </svg>
      );
    case "phone":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3 .5.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C9.9 21.2 2.8 14.1 2.8 4.2 2.8 3.5 3.3 3 4 3h2.3c.7 0 1.2.5 1.2 1.2 0 1 .2 2 .5 3 .1.4 0 .9-.3 1.2l-2.1 2.4z" />
        </svg>
      );
    case "clock":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 11H7v-2h4V6h2v7z" />
        </svg>
      );
    case "send":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M2 21 23 12 2 3v7l15 2-15 2z" />
        </svg>
      );
    case "agent":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path fill={c} d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Contact() {
  // FULL localhost URL as requested
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/contact-support/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to submit");
      }
      setForm({ name: "", email: "", subject: "", message: "" });
      alert("Your message has been sent!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong sending your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero full-bleed text-white">
        <div className="container py-5 text-center">
          <h1 className="display-6 fw-bold" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            Need help? We’re here for you.
          </h1>
          <p className="lead mb-0">
            Our team is dedicated to providing the best possible support. Reach out with any questions or concerns.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* LEFT: form */}
            <div className="col-12 col-lg-6">
              <div className="card soft border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="fs-5 fw-bold mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    Send us a message
                  </h2>

                  <form className="text-start" onSubmit={onSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="c-name">Name</label>
                      <input
                        id="c-name"
                        name="name"
                        className="form-control form-control-lg"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="c-email">Email</label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="c-subject">Subject</label>
                      <input
                        id="c-subject"
                        name="subject"
                        className="form-control form-control-lg"
                        placeholder="Brief subject"
                        value={form.subject}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="c-msg">Message</label>
                      <textarea
                        id="c-msg"
                        name="message"
                        className="form-control form-control-lg"
                        rows="5"
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-teal-slim btn-lg" disabled={sending}>
                      {sending ? "Sending..." : "Submit"}
                    </button>
                    <div className="text-muted small mt-2">We typically reply within 1 business day.</div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card chat-card shadow-sm">
                <div className="chat-header fw-semibold">Accessibility Support</div>
                <div className="chat-body">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="cavatar"><Icon name="agent" /></div>
                    <div>
                      <div className="fw-semibold mb-2">Improve Accessibility with Confidence</div>
                      <ul className="mb-0 ps-3 text-muted small d-flex flex-column gap-2">
                        <li>Generate accurate alt text for images and documents</li>
                        <li>Ensure compliance with accessibility standards like WCAG</li>
                        <li>Enhance SEO and usability through better content descriptions</li>
                        <li>Get guidance on improving accessibility across your platform</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card chat-card shadow-sm mt-3">
                <div className="chat-header fw-semibold">Platform Assistance</div>
                <div className="chat-body">
                  <div className="d-flex align-items-start gap-3">
                    <div className="cavatar"><Icon name="agent" /></div>
                    <div>
                      <div className="fw-semibold mb-2">We Are Here to Help You</div>
                      <ul className="mb-0 ps-3 text-muted small d-flex flex-column gap-2">
                        <li>Resolve issues related to file uploads and processing</li>
                        <li>Understand how AI-generated alt text works</li>
                        <li>Get support for export, integrations, and workflows</li>
                        <li>Clarify any technical or usage-related queries</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-5 border-top full-bleed">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-5">
              <div className="card soft border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="fs-6 fw-bold mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    Visit Arohio in Bihar
                  </h3>
                  <p className="text-muted mb-3">
                    You’ll find our <strong>Arohio Office</strong> conveniently located in Bihar (near Patna).
                    Stop by during office hours or book a slot with our team in advance.
                  </p>

                  <div className="d-grid gap-2 small">
                    <div className="d-flex gap-2">
                      <div className="method-card flex-grow-1">
                        <div className="m-icon"><Icon name="clock" /></div>
                        <div>
                          <div className="fw-semibold">Office Hours</div>
                          <div className="text-muted">Mon–Fri, 9:00am – 6:00pm IST</div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <div className="method-card flex-grow-1">
                        <div className="m-icon"><Icon name="phone" /></div>
                        <div>
                          <div className="fw-semibold">Phone</div>
                          <div className="text-muted">+91 6200 000 000</div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <div className="method-card flex-grow-1">
                        <div className="m-icon"><Icon name="mail" /></div>
                        <div>
                          <div className="fw-semibold">Email</div>
                          <a href="mailto:support@arohio.com" className="text-decoration-none">
                            support@arohio.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    className="btn btn-outline-teal-slim w-100 mt-3"
                    href="https://www.google.com/maps/search/?api=1&query=Arohio+Office+Patna+Bihar"
                    target="_blank" rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="col-12 col-lg-7">
              <div className="map-wrap shadow-sm rounded-4 overflow-hidden h-100">
                <div className="ratio ratio-16x9">
                  <iframe
                    title="Arohio Office — Bihar (Google Map)"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Arohio%20Office%20Patna%20Bihar&z=13&hl=en&output=embed"
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                </div>

                {/* label badge */}
                <div className="map-badge">
                  Arohio Office — Bihar
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
