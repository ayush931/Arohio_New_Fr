import { Outlet } from "react-router-dom";
import Headers from "../components/common/Headers";
import Sidebar from "../components/common/Sidebar";
import ToastProvider from "../components/common/ToastProvider";

export default function DashboardLayout() {
  return (
    <ToastProvider>
      <div
        className="d-flex flex-column no-scrollbar"
        style={{ height: "100vh", overflow: "hidden", background: "#f8fafc" }}
      >
        <style>{`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <Headers />

        <div
          className="d-flex"
          style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}
        >
          <div
            className="no-scrollbar d-none d-md-block"
            style={{ width: 232, height: "100%", overflowY: "auto" }}
          >
            <Sidebar />
          </div>

          <main
            className="flex-grow-1 no-scrollbar"
            style={{ height: "100%", overflowY: "auto" }}
          >
            <div className="container-fluid py-3">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}