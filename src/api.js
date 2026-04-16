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
  localStorage.removeItem("device_id");
}

export function isLoggedIn() {
  return !!getToken();
}

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", "x-device-id": getDeviceId(), ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const msg = typeof data.message === "string"
      ? data.message
      : typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail || data.message || data);
    throw new Error(msg || `HTTP ${res.status}`);
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
    if (res.data.device_id) localStorage.setItem("device_id", res.data.device_id);
  }
  return res;
}

// Patient Onboarding Agent
export async function startOnboarding(restart = false) {
  return request("/patient-onboarding-agent/start", {
    method: "POST",
    body: JSON.stringify({ restart }),
  });
}

export async function chatWithOnboarding(message) {
  return request("/patient-onboarding-agent/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getOnboardingSession() {
  return request("/patient-onboarding-agent/session");
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
