import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/admin/dashboard",   label: "Dashboard",   icon: "bi-speedometer2" },
  { to: "/admin/users",       label: "Users",        icon: "bi-people-fill" },
  { to: "/admin/resumes",     label: "Resumes",      icon: "bi-file-earmark-person-fill" },
  { to: "/admin/jobs",        label: "Jobs",         icon: "bi-briefcase-fill" },
  { to: "/admin/selected",    label: "Selected",     icon: "bi-person-check-fill" },
  { to: "/admin/emails",      label: "Emails",       icon: "bi-envelope-check-fill" },
];

export default function AdminNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin");
  };

  return (
    <nav style={S.nav}>
      <Link to="/admin/dashboard" style={S.brand}>
        <div style={S.brandDot} />
        SkillMatch
        <span style={S.adminBadge}>ADMIN</span>
      </Link>

      <div style={S.links}>
        {navLinks.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            style={{ ...S.link, ...(pathname === to ? S.linkActive : {}) }}
          >
            <i className={`bi ${icon}`} style={{ fontSize: "0.85rem" }} />
            {label}
          </Link>
        ))}
      </div>

      <div style={S.rightGroup}>
        <Link to="/dashboard" style={S.hrBtn}>← HR Portal</Link>
        <button onClick={logout} style={S.logout}>Logout</button>
      </div>
    </nav>
  );
}

const S = {
  nav:       { display: "flex", alignItems: "center", gap: 0, padding: "0 32px", height: 60, background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 100 },
  brand:     { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginRight: 32, flexShrink: 0 },
  brandDot:  { width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" },
  adminBadge:{ background: "#7c3aed", color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "2px 7px", borderRadius: 99, letterSpacing: "0.08em" },
  links:     { display: "flex", flex: 1, gap: 2 },
  link:      { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, fontSize: "0.82rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "all 0.15s" },
  linkActive:{ color: "#ffffff", background: "rgba(59,130,246,0.2)" },
  rightGroup:{ display: "flex", alignItems: "center", gap: 10 },
  hrBtn:     { padding: "6px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", textDecoration: "none", cursor: "pointer" },
  logout:    { padding: "6px 14px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, color: "#f87171", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};