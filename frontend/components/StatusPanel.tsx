"use client";

type StatusPanelProps = {
  title: string;
  loading: boolean;
  data: unknown;
  error: string | null;
};

export function StatusPanel({ title, loading, data, error }: StatusPanelProps) {
  return (
    <section style={{ border: "1px solid #d0d0d0", borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {loading && <p>Loading...</p>}
      {!loading && error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!loading && !error && <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
}
