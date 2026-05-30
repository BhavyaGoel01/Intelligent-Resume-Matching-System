import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";

export default function AdminResumes() {
  const [resumes, setResumes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState(null);
  const [msg, setMsg]           = useState("");

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resumes");
      setResumes(res.data.reverse());
    } catch { setResumes([]); }
    setLoading(false);
  };

  const deleteResume = async (id, name) => {
    if (!window.confirm(`Delete resume "${name}"?`)) return;
    try {
      await api.delete(`/admin/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      setMsg("✅ Resume deleted.");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ Failed to delete.");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const filtered = resumes.filter(r =>
    r.fileName?.toLowerCase().includes(search.toLowerCase()) ||
    r.candidateEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}><i className="bi bi-file-earmark-person-fill" style={{ color: "#10b981", marginRight: 10 }} />Resumes</h1>
            <p style={S.sub}>{resumes.length} resume{resumes.length !== 1 ? "s" : ""} uploaded</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchResumes}>↻ Refresh</button>
        </div>

        {msg && <div style={{ ...S.toast, background: msg.startsWith("✅") ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderColor: msg.startsWith("✅") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", color: msg.startsWith("✅") ? "#34d399" : "#f87171" }}>{msg}</div>}

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="bi bi-search" style={{ color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by filename or email…" style={S.searchInput} />
          </div>
          <span style={S.count}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={S.loadingRow}><div style={S.spinner} /><span style={{ color: "#64748b" }}>Loading resumes…</span></div>
        ) : (
          <div style={S.list}>
            {filtered.length === 0 ? (
              <div style={S.empty}>No resumes found</div>
            ) : filtered.map(r => (
              <div key={r.id} style={S.card}>
                <div style={S.cardTop}>
                  <div style={S.fileIcon}>
                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: "1.4rem", color: "#f87171" }} />
                  </div>
                  <div style={S.cardInfo}>
                    <span style={S.fileName}>{r.fileName}</span>
                    <div style={S.metaRow}>
                      {r.candidateEmail && <span style={S.emailChip}>📧 {r.candidateEmail}</span>}
                      <span style={S.dateBadge}>{r.uploadedAt?.slice(0,10) || "—"}</span>
                      <span style={S.idBadge}>ID: {r.id}</span>
                    </div>
                  </div>
                  <div style={S.actions}>
                    <button style={S.previewBtn} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                      <i className={`bi ${expanded === r.id ? "bi-eye-slash" : "bi-eye"}`} /> {expanded === r.id ? "Hide" : "Preview"}
                    </button>
                    <button style={S.deleteBtn} onClick={() => deleteResume(r.id, r.fileName)}>
                      <i className="bi bi-trash3-fill" />
                    </button>
                  </div>
                </div>
                {expanded === r.id && (
                  <div style={S.textPreview}>
                    <div style={S.previewLabel}>Extracted Text Preview</div>
                    <pre style={S.previewText}>{(r.extractedText || "No text extracted.").slice(0, 800)}{r.extractedText?.length > 800 ? "\n…(truncated)" : ""}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:       { minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif" },
  body:       { maxWidth: 1100, margin: "0 auto", padding: "36px 28px" },
  topRow:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  heading:    { fontFamily: "'Syne', sans-serif", fontSize: "1.7rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub:        { color: "#64748b", fontSize: "0.88rem" },
  refreshBtn: { padding: "8px 18px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#60a5fa", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  toast:      { border: "1px solid", borderRadius: 9, padding: "10px 16px", marginBottom: 18, fontSize: "0.875rem", fontWeight: 600 },
  toolbar:    { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  searchWrap: { position: "relative", flex: 1 },
  searchInput:{ width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  count:      { color: "#64748b", fontSize: "0.82rem", whiteSpace: "nowrap" },
  loadingRow: { display: "flex", alignItems: "center", gap: 12, padding: "50px", justifyContent: "center" },
  spinner:    { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  list:       { display: "flex", flexDirection: "column", gap: 10 },
  empty:      { textAlign: "center", color: "#475569", padding: "40px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" },
  card:       { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" },
  cardTop:    { display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" },
  fileIcon:   { flexShrink: 0 },
  cardInfo:   { flex: 1, minWidth: 0 },
  fileName:   { display: "block", color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  metaRow:    { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  emailChip:  { background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "2px 9px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600 },
  dateBadge:  { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  idBadge:    { background: "rgba(255,255,255,0.06)", color: "#64748b", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  actions:    { display: "flex", gap: 8, flexShrink: 0 },
  previewBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, color: "#60a5fa", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  deleteBtn:  { padding: "6px 10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 7, color: "#f87171", fontSize: "0.82rem", cursor: "pointer" },
  textPreview:{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px", background: "rgba(0,0,0,0.2)" },
  previewLabel:{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  previewText:{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, maxHeight: 200, overflowY: "auto" },
};