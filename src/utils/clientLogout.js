import axios from "axios";

export function clientLogout() {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("role_id");
    localStorage.removeItem("app-view"); 
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    delete axios.defaults.headers.common["Authorization"];
  } catch (e) {
    console.warn("Logout cleanup warning:", e);
  }

  console.log("[Logout] Cleared auth_token, auth_user, role_id. Redirecting to /login …");
}
