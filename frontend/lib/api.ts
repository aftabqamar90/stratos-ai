const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function parseResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return parseResponse(response);
}

export async function fetchDbStatus() {
  const response = await fetch(`${API_BASE_URL}/api/db-status`);
  return parseResponse(response);
}
