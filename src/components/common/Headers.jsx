import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { clientLogout } from "../../utils/clientLogout";
import Logout from "./UseLogout";

export default function Header() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [seconds, setSeconds] = useState(3);
  const timerRef = useRef(null);

  const handleLogout = () => {
    clientLogout();
    setSeconds(3);
    setShowModal(true);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          navigate("/login", { replace: true });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-2 sticky-top">
        <div className="container position-relative">

          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Arohio Logo"
              style={{ height: "36px", objectFit: "contain" }}
            />
          </NavLink>

          <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x">
            <ul className="navbar-nav gap-4 fw-medium items-center">

              <li className="nav-item">
                <NavLink end className="nav-link" to="/">Home</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/tools/pdf-to-excel">
                  PDF to Images
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/tools/excel-to-alttext">
                  Excel to Alt Text
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/about">About Us</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact</NavLink>
              </li>

            </ul>
          </div>

          <div className="d-flex align-items-center ms-auto gap-3">
            <Logout>
              <button
                type="button"
                className="btn d-flex align-items-center gap-1 px-2 py-1"
                style={{ color: "#1BA3A2", fontWeight: 500 }}
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </Logout>

          </div>

        </div>
      </nav>
    </>
  );
}