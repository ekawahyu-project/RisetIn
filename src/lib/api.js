const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "risetin-token";

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export function resolveMediaUrl(url) {
  if (!url) return null;
  if (/^https?:|^blob:|^data:/i.test(url)) return url;
  return `${API_BASE}${url}`;
}

export async function apiFetch(path, { method = "GET", body, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
  } catch {
    throw new Error("Tidak dapat terhubung ke server backend. Pastikan server sudah berjalan (npm run dev:server).");
  }

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const defaultMsg =
      !data && res.status === 502
        ? "Server backend (port 3001) belum berjalan. Jalankan 'npm run dev' untuk menyalakan frontend & backend."
        : `Permintaan gagal (HTTP ${res.status})`;
    const err = new Error(data?.error || defaultMsg);
    err.status = res.status;
    throw err;
  }

  return data;
}
