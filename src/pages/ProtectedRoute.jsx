import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    toast.dismiss();
    toast.custom(
      (t) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            minWidth: 300,
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.06)",
            transition: "transform .18s ease, opacity .18s ease",
            transform: t.visible ? "translateY(0)" : "translateY(-6px)",
            opacity: t.visible ? 1 : 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "rgba(33,199,184,0.15)",
              border: "1px solid rgba(33,199,184,0.3)",
            }}
          >
            <FaLock size={15} style={{ color: "#21c7b8" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              Please log in to access this feature.
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Authentication required to continue.
            </div>
          </div>
        </div>
      ),
      { id: "auth-toast", duration: 3000 }
    );

    return <Navigate to="/login" replace />;
  }

  return children;
}
