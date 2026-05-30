import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const steps = [
  {
    step: "01",
    icon: "🎯",
    title: "Add Required Skills",
    desc: "Define the skills and technologies required for the job role.",
    route: "/add-skills",
    accent: "#2563eb",
    light: "#dbeafe",
    btn: "Add Skills →",
  },
  {
    step: "02",
    icon: "📁",
    title: "Upload Resumes",
    desc: "Upload one file, multiple files, or an entire folder of candidate resumes.",
    route: "/upload",
    accent: "#0284c7",
    light: "#e0f2fe",
    btn: "Upload Resumes →",
  },
  {
    step: "03",
    icon: "📊",
    title: "View Results",
    desc: "See ranked candidates with match scores and skill gap analysis.",
    route: "/results",
    accent: "#7c3aed",
    light: "#ede9fe",
    btn: "View Results →",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "HR";

  return (
    <div className="page">
      <Navbar />
      <div style={styles.page}>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.greet}>👋 Welcome back, {name}</div>
          <h1 style={styles.heading}>Resume Skill<br />Matcher</h1>
          <p style={styles.sub}>
            Follow the 3-step workflow below to find the best-matched candidates for your job role.
          </p>
        </div>

        {/* Steps */}
        <div style={styles.steps}>
          {steps.map((s, i) => (
            <div key={s.route} style={styles.stepRow}>
              {/* Connector line */}
              {i < steps.length - 1 && <div style={styles.connector} />}

              <div style={styles.card}>
                {/* Step number badge */}
                <div style={{ ...styles.stepBadge, background: s.light, color: s.accent }}>
                  STEP {s.step}
                </div>

                {/* Icon */}
                <div style={{ ...styles.iconWrap, background: s.light }}>
                  <span style={styles.icon}>{s.icon}</span>
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{s.title}</h3>
                  <p style={styles.cardDesc}>{s.desc}</p>
                </div>

                <button
                  onClick={() => navigate(s.route)}
                  style={{ ...styles.cardBtn, background: s.accent }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {s.btn}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress hint */}
        <div style={styles.hint}>
          <span style={styles.hintIcon}>💡</span>
          <span>Complete each step in order for best results. Skills must be added before uploading resumes.</span>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 980, margin: "0 auto", padding: "60px 24px" },
  hero: { marginBottom: 52, textAlign: "center" },
  greet: { fontSize: "0.9rem", color: "#6b7fa8", marginBottom: 14 },
 heading: {
  fontFamily: "'Syne', sans-serif",
  fontSize: "3.4rem",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "#1e3a5f",
  lineHeight: 1.1,
  marginBottom: 18,
},
  sub: { color: "#6b7fa8", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" },

  steps: { display: "flex", gap: 0, alignItems: "stretch", position: "relative", marginBottom: 36 },
  stepRow: { flex: 1, position: "relative", display: "flex" },
  connector: {
    position: "absolute", top: "50%", right: -1, width: 2,
    height: "60%", transform: "translateY(-50%)",
    background: "linear-gradient(180deg, #c7d7f8 0%, #e8f0fe 100%)",
    zIndex: 1,
  },

  card: {
    flex: 1,
    background: "#ffffff",
    border: "1px solid #c7d7f8",
    borderRadius: 16,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    margin: "0 8px",
    boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  stepBadge: {
    alignSelf: "flex-start",
    padding: "3px 10px",
    borderRadius: 99,
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
  },
  iconWrap: {
    width: 58, height: 58, borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  icon: { fontSize: "1.7rem" },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700,
    color: "#1e3a5f", marginBottom: 8,
  },
  cardDesc: { color: "#6b7fa8", fontSize: "0.875rem", lineHeight: 1.65 },
  cardBtn: {
    padding: "11px 18px",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: "pointer",
    textAlign: "center",
    transition: "opacity 0.2s",
  },

  hint: {
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: 10,
    padding: "13px 18px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: "0.875rem",
    color: "#78716c",
  },
  hintIcon: { fontSize: "1rem" },
};

export default Dashboard;