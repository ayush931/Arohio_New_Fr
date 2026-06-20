import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaArrowRight, FaCamera } from "react-icons/fa";

function getAuth() {
  const rawUserLS = localStorage.getItem("auth_user");
  const rawUserSS = sessionStorage.getItem("auth_user");
  const rawTokLS = localStorage.getItem("auth_token");
  const rawTokSS = sessionStorage.getItem("auth_token");

  const sourceUser = rawUserLS ? "localStorage" : rawUserSS ? "sessionStorage" : "none";
  const sourceTok = rawTokLS ? "localStorage" : rawTokSS ? "sessionStorage" : "none";

  console.log("auth_user source:", sourceUser, "raw:", rawUserLS ?? rawUserSS);
  console.log("auth_token source:", sourceTok, "raw:", rawTokLS ?? rawTokSS);

  const user = rawUserLS ? JSON.parse(rawUserLS) : rawUserSS ? JSON.parse(rawUserSS) : {};
  const token = rawTokLS ?? rawTokSS ?? null;

  return { user, token, userSource: sourceUser, tokenSource: sourceTok };
}

export default function ProfileSettings() {
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";
  const fileRef = useRef(null);

  const { user, token } = getAuth();
  const userId = user?.id;
  console.log("resolved userId:", userId);

  const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
  console.log("BASE_URL:", BASE_URL);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    console.log("useEffect -> fetch profile | userId:", userId, "token:", token);
    if (!userId || !token) {
      console.warn("Missing auth; skip profile fetch.");
      return;
    }
    const url = `${BASE_URL}/users/${userId}/profile`;
    console.log("GET", url);
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("Profile response", res.data);
        const d = res.data || {};
        setForm((s) => ({
          ...s,
          name: d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim(),
          email: d.email || "",
          phoneNumber: d.phone_number || "",
          jobTitle: d.job_title || d.jobTitle || "",
        }));
        setAvatarUrl(
          d.avatar_url ? `${BASE_URL}${d.avatar_url}` : ""
        );
      })
      .catch((err) => {
        console.error("Profile fetch error", err?.response?.status, err?.response?.data || err.message);
      });
  }, [userId, token, BASE_URL]);

  const onChange = (k, v) => {
    console.log("onChange", k, v);
    setForm((s) => ({ ...s, [k]: v }));
  };

  const chooseAvatar = () => {
    console.log("chooseAvatar clicked");
    fileRef.current?.click();
  };

  const onAvatarChange = (e) => {
    const f = e.target.files?.[0];
    console.log("onAvatarChange file", f);
    if (!f) return;
    if (!/image\/(png|jpe?g|gif)/i.test(f.type) || f.size > 5 * 1024 * 1024) {
      alert("Please upload a PNG/JPG/GIF up to 5MB.");
      return;
    }
    setAvatar(f);
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  };

  const onSave = async (e) => {
    e.preventDefault();
    console.log("onSave clicked; form:", form);

    if (!userId || !token) {
      alert("You’re not logged in. Please log in again.");
      console.warn("Missing auth; abort save.");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password must match.");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone_number", form.phoneNumber);
    fd.append("jobTitle", form.jobTitle);
    if (avatar) fd.append("avatar", avatar);

    const profileUrl = `${BASE_URL}/users/${userId}/profile`;
    console.log("POST", profileUrl);
    for (const p of fd.entries()) console.log("Profile field", p[0], p[1]);

    try {
      const res = await axios.post(profileUrl, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile update response", res.data);
    } catch (err) {
      console.error("Profile update error", err?.response?.status, err?.response?.data || err.message);
      alert("Error saving profile");
      return;
    }

    if (form.newPassword) {
      const fdPass = new FormData();
      fdPass.append("current_password", form.currentPassword);
      fdPass.append("new_password", form.newPassword);

      const passUrl = `${BASE_URL}/users/${userId}/password`;
      console.log("POST", passUrl);
      for (const p of fdPass.entries()) console.log("Password field", p[0], p[1]);

      try {
        const passRes = await axios.post(passUrl, fdPass, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Password update response", passRes.data);
      } catch (err) {
        console.error("Password update error", err?.response?.status, err?.response?.data || err.message);
        alert("Password change failed");
        return;
      }
    }

    alert("Profile saved successfully");
    setForm((s) => ({
      ...s,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="container py-4" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root { --teal:${TEAL}; --line:${LINE}; }
        .ps-card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 10px 24px rgba(2,8,23,.04)}
        .ps-title{font-weight:800;color:#0f172a}
        .ps-muted{color:#64748b}
        .ps-label{font-size:.9rem;font-weight:800;color:#0f172a;margin-bottom:6px}
        .ps-input{width:100%;background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;color:#0f172a;outline:none}
        .ps-input::placeholder{color:#94a3b8}
        .ps-input:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(33,199,184,.15)}
        .ps-hr{height:1px;background:var(--line);margin:18px 0}
        .ps-btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:3px;padding:12px 16px;background:var(--teal);color:#fff;font-weight:800;cursor:pointer}
        .ps-btn:hover{filter:brightness(.98)}
        .avatar-wrap{position:relative;width:96px;height:96px}
        .avatar{width:96px;height:96px;border-radius:999px;object-fit:cover;border:2px solid var(--line)}
        .avatar-btn{position:absolute;right:-6px;bottom:-6px;width:34px;height:34px;border:none;border-radius:999px;background:var(--teal);color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 18px rgba(33,199,184,.3)}
        @media(max-width:768px){ .grid-2{grid-template-columns:1fr!important} }
      `}</style>

      <h1 className="h5 ps-title mb-3 text-start">Profile Settings</h1>

      <form className="ps-card p-3 p-md-4 text-start" onSubmit={onSave}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="avatar-wrap">
            <img
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "U")}&background=21c7b8&color=fff`}
              alt="Avatar"
              className="avatar"
            />
            <button type="button" className="avatar-btn" onClick={chooseAvatar} aria-label="Change photo">
              <FaCamera size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              hidden
              onChange={onAvatarChange}
            />
          </div>
          <div>
            <div className="ps-title" style={{ fontSize: "1rem" }}>Change your profile photo</div>
            <div className="ps-muted small">PNG, JPG, GIF up to 5MB. Recommended 120×120px.</div>
          </div>
        </div>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="ps-label">Name</label>
            <input
              className="ps-input"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="ps-label">Email</label>
            <input
              className="ps-input bg-gray-100 cursor-not-allowed"
              type="email"
              value={form.email}
              disabled
            />
          </div>
          {/* <div>
            <label className="ps-label">Phone Number</label>
            <input
              className="ps-input"
              value={form.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="Phone Number"
            />
          </div>
          <div>
            <label className="ps-label">Job Title</label>
            <input
              className="ps-input"
              value={form.jobTitle}
              onChange={(e) => onChange("jobTitle", e.target.value)}
              placeholder="Job Title"
            />
          </div> */}
        </div>

        <div className="ps-hr" />

        <div className="mb-2 ps-title" style={{ fontSize: "1rem" }}>Password</div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="ps-label">Current Password</label>
            <input
              className="ps-input"
              type="password"
              value={form.currentPassword}
              onChange={(e) => onChange("currentPassword", e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="ps-label">New Password</label>
            <input
              className="ps-input"
              type="password"
              value={form.newPassword}
              onChange={(e) => onChange("newPassword", e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="ps-label">Confirm Password</label>
            <input
              className="ps-input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button className="ps-btn" type="submit">
            Save Changes <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
