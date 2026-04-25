const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

function formatDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((entry) => {
        if (entry && typeof entry === "object" && "msg" in entry) {
          return String((entry as { msg?: unknown }).msg ?? JSON.stringify(entry));
        }
        return JSON.stringify(entry);
      })
      .join("; ");
  }
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return String(detail);
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  if (response.ok) {
    if (response.status === 204 || !isJson) return undefined as T;
    return response.json() as Promise<T>;
  }
  let message = `Request failed with status ${response.status}`;
  if (isJson) {
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && "detail" in body) {
        message = formatDetail((body as { detail: unknown }).detail);
      }
    } catch {
      /* ignore */
    }
  }
  throw new Error(message);
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(apiUrl(path), { ...init, headers });
  return parseJsonResponse<T>(response);
}
