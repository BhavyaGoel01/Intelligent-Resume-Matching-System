import { useState } from "react";
import Navbar from "../components/Navbar";

const contactInfo = [
  { icon: "bi-envelope-fill",  label: "Email Us",      value: "support@skillmatch.ai", sub: "We reply within 24 hours",  color: "#2563eb", bg: "#dbeafe" },
  { icon: "bi-telephone-fill", label: "Call Us",        value: "+91 98765 43210",        sub: "Mon–Fri, 9am–6pm IST",      color: "#0284c7", bg: "#e0f2fe" },
  { icon: "bi-geo-alt-fill",   label: "Office",         value: "Pune, Maharashtra",      sub: "India — 411001",             color: "#7c3aed", bg: "#ede9fe" },
  { icon: "bi-clock-fill",     label: "Support Hours",  value: "Mon – Fri",              sub: "9:00 AM – 6:00 PM IST",     color: "#0891b2", bg: "#cffafe" },
];

const socials = [
  { label: "LinkedIn", icon: "bi-linkedin", href: "#",  color: "#0a66c2" },
  { label: "GitHub",   icon: "bi-github",   href: "#",  color: "#1e3a5f" },
  { label: "Twitter",  icon: "bi-twitter-x",href: "#",  color: "#000000" },
];

const faqs = [
  { q: "How does the skill matching work?",      a: "We extract keywords from your resume using Apache PDFBox, then compare them against the required skills you define for a job role. The match percentage shows how many required skills were found in the resume." },
  { q: "What file formats are supported?",       a: "Currently we support PDF and TXT files. PDF text is extracted automatically. Make sure your PDF is not a scanned image — text must be selectable." },
  { q: "Can I upload multiple resumes at once?", a: "Yes! You can upload individual files, select multiple files at once, or upload an entire folder. All resumes will be processed and ranked against your required skills." },
  { q: "Is my data secure?",                     a: "All requests are protected with JWT authentication. Resumes are stored on the backend server and only accessible to authenticated users." },
];

