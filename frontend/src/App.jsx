import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ── HR Pages ──────────────────────────────────────────────
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Dashboard     from "./pages/Dashboard";
import AddSkills     from "./pages/AddSkills";
import UploadResumes from "./pages/UploadResume";
import Results from "./pages/Result";
import ContactUs     from "./pages/ContactUs";

// ── Admin Pages ───────────────────────────────────────────
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminGuard from "./routes/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEmails from "./pages/admin/AdminEmails";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminResumes from "./pages/admin/AdminResumes";
import AdminSelected from "./pages/admin/AdminSelected";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── HR Routes ─────────────────────────────────── */}
        <Route path="/"           element={<Login />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/add-skills" element={<AddSkills />} />
        <Route path="/upload"     element={<UploadResumes />} />
        <Route path="/results"    element={<Results />} />
        <Route path="/contact"    element={<ContactUs />} />

        {/* ── Admin Routes (protected) ───────────────────── */}
        <Route path="/admin"               element={<AdminLogin />} />
        <Route path="/admin/dashboard"     element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/users"         element={<AdminGuard><AdminUsers /></AdminGuard>} />
        <Route path="/admin/resumes"       element={<AdminGuard><AdminResumes /></AdminGuard>} />
        <Route path="/admin/jobs"          element={<AdminGuard><AdminJobs /></AdminGuard>} />
        <Route path="/admin/selected"      element={<AdminGuard><AdminSelected /></AdminGuard>} />
        <Route path="/admin/emails"        element={<AdminGuard><AdminEmails /></AdminGuard>} />

        {/* ── Redirects ─────────────────────────────────── */}
        <Route path="/add-job"       element={<Navigate to="/add-skills" replace />} />
        <Route path="/result"        element={<Navigate to="/results"    replace />} />
        <Route path="/upload-resume" element={<Navigate to="/upload"     replace />} />
        <Route path="*"              element={<Navigate to="/dashboard"  replace />} />

      </Routes>
    </Router>
  );
}

export default App;