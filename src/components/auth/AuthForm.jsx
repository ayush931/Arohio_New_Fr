import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({
  title = "Welcome",
  subtitle = "",
  form,
  onChange,
  onSubmit,
  loading,
  footerText,
  footerLink,
  footerLinkText,
  type = "login"
}) {
  return (
    <div className="col-12 col-lg-6 bg-white p-4 p-md-5 text-center text-lg-start d-flex flex-column justify-content-center">

      <h1 className="display-6 fw-bold auth-title mb-1">{title}</h1>
      <p className="text-muted mb-4">{subtitle}</p>

      <form onSubmit={onSubmit} noValidate className="w-100">
        <div className="auth-form text-center text-lg-start">

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-md auth-input mx-auto"
              placeholder="Enter Your Email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-md auth-input mx-auto"
              placeholder="Enter Your Password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-2 mb-3">
          {/* <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              name="remember"
              checked={form.remember}
              onChange={onChange}
            />
            <label className="form-check-label small" htmlFor="rememberMe">
              Remember me
            </label>
          </div> */}

          {/* {type === "login" && (
            <NavLink className="small link-teal text-decoration-none" to="/forgot">
              Forgot your password?
            </NavLink>
          )} */}
        </div>

        <button type="submit" className="btn btn-teal-slim btn-lg w-100 mb-3" disabled={loading}>
          {loading ? "Processing..." : type === "login" ? "Log in" : "Sign up"}
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

      </form>

      <p className="text-center mt-4 small">
        {footerText}{" "}
        <NavLink to={footerLink} className="link-teal text-decoration-none">
          {footerLinkText}
        </NavLink>
      </p>
    </div>
  );
}