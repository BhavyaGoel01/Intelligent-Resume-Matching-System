import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hardcoded admin credentials (change these!)
const ADMIN_EMAIL    = "admin@skillmatch.ai";
const ADMIN_PASSWORD = "admin@123";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logoRow}>
          <div style={S.logoDot} />
          <span style={S.logoText}>SkillMatch</span>
        </div>
        <div style={S.badge}>Admin Portal</div>
        <h1 style={S.title}>Welcome back</h1>
        <p style={S.sub}>Sign in to access the admin dashboard</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleLogin} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@skillmatch.ai"
              style={S.input}
              required
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={S.input}
              required
            />
          </div>
          <button type="submit" style={{ ...S.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <a href="/dashboard" style={S.backLink}>← Back to HR Portal</a>
      </div>

      {/* Background decoration */}
      <div style={S.blob1} />
      <div style={S.blob2} />
    </div>
  );
}

const S = {
  page:    { minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  card:    { background: "#ffffff", borderRadius: 20, padding: "48px 44px", width: "100%", maxWidth: 420, position: "relative", zIndex: 2, boxShadow: "0 24px 80px rgba(0,0,0,0.35)" },
  logoRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 28 },
  logoDot: { width: 10, height: 10, borderRadius: "50%", background: "#2563eb" },
  logoText:{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#1e3a5f" },
  badge:   { display: "inline-block", padding: "3px 12px", background: "#ede9fe", color: "#7c3aed", borderRadius: 99, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 },
  title:   { fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#1e3a5f", marginBottom: 6 },
  sub:     { color: "#6b7fa8", fontSize: "0.9rem", marginBottom: 32 },
  error:   { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.875rem", marginBottom: 20 },
  form:    { display: "flex", flexDirection: "column", gap: 18 },
  field:   { display: "flex", flexDirection: "column", gap: 6 },
  label:   { fontSize: "0.82rem", fontWeight: 700, color: "#4a6080" },
  input:   { padding: "11px 14px", border: "1.5px solid #c7d7f8", borderRadius: 9, fontSize: "0.9rem", color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  btn:     { padding: "13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", marginTop: 4 },
  backLink:{ display: "block", textAlign: "center", marginTop: 24, color: "#6b7fa8", fontSize: "0.82rem", textDecoration: "none" },
  blob1:   { position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)", zIndex: 1 },
  blob2:   { position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)", zIndex: 1 },
};