"use client";

import { useCallback, useEffect, useState } from "react";

import { listProjectTrainings } from "../api/projectTrainingsApi";
import type { ProjectTraining } from "../types/projectTraining.types";

export function useProjectTrainings(projectId: number) {
  const [trainings, setTrainings] = useState<ProjectTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listProjectTrainings();
      setTrainings(rows.filter((row) => row.project_id === projectId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load trainings");
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { trainings, loading, error, refetch };
}
