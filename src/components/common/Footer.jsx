import { NavLink } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  const API_BASE = useMemo(
    () =>
      (import.meta.env.VITE_API_BASE &&
        String(import.meta.env.VITE_API_BASE).trim()) ||
      "http://127.0.0.1:8000",
    []
  );

  const ENDPOINT = `${API_BASE}/newsletters`;

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isLoggedIn = !!sessionStorage.getItem("auth_user");

  const linkClass = ({ isActive }) =>
    `text-decoration-none ${isActive ? "fw-semibold text-dark" : "text-muted"
    }`;

  useEffect(() => {
    try {
      const userData = sessionStorage.getItem("auth_user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);

      if (parsedUser?.email || parsedUser?.first_name) {
        setForm((prev) => ({
          ...prev,
          name: `${parsedUser.first_name || ""} ${parsedUser.last_name || ""
            }`.trim(),
          email: parsedUser.email || "",
        }));
      }
    } catch (err) {
      console.error("Error parsing auth_user:", err);
    }

  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setMessage("Fill all fields.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          source: "footer",
        }),
      });
      if (res.status === 201) {
        setMessage("Subscribed successfully.");
        if (!isLoggedIn) {
          setForm({ name: "", email: "" });
        }
      } else {
        setMessage("Already subscribed or invalid.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (<footer className="bg-light border-top pt-5 mt-5"> <div className="container">

    ```
    <div className="row align-items-center mb-5">
      <div className="col-lg-6">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Arohio Logo"
          style={{ height: "50px" }}
        />
        <p
          className="text-muted mt-3 mb-0"
          style={{ maxWidth: "480px", fontSize: "18px", lineHeight: "1.6" }}
        >
          AI-powered accessibility automation platform delivering scalable
          alt text, SEO enhancements and document intelligence.
        </p>
      </div>

      <div className="col-lg-6">
        <h5 className="fw-semibold mb-3" style={{ fontSize: "18px" }}>
          Stay Updated
        </h5>

        {!isLoggedIn ? (
          <form onSubmit={onSubmit}>
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-5">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2 d-grid">
                <button
                  className="btn btn-lg text-white"
                  style={{ backgroundColor: "#2bb3a3" }}
                  disabled={loading}
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-3 rounded bg-light border text-muted">
            You are already subscribed with your account. You will receive updates automatically.
          </div>
        )}

        {message && (
          <div className="small text-muted mt-2">{message}</div>
        )}
      </div>
    </div>

    <div className="row gy-4 mb-5">

      <div className="col-6 col-md-3">
        <h6 className="fw-semibold mb-3" style={{ fontSize: "18px" }}>
          Company
        </h6>
        <ul className="list-unstyled">
          <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About Us</NavLink></li>
          <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
        </ul>
      </div>

      <div className="col-6 col-md-3">
        <h6 className="fw-semibold mb-3" style={{ fontSize: "18px" }}>
          Products
        </h6>
        <ul className="list-unstyled">
          <li>
            <NavLink to="/tools/pdf-to-excel" className={linkClass}>
              PDF to Images Extraction
            </NavLink>
          </li>
          <li>
            <NavLink to="/tools/excel-to-alttext" className={linkClass}>
              Excel to Alt Text
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="col-6 col-md-3">
        <h6 className="fw-semibold mb-3" style={{ fontSize: "18px" }}>
          Resources
        </h6>
        <ul className="list-unstyled mb-3">
          <li><NavLink to="/blog" className={linkClass}>Blog</NavLink></li>
        </ul>

        <h6 className="fw-semibold mb-3 mt-3" style={{ fontSize: "18px" }}>
          Legal
        </h6>
        <ul className="list-unstyled">
          <li><NavLink to="/terms" className={linkClass}>Terms & Conditions</NavLink></li>
          <li><NavLink to="/privacy" className={linkClass}>Privacy Policy</NavLink></li>
        </ul>
      </div>

      <div className="col-6 col-md-3">
        <h6 className="fw-semibold mb-3" style={{ fontSize: "18px" }}>
          Contact
        </h6>
        <ul className="list-unstyled text-muted">
          <li>Email: support@arohio.com</li>
          <li>Location: Bihar, India</li>
        </ul>
        <div className="d-flex gap-3 mt-3 fs-5 text-muted">
          <a href="#" className="text-muted"><FaLinkedin /></a>
          <a href="#" className="text-muted"><FaGithub /></a>
          <a href="#" className="text-muted"><FaFacebook /></a>
          <a href="#" className="text-muted"><FaYoutube /></a>
        </div>
      </div>

    </div>

    <div className="border-top pt-3 pb-4 small text-muted text-center">
      © {year} Arohio. All rights reserved.
    </div>

  </div>
  </footer>
  );
}
