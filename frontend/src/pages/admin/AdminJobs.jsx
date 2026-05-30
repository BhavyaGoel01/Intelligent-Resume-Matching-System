import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";

export default function AdminJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);
  const [msg, setMsg]         = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.reverse());
    } catch { setJobs([]); }
    setLoading(false);
  };

  const deleteJob = async (id, title) => {
    if (!window.confirm(`Delete job "${title}"?`)) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(prev => prev.filter(j => j.id !== id));
      setMsg("✅ Job deleted.");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ Failed to delete.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}><i className="bi bi-briefcase-fill" style={{ color: "#f59e0b", marginRight: 10 }} />Jobs</h1>
            <p style={S.sub}>{jobs.length} job description{jobs.length !== 1 ? "s" : ""} saved</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchJobs}>↻ Refresh</button>
        </div>

        {msg && <div style={{ ...S.toast, background: msg.startsWith("✅") ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderColor: msg.startsWith("✅") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", color: msg.startsWith("✅") ? "#34d399" : "#f87171" }}>{msg}</div>}

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="bi bi-search" style={{ color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…" style={S.searchInput} />
          </div>
          <span style={S.count}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={S.loadingRow}><div style={S.spinner} /></div>
        ) : (
          <div style={S.list}>
            {filtered.length === 0 ? (
              <div style={S.empty}>No jobs found</div>
            ) : filtered.map(j => {
              const wordCount = j.description?.split(/\s+/).length || 0;
              const keywords  = j.description ? [...new Set(j.description.toLowerCase().split(/[\s,]+/).filter(w => w.length > 3))].slice(0, 8) : [];
              return (
                <div key={j.id} style={S.card}>
                  <div style={S.cardTop}>
                    <div style={S.jobIconWrap}>
                      <i className="bi bi-briefcase-fill" style={{ fontSize: "1.2rem", color: "#f59e0b" }} />
                    </div>
                    <div style={S.cardInfo}>
                      <span style={S.jobTitle}>{j.title}</span>
                      <div style={S.metaRow}>
                        <span style={S.dateBadge}>{j.createdAt?.slice(0,10) || "—"}</span>
                        <span style={S.wordBadge}>{wordCount} words</span>
                        <span style={S.idBadge}>ID: {j.id}</span>
                      </div>
                      {keywords.length > 0 && (
                        <div style={S.kwRow}>
                          {keywords.map(k => <span key={k} style={S.kwChip}>{k}</span>)}
                          {wordCount > 8 && <span style={S.kwMore}>+more</span>}
                        </div>
                      )}
                    </div>
                    <div style={S.actions}>
                      <button style={S.previewBtn} onClick={() => setExpanded(expanded === j.id ? null : j.id)}>
                        <i className={`bi ${expanded === j.id ? "bi-eye-slash" : "bi-eye"}`} /> {expanded === j.id ? "Hide" : "View"}
                      </button>
                      <button style={S.deleteBtn} onClick={() => deleteJob(j.id, j.title)}>
                        <i className="bi bi-trash3-fill" />
                      </button>
                    </div>
                  </div>
                  {expanded === j.id && (
                    <div style={S.descBox}>
                      <div style={S.descLabel}>Full Job Description</div>
                      <p style={S.descText}>{j.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:        { minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif" },
  body:        { maxWidth: 1100, margin: "0 auto", padding: "36px 28px" },
  topRow:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  heading:     { fontFamily: "'Syne', sans-serif", fontSize: "1.7rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub:         { color: "#64748b", fontSize: "0.88rem" },
  refreshBtn:  { padding: "8px 18px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#60a5fa", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  toast:       { border: "1px solid", borderRadius: 9, padding: "10px 16px", marginBottom: 18, fontSize: "0.875rem", fontWeight: 600 },
  toolbar:     { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  searchWrap:  { position: "relative", flex: 1 },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  count:       { color: "#64748b", fontSize: "0.82rem", whiteSpace: "nowrap" },
  loadingRow:  { display: "flex", justifyContent: "center", padding: "50px" },
  spinner:     { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  list:        { display: "flex", flexDirection: "column", gap: 10 },
  empty:       { textAlign: "center", color: "#475569", padding: "40px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" },
  card:        { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" },
  cardTop:     { display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px" },
  jobIconWrap: { width: 40, height: 40, background: "rgba(245,158,11,0.12)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardInfo:    { flex: 1, minWidth: 0 },
  jobTitle:    { display: "block", color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 },
  metaRow:     { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 },
  dateBadge:   { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  wordBadge:   { background: "rgba(245,158,11,0.12)", color: "#fbbf24", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  idBadge:     { background: "rgba(255,255,255,0.06)", color: "#64748b", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  kwRow:       { display: "flex", flexWrap: "wrap", gap: 5 },
  kwChip:      { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.7rem", padding: "1px 7px", borderRadius: 99 },
  kwMore:      { color: "#64748b", fontSize: "0.7rem", padding: "1px 4px" },
  actions:     { display: "flex", gap: 8, flexShrink: 0 },
  previewBtn:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 7, color: "#fbbf24", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  deleteBtn:   { padding: "6px 10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 7, color: "#f87171", fontSize: "0.82rem", cursor: "pointer" },
  descBox:     { borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", background: "rgba(0,0,0,0.2)" },
  descLabel:   { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  descText:    { color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" },
};