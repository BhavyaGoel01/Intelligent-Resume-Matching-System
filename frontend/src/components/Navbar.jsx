import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/dashboard",  label: "Dashboard" },
  { to: "/add-skills", label: "Add Skills" },
  { to: "/upload",     label: "Upload Resumes" },
  { to: "/results",    label: "Results" },
  { to: "/contact",    label: "Contact Us" },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        <span style={styles.brandDot} />
        SkillMatch
      </Link>

      <div style={styles.links}>
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              ...styles.link,
              ...(pathname === to ? styles.linkActive : {}),
            }}
          >
            {label}
            {pathname === to && <span style={styles.activeDot} />}
          </Link>
        ))}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          navigate("/");
        }}
        style={styles.logout}
      >
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: "64px", background: "#ffffff",
    borderBottom: "1px solid #c7d7f8", position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 8px rgba(37,99,235,0.07)",
  },
  brand: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.25rem",
    color: "#1e3a5f", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
  },
  brandDot: { width: 10, height: 10, borderRadius: "50%", background: "#2563eb", display: "inline-block" },
  links: { display: "flex", gap: "2px" },
  link: {
    position: "relative", padding: "6px 12px", borderRadius: "6px",
    fontSize: "0.85rem", fontWeight: 500, color: "#6b7fa8",
    textDecoration: "none", transition: "color 0.2s",
  },
  linkActive: { color: "#2563eb", background: "#dbeafe" },
  activeDot: {
    position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
    width: 4, height: 4, borderRadius: "50%", background: "#2563eb", display: "block",
  },
  logout: {
    padding: "7px 18px", background: "transparent", border: "1px solid #c7d7f8",
    borderRadius: "8px", color: "#6b7fa8", fontSize: "0.875rem", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
  },
};

export default Navbar;