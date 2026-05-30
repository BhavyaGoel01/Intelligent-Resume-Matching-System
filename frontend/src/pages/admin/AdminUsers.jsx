import { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import api from "../../api/axiosConfig";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg]         = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setMsg(`✅ User "${name}" deleted.`);
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ Failed to delete user.");
      setTimeout(() => setMsg(""), 3000);
    }
    setDeleting(null);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>
      <AdminNavbar />
      <div style={S.body}>
        <div style={S.topRow}>
          <div>
            <h1 style={S.heading}><i className="bi bi-people-fill" style={{ color: "#3b82f6", marginRight: 10 }} />Users</h1>
            <p style={S.sub}>{users.length} registered HR user{users.length !== 1 ? "s" : ""}</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchUsers}>↻ Refresh</button>
        </div>

        {msg && <div style={{ ...S.toast, background: msg.startsWith("✅") ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", borderColor: msg.startsWith("✅") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)", color: msg.startsWith("✅") ? "#34d399" : "#f87171" }}>{msg}</div>}

        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <i className="bi bi-search" style={{ color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              style={S.searchInput}
            />
          </div>
          <span style={S.count}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={S.tableCard}>
          {loading ? (
            <div style={S.loadingRow}><div style={S.spinner} /><span style={{ color: "#64748b" }}>Loading users…</span></div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  {["#", "Name", "Email", "Registered", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={S.empty}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.id} style={S.tr}>
                    <td style={S.td}><span style={S.idBadge}>{u.id}</span></td>
                    <td style={S.td}>
                      <div style={S.avatar}>
                        <div style={S.avatarCircle}>{(u.name || "?")[0].toUpperCase()}</div>
                        <span style={S.userName}>{u.name}</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={S.emailCell}>{u.email}</span></td>
                    <td style={S.td}><span style={S.dateBadge}>{u.createdAt?.slice(0,10) || "—"}</span></td>
                    <td style={S.td}>
                      <button
                        style={{ ...S.deleteBtn, opacity: deleting === u.id ? 0.5 : 1 }}
                        onClick={() => deleteUser(u.id, u.name)}
                        disabled={deleting === u.id}
                      >
                        <i className="bi bi-trash3-fill" /> Delete
                      </button>
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
  tableCard:  { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" },
  loadingRow: { display: "flex", alignItems: "center", gap: 12, padding: "50px", justifyContent: "center" },
  spinner:    { width: 22, height: 22, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { padding: "12px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" },
  tr:         { borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" },
  td:         { padding: "14px 20px" },
  empty:      { padding: "30px", textAlign: "center", color: "#475569", fontSize: "0.875rem" },
  idBadge:    { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.75rem", padding: "2px 8px", borderRadius: 6 },
  avatar:     { display: "flex", alignItems: "center", gap: 10 },
  avatarCircle:{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0 },
  userName:   { color: "#e2e8f0", fontWeight: 600, fontSize: "0.875rem" },
  emailCell:  { color: "#60a5fa", fontSize: "0.82rem" },
  dateBadge:  { background: "rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 6 },
  deleteBtn:  { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 7, color: "#f87171", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};