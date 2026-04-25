"use client";

import { useCallback, useState } from "react";

import { createProject, deleteProject, updateProject } from "../api/projectsApi";
import type { Project, ProjectWrite } from "../types/project.types";

export function useProjectMutations() {
  const [busy, setBusy] = useState(false);

  const create = useCallback(async (body: ProjectWrite): Promise<Project> => {
    setBusy(true);
    try {
      return await createProject(body);
    } finally {
      setBusy(false);
    }
  }, []);

  const update = useCallback(async (id: number, body: ProjectWrite): Promise<Project> => {
    setBusy(true);
    try {
      return await updateProject(id, body);
    } finally {
      setBusy(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setBusy(true);
    try {
      await deleteProject(id);
    } finally {
      setBusy(false);
    }
  }, []);

  return { create, update, remove, busy };
}
