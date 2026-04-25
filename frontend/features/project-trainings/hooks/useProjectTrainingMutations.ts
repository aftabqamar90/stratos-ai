"use client";

import { useCallback, useState } from "react";

import { createProjectTraining, deleteProjectTraining, updateProjectTraining } from "../api/projectTrainingsApi";
import type { ProjectTraining, ProjectTrainingWrite } from "../types/projectTraining.types";

export function useProjectTrainingMutations() {
  const [busy, setBusy] = useState(false);

  const create = useCallback(async (body: ProjectTrainingWrite): Promise<ProjectTraining> => {
    setBusy(true);
    try {
      return await createProjectTraining(body);
    } finally {
      setBusy(false);
    }
  }, []);

  const update = useCallback(async (id: number, body: ProjectTrainingWrite): Promise<ProjectTraining> => {
    setBusy(true);
    try {
      return await updateProjectTraining(id, body);
    } finally {
      setBusy(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setBusy(true);
    try {
      await deleteProjectTraining(id);
    } finally {
      setBusy(false);
    }
  }, []);

  return { create, update, remove, busy };
}
