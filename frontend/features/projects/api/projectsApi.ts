import { apiRequest } from "../../../lib/api/client";

import type { Project, ProjectDeleteResponse, ProjectWrite } from "../types/project.types";

const base = "/v1/projects";

export function listProjects(): Promise<Project[]> {
  return apiRequest<Project[]>(base);
}

export function getProject(id: number): Promise<Project> {
  return apiRequest<Project>(`${base}/${id}`);
}

export function createProject(body: ProjectWrite): Promise<Project> {
  return apiRequest<Project>(base, { method: "POST", body: JSON.stringify(body) });
}

export function updateProject(id: number, body: ProjectWrite): Promise<Project> {
  return apiRequest<Project>(`${base}/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteProject(id: number): Promise<ProjectDeleteResponse> {
  return apiRequest<ProjectDeleteResponse>(`${base}/${id}`, { method: "DELETE" });
}
