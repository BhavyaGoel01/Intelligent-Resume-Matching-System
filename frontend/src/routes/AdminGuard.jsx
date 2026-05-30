import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return children;
}