import { createContext, useContext, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[260px]"
          >
            <div className={`text-lg ${t.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {t.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>

            <div className="text-sm text-gray-800 font-medium">
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}