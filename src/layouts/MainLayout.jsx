import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useState, lazy, Suspense, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ChatModule = lazy(() => import("../components/chat/ChatModule"));

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [expanded] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  const box = expanded
    ? { width: 520, height: 620 }
    : { width: 360, height: 460 };

  const z = 1050;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <div className="container">
          <Outlet />
        </div>

        {!open && (
          <div
            className="position-fixed"
            style={{ bottom: 24, right: 24, zIndex: z }}
          >
            <button
              onClick={() => setOpen(true)}
              className="d-flex align-items-center gap-2"
              style={{
                backgroundColor: "#21c7b8",
                color: "#fff",
                border: "none",
                padding: "12px 22px",
                fontWeight: 600,
                borderRadius: 7,
                boxShadow: "0 6px 14px rgba(0,0,0,.15)",
                fontSize: 15,
                cursor: "pointer",
                transition: "transform .12s ease",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <FaRobot size={18} />
              Ask Arohio
            </button>
          </div>
        )}

        {open && (
          <div
            className="position-fixed bg-white border rounded shadow d-flex flex-column"
            style={{ bottom: 24, right: 24, zIndex: z, ...box }}
          >
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                background: "#ffffff",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                padding: "10px 12px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  color: "#1f2937",
                  fontSize: 16,
                }}
              >
                Arohio
              </div>
              <button
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#1f2937",
                }}
                onClick={() => setOpen(false)}
              >
                <IoClose size={22} />
              </button>
            </div>

            <div className="p-0 flex-grow-1 overflow-auto">
              <Suspense
                fallback={
                  <div className="p-3 text-muted small">Loading…</div>
                }
              >
                <ChatModule />
              </Suspense>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}