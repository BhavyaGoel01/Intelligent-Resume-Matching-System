import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Navbar from "../components/Navbar";

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [selected, setSelected]     = useState(null);
  const [jobTitle, setJobTitle]     = useState("");
  const [skills, setSkills]         = useState([]);
  const [emailMap, setEmailMap]     = useState({});
  const [autoSending, setAutoSending] = useState(false);

  useEffect(() => {
    setJobTitle(localStorage.getItem("jobTitle") || "");
    setSkills(JSON.parse(localStorage.getItem("requiredSkills") || "[]"));
  }, []);

  const autoSendEmail = async (candidate, emailAddr, currentMap) => {
    if (!emailAddr || candidate.matchPercentage < 60) return currentMap;
    const updated = { ...currentMap, [candidate.resumeId]: { ...currentMap[candidate.resumeId], sending: true, msg: "📤 Sending…" } };
    try {
      await api.post("/auth/send-email", { email: emailAddr });
      await api.post("/selected/save", {
        resumeId:        candidate.resumeId,
        resumeFileName:  candidate.resumeFileName,
        candidateEmail:  emailAddr,
        jobId:           localStorage.getItem("jobId"),
        jobTitle:        localStorage.getItem("jobTitle"),
        matchPercentage: candidate.matchPercentage,
        matchedSkills:   (candidate.matchedKeywords || []).join(", "),
        missingSkills:   (candidate.missingKeywords  || []).join(", "),
      });
      return { ...updated, [candidate.resumeId]: { email: emailAddr, sending: false, sent: true, msg: "✅ Email sent & saved!" } };
    } catch {
      return { ...updated, [candidate.resumeId]: { email: emailAddr, sending: false, sent: false, msg: "❌ Failed to send." } };
    }
  };

  const fetchResults = async () => {
    const resumeIds = JSON.parse(localStorage.getItem("uploadedResumeIds") || "[]");
    const jobId = localStorage.getItem("jobId");
    if (resumeIds.length === 0) { setError("No uploaded resumes found. Please complete Step 2 first."); return; }
    setLoading(true); setError(""); setCandidates([]); setEmailMap({});
    try {
      let list = [];
      if (jobId) {
        const results = await Promise.all(resumeIds.map(rid =>
          api.get(`/match/details/${rid}/${jobId}`).then(r => r.data).catch(() => null)
        ));
        list = results.filter(Boolean);
      } else {
        const resumes = await Promise.all(resumeIds.map(rid =>
          api.get(`/resumes/${rid}`).then(r => r.data).catch(() => null)
        ));
        list = resumes.filter(Boolean).map(r => localMatch(r, skills));
      }
      list.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setCandidates(list);

      let emailState = {};
      list.forEach(c => {
        emailState[c.resumeId] = {
          email: c.candidateEmail || "", sending: false, sent: false,
          msg: c.matchPercentage >= 60 ? (c.candidateEmail ? "📤 Preparing to send…" : "⚠️ No email found in resume") : "",
        };
      });
      setEmailMap(emailState);
      setLoading(false);

      const qualified = list.filter(c => c.matchPercentage >= 60 && c.candidateEmail);
      if (qualified.length > 0) {
        setAutoSending(true);
        for (const candidate of qualified) {
          emailState = await autoSendEmail(candidate, candidate.candidateEmail, emailState);
          setEmailMap({ ...emailState });
        }
        setAutoSending(false);
      }
    } catch { setError("Failed to load results. Make sure the backend is running."); setLoading(false); }
  };

  const manualSend = async (candidate) => {
    const state = emailMap[candidate.resumeId];
    if (!state?.email) { updateEmail(candidate.resumeId, "msg", "⚠️ No email — enter manually."); return; }
    let updated = { ...emailMap, [candidate.resumeId]: { ...state, sending: true, msg: "" } };
    setEmailMap(updated);
    updated = await autoSendEmail(candidate, state.email, updated);
    setEmailMap({ ...updated });
  };

  const updateEmail = (id, field, val) =>
    setEmailMap(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const localMatch = (resume, requiredSkills) => {
    const text = (resume.extractedText || "").toLowerCase();
    const matched = requiredSkills.filter(s => text.includes(s.toLowerCase()));
    const missing = requiredSkills.filter(s => !text.includes(s.toLowerCase()));
    const pct = requiredSkills.length === 0 ? 0 : Math.round((matched.length / requiredSkills.length) * 100);
    return {
      resumeId: resume.id, resumeFileName: resume.fileName, candidateEmail: resume.candidateEmail || "",
      jobTitle, matchPercentage: pct, matchedCount: matched.length, totalJobKeywords: requiredSkills.length,
      matchedKeywords: matched, missingKeywords: missing,
    };
  };

  // ✅ PDF REPORT GENERATOR
  const downloadPDF = () => {
    const selectedCandidates = candidates.filter(c => c.matchPercentage >= 60);
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

    const rows = selectedCandidates.map((c, i) => {
      const es = emailMap[c.resumeId] || {};
      return `
        <tr style="background:${i % 2 === 0 ? "#fffdf8" : "#ffffff"}">
          <td style="padding:10px 14px;font-weight:700;color:#17352f">${i + 1}</td>
          <td style="padding:10px 14px;color:#17352f">${c.resumeFileName}</td>
          <td style="padding:10px 14px;color:#b7792f">${es.email || c.candidateEmail || "—"}</td>
          <td style="padding:10px 14px;text-align:center">
            <span style="background:#e8f0eb;color:#176b5b;padding:3px 12px;border-radius:99px;font-weight:700;font-size:13px">
              ${c.matchPercentage}%
            </span>
          </td>
          <td style="padding:10px 14px;color:#176b5b;font-size:12px">${(c.matchedKeywords || []).join(", ") || "—"}</td>
          <td style="padding:10px 14px;color:#dc2626;font-size:12px">${(c.missingKeywords || []).join(", ") || "—"}</td>
          <td style="padding:10px 14px;text-align:center">
            ${es.sent
              ? `<span style="background:#e8f0eb;color:#176b5b;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600">✅ Sent</span>`
              : `<span style="background:#fef2f2;color:#dc2626;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600">⏳ Pending</span>`
            }
          </td>
        </tr>`;
    }).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>SkillMatch — Selected Candidates Report</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#17352f; }
          .header { background: linear-gradient(135deg,#17352f,#176b5b); padding:36px 48px; color:#fff8ef; }
          .header h1 { font-size:24px; font-weight:800; margin-bottom:6px; }
          .header p  { font-size:13px; opacity:0.85; }
          .meta  { display:flex; gap:32px; padding:20px 48px; background:#fffdf8; border-bottom:2px solid #e8dfcf; }
          .meta div { display:flex; flex-direction:column; gap:2px; }
          .meta .label { font-size:10px; font-weight:700; color:#69766f; text-transform:uppercase; letter-spacing:0.06em; }
          .meta .value { font-size:14px; font-weight:700; color:#17352f; }
          .body  { padding:28px 48px; }
          h2 { font-size:15px; font-weight:700; color:#17352f; margin-bottom:16px; }
          table { width:100%; border-collapse:collapse; border:1px solid #e8dfcf; border-radius:10px; overflow:hidden; font-size:13px; }
          th { background:#17352f; color:#fff8ef; padding:10px 14px; text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
          tr:last-child td { border-bottom:none; }
          td { border-bottom:1px solid #e8dfcf; }
          .summary { display:flex; gap:16px; margin-bottom:24px; }
          .sum-box { flex:1; background:#fffdf8; border:1px solid #d9c8ad; border-radius:10px; padding:14px 18px; }
          .sum-num { font-size:28px; font-weight:800; }
          .sum-lbl { font-size:10px; font-weight:700; color:#69766f; text-transform:uppercase; letter-spacing:0.04em; margin-top:2px; }
          .footer { margin-top:32px; padding-top:16px; border-top:1px solid #e8dfcf; text-align:center; font-size:11px; color:#8a9a91; }
          @media print {
            .header { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            th { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .sum-box { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Selected Candidates Report</h1>
          <p>SkillMatch — AI-Powered Resume Matching System</p>
        </div>

        <div class="meta">
          <div><span class="label">Job Title</span><span class="value">${jobTitle || "N/A"}</span></div>
          <div><span class="label">Report Date</span><span class="value">${date}</span></div>
          <div><span class="label">Total Screened</span><span class="value">${candidates.length}</span></div>
          <div><span class="label">Threshold</span><span class="value">60% Match</span></div>
        </div>

        <div class="body">
          <div class="summary">
            <div class="sum-box">
              <div class="sum-num" style="color:#17352f">${candidates.length}</div>
              <div class="sum-lbl">Total Resumes</div>
            </div>
            <div class="sum-box">
              <div class="sum-num" style="color:#176b5b">${selectedCandidates.length}</div>
              <div class="sum-lbl">Selected ≥60%</div>
            </div>
            <div class="sum-box">
              <div class="sum-num" style="color:#b7792f">${Object.values(emailMap).filter(e => e.sent).length}</div>
              <div class="sum-lbl">Emails Sent</div>
            </div>
            <div class="sum-box">
              <div class="sum-num" style="color:#dc2626">${candidates.length - selectedCandidates.length}</div>
              <div class="sum-lbl">Not Selected</div>
            </div>
          </div>

          <h2>Selected Candidates (${selectedCandidates.length})</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Resume / Candidate</th>
                <th>Email</th>
                <th style="text-align:center">Match %</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
                <th style="text-align:center">Email Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="footer">
            Generated by SkillMatch &nbsp;·&nbsp; ${date} &nbsp;·&nbsp; Confidential — HR Use Only
          </div>
        </div>
      </body>
      </html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const scoreColor = (p) => p >= 60 ? "#176b5b" : p >= 40 ? "#b7792f" : "#dc2626";
  const scoreBg    = (p) => p >= 60 ? "#e8f0eb" : p >= 40 ? "#f7ead6" : "#fef2f2";
  const scoreLabel = (p) => p >= 60 ? "✅ Selected" : p >= 40 ? "⚡ Partial" : "❌ Rejected";
  const qualifiedCount = candidates.filter(c => c.matchPercentage >= 60).length;
  const sentCount      = Object.values(emailMap).filter(e => e.sent).length;

  return (
    <div className="page">
      <Navbar />
      <div style={S.page}>

        <div style={S.header}>
          <div style={S.stepTag}>Step 03</div>
          <h1 style={S.title}>Match Results</h1>
          <p style={S.subtitle}>
            Selection emails are <strong style={{ color: "#176b5b" }}>sent automatically</strong> to
            all candidates with 60%+ match as soon as results load.
          </p>
        </div>

        {(jobTitle || skills.length > 0) && (
          <div style={S.contextBar}>
            {jobTitle && <span style={S.ctxTitle}>🎯 {jobTitle}</span>}
            {skills.length > 0 && <span style={S.ctxSkills}>Matching against <strong>{skills.length}</strong> skill{skills.length > 1 ? "s" : ""}</span>}
          </div>
        )}

        <div style={S.legend}>
          {[
            { dot: "#176b5b", label: "≥ 60% — Selected (auto email sent)" },
            { dot: "#b7792f", label: "40–59% — Partial" },
            { dot: "#dc2626", label: "< 40% — Rejected" },
          ].map(l => (
            <span key={l.label} style={{ ...S.legendItem, color: l.dot }}>
              <span style={{ ...S.legendDot, background: l.dot }} />{l.label}
            </span>
          ))}
        </div>

        {candidates.length === 0 && !loading && (
          <button onClick={fetchResults} style={S.runBtn}>🔍 Run Analysis & Auto-Send Emails</button>
        )}
        {error && <div style={S.error}>{error}</div>}

        {loading && (
          <div style={S.loadingBox}><div style={S.spinner} /><span>Analyzing resumes…</span></div>
        )}

        {autoSending && (
          <div style={S.autoSendBanner}>
            <div style={S.spinner} />
            📧 Automatically sending selection emails to qualified candidates…
          </div>
        )}

        {candidates.length > 0 && !loading && (
          <>
            {/* Summary + PDF button */}
            <div style={S.summaryBar}>
              <div style={S.summaryStats}>
                <div style={S.summaryItem}><span style={{ ...S.summaryNum, color: "#17352f" }}>{candidates.length}</span><span style={S.summaryLabel}>Total</span></div>
                <div style={S.divider} />
                <div style={S.summaryItem}><span style={{ ...S.summaryNum, color: "#176b5b" }}>{qualifiedCount}</span><span style={S.summaryLabel}>Selected ≥60%</span></div>
                <div style={S.divider} />
                <div style={S.summaryItem}><span style={{ ...S.summaryNum, color: "#b7792f" }}>{sentCount}</span><span style={S.summaryLabel}>Emails Sent</span></div>
                <div style={S.divider} />
                <div style={S.summaryItem}><span style={{ ...S.summaryNum, color: "#dc2626" }}>{candidates.length - qualifiedCount}</span><span style={S.summaryLabel}>Not Selected</span></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* ✅ PDF DOWNLOAD BUTTON */}
                {qualifiedCount > 0 && (
                  <button style={S.pdfBtn} onClick={downloadPDF}>
                    📄 Download PDF Report
                  </button>
                )}
                <button style={S.rerunBtn} onClick={fetchResults}>↻ Re-run</button>
              </div>
            </div>

            {/* Candidate Cards */}
            <div style={S.cardList}>
              {candidates.map((c, i) => {
                const qualified = c.matchPercentage >= 60;
                const es = emailMap[c.resumeId] || {};
                return (
                  <div key={c.resumeId} style={{
                    ...S.candidateCard,
                    borderLeft: `4px solid ${scoreColor(c.matchPercentage)}`,
                    background: qualified ? "#fbfffb" : "#ffffff",
                  }}>
                    <div style={S.cardTop}>
                      <span style={S.medal}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}</span>
                      <div style={S.cardInfo}>
                        <span style={S.cardName}>📄 {c.resumeFileName}</span>
                        <span style={S.cardMeta}>
                          {c.matchedCount} matched · {c.missingKeywords?.length ?? 0} missing
                          {c.candidateEmail && <span style={S.emailChip}>📧 {c.candidateEmail}</span>}
                        </span>
                      </div>
                      <div style={S.cardRight}>
                        <span style={{ ...S.pctBadge, color: scoreColor(c.matchPercentage), background: scoreBg(c.matchPercentage) }}>{c.matchPercentage}%</span>
                        <span style={{ ...S.statusBadge, color: scoreColor(c.matchPercentage), background: scoreBg(c.matchPercentage) }}>{scoreLabel(c.matchPercentage)}</span>
                        <button style={S.detailBtn} onClick={() => setSelected(c === selected ? null : c)}>
                          {selected === c ? "Hide" : "Details"}
                        </button>
                      </div>
                    </div>

                    {qualified && (
                      <div style={S.emailStatusRow}>
                        {es.sent ? (
                          <div style={S.sentPill}>✅ Selection email sent to <strong>{es.email}</strong></div>
                        ) : es.sending ? (
                          <div style={S.sendingPill}><div style={S.miniSpinner} /> Sending to {es.email}…</div>
                        ) : (
                          <div style={S.manualRow}>
                            {es.msg && <span style={{ fontSize: "0.8rem", color: es.msg.startsWith("⚠️") ? "#b7792f" : "#dc2626" }}>{es.msg}</span>}
                            {!c.candidateEmail && (
                              <>
                                <input type="email" placeholder="Enter email manually…" value={es.email || ""} onChange={e => updateEmail(c.resumeId, "email", e.target.value)} style={S.emailInput} />
                                <button style={S.sendBtn} onClick={() => manualSend(c)} disabled={es.sending || !es.email}>Send Email →</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {selected === c && (
                      <div style={S.detailPanel}>
                        <div style={S.progressRow}>
                          <div style={S.progressBar}>
                            <div style={{ ...S.progressFill, width: `${c.matchPercentage}%`, background: scoreColor(c.matchPercentage) }} />
                            <div style={S.thresholdMark} />
                          </div>
                          <span style={{ color: scoreColor(c.matchPercentage), fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>{c.matchedCount} / {c.totalJobKeywords} skills</span>
                        </div>
                        <div style={S.kwRow}>
                          <div style={S.kwBox}>
                            <div style={S.kwTitle}>✅ Matched ({c.matchedKeywords?.length})</div>
                            <div style={S.kwChips}>{(c.matchedKeywords || []).sort().map(k => <span key={k} style={{ ...S.kwChip, background: "#e8f0eb", border: "1px solid #a8beb1", color: "#176b5b" }}>{k}</span>)}</div>
                          </div>
                          <div style={S.kwBox}>
                            <div style={S.kwTitle}>❌ Missing ({c.missingKeywords?.length})</div>
                            <div style={S.kwChips}>{(c.missingKeywords || []).sort().map(k => <span key={k} style={{ ...S.kwChip, background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626" }}>{k}</span>)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  page:     { maxWidth: 900, margin: "0 auto", padding: "60px 24px" },
  header:   { marginBottom: 20 },
  stepTag:  { display: "inline-block", padding: "3px 12px", background: "#f7ead6", color: "#b7792f", borderRadius: 99, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", marginBottom: 14 },
  title:    { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#17352f", marginBottom: 8 },
  subtitle: { color: "#69766f", fontSize: "0.95rem", lineHeight: 1.7 },
  contextBar: { background: "#ffffff", border: "1px solid #d9c8ad", borderRadius: 10, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" },
  ctxTitle:   { fontWeight: 700, color: "#17352f", fontSize: "0.95rem" },
  ctxSkills:  { color: "#69766f", fontSize: "0.875rem" },
  legend:     { display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 600 },
  legendDot:  { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  runBtn: { display: "block", margin: "0 auto 28px", padding: "14px 44px", background: "#17352f", color: "#fff8ef", border: "none", borderRadius: 10, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", cursor: "pointer" },
  error:  { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 16px", color: "#dc2626", fontSize: "0.875rem", marginBottom: 20 },
  loadingBox: { display: "flex", alignItems: "center", gap: 14, justifyContent: "center", padding: "40px", color: "#69766f" },
  spinner:    { width: 22, height: 22, border: "3px solid #e8dfcf", borderTop: "3px solid #b7792f", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  miniSpinner:{ width: 14, height: 14, border: "2px solid #d9c8ad", borderTop: "2px solid #b7792f", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  autoSendBanner: { display: "flex", alignItems: "center", gap: 12, background: "#fff8ea", border: "1px solid #d9b46c", borderRadius: 10, padding: "14px 20px", marginBottom: 20, color: "#b7792f", fontWeight: 600, fontSize: "0.9rem" },
  summaryBar:   { background: "#ffffff", border: "1px solid #d9c8ad", borderRadius: 12, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  summaryStats: { display: "flex", alignItems: "center" },
  summaryItem:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "0 16px" },
  summaryNum:   { fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800 },
  summaryLabel: { fontSize: "0.68rem", color: "#69766f", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  divider:      { width: 1, height: 32, background: "#e8dfcf" },
  pdfBtn:  { padding: "7px 16px", background: "#17352f", color: "#fff8ef", border: "none", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  rerunBtn:{ padding: "7px 14px", background: "#fffdf8", border: "1px solid #d9c8ad", borderRadius: 8, color: "#40564f", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  cardList:      { display: "flex", flexDirection: "column", gap: 14 },
  candidateCard: { background: "#ffffff", border: "1px solid #d9c8ad", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 10px rgba(23,53,47,0.07)", display: "flex", flexDirection: "column", gap: 0 },
  cardTop:  { display: "flex", alignItems: "center", gap: 14 },
  medal:    { fontSize: "1.3rem", flexShrink: 0 },
  cardInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  cardName: { fontWeight: 700, color: "#17352f", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardMeta: { fontSize: "0.75rem", color: "#69766f", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  emailChip:{ background: "#f7ead6", color: "#b7792f", padding: "1px 8px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600 },
  cardRight:{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  pctBadge:    { padding: "4px 12px", borderRadius: 99, fontSize: "0.85rem", fontWeight: 800 },
  statusBadge: { padding: "4px 10px", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700 },
  detailBtn:   { padding: "5px 12px", background: "#fffdf8", border: "1px solid #d9c8ad", borderRadius: 7, color: "#b7792f", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  emailStatusRow: { marginTop: 12, paddingTop: 12, borderTop: "1px dashed #d9c8ad" },
  sentPill:    { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#e8f0eb", border: "1px solid #a8beb1", borderRadius: 99, color: "#176b5b", fontSize: "0.82rem", fontWeight: 600 },
  sendingPill: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "#fff8ea", border: "1px solid #d9b46c", borderRadius: 99, color: "#b7792f", fontSize: "0.82rem", fontWeight: 600 },
  manualRow:   { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  emailInput:  { flex: "1 1 200px", padding: "7px 12px", border: "1.5px solid #d9c8ad", borderRadius: 7, fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#17352f" },
  sendBtn:     { padding: "7px 16px", background: "#176b5b", color: "#fff8ef", border: "none", borderRadius: 7, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap" },
  detailPanel:   { marginTop: 16, paddingTop: 16, borderTop: "1px solid #e8dfcf" },
  progressRow:   { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  progressBar:   { flex: 1, height: 8, background: "#e8dfcf", borderRadius: 99, overflow: "hidden", position: "relative" },
  progressFill:  { height: "100%", borderRadius: 99, transition: "width 0.8s ease" },
  thresholdMark: { position: "absolute", top: 0, left: "60%", width: 2, height: "100%", background: "#17352f", opacity: 0.3 },
  kwRow:  { display: "flex", gap: 12 },
  kwBox:  { flex: 1, background: "#fffdf8", borderRadius: 10, padding: "14px" },
  kwTitle:{ fontWeight: 700, color: "#17352f", fontSize: "0.82rem", marginBottom: 10 },
  kwChips:{ display: "flex", flexWrap: "wrap", gap: 6 },
  kwChip: { padding: "2px 10px", borderRadius: 99, fontSize: "0.75rem", fontWeight: 500 },
};

export default Results;
