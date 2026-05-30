import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";   // ✅ uses interceptor — token auto-attached
import Navbar from "../components/Navbar";

function UploadResumes() {
  const navigate  = useNavigate();
  const fileRef   = useRef();
  const folderRef = useRef();

  const [files, setFiles]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const addFiles = (incoming) => {
    const existing = files.map(f => f.file.name);
    const fresh = Array.from(incoming)
      .filter(f => f.name.endsWith(".pdf") || f.name.endsWith(".txt"))
      .filter(f => !existing.includes(f.name))
      .map(f => ({ file: f, status: "pending", resumeId: null, error: null }));
    setFiles(prev => [...prev, ...fresh]);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name) => setFiles(prev => prev.filter(f => f.file.name !== name));

  const uploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      updated[i] = { ...updated[i], status: "uploading" };
      setFiles([...updated]);

      try {
        const formData = new FormData();
        formData.append("file", updated[i].file);

        // ✅ api instance auto-adds: Authorization: Bearer <token>
        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updated[i] = { ...updated[i], status: "done", resumeId: res.data.id };
      } catch (err) {
        const msg = err.response?.status === 403
          ? "Not authenticated — please log in again"
          : "Upload failed";
        updated[i] = { ...updated[i], status: "error", error: msg };
      }

      setFiles([...updated]);
    }

    setUploading(false);
    const uploaded = updated.filter(f => f.status === "done");
    if (uploaded.length > 0) {
      localStorage.setItem("uploadedResumeIds", JSON.stringify(uploaded.map(f => f.resumeId)));
      setDone(true);
    }
  };

  const statusIcon  = (s) => ({ pending: "⏳", uploading: "🔄", done: "✅", error: "❌" }[s]);
  const statusColor = (s) => ({ pending: "#6b7fa8", uploading: "#f59e0b", done: "#16a34a", error: "#dc2626" }[s]);

  const doneCount    = files.filter(f => f.status === "done").length;
  const pendingCount = files.filter(f => f.status === "pending").length;
  const errorCount   = files.filter(f => f.status === "error").length;

  return (
    <div className="page">
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.stepTag}>Step 02</div>
          <h1 style={styles.title}>Upload Resumes</h1>
          <p style={styles.subtitle}>
            Upload one file, multiple files, or an entire folder of PDF/TXT resumes.
          </p>
        </div>

        {/* Token status indicator */}
        <TokenStatus />

        {/* Drop zone */}
        <div
          style={{ ...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {}) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div style={styles.dropIcon}>📁</div>
          <div style={styles.dropTitle}>Drag & drop resumes here</div>
          <div style={styles.dropSub}>PDF and TXT files supported</div>
          <div style={styles.btnRow}>
            <input ref={fileRef} type="file" accept=".pdf,.txt" multiple
              style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
            <button style={styles.pickBtn} onClick={() => fileRef.current.click()}>
              📄 Choose Files
            </button>
            <input ref={folderRef} type="file" accept=".pdf,.txt" multiple
              webkitdirectory="" style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)} />
            <button style={styles.pickBtn} onClick={() => folderRef.current.click()}>
              📂 Choose Folder
            </button>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={styles.fileListCard}>
            <div style={styles.fileListHeader}>
              <span style={styles.fileListTitle}>
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </span>
              <div style={styles.badges}>
                {doneCount > 0    && <span style={{ ...styles.badge, background: "#dcfce7", color: "#15803d" }}>✅ {doneCount} uploaded</span>}
                {pendingCount > 0 && <span style={{ ...styles.badge, background: "#e0f2fe", color: "#0284c7" }}>⏳ {pendingCount} pending</span>}
                {errorCount > 0   && <span style={{ ...styles.badge, background: "#fef2f2", color: "#dc2626" }}>❌ {errorCount} failed</span>}
              </div>
            </div>

            <div style={styles.fileList}>
              {files.map(({ file, status, resumeId, error }) => (
                <div key={file.name} style={styles.fileRow}>
                  <div style={styles.fileInfo}>
                    <span style={styles.fileExt}>{file.name.endsWith(".pdf") ? "PDF" : "TXT"}</span>
                    <div>
                      <div style={styles.fileName}>{file.name}</div>
                      <div style={styles.fileMeta}>
                        {(file.size / 1024).toFixed(1)} KB
                        {resumeId && <span style={styles.idPill}>ID: {resumeId}</span>}
                        {error    && <span style={{ color: "#dc2626", marginLeft: 8, fontSize: "0.78rem" }}>{error}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={styles.fileRight}>
                    <span style={{ color: statusColor(status), fontSize: "1rem" }}>{statusIcon(status)}</span>
                    {status === "pending" && (
                      <button style={styles.removeBtn} onClick={() => removeFile(file.name)}>✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!done && (
              <button
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
                style={{ ...styles.uploadBtn, opacity: (uploading || pendingCount === 0) ? 0.65 : 1 }}
              >
                {uploading
                  ? `Uploading… (${doneCount}/${files.length})`
                  : `Upload ${pendingCount} Resume${pendingCount !== 1 ? "s" : ""} →`}
              </button>
            )}

            {done && (
              <div style={styles.successRow}>
                <div style={styles.successMsg}>
                  🎉 {doneCount} resume{doneCount > 1 ? "s" : ""} uploaded successfully!
                </div>
                <button style={styles.nextBtn} onClick={() => navigate("/results")}>
                  View Results →
                </button>
              </div>
            )}
          </div>
        )}

        {files.length === 0 && (
          <div style={styles.emptyNote}>
            No files selected yet. Drag & drop above or use the buttons to choose files or a folder.
          </div>
        )}
      </div>
    </div>
  );
}

// Small component showing whether token exists in localStorage
function TokenStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    return (
      <div style={ts.ok}>
        🔐 Authenticated — token found. Uploads will include your credentials automatically.
      </div>
    );
  }
  return (
    <div style={ts.warn}>
      ⚠️ Not logged in — no token found. Please{" "}
      <a href="/" style={{ color: "#dc2626", fontWeight: 700 }}>login first</a>{" "}
      before uploading.
    </div>
  );
}

