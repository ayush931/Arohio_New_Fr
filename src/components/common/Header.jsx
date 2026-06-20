import { clientLogout } from "../../utils/clientLogout";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SecondaryButton from "../ui/SecondaryButton";
import PrimaryButton from "../ui/PrimaryButton";
import { FiChevronDown } from "react-icons/fi";

function getStoredUser() {
  try {
    const lsUser = localStorage.getItem("auth_user");
    const ssUser = sessionStorage.getItem("auth_user");
    const raw = lsUser ?? ssUser;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hasToken() {
  return !!(
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token")
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    hasToken() ? getStoredUser() : null
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    const sync = () =>
      setUser(hasToken() ? getStoredUser() : null);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const first = user?.first_name?.trim();

  const handleLogout = () => {
    clientLogout();
    setUser(null);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `d-flex align-items-center justify-content-between px-3 py-3 rounded-3 fw-medium ${isActive ? "bg-light border-start border-4 border-success text-success" : "text-dark"
    }`;

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
        <div className="container position-relative">

          <NavLink className="navbar-brand" to="/">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Logo"
              style={{ height: "40px" }}
            />
          </NavLink>

          <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x">
            <ul className="navbar-nav gap-4 items-center">

              <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/">Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/tools/pdf-to-excel">
                  PDF to Images
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/tools/excel-to-alttext">
                  Excel to Alt Text
                </NavLink>
              </li>

              {/* <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/blog">Blog</NavLink>
              </li> */}

              <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/about">About Us</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium" to="/contact">Contact</NavLink>
              </li>

            </ul>
          </div>

          <div className="d-none d-lg-flex ms-auto gap-2">
            {user ? (
              <>
                <SecondaryButton to="/dashboard">
                  Hello{first ? `, ${first}` : ""}
                </SecondaryButton>
                <PrimaryButton onClick={handleLogout}>
                  Logout
                </PrimaryButton>
              </>
            ) : (
              <>
                <SecondaryButton to="/login">Log in</SecondaryButton>
                <PrimaryButton to="/signup">Sign up Free</PrimaryButton>
              </>
            )}
          </div>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setMobileOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

        </div>
      </nav>

      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div
            className="bg-white position-absolute start-50 translate-middle-x shadow-lg"
            style={{
              top: "6%",
              width: "94%",
              maxWidth: "380px",
              borderRadius: "12px",
              padding: "22px"
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}logo.png`}
                  alt="Logo"
                  style={{ height: "32px" }}
                />
              </div>
              <button
                className="btn-close"
                onClick={() => setMobileOpen(false)}
              ></button>
            </div>

            <div className="d-flex flex-column gap-2">

              <NavLink className={linkClass} to="/" onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>

              <NavLink className={linkClass} to="/tools/pdf-to-excel" onClick={() => setMobileOpen(false)}>
                PDF to Images Extraction
              </NavLink>

              <NavLink className={linkClass} to="/tools/excel-to-alttext" onClick={() => setMobileOpen(false)}>
                Excel to Alt Text
              </NavLink>

              <NavLink className={linkClass} to="/blog" onClick={() => setMobileOpen(false)}>
                Blog
              </NavLink>

              <NavLink className={linkClass} to="/about" onClick={() => setMobileOpen(false)}>
                About Us
              </NavLink>

              <NavLink className={linkClass} to="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </NavLink>

            </div>

            <div className="mt-4 d-flex flex-column gap-3">
              {user ? (
                <>
                  <SecondaryButton
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    Hello{first ? `, ${first}` : ""}
                  </SecondaryButton>
                  <PrimaryButton onClick={handleLogout}>
                    Logout
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <SecondaryButton
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </SecondaryButton>
                  <PrimaryButton
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up Free
                  </PrimaryButton>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}