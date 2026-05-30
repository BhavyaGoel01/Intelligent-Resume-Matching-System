import axios from "axios";

// ============================================================
// GLOBAL AXIOS INSTANCE — HR Portal
// All HR API calls go through this — JWT token auto-attached
// Never use plain `axios` in any page — always import THIS
// ============================================================

const api = axios.create({
  baseURL: "http://localhost:8081",
});

// REQUEST INTERCEPTOR — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR — auto logout on token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're NOT on an admin page
      if (!window.location.pathname.startsWith("/admin")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// ============================================================
// ADMIN AXIOS INSTANCE
// Used exclusively by admin pages (src/admin/*.jsx)
// Admin auth is localStorage-based (no JWT needed)
// If adminLoggedIn flag is missing → redirect to /admin login
// ============================================================

export const adminApi = axios.create({
  baseURL: "http://localhost:8081",
});

// REQUEST INTERCEPTOR — attach HR JWT if present (for shared endpoints like /resumes, /jobs)
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR — redirect to admin login on 401
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminLoggedIn");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  },
);
