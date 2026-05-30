import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Suggested skill chips for quick-add
const SUGGESTED = [
  "Java", "Spring Boot", "React", "Python", "SQL", "REST API",
  "Microservices", "Docker", "Git", "AWS", "Node.js", "MongoDB",
  "Kafka", "Redis", "TypeScript", "Kubernetes", "CI/CD", "Agile",
  "Machine Learning", "Hibernate", "Maven", "Linux", "PostgreSQL",
];

function AddSkills() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle]   = useState("");
  const [skills, setSkills]       = useState([]);    // added skills list
  const [input, setInput]         = useState("");    // text box value
  const [saved, setSaved]         = useState(false);

  // Add a skill (from text input or chip click)
  const addSkill = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) return; // no duplicates
    setSkills((prev) => [...prev, trimmed]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addSkill(input);
    }
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const handleSave = () => {
    if (!jobTitle.trim()) { alert("Please enter a job title."); return; }
    if (skills.length === 0) { alert("Please add at least one skill."); return; }
    // Save to localStorage so UploadResumes & Results pages can use it
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("requiredSkills", JSON.stringify(skills));
    setSaved(true);
  };

  const suggested = SUGGESTED.filter(
    (s) => !skills.map(x => x.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.stepTag}>Step 01</div>
          <h1 style={styles.title}>Add Required Skills</h1>
          <p style={styles.subtitle}>
            Define the job title and all skills needed for this role. Candidates will be matched against these.
          </p>
        </div>

        {!saved ? (
          <div style={styles.card}>
            {/* Job Title */}
            <div style={styles.field}>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Java Backend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* Skills input */}
            <div style={styles.field}>
              <label style={styles.label}>Required Skills</label>
              <div style={styles.tagInput}>
                {skills.map((s) => (
                  <span key={s} style={styles.tag}>
                    {s}
                    <button style={styles.tagX} onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))}
                <input
                  style={styles.tagInputBox}
                  placeholder={skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => addSkill(input)}
                />
              </div>
              <p style={styles.hint}>Press Enter, Tab, or comma to add each skill</p>
            </div>

            {/* Skill count */}
            {skills.length > 0 && (
              <div style={styles.countRow}>
                <span style={styles.countBadge}>{skills.length} skill{skills.length > 1 ? "s" : ""} added</span>
              </div>
            )}

            {/* Suggested chips */}
            <div style={styles.field}>
              <label style={styles.label}>Quick Add — Click to add</label>
              <div style={styles.chips}>
                {suggested.slice(0, 16).map((s) => (
                  <button key={s} style={styles.chip} onClick={() => addSkill(s)}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} style={styles.btn}>
              Save Skills & Continue →
            </button>
          </div>
        ) : (
          /* Success */
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <h3 style={styles.successTitle}>Skills saved!</h3>
            <p style={styles.successSub}>{jobTitle}</p>

            <div style={styles.skillsPreview}>
              {skills.map((s) => (
                <span key={s} style={styles.savedChip}>{s}</span>
              ))}
            </div>

            <div style={styles.actions}>
              <button style={styles.btnOutline} onClick={() => setSaved(false)}>
                Edit Skills
              </button>
              <button style={styles.btn} onClick={() => navigate("/upload")}>
                Upload Resumes →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 680, margin: "0 auto", padding: "60px 24px" },
  header: { marginBottom: 36 },
  stepTag: {
    display: "inline-block", padding: "3px 12px", background: "#dbeafe",
    color: "#2563eb", borderRadius: 99, fontSize: "0.75rem", fontWeight: 800,
    letterSpacing: "0.06em", marginBottom: 14,
  },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#1e3a5f", marginBottom: 8 },
  subtitle: { color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.6 },

  card: {
    background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 16,
    padding: "36px", display: "flex", flexDirection: "column", gap: 24,
    boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#4a6080", letterSpacing: "0.02em" },
  hint: { fontSize: "0.78rem", color: "#93b4d0" },

  tagInput: {
    display: "flex", flexWrap: "wrap", gap: 8,
    padding: "10px 12px", background: "#f8faff",
    border: "1px solid #c7d7f8", borderRadius: 8, minHeight: 52, cursor: "text",
  },
  tag: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", background: "#dbeafe",
    border: "1px solid #93c5fd", borderRadius: 99,
    color: "#1d4ed8", fontSize: "0.82rem", fontWeight: 600,
  },
  tagX: {
    background: "none", border: "none", cursor: "pointer",
    color: "#3b82f6", fontSize: "1rem", lineHeight: 1, padding: 0,
    display: "flex", alignItems: "center",
  },
  tagInputBox: {
    border: "none", outline: "none", background: "transparent",
    fontSize: "0.9rem", color: "#1e3a5f", minWidth: 180, flex: 1,
    fontFamily: "'DM Sans', sans-serif",
  },

  countRow: { display: "flex" },
  countBadge: {
    padding: "4px 14px", background: "#dcfce7", border: "1px solid #86efac",
    borderRadius: 99, color: "#15803d", fontSize: "0.8rem", fontWeight: 600,
  },

  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    padding: "5px 13px", background: "#f8faff", border: "1px solid #c7d7f8",
    borderRadius: 99, color: "#4a6080", fontSize: "0.8rem", fontWeight: 500,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },

  btn: {
    padding: "13px", background: "#2563eb", color: "#ffffff",
    border: "none", borderRadius: 8, fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
  },
  btnOutline: {
    padding: "13px", background: "transparent", color: "#1e3a5f",
    border: "1px solid #c7d7f8", borderRadius: 8, fontFamily: "'Syne', sans-serif",
    fontWeight: 600, fontSize: "0.95rem", cursor: "pointer", flex: 1,
  },

  successCard: {
    background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 16,
    padding: "48px 36px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 14, boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
  },
  successIcon: { fontSize: "3rem" },
  successTitle: { fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1e3a5f" },
  successSub: { color: "#6b7fa8", fontSize: "0.95rem", marginBottom: 4 },
  skillsPreview: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 },
  savedChip: {
    padding: "4px 12px", background: "#dbeafe", border: "1px solid #93c5fd",
    borderRadius: 99, color: "#1d4ed8", fontSize: "0.8rem", fontWeight: 600,
  },
  actions: { display: "flex", gap: 12, marginTop: 8, width: "100%" },
};

export default AddSkills;