// src/pages/Signup.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AuthAside from "../components/auth/AuthAside";
import { FcGoogle } from "react-icons/fc";


export default function Signup() {
  const navigate = useNavigate();
  const browserLocale = useMemo(() => (typeof navigator !== "undefined" ? navigator.language || "en" : "en"), []);
  const browserTz = useMemo(
    () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" : "UTC"),
    []
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password_hash: "",
    confirm_password: "",
    locale: browserLocale,
    time_zone: browserTz,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, locale: browserLocale, time_zone: browserTz }));
  }, [browserLocale, browserTz]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error("Please enter first and last name");
      return;
    }
    if (form.password_hash !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password_hash.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/users/`, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password_hash: form.password_hash,
        locale: form.locale,
        time_zone: form.time_zone,
      });

      const first = res?.data?.first_name || form.first_name;
      toast.success(`Welcome to AROHIO, ${first}! Your account has been created successfully.`, {
        duration: 3000,
        style: {
          padding: "14px 16px",
          fontSize: "14px",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password_hash: "",
        confirm_password: "",
        locale: browserLocale,
        time_zone: browserTz,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Signup failed";
      toast.error(`Signup failed: ${msg}`, {
        duration: 5000,
        style: {
          padding: "14px 16px",
          fontSize: "14px",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 min-vh-100 auth-shell d-flex flex-column h-100">
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 12, right: 12 }}
        toastOptions={{
          duration: 3000,
          style: {
            padding: "14px 16px",
            fontSize: "14px",
            lineHeight: 1.35,
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
          success: { duration: 3000, iconTheme: { primary: "#0fb9b1", secondary: "#fff" } },
          error: { duration: 5000, iconTheme: { primary: "#ff4757", secondary: "#fff" } },
        }}
      />
      <div className="row g-0 flex-grow-1">
        <div className="col-12 d-flex flex-column flex-grow-1">
          <div className="row g-0 flex-grow-1">
            <AuthAside />
            <div className="col-12 col-lg-6 bg-white p-4 p-md-5 d-flex flex-column">
              <h1 className="fw-bold" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Create your account
              </h1>
              <p className="text-muted">Start your journey with Arohio for free.</p>
              <form className="auth-form text-start" onSubmit={onSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="first_name">First Name</label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      className="form-control form-control-lg auth-input"
                      placeholder="First Name"
                      value={form.first_name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="last_name">Last Name</label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      className="form-control form-control-lg auth-input"
                      placeholder="Last Name"
                      value={form.last_name}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control form-control-lg auth-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="pass">Password</label>
                  <input
                    id="pass"
                    name="password_hash"
                    type="password"
                    className="form-control form-control-lg auth-input"
                    placeholder="Create a password"
                    value={form.password_hash}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="cpass">Confirm Password</label>
                  <input
                    id="cpass"
                    name="confirm_password"
                    type="password"
                    className="form-control form-control-lg auth-input"
                    placeholder="Confirm your password"
                    value={form.confirm_password}
                    onChange={onChange}
                    required
                  />
                </div>
                <input type="hidden" name="locale" value={form.locale} readOnly />
                <input type="hidden" name="time_zone" value={form.time_zone} readOnly />
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="terms" required />
                  <label className="form-check-label small" htmlFor="terms">
                    I agree to the <NavLink to="/terms" className="link-teal text-decoration-none">Terms</NavLink> and{" "}
                    <NavLink to="/privacy" className="link-teal text-decoration-none">Privacy Policy</NavLink>.
                  </label>
                </div>
                <button type="submit" className="btn btn-teal-slim btn-lg w-100" disabled={loading}>
                  {loading ? "Signing up..." : "Sign up"}
                </button>
                {/* <div className="d-flex align-items-center my-4">
                  <div className="flex-grow-1 border-top"></div>
                  <span className="px-3 text-muted small">Or continue with</span>
                  <div className="flex-grow-1 border-top"></div>
                </div> */}
                {/* <div className="row g-3">
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-outline-light w-100 social-btn d-flex align-items-center justify-content-center gap-2"
                    >
                      <FcGoogle size={18} /> <span>Continue with Google</span>
                    </button>
                  </div>
                </div> */}
                <p className="text-muted small text-center mt-4">
                  Already a member?{" "}
                  <NavLink to="/login" className="link-teal text-decoration-none">Log in</NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
