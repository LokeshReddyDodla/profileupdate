const BASE = "";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.detail || `HTTP ${res.status}`);
  }
  return data;
}

// Auth
export async function sendOtp(phone_number) {
  return request("/v1/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone_number }),
  });
}

export async function verifyOtp(phone_number, otp) {
  const res = await request(`/v1/auth/verify-otp?role=patient`, {
    method: "POST",
    body: JSON.stringify({ phone_number, otp }),
  });
  if (res.data?.token) {
    setToken(res.data.token);
    localStorage.setItem("user_id", res.data.user_id);
  }
  return res;
}

// Profile Update Agent
export async function chatWithAgent(message) {
  return request("/profile-update-agent/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getDraft() {
  return request("/profile-update-agent/draft");
}

// Patient Profile
export async function getProfile() {
  return request("/patient/profile?detailed=true");
}
