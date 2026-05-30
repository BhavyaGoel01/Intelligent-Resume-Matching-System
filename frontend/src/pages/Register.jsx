import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // 🔌 REAL API CALL to Spring Boot backend
      const res = await axios.post("http://localhost:8081/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Save JWT token and user info in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      navigate("/dashboard");
    } catch (err) {
      // Show error from backend (e.g. "Email already registered")
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className="page">
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoDot} />
            SkillMatch
          </div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>
            Start matching resumes to jobs in seconds
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.row}>
            <Field
              label="Full Name"
              value={form.name}
              onChange={update("name")}
              placeholder="Bhavya Goel"
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="bhavya@example.com"
            />
          </div>
          <div style={styles.row}>
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Min. 6 characters"
            />
            <Field
              label="Confirm Password"
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              placeholder="Repeat password"
            />
          </div>
          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label
        style={{
          fontSize: "0.82rem",
          fontWeight: 500,
          color: "#40564f",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f6f1e8",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "#ffffff",
    border: "1px solid #d9c8ad",
    borderRadius: 16,
    padding: "48px 44px",
    boxShadow: "0 4px 24px rgba(23,53,47,0.10)",
  },
  header: { marginBottom: 36 },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "1.1rem",
    color: "#17352f",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
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
    fontSize: "1.7rem",
    fontWeight: 700,
    color: "#17352f",
    marginBottom: 6,
  },
  subtitle: { color: "#69766f", fontSize: "0.95rem" },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
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

export default Register;
