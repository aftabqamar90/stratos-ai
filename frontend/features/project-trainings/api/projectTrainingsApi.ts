import { apiRequest } from "../../../lib/api/client";
import type {
  ProjectTraining,
  ProjectTrainingDeleteResponse,
  ProjectTrainingWrite,
} from "../types/projectTraining.types";

const base = "/v1/project-trainings";

export function listProjectTrainings(): Promise<ProjectTraining[]> {
  return apiRequest<ProjectTraining[]>(base);
}

export function createProjectTraining(body: ProjectTrainingWrite): Promise<ProjectTraining> {
  return apiRequest<ProjectTraining>(base, { method: "POST", body: JSON.stringify(body) });
}

export function updateProjectTraining(id: number, body: ProjectTrainingWrite): Promise<ProjectTraining> {
  return apiRequest<ProjectTraining>(`${base}/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteProjectTraining(id: number): Promise<ProjectTrainingDeleteResponse> {
  return apiRequest<ProjectTrainingDeleteResponse>(`${base}/${id}`, { method: "DELETE" });
}
