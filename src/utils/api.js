// آدرس پایه‌ی بک‌اند از متغیر محیطی خوانده می‌شود.
// در حالت لوکال خالی می‌ماند و از proxy پکیج react-scripts استفاده می‌شود.
const rawBase = (process.env.REACT_APP_API_URL || "").trim();

// اگر آدرس هنوز placeholder باشد یا در حالت https به localhost اشاره کند،
// آن را نادیده می‌گیریم تا درخواست‌ها به سرور ناموجود نروند.
const isInvalid =
  !rawBase ||
  rawBase.includes("YOUR-BACKEND-URL") ||
  (rawBase.includes("localhost") &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:");

export const API_BASE_URL = isInvalid ? "" : rawBase.replace(/\/$/, "");

const buildUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

async function request(endpoint, options) {
  try {
    return await fetch(buildUrl(endpoint), options);
  } catch (err) {
    const error = new Error(
      "خطا در برقراری ارتباط با سرور. مطمئن شوید بک‌اند روی Render دیپلوی شده و آدرس آن در فایل .env.production تنظیم شده است.",
    );
    error.cause = err;
    throw error;
  }
}

export function postApi(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function getApi(endpoint, token) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(endpoint, { headers });
}