const ts = {
  ok:   { background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", color: "#15803d", fontSize: "0.85rem", marginBottom: 20 },
  warn: { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", color: "#dc2626", fontSize: "0.85rem", marginBottom: 20 },
};

const styles = {
  page: { maxWidth: 720, margin: "0 auto", padding: "60px 24px" },
  header: { marginBottom: 28 },
  stepTag: { display: "inline-block", padding: "3px 12px", background: "#e0f2fe", color: "#0284c7", borderRadius: 99, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", marginBottom: 14 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#1e3a5f", marginBottom: 8 },
  subtitle: { color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.6 },
  dropZone: { border: "2px dashed #c7d7f8", borderRadius: 16, padding: "48px 24px", textAlign: "center", background: "#f8faff", marginBottom: 24, transition: "all 0.2s" },
  dropZoneActive: { borderColor: "#2563eb", background: "rgba(37,99,235,0.04)" },
  dropIcon: { fontSize: "3rem", marginBottom: 12 },
  dropTitle: { fontSize: "1.05rem", fontWeight: 600, color: "#1e3a5f", marginBottom: 6 },
  dropSub: { color: "#6b7fa8", fontSize: "0.875rem", marginBottom: 24 },
  btnRow: { display: "flex", gap: 12, justifyContent: "center" },
  pickBtn: { padding: "10px 22px", background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 8, color: "#1e3a5f", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  fileListCard: { background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(37,99,235,0.07)" },
  fileListHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  fileListTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#1e3a5f", fontSize: "0.95rem" },
  badges: { display: "flex", gap: 8 },
  badge: { padding: "3px 10px", borderRadius: 99, fontSize: "0.75rem", fontWeight: 600 },
  fileList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, maxHeight: 340, overflowY: "auto" },
  fileRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8faff", border: "1px solid #e8f0fe", borderRadius: 10 },
  fileInfo: { display: "flex", alignItems: "center", gap: 12 },
  fileExt: { width: 40, height: 40, borderRadius: 8, background: "#dbeafe", color: "#1d4ed8", fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  fileName: { fontSize: "0.875rem", fontWeight: 600, color: "#1e3a5f", marginBottom: 2 },
  fileMeta: { fontSize: "0.78rem", color: "#6b7fa8", display: "flex", alignItems: "center", gap: 6 },
  idPill: { padding: "1px 8px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 99, color: "#15803d", fontSize: "0.72rem", fontWeight: 600 },
  fileRight: { display: "flex", alignItems: "center", gap: 10 },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#6b7fa8", fontSize: "0.9rem", padding: "2px 6px" },
  uploadBtn: { width: "100%", padding: "13px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" },
  successRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  successMsg: { color: "#15803d", fontWeight: 600, fontSize: "0.95rem" },
  nextBtn: { padding: "11px 22px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap" },
  emptyNote: { textAlign: "center", color: "#93b4d0", fontSize: "0.875rem", marginTop: 8 },
};

export default UploadResumes;