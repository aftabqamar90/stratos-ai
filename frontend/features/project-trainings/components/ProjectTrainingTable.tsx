"use client";

import type { ProjectTraining } from "../types/projectTraining.types";
import { ProjectTrainingTableRow } from "./ProjectTrainingTableRow";

type ProjectTrainingTableProps = {
  trainings: ProjectTraining[];
  loading: boolean;
  onEdit: (training: ProjectTraining) => void;
  onDelete: (training: ProjectTraining) => void;
};

export function ProjectTrainingTable({ trainings, loading, onEdit, onDelete }: ProjectTrainingTableProps) {
  if (loading) {
    return <p className="text-sm text-[var(--admin-text-muted)]">Loading trainings…</p>;
  }

  if (trainings.length === 0) {
    return <p className="text-sm text-[var(--admin-text-muted)]">No trainings yet. Create one to get started.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--admin-border)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">ID</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              Name
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[var(--admin-surface)]">
          {trainings.map((training) => (
            <ProjectTrainingTableRow
              key={training.id}
              training={training}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
