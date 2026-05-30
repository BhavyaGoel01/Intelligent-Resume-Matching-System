import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";
export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [recentResumes, setRecentResumes] = useState([]);
  const [recentJobs, setRecentJobs]       = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, resumesRes, jobsRes, selectedRes] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/resumes"),
        api.get("/jobs"),
        api.get("/selected/all"),
      ]);

      const users    = usersRes.status    === "fulfilled" ? usersRes.value.data    : [];
      const resumes  = resumesRes.status  === "fulfilled" ? resumesRes.value.data  : [];
      const jobs     = jobsRes.status     === "fulfilled" ? jobsRes.value.data     : [];
      const selected = selectedRes.status === "fulfilled" ? selectedRes.value.data : [];

      setStats({ users: users.length, resumes: resumes.length, jobs: jobs.length, selected: selected.length });
      setRecentResumes([...resumes].reverse().slice(0, 5));
      setRecentJobs([...jobs].reverse().slice(0, 5));
    } catch (e) {
      setStats({ users: 0, resumes: 0, jobs: 0, selected: 0 });
    }
    setLoading(false);
  };

  const cards = stats ? [
    { label: "Total Users",      value: stats.users,    icon: "bi-people-fill",                color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)" },
    { label: "Resumes Uploaded", value: stats.resumes,  icon: "bi-file-earmark-person-fill",   color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" },
    { label: "Jobs Posted",      value: stats.jobs,     icon: "bi-briefcase-fill",             color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)" },
    { label: "Candidates Selected", value: stats.selected, icon: "bi-person-check-fill",       color: "#a855f7", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.25)" },
  ] : [];

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}>Admin Dashboard</h1>
            <p style={S.sub}>Complete overview of SkillMatch activity</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchAll}>↻ Refresh</button>
        </div>

        {loading ? (
          <div style={S.loadingRow}><div style={S.spinner} /><span style={{ color: "#64748b" }}>Loading stats…</span></div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={S.cardGrid}>
              {cards.map(c => (
                <div key={c.label} style={{ ...S.statCard, background: c.bg, border: `1px solid ${c.border}` }}>
                  <div style={{ ...S.statIcon, color: c.color }}>
                    <i className={`bi ${c.icon}`} style={{ fontSize: "1.4rem" }} />
                  </div>
                  <div style={{ ...S.statNum, color: c.color }}>{c.value}</div>
                  <div style={S.statLabel}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div style={S.twoCol}>
              {/* Recent Resumes */}
              <div style={S.tableCard}>
                <div style={S.tableHeader}>
                  <span style={S.tableTitle}><i className="bi bi-file-earmark-person-fill" style={{ color: "#10b981", marginRight: 8 }} />Recent Resumes</span>
                  <a href="/admin/resumes" style={S.viewAll}>View All →</a>
                </div>
                <table style={S.table}>
                  <thead>
                    <tr>{["File Name", "Email", "Uploaded"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {recentResumes.length === 0 ? (
                      <tr><td colSpan={3} style={S.empty}>No resumes yet</td></tr>
                    ) : recentResumes.map(r => (
                      <tr key={r.id} style={S.tr}>
                        <td style={S.td}><span style={S.fileName}>📄 {r.fileName}</span></td>
                        <td style={S.td}><span style={S.emailCell}>{r.candidateEmail || "—"}</span></td>
                        <td style={S.td}><span style={S.dateBadge}>{r.uploadedAt?.slice(0,10) || "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Jobs */}
              <div style={S.tableCard}>
                <div style={S.tableHeader}>
                  <span style={S.tableTitle}><i className="bi bi-briefcase-fill" style={{ color: "#f59e0b", marginRight: 8 }} />Recent Jobs</span>
                  <a href="/admin/jobs" style={S.viewAll}>View All →</a>
                </div>
                <table style={S.table}>
                  <thead>
                    <tr>{["Title", "Created"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {recentJobs.length === 0 ? (
                      <tr><td colSpan={2} style={S.empty}>No jobs yet</td></tr>
                    ) : recentJobs.map(j => (
                      <tr key={j.id} style={S.tr}>
                        <td style={S.td}><span style={S.jobTitle}>💼 {j.title}</span></td>
                        <td style={S.td}><span style={S.dateBadge}>{j.createdAt?.slice(0,10) || "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  page:       { minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif" },
  body:       { maxWidth: 1100, margin: "0 auto", padding: "36px 28px" },
  topRow:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  heading:    { fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 },
  sub:        { color: "#64748b", fontSize: "0.9rem" },
  refreshBtn: { padding: "8px 18px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#60a5fa", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  loadingRow: { display: "flex", alignItems: "center", gap: 12, padding: "60px", justifyContent: "center" },
  spinner:    { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  cardGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard:   { borderRadius: 14, padding: "24px", display: "flex", flexDirection: "column", gap: 8 },
  statIcon:   { marginBottom: 4 },
  statNum:    { fontFamily: "'Syne', sans-serif", fontSize: "2.4rem", fontWeight: 800, lineHeight: 1 },
  statLabel:  { fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" },

  twoCol:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  tableCard:  { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" },
  tableHeader:{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  tableTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#f1f5f9", fontSize: "0.9rem" },
  viewAll:    { color: "#60a5fa", fontSize: "0.78rem", textDecoration: "none" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { padding: "10px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  tr:         { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td:         { padding: "12px 20px" },
  empty:      { padding: "20px", textAlign: "center", color: "#475569", fontSize: "0.85rem" },
  fileName:   { color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 500 },
  emailCell:  { color: "#60a5fa", fontSize: "0.78rem" },
  jobTitle:   { color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 500 },
  dateBadge:  { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
};