import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    if (!["application/pdf", "text/plain"].includes(f.type)) {
      setError("Only PDF or .txt files are supported.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8081/upload", formData);
      setSuccess(res.data);
    } catch {
      setError("Upload failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Upload Resume</h1>
          <p style={styles.subtitle}>
            We'll extract your skills automatically from PDF or text files.
          </p>
        </div>

        {!success ? (
          <div style={styles.card}>
            <div
              style={{
                ...styles.dropZone,
                ...(dragging ? styles.dropZoneActive : {}),
                ...(file ? styles.dropZoneFilled : {}),
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.txt"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div style={styles.fileIcon}>📄</div>
                  <div style={styles.fileName}>{file.name}</div>
                  <div style={styles.fileSize}>
                    {(file.size / 1024).toFixed(1)} KB — click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.uploadIcon}>☁️</div>
                  <div style={styles.dropText}>
                    Drag & drop your resume here
                  </div>
                  <div style={styles.dropSub}>
                    or click to browse — PDF or TXT
                  </div>
                </>
              )}
            </div>

            {error && <div style={styles.error}>{error}</div>}
            <button
              onClick={handleUpload}
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Uploading…" : "Upload Resume →"}
            </button>
          </div>
        ) : (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <h3 style={styles.successTitle}>Resume uploaded!</h3>
            <p style={styles.successSub}>{success.fileName}</p>
            <div style={styles.idBadge}>
              Resume ID: <strong>{success.id}</strong>
            </div>
            <p style={styles.idNote}>
              Save this ID — you'll need it when viewing results.
            </p>
            <div style={styles.successActions}>
              <button
                style={styles.btnOutline}
                onClick={() => {
                  setSuccess(null);
                  setFile(null);
                }}
              >
                Upload Another
              </button>
              <button style={styles.btn} onClick={() => navigate("/add-job")}>
                Add a Job →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 560, margin: "0 auto", padding: "60px 24px" },
  header: { marginBottom: 36 },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1e3a5f",
    marginBottom: 8,
  },
  subtitle: { color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.6 },
  card: {
    background: "#ffffff",
    border: "1px solid #c7d7f8",
    borderRadius: 14,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
  },
  dropZone: {
    border: "2px dashed #c7d7f8",
    borderRadius: 12,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "#f8faff",
  },
  dropZoneActive: {
    borderColor: "#2563eb",
    background: "rgba(37,99,235,0.04)",
  },
  dropZoneFilled: { borderColor: "#2563eb", borderStyle: "solid" },
  uploadIcon: { fontSize: "2.5rem", marginBottom: 12 },
  dropText: { color: "#1e3a5f", fontWeight: 500, marginBottom: 6 },
  dropSub: { color: "#6b7fa8", fontSize: "0.85rem" },
  fileIcon: { fontSize: "2.5rem", marginBottom: 10 },
  fileName: { color: "#2563eb", fontWeight: 600, marginBottom: 4 },
  fileSize: { color: "#6b7fa8", fontSize: "0.82rem" },
  btn: {
    padding: "13px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    width: "100%",
    flex: 1,
  },
  btnOutline: {
    padding: "13px",
    background: "transparent",
    color: "#1e3a5f",
    border: "1px solid #c7d7f8",
    borderRadius: 8,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
    flex: 1,
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#dc2626",
    fontSize: "0.875rem",
  },
  successCard: {
    background: "#ffffff",
    border: "1px solid #c7d7f8",
    borderRadius: 14,
    padding: "48px 32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
  },
  successIcon: { fontSize: "3rem", marginBottom: 8 },
  successTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#1e3a5f",
  },
  successSub: { color: "#6b7fa8", fontSize: "0.9rem" },
  idBadge: {
    marginTop: 8,
    padding: "8px 20px",
    background: "#dbeafe",
    border: "1px solid #93c5fd",
    borderRadius: 8,
    color: "#1d4ed8",
    fontSize: "0.9rem",
  },
  idNote: { color: "#6b7fa8", fontSize: "0.82rem" },
  successActions: { display: "flex", gap: 12, marginTop: 16, width: "100%" },
};

export default UploadResume;
