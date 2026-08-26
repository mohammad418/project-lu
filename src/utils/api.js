const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const joinUrl = (base, endpoint) =>
  `${base.replace(/\/$/, "")}${endpoint}`;

export async function postApi(endpoint, data) {
  const url = process.env.REACT_APP_API_URL
    ? joinUrl(process.env.REACT_APP_API_URL, endpoint)
    : endpoint;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res) return res;
  } catch (err) {
    // Network error -> fallback to default base URL
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getApi(endpoint, token) {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = process.env.REACT_APP_API_URL
    ? joinUrl(process.env.REACT_APP_API_URL, endpoint)
    : endpoint;

  try {
    const res = await fetch(url, { headers });
    if (res) return res;
  } catch (err) {
    // Fallback
  }

  return fetch(`${API_BASE_URL}${endpoint}`, { headers });
}
