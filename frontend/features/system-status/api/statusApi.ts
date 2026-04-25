import { apiUrl, parseJsonResponse } from "../../../lib/api/client";

export async function fetchHealth(): Promise<unknown> {
  const response = await fetch(apiUrl("/api/health"));
  return parseJsonResponse(response);
}

export async function fetchDbStatus(): Promise<unknown> {
  const response = await fetch(apiUrl("/api/db-status"));
  return parseJsonResponse(response);
}
