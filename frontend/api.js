// GovAssist API Helper
// A centralized API connector for all frontend pages
// Base URL of your backend (update when you deploy backend to cloud)
const API_BASE_URL = "http://localhost:4000"; 

// ------------------------ TOKEN MANAGEMENT ------------------------
function getToken() {
  return localStorage.getItem("govassist_token") || "";
}

function setToken(token) {
  if (token) localStorage.setItem("govassist_token", token);
}

function clearToken() {
  localStorage.removeItem("govassist_token");
}

// ------------------------ AUTH HEADER ------------------------
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ------------------------ MAIN FETCH WRAPPER ------------------------
async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...authHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

// ------------------------ AUTH GUARD ------------------------
function requireAuth(redirectTo = "login.html") {
  if (!getToken()) {
    window.location.href = redirectTo;
  }
}

// ------------------------ GOVASSIST API ROUTES ------------------------

// LOGIN
async function loginUser(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

// SIGNUP
async function registerUser(name, email, password) {
  const data = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data;
}

// FETCH SCHEMES
async function fetchSchemes() {
  return apiFetch("/schemes", { method: "GET" });
}

// SCHEME OVERVIEW
async function getSchemeById(schemeId) {
  return apiFetch(`/schemes/${schemeId}`, { method: "GET" });
}

// ELIGIBILITY CHECKER
async function checkEligibility(userData) {
  return apiFetch("/eligibility/check", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// APPLICATION TRACKER
async function trackApplication(userId) {
  return apiFetch(`/applications/${userId}`, { method: "GET" });
}

// SETTINGS (UPDATE PROFILE)
async function updateUserSettings(userId, updates) {
  return apiFetch(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// LOGOUT
function logoutUser() {
  clearToken();
  window.location.href = "login.html";
}

// ------------------------ EXPORT ALL FUNCTIONS ------------------------
window.GovAssistAPI = {
  apiFetch,
  getToken,
  setToken,
  clearToken,
  authHeader,
  requireAuth,
  loginUser,
  registerUser,
  fetchSchemes,
  getSchemeById,
  checkEligibility,
  trackApplication,
  updateUserSettings,
  logoutUser,
};

