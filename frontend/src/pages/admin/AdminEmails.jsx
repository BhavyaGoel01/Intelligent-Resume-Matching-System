import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";

export default function AdminEmails() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/selected/all");
      setSelected(res.data.reverse());
    } catch { setSelected([]); }
    setLoading(false);
  };

  const filtered = selected.filter(c =>
    c.candidateEmail?.toLowerCase().includes(search.toLowerCase()) ||
    c.resumeFileName?.toLowerCase().includes(search.toLowerCase()) ||
    c.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const sentCount = selected.length; // every saved selected candidate had email sent

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}><i className="bi bi-envelope-check-fill" style={{ color: "#3b82f6", marginRight: 10 }} />Email Log</h1>
            <p style={S.sub}>All selection emails sent to candidates</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchData}>↻ Refresh</button>
        </div>

        <div style={S.statsRow}>
          <div style={S.statBox}>
            <span style={{ ...S.statNum, color: "#3b82f6" }}>{sentCount}</span>
            <span style={S.statLbl}>Total Sent</span>
          </div>
          <div style={S.statBox}>
            <span style={{ ...S.statNum, color: "#10b981" }}>{[...new Set(selected.map(c => c.jobTitle))].filter(Boolean).length}</span>
            <span style={S.statLbl}>Jobs Covered</span>
          </div>
          <div style={S.statBox}>
            <span style={{ ...S.statNum, color: "#f59e0b" }}>{[...new Set(selected.map(c => c.candidateEmail))].filter(Boolean).length}</span>
            <span style={S.statLbl}>Unique Recipients</span>
          </div>
        </div>

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="bi bi-search" style={{ color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email, name, or job…" style={S.searchInput} />
          </div>
        </div>

        <div style={S.tableCard}>
          {loading ? (
            <div style={S.loadingRow}><div style={S.spinner} /></div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>{["Recipient Email", "Resume", "Job Title", "Match %", "Sent On"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={S.empty}>No emails logged yet</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id} style={S.tr}>
                    <td style={S.td}>
                      <div style={S.recipientRow}>
                        <div style={S.avatarCircle}><i className="bi bi-envelope-fill" style={{ fontSize: "0.75rem" }} /></div>
                        <span style={S.emailCell}>{c.candidateEmail || "—"}</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={S.fileName}>📄 {c.resumeFileName || "—"}</span></td>
                    <td style={S.td}><span style={S.jobTitle}>{c.jobTitle || "—"}</span></td>
                    <td style={S.td}>
                      <span style={{
                        background: c.matchPercentage >= 80 ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                        color:      c.matchPercentage >= 80 ? "#34d399" : "#fbbf24",
                        padding: "3px 12px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 800
                      }}>{c.matchPercentage}%</span>
                    </td>
                    <td style={S.td}>
                      <div style={S.sentPill}>
                        <i className="bi bi-check-circle-fill" style={{ color: "#34d399", fontSize: "0.75rem" }} />
                        <span style={S.dateBadge}>{c.savedAt?.slice(0, 16) || "—"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  page:        { minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif" },
  body:        { maxWidth: 1100, margin: "0 auto", padding: "36px 28px" },
  topRow:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  heading:     { fontFamily: "'Syne', sans-serif", fontSize: "1.7rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub:         { color: "#64748b", fontSize: "0.88rem" },
  refreshBtn:  { padding: "8px 18px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#60a5fa", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  statsRow:    { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 },
  statBox:     { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 },
  statNum:     { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800 },
  statLbl:     { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" },
  toolbar:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  searchWrap:  { position: "relative", flex: 1 },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  tableCard:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" },
  loadingRow:  { display: "flex", justifyContent: "center", padding: "50px" },
  spinner:     { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { padding: "12px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" },
  tr:          { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td:          { padding: "13px 20px" },
  empty:       { padding: "30px", textAlign: "center", color: "#475569", fontSize: "0.875rem" },
  recipientRow:{ display: "flex", alignItems: "center", gap: 10 },
  avatarCircle:{ width: 28, height: 28, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", flexShrink: 0 },
  emailCell:   { color: "#60a5fa", fontSize: "0.82rem" },
  fileName:    { color: "#94a3b8", fontSize: "0.78rem" },
  jobTitle:    { color: "#e2e8f0", fontSize: "0.82rem" },
  sentPill:    { display: "flex", alignItems: "center", gap: 6 },
  dateBadge:   { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
};