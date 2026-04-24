"use client";

import { useEffect, useState } from "react";

import { fetchDbStatus, fetchHealth } from "../lib/api";

type ApiState = {
  loading: boolean;
  data: unknown | null;
  error: string | null;
};

export function useBackendStatus() {
  const [health, setHealth] = useState<ApiState>({ loading: true, data: null, error: null });
  const [db, setDb] = useState<ApiState>({ loading: true, data: null, error: null });

  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth({ loading: false, data, error: null }))
      .catch((error: Error) => setHealth({ loading: false, data: null, error: error.message }));

    fetchDbStatus()
      .then((data) => setDb({ loading: false, data, error: null }))
      .catch((error: Error) => setDb({ loading: false, data: null, error: error.message }));
  }, []);

  return { health, db };
}
