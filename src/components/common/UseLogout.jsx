import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientLogout } from "../../utils/clientLogout";

export default function Logout({ children }) {
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

  const closeAndRedirect = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setShowModal(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <div onClick={handleLogout} style={{ cursor: "pointer" }}>
        {children}
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "rgba(15,23,42,0.35)", zIndex: 1080 }}
        >
          <div className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
            <div className="bg-white rounded-4 shadow p-4" style={{ maxWidth: 380, width: "100%" }}>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 44,
                    height: 44,
                    background: "linear-gradient(135deg, #2EC4B6 0%, #1BA3A2 100%)",
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <h6 className="mb-1 fw-semibold">Logged out successfully</h6>
                  <div className="text-muted small">
                    Redirecting in <strong>{seconds}</strong>…
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={closeAndRedirect}
                >
                  Go now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}