function ContactUs() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) { setError("Please fill in Name, Email and Message."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      setSent(true);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div style={S.page}>

        {/* Header */}
        <div style={S.header}>
          <div style={S.tag}>Get In Touch</div>
          <h1 style={S.title}>Contact Us</h1>
          <p style={S.subtitle}>Have a question, feedback, or need help? We'd love to hear from you.</p>
        </div>

        {/* Top grid */}
        <div style={S.topGrid}>

          {/* Left — info cards */}
          <div style={S.infoCol}>
            <div style={S.infoCards}>
              {contactInfo.map((c) => (
                <div key={c.label} style={S.infoCard}>
                  <div style={{ ...S.infoIcon, background: c.bg, color: c.color }}>
                    <i className={`bi ${c.icon}`} style={{ fontSize: "1.3rem" }} />
                  </div>
                  <div>
                    <div style={S.infoLabel}>{c.label}</div>
                    <div style={{ ...S.infoValue, color: c.color }}>{c.value}</div>
                    <div style={S.infoSub}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={S.socialBox}>
              <div style={S.socialTitle}>Follow Us</div>
              <div style={S.socialRow}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} style={S.socialBtn}>
                    <i className={`bi ${s.icon}`} style={{ fontSize: "1rem", color: s.color }} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div style={S.formCard}>
            {!sent ? (
              <>
                <h2 style={S.formTitle}>
                  <i className="bi bi-chat-dots-fill" style={{ color: "#2563eb", marginRight: 10 }} />
                  Send a Message
                </h2>
                <p style={S.formSub}>Fill out the form and we'll get back to you shortly.</p>
                {error && <div style={S.error}><i className="bi bi-exclamation-circle-fill" style={{ marginRight: 6 }} />{error}</div>}

                <form onSubmit={handleSubmit} style={S.form}>
                  <div style={S.row}>
                    <Field label="Your Name"     icon="bi-person-fill"   value={form.name}    onChange={update("name")}    placeholder="Ankita Sharma" />
                    <Field label="Email Address" icon="bi-envelope-fill" type="email" value={form.email} onChange={update("email")} placeholder="ankita@example.com" />
                  </div>
                  <Field label="Subject" icon="bi-tag-fill" value={form.subject} onChange={update("subject")} placeholder="e.g. Issue with resume upload" />
                  <div style={S.field}>
                    <label style={S.label}>
                      <i className="bi bi-pencil-fill" style={{ marginRight: 6, color: "#2563eb" }} />
                      Message
                    </label>
                    <textarea rows={6} placeholder="Describe your question or issue in detail…" value={form.message} onChange={update("message")} style={S.textarea} />
                  </div>
                  <button type="submit" style={{ ...S.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
                    {loading
                      ? <><i className="bi bi-hourglass-split" style={{ marginRight: 8 }} />Sending…</>
                      : <><i className="bi bi-send-fill" style={{ marginRight: 8 }} />Send Message</>
                    }
                  </button>
                </form>
              </>
            ) : (
              <div style={S.successBox}>
                <i className="bi bi-check-circle-fill" style={{ fontSize: "4rem", color: "#16a34a" }} />
                <h3 style={S.successTitle}>Message Sent!</h3>
                <p style={S.successMsg}>Thanks, <strong>{form.name}</strong>! We'll reply to <strong>{form.email}</strong> within 24 hours.</p>
                <button style={S.btn} onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  <i className="bi bi-arrow-repeat" style={{ marginRight: 8 }} />Send Another
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={S.faqSection}>
          <h2 style={S.faqHeading}>
            <i className="bi bi-question-circle-fill" style={{ color: "#2563eb", marginRight: 10 }} />
            Frequently Asked Questions
          </h2>
          <div style={S.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ ...S.faqItem, ...(openFaq === i ? S.faqItemOpen : {}) }}>
                <button style={S.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <i className={`bi ${openFaq === i ? "bi-chevron-up" : "bi-chevron-down"}`} style={{ color: "#2563eb", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={S.faqA}>
                    <i className="bi bi-info-circle-fill" style={{ color: "#2563eb", marginRight: 8 }} />
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4a6080", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <i className={`bi ${icon}`} style={{ color: "#2563eb" }} />}
        {label}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

const S = {
  page:     { maxWidth: 1000, margin: "0 auto", padding: "60px 24px" },
  header:   { textAlign: "center", marginBottom: 52 },
  tag:      { display: "inline-block", padding: "4px 14px", background: "#dbeafe", color: "#2563eb", borderRadius: 99, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 },
  title:    { fontFamily: "'Syne', sans-serif", fontSize: "2.4rem", fontWeight: 800, color: "#1e3a5f", marginBottom: 12 },
  subtitle: { color: "#6b7fa8", fontSize: "1rem", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" },

  topGrid:  { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 28, marginBottom: 52, alignItems: "start" },

  infoCol:   { display: "flex", flexDirection: "column", gap: 20 },
  infoCards: { display: "flex", flexDirection: "column", gap: 14 },
  infoCard:  { background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(37,99,235,0.06)" },
  infoIcon:  { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  infoLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#6b7fa8", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2 },
  infoValue: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 },
  infoSub:   { fontSize: "0.78rem", color: "#93b4d0" },

  socialBox:   { background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 10px rgba(37,99,235,0.06)" },
  socialTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#6b7fa8", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 },
  socialRow:   { display: "flex", gap: 10 },
  socialBtn:   { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#f0f5ff", border: "1px solid #c7d7f8", borderRadius: 8, color: "#1e3a5f", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" },

  formCard:  { background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 16, padding: "36px", boxShadow: "0 2px 16px rgba(37,99,235,0.07)" },
  formTitle: { fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1e3a5f", marginBottom: 6, display: "flex", alignItems: "center" },
  formSub:   { color: "#6b7fa8", fontSize: "0.875rem", marginBottom: 28 },
  form:      { display: "flex", flexDirection: "column", gap: 18 },
  row:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field:     { display: "flex", flexDirection: "column", gap: 7 },
  label:     { fontSize: "0.82rem", fontWeight: 600, color: "#4a6080", letterSpacing: "0.02em", display: "flex", alignItems: "center" },
  textarea:  { resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, minHeight: 130 },
  btn:       { padding: "13px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  error:     { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.875rem", marginBottom: 12, display: "flex", alignItems: "center" },

  successBox:   { textAlign: "center", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  successTitle: { fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1e3a5f" },
  successMsg:   { color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 320 },

  faqSection: { marginTop: 12 },
  faqHeading: { fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#1e3a5f", marginBottom: 24, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" },
  faqList:    { display: "flex", flexDirection: "column", gap: 12 },
  faqItem:    { background: "#ffffff", border: "1px solid #c7d7f8", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(37,99,235,0.05)", transition: "border-color 0.2s" },
  faqItemOpen:{ borderColor: "#2563eb" },
  faqQ:       { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#1e3a5f", textAlign: "left", gap: 12 },
  faqA:       { padding: "14px 20px 18px", color: "#6b7fa8", fontSize: "0.9rem", lineHeight: 1.7, borderTop: "1px solid #e8f0fe", display: "flex", alignItems: "flex-start", gap: 6 },
};

export default ContactUs;