const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function postApi(endpoint, data) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // If response is valid HTTP status (200, 400, 401, etc.), return it
    if (res) return res;
  } catch (err) {
    // Proxy or relative fetch network error -> fallback to absolute URL
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

  try {
    const res = await fetch(endpoint, { headers });
    if (res) return res;
  } catch (err) {
    // Fallback
  }

  return fetch(`${API_BASE_URL}${endpoint}`, { headers });
}
