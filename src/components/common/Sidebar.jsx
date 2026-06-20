import { useState, useMemo, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaUpload, FaChartBar, FaComments, FaCog, FaLifeRing, FaSignOutAlt,
  FaCalendarAlt, FaUser, FaSlidersH, FaChevronDown, FaChevronUp, FaUserShield,
  FaLock, FaCreditCard, FaUsers, FaProjectDiagram, FaUserCog, FaBell,
  FaShieldAlt, FaFolderOpen, FaEnvelopeOpen, FaFileAlt, FaDatabase, FaLayerGroup, FaEnvelope,
  FaKey, FaBlog
} from "react-icons/fa";
import Logout from "./UseLogout";

const baseStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  borderRadius: 6,
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: 14,
  transition: "all .2s ease",
};

function resolveRoleId() {
  const direct = localStorage.getItem("role_id") ?? sessionStorage.getItem("role_id");
  if (direct) return direct;
  const raw = localStorage.getItem("auth_user") ?? sessionStorage.getItem("auth_user");
  if (raw) {
    try {
      const u = JSON.parse(raw);
      if (u?.role_id != null) return String(u.role_id);
    } catch { }
  }
  return "1";
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const teal = "#21c7b8";

  const jumpTop = () =>
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    );

  const [roleId, setRoleId] = useState(resolveRoleId());
  const isAdmin = Number(roleId) === 2;

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "role_id" || e.key === "auth_user") {
        setRoleId(resolveRoleId());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (!location.pathname.startsWith("/admin/credits")) navigate("/admin/credits", { replace: true });
    } else {
      if (!location.pathname.startsWith("/dashboard")) navigate("/dashboard", { replace: true });
    }
    jumpTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const isSettingsSub = useMemo(
    () =>
      location.pathname.startsWith("/dashboard/privacy") ||
      location.pathname.startsWith("/dashboard/security"),
    [location.pathname]
  );
  const [openSettings, setOpenSettings] = useState(isSettingsSub);
  useEffect(() => { if (isSettingsSub) setOpenSettings(true); }, [isSettingsSub]);

  const isTeamsSub = useMemo(
    () => location.pathname.startsWith("/dashboard/teams/"),
    [location.pathname]
  );
  const [openTeams, setOpenTeams] = useState(isTeamsSub);
  useEffect(() => { if (isTeamsSub) setOpenTeams(true); }, [isTeamsSub]);

  const [openMaster, setOpenMaster] = useState(false);
  const [openContent, setOpenContent] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openDbData, setOpenDbData] = useState(false);
  const [openCRM, setOpenCRM] = useState(false);
  return (
    <aside
      className="d-flex flex-column sidebar-scroll"
      style={{
        width: 232,
        background: "#0f172a",
        color: "#cbd5e1",
        minHeight: "100vh",
        borderRight: "1px solid #1e293b",
        overflowY: "auto",
      }}
    >
      <style>{`
        .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .sidebar-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {isAdmin ? (
        <nav className="p-3 d-flex flex-column gap-1">
          {/* <NavLink to="/admin" end onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaShieldAlt size={15} /> <span>Admin Dashboard</span>
          </NavLink> */}

          <NavLink to="/admin/users" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaUsers size={15} /> <span>User Management</span>
          </NavLink>

          <NavLink to="/admin/credits" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaCreditCard size={15} /> <span>Credit Management</span>
          </NavLink>

          {/* <NavLink to="/admin/system-reports" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaChartBar size={15} /> <span>System Reports</span>
          </NavLink> */}

          <NavLink to="/admin/support-tickets" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaLifeRing size={15} /> <span>Support Tickets</span>
          </NavLink>

          <NavLink to="/admin/audit-logs" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaShieldAlt size={15} /> <span>Audit Logs</span>
          </NavLink>
          <NavLink
            to="/admin/newsletters"
            onClick={jumpTop}
            style={({ isActive }) => navStyle(isActive)}
          >
            <FaEnvelope size={15} /> <span>Newsletters</span>
          </NavLink>


          <NavLink to="/dashboard/projects" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaUpload size={15} /> <span>Projects</span>
          </NavLink>
          {/* <Dropdown
            title="CRM Management"
            icon={<FaUsers size={15} />}
            open={openCRM}
            setOpen={setOpenCRM}
            links={[
              { to: "home", icon: <FaUsers size={14} />, label: "Home" },
              { to: "about", icon: <FaUserCog size={14} />, label: "About Us" },
              // { to: "contact", icon: <FaProjectDiagram size={14} />, label: "Contact Us" },
              { to: "crm/blogs", icon: <FaBlog size={14} />, label: "Blogs" },
            ]}
          /> */}

          {/* <Dropdown
            title="Teams"
            icon={<FaUsers size={15} />}
            open={openTeams}
            setOpen={setOpenTeams}
            links={[
              { to: "/dashboard/teams/management", icon: <FaUsers size={14} />, label: "Team Management" },
              { to: "/dashboard/teams/roles", icon: <FaUserCog size={14} />, label: "Role Permissions" },
              { to: "/dashboard/teams/workflow", icon: <FaProjectDiagram size={14} />, label: "Collaboration flow" },
              { to: "/dashboard/teams/collaboration", icon: <FaProjectDiagram size={14} />, label: "Team Collaboration" },
            ]}
          /> */}

          {/* <Dropdown
            title="Master Data"
            icon={<FaFileAlt size={15} />}
            open={openMaster}
            setOpen={setOpenMaster}
          >
            <Dropdown
              title="Emails"
              icon={<FaEnvelopeOpen size={14} />}
              open={openEmail}
              setOpen={setOpenEmail}
              level={1}
              links={[
                { to: "/admin/email-templates/welcome", icon: <FaEnvelopeOpen size={14} />, label: "Welcome Email" },
                { to: "/admin/email-templates/reset", icon: <FaEnvelopeOpen size={14} />, label: "Password Reset" },
                { to: "/admin/email-templates/notification", icon: <FaEnvelopeOpen size={14} />, label: "Notification Email" },
              ]}
            />

            <Dropdown
              title="Database Data"
              icon={<FaDatabase size={14} />}
              open={openDbData}
              setOpen={setOpenDbData}
              level={1}
              links={[
                { to: "/admin/plans", icon: <FaCreditCard size={14} />, label: "Plans" },
                { to: "/admin/roles", icon: <FaUserShield size={14} />, label: "Roles" },
                { to: "/admin/modules", icon: <FaLayerGroup size={14} />, label: "Modules" },
                { to: "/admin/permissions", icon: <FaKey size={14} />, label: "Permissions" },

              ]}
            />
          </Dropdown> */}

          {/* <Dropdown
            title="Settings"
            icon={<FaCog size={15} />}
            open={openSettings}
            setOpen={setOpenSettings}
            links={[
              { to: "/dashboard/privacy", icon: <FaUserShield size={14} />, label: "Privacy Settings" },
              { to: "/dashboard/security", icon: <FaLock size={14} />, label: "Security Settings" },
            ]}
          /> */}

          <SecondaryLinks admin />
        </nav>
      ) : (
        <nav className="p-3 d-flex flex-column gap-1">
          <NavLink to="/dashboard" end onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaHome size={15} /> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/dashboard/projects" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaUpload size={15} /> <span>Projects</span>
          </NavLink>

          {/* <NavLink to="/dashboard/automation" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaCalendarAlt size={15} /> <span>Auto & Schedule</span>
          </NavLink>

          <NavLink to="/dashboard/reports-analytics" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaChartBar size={15} /> <span>Analytics</span>
          </NavLink> */}

          {/* <NavLink to="/dashboard/chatbot" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaComments size={15} /> <span>Chatbot</span>
          </NavLink> */}

          {/* <NavLink to="/dashboard/notifications" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaBell size={15} /> <span>Notifications</span>
          </NavLink> */}

          {/* <Dropdown
            title="Teams"
            icon={<FaUsers size={15} />}
            open={openTeams}
            setOpen={setOpenTeams}
            links={[
              { to: "/dashboard/teams/management", icon: <FaUsers size={14} />, label: "Team Management" },
              { to: "/dashboard/teams/roles", icon: <FaUserCog size={14} />, label: "Role Permissions" },
              { to: "/dashboard/teams/workflow", icon: <FaProjectDiagram size={14} />, label: "Collaboration flow" },
              { to: "/dashboard/teams/collaboration", icon: <FaProjectDiagram size={14} />, label: "Team Collaboration" },
            ]}
          /> */}

          <NavLink to="/dashboard/billing" onClick={jumpTop} style={({ isActive }) => navStyle(isActive)}>
            <FaCreditCard size={15} /> <span>Billing & Subscription</span>
          </NavLink>

          {/* <Dropdown
            title="Settings"
            icon={<FaCog size={15} />}
            open={openSettings}
            setOpen={setOpenSettings}
            links={[
              { to: "/dashboard/privacy", icon: <FaUserShield size={14} />, label: "Privacy Settings" },
              { to: "/dashboard/security", icon: <FaLock size={14} />, label: "Security Settings" },
            ]}
          /> */}

          <SecondaryLinks />
        </nav>
      )}
    </aside>
  );
}

function navStyle(isActive) {
  const teal = "#21c7b8";
  return {
    ...baseStyle,
    color: isActive ? "#fff" : "#cbd5e1",
    borderLeft: isActive ? `3px solid ${teal}` : "3px solid transparent",
    background: isActive ? "rgba(33,199,184,0.05)" : "transparent",
  };
}

function Dropdown({ title, icon, open, setOpen, links = [], level = 0, children }) {
  const indent = 20 + level * 14;
  const teal = "#21c7b8";

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((s) => !s)}
        style={{
          ...baseStyle,
          cursor: "pointer",
          justifyContent: "space-between",
          color: open ? "#fff" : "#cbd5e1",
          borderLeft: open ? `3px solid ${teal}` : "3px solid transparent",
          background: open ? "rgba(33,199,184,0.05)" : "transparent",
          paddingRight: 10,
          marginLeft: level ? indent - 10 : 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon} <span>{title}</span>
        </div>
        {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </div>

      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 200ms ease",
        }}
      >
        <div className="d-flex flex-column gap-1" style={{ marginLeft: indent, marginTop: 8 }}>
          {links.map((l, i) => (
            <NavLink
              key={i}
              to={l.to}
              style={({ isActive }) => ({
                ...baseStyle,
                color: isActive ? "#fff" : "#cbd5e1",
                borderLeft: isActive ? `3px solid ${teal}` : "3px solid transparent",
                background: isActive ? "rgba(33,199,184,0.05)" : "transparent",
              })}
            >
              {l.icon} <span>{l.label}</span>
            </NavLink>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}

function SecondaryLinks({ admin = false }) {
  return (
    <div className="mt-3 d-flex flex-column gap-1">
      <NavLink to="/dashboard/profile" style={({ isActive }) => navStyle(isActive)}>
        <FaUser size={15} /> <span>My Profile</span>
      </NavLink>

      {/* <NavLink to="/dashboard/preferences" style={({ isActive }) => navStyle(isActive)}>
        <FaSlidersH size={15} /> <span>Preferences</span>
      </NavLink> */}

      {/* {!admin && (
        <NavLink to="/dashboard/help" style={({ isActive }) => navStyle(isActive)}>
          <FaLifeRing size={15} /> <span>Help/Support</span>
        </NavLink>
      )} */}

      <Logout>
        <div style={navStyle(false)} className="d-flex align-items-center gap-2">
          <FaSignOutAlt size={15} />
          <span>Logout</span>
        </div>
      </Logout>
    </div>
  );
}
