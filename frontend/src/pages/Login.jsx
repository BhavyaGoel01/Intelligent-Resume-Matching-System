import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // login uses plain axios (no token needed yet)

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className="page">
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.pill}>AI-Powered Matching</div>
          <h1 style={styles.headline}>
            Match your skills.
            <br />
            Land your role.
          </h1>
          <p style={styles.sub}>
            Upload your resume and instantly see how well you match any job
            description.
          </p>
          <div style={styles.stats}>
            {["95% Accuracy", "PDF Support", "Instant Results"].map((s) => (
              <div key={s} style={styles.stat}>
                <span style={styles.statDot} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <span style={styles.logoDot} />
            SkillMatch
          </div>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="bhavya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In ->"}
            </button>
          </form>
          <p style={styles.footer}>
            No account?{" "}
            <Link to="/register" style={styles.footerLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh" },
  left: {
    flex: 1,
    background:
      "linear-gradient(135deg, #0f3d36 0%, #176b5b 52%, #d59b45 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },
  leftInner: { maxWidth: 420 },
  pill: {
    display: "inline-block",
    padding: "4px 14px",
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 99,
    color: "#ffffff",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginBottom: 28,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "2.8rem",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#ffffff",
    marginBottom: 20,
  },
  sub: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.7,
    fontSize: "1rem",
    marginBottom: 36,
  },
  stats: { display: "flex", flexDirection: "column", gap: 12 },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.9rem",
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#ffffff",
    flexShrink: 0,
  },
  right: {
    width: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#f6f1e8",
  },
  card: { width: "100%", maxWidth: 380 },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.1rem",
    color: "#17352f",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#d59b45",
    display: "inline-block",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#17352f",
    marginBottom: 6,
  },
  subtitle: { color: "#69766f", marginBottom: 32, fontSize: "0.95rem" },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  label: {
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#40564f",
    letterSpacing: "0.02em",
  },
  btn: {
    marginTop: 8,
    padding: "13px",
    background: "#17352f",
    color: "#fff8ef",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#dc2626",
    fontSize: "0.875rem",
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#69766f",
    fontSize: "0.875rem",
  },
  footerLink: { color: "#b7792f", fontWeight: 600 },
};

export default Login;
