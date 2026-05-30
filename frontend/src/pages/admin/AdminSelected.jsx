import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";

export default function AdminSelected() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");

  useEffect(() => { fetchSelected(); }, []);

  const fetchSelected = async () => {
    setLoading(true);
    try {
      const res = await api.get("/selected/all");
      setCandidates(res.data.reverse());
    } catch { setCandidates([]); }
    setLoading(false);
  };

  const filtered = candidates.filter(c => {
    const matchSearch =
      c.resumeFileName?.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"    ? true :
      filter === "high"   ? c.matchPercentage >= 80 :
      filter === "medium" ? c.matchPercentage >= 60 && c.matchPercentage < 80 : true;
    return matchSearch && matchFilter;
  });

  const pct = c => c.matchPercentage;
  const pctColor = p => p >= 80 ? "#10b981" : p >= 60 ? "#f59e0b" : "#ef4444";
  const pctBg    = p => p >= 80 ? "rgba(16,185,129,0.12)" : p >= 60 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";

  const downloadReport = () => {
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const rows = filtered.map((c, i) => `
      <tr style="background:${i%2===0?"#f8faff":"#fff"}">
        <td>${i+1}</td>
        <td>${c.resumeFileName || "—"}</td>
        <td style="color:#2563eb">${c.candidateEmail || "—"}</td>
        <td>${c.jobTitle || "—"}</td>
        <td style="text-align:center">
          <span style="background:${pctBg(pct(c))};color:${pctColor(pct(c))};padding:3px 12px;border-radius:99px;font-weight:700">${c.matchPercentage}%</span>
        </td>
        <td style="font-size:12px;color:#16a34a">${c.matchedSkills || "—"}</td>
        <td style="font-size:11px;color:#94a3b8">${c.savedAt?.slice(0,10) || "—"}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',sans-serif;}
      .hdr{background:linear-gradient(135deg,#1d4ed8,#7c3aed);padding:32px 48px;color:#fff;}
      .hdr h1{font-size:22px;font-weight:800;margin-bottom:4px;}
      .meta{display:flex;gap:28px;padding:16px 48px;background:#f8faff;border-bottom:2px solid #e8f0fe;}
      .meta div{display:flex;flex-direction:column;}
      .meta .lbl{font-size:10px;font-weight:700;color:#6b7fa8;text-transform:uppercase;}
      .meta .val{font-size:14px;font-weight:700;color:#1e3a5f;}
      .body{padding:24px 48px;}
      table{width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e8f0fe;border-radius:8px;overflow:hidden;}
      th{background:#1d4ed8;color:#fff;padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;}
      td{padding:10px 14px;border-bottom:1px solid #e8f0fe;}
      .footer{margin-top:24px;text-align:center;font-size:11px;color:#94a3b8;}
      @media print{.hdr{-webkit-print-color-adjust:exact;print-color-adjust:exact;}th{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
      </style></head><body>
      <div class="hdr"><h1>📋 Selected Candidates — Admin Report</h1><p>SkillMatch Admin Portal</p></div>
      <div class="meta">
        <div><span class="lbl">Generated</span><span class="val">${date}</span></div>
        <div><span class="lbl">Total Selected</span><span class="val">${filtered.length}</span></div>
        <div><span class="lbl">Avg Match</span><span class="val">${filtered.length ? (filtered.reduce((a,c)=>a+c.matchPercentage,0)/filtered.length).toFixed(1) : 0}%</span></div>
      </div>
      <div class="body">
        <table><thead><tr><th>#</th><th>Resume</th><th>Email</th><th>Job</th><th style="text-align:center">Match%</th><th>Matched Skills</th><th>Date</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <div class="footer">SkillMatch Admin Report · ${date} · Confidential</div>
      </div></body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}><i className="bi bi-person-check-fill" style={{ color: "#a855f7", marginRight: 10 }} />Selected Candidates</h1>
            <p style={S.sub}>{candidates.length} candidate{candidates.length !== 1 ? "s" : ""} selected across all jobs</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {filtered.length > 0 && (
              <button style={S.pdfBtn} onClick={downloadReport}>📄 Export PDF</button>
            )}
            <button style={S.refreshBtn} onClick={fetchSelected}>↻ Refresh</button>
          </div>
        </div>

        {/* Stats row */}
        {candidates.length > 0 && (
          <div style={S.statsRow}>
            <div style={S.statBox}>
              <span style={{ ...S.statNum, color: "#a855f7" }}>{candidates.length}</span>
              <span style={S.statLbl}>Total Selected</span>
            </div>
            <div style={S.statBox}>
              <span style={{ ...S.statNum, color: "#10b981" }}>{candidates.filter(c => c.matchPercentage >= 80).length}</span>
              <span style={S.statLbl}>≥80% Match</span>
            </div>
            <div style={S.statBox}>
              <span style={{ ...S.statNum, color: "#f59e0b" }}>{candidates.filter(c => c.matchPercentage >= 60 && c.matchPercentage < 80).length}</span>
              <span style={S.statLbl}>60–79% Match</span>
            </div>
            <div style={S.statBox}>
              <span style={{ ...S.statNum, color: "#3b82f6" }}>
                {candidates.length ? (candidates.reduce((a, c) => a + c.matchPercentage, 0) / candidates.length).toFixed(1) : 0}%
              </span>
              <span style={S.statLbl}>Avg Match</span>
            </div>
          </div>
        )}

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="bi bi-search" style={{ color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or job…" style={S.searchInput} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={S.select}>
            <option value="all">All</option>
            <option value="high">≥80%</option>
            <option value="medium">60–79%</option>
          </select>
        </div>

        <div style={S.tableCard}>
          {loading ? (
            <div style={S.loadingRow}><div style={S.spinner} /></div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  {["#", "Resume", "Email", "Job Title", "Match %", "Matched Skills", "Date"].map(h =>
                    <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={S.empty}>No selected candidates found</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id} style={S.tr}>
                    <td style={S.td}><span style={S.idBadge}>{i + 1}</span></td>
                    <td style={S.td}><span style={S.fileName}>📄 {c.resumeFileName || "—"}</span></td>
                    <td style={S.td}><span style={S.emailCell}>{c.candidateEmail || "—"}</span></td>
                    <td style={S.td}><span style={S.jobTitle}>{c.jobTitle || "—"}</span></td>
                    <td style={S.td}>
                      <span style={{ background: pctBg(pct(c)), color: pctColor(pct(c)), padding: "3px 12px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 800 }}>
                        {c.matchPercentage}%
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={S.skillsWrap}>
                        {(c.matchedSkills || "").split(",").filter(Boolean).slice(0, 4).map(s => (
                          <span key={s} style={S.skillChip}>{s.trim()}</span>
                        ))}
                        {(c.matchedSkills || "").split(",").filter(Boolean).length > 4 && (
                          <span style={S.moreChip}>+{(c.matchedSkills || "").split(",").filter(Boolean).length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td style={S.td}><span style={S.dateBadge}>{c.savedAt?.slice(0, 10) || "—"}</span></td>
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
  pdfBtn:      { padding: "8px 16px", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 8, color: "#c084fc", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  refreshBtn:  { padding: "8px 18px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#60a5fa", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  statsRow:    { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  statBox:     { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4 },
  statNum:     { fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800 },
  statLbl:     { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" },
  toolbar:     { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  searchWrap:  { position: "relative", flex: 1 },
  searchInput: { width: "100%", padding: "10px 14px 10px 36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#f1f5f9", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  select:      { padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#94a3b8", fontSize: "0.875rem", cursor: "pointer", outline: "none" },
  tableCard:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" },
  loadingRow:  { display: "flex", justifyContent: "center", padding: "50px" },
  spinner:     { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { padding: "12px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" },
  tr:          { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td:          { padding: "12px 16px" },
  empty:       { padding: "30px", textAlign: "center", color: "#475569", fontSize: "0.875rem" },
  idBadge:     { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  fileName:    { color: "#e2e8f0", fontSize: "0.82rem" },
  emailCell:   { color: "#60a5fa", fontSize: "0.78rem" },
  jobTitle:    { color: "#f1f5f9", fontSize: "0.82rem", fontWeight: 500 },
  dateBadge:   { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  skillsWrap:  { display: "flex", flexWrap: "wrap", gap: 4 },
  skillChip:   { background: "rgba(16,185,129,0.12)", color: "#34d399", fontSize: "0.68rem", padding: "1px 7px", borderRadius: 99 },
  moreChip:    { background: "rgba(255,255,255,0.06)", color: "#64748b", fontSize: "0.68rem", padding: "1px 7px", borderRadius: 99 },
};