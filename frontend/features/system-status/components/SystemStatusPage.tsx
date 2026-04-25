"use client";

import { AdminHeader } from "../../../components/admin/AdminHeader";
import { StatusPanel } from "./StatusPanel";
import { useBackendStatus } from "../hooks/useBackendStatus";

export function SystemStatusPage() {
  const { health, db } = useBackendStatus();

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 space-y-6 overflow-auto p-6">
        <p className="text-sm text-[var(--admin-text-muted)]">
          Client-side status checks for backend service and database.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <StatusPanel title="Health Check (/api/health)" loading={health.loading} data={health.data} error={health.error} />
          <StatusPanel title="DB Status (/api/db-status)" loading={db.loading} data={db.data} error={db.error} />
        </div>
      </main>
    </>
  );
}
