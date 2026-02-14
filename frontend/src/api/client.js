import { config } from "../config";

const API_BASE_URL = config.apiBaseUrl ?? "";
const ACCESS_TOKEN_KEY = "access_token";

export class ApiError extends Error {
  constructor(message, { status, url, data }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.data = data;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function readBody(res) {
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      // 
    }
  }

  const text = await res.text();
  return text.length ? text : null;
}

export async function request(path, options = {}) {
  const method = (options.method ?? "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}`;
  const headers = { ...(options.headers ?? {}) };

  if (options.auth !== false) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let body = options.body ?? null;

  if (options.json !== undefined) {
    body = JSON.stringify(options.json);
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }

  let response;
  try {
    response = await fetch(url, { method, headers, body, credentials: options.credentials ?? "same-origin" });
  } catch (err) {
    throw new ApiError("Network error", { status: 0, url, data: String(err) });
  }


  const data = await readBody(response);

  if (!response.ok) {
    if (response.status === 401) clearAccessToken();
    throw new ApiError(`Request failed: ${response.status}`, {
      status: response.status,
      url,
      data,
    });
  }

  return data;
}
