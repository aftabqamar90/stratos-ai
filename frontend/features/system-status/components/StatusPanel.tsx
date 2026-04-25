"use client";

type StatusPanelProps = {
  title: string;
  loading: boolean;
  data: unknown;
  error: string | null;
};

export function StatusPanel({ title, loading, data, error }: StatusPanelProps) {
  return (
    <section className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm">
      <h2 className="mt-0 text-sm font-semibold text-[var(--admin-text)]">{title}</h2>
      {loading && <p className="text-sm text-[var(--admin-text-muted)]">Loading...</p>}
      {!loading && error && <p className="text-sm text-[var(--admin-danger)]">{error}</p>}
      {!loading && !error && (
        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-[var(--admin-bg)] p-3 text-xs text-[var(--admin-text-muted)]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}
