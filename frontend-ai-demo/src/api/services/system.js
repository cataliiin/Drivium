import { config } from "../../config";

function getHealthUrl() {
  const base = (config.apiBaseUrl ?? "").replace(/\/+$/, "");
  return `${base}/`;
}

export async function isBackendOnline(timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(getHealthUrl(), {
      method: "GET",
      signal: controller.signal,
    });

    return response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
