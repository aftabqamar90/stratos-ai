"use client";

import { StatusPanel } from "../components/StatusPanel";
import { useBackendStatus } from "../hooks/useBackendStatus";

export default function HomePage() {
  const { health, db } = useBackendStatus();

  return (
    <main>
      <h1>Stratos AI Dashboard</h1>
      <p>Client-side status checks for backend service and database.</p>

      <StatusPanel title="Health Check (/api/health)" loading={health.loading} data={health.data} error={health.error} />
      <StatusPanel title="DB Status (/api/db-status)" loading={db.loading} data={db.data} error={db.error} />
    </main>
  );
}
