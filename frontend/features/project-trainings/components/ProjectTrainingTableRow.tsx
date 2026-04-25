"use client";

import type { ProjectTraining } from "../types/projectTraining.types";

type ProjectTrainingTableRowProps = {
  training: ProjectTraining;
  onEdit: (training: ProjectTraining) => void;
  onDelete: (training: ProjectTraining) => void;
};

export function ProjectTrainingTableRow({ training, onEdit, onDelete }: ProjectTrainingTableRowProps) {
  return (
    <tr className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface-hover)]/50">
      <td className="px-4 py-3 font-mono text-xs text-[var(--admin-text-muted)]">{training.id}</td>
      <td className="px-4 py-3 text-sm text-[var(--admin-text)]">{training.name}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onEdit(training)}
          className="mr-2 rounded-md px-2 py-1 text-xs font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-surface-hover)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(training)}
          className="rounded-md px-2 py-1 text-xs font-medium text-[var(--admin-danger)] hover:bg-[var(--admin-surface-hover)]"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
