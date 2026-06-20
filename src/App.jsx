// src/App.jsx
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routes/index";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            padding: "14px 16px",
            fontSize: "14px",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}
