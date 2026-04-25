"use client";

import type { Project } from "../types/project.types";

import { ProjectTableRow } from "./ProjectTableRow";

type ProjectTableProps = {
  projects: Project[];
  loading: boolean;
  onTraining: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export function ProjectTable({ projects, loading, onTraining, onEdit, onDelete }: ProjectTableProps) {
  if (loading) {
    return <p className="text-sm text-[var(--admin-text-muted)]">Loading projects…</p>;
  }

  if (projects.length === 0) {
    return <p className="text-sm text-[var(--admin-text-muted)]">No projects yet. Create one to get started.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-border)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">ID</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">Name</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[var(--admin-surface)]">
          {projects.map((p) => (
            <ProjectTableRow key={p.id} project={p} onTraining={onTraining} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
