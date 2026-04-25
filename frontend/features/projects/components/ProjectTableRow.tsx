"use client";

import type { Project } from "../types/project.types";

type ProjectTableRowProps = {
  project: Project;
  onTraining: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export function ProjectTableRow({ project, onTraining, onEdit, onDelete }: ProjectTableRowProps) {
  return (
    <tr className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-surface-hover)]/50">
      <td className="px-4 py-3 font-mono text-xs text-[var(--admin-text-muted)]">{project.id}</td>
      <td className="px-4 py-3 text-sm text-[var(--admin-text)]">{project.name}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onTraining(project)}
          className="mr-2 rounded-md px-2 py-1 text-xs font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-surface-hover)]"
        >
          Training
        </button>
        <button
          type="button"
          onClick={() => onEdit(project)}
          className="mr-2 rounded-md px-2 py-1 text-xs font-medium text-[var(--admin-accent)] hover:bg-[var(--admin-surface-hover)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-md px-2 py-1 text-xs font-medium text-[var(--admin-danger)] hover:bg-[var(--admin-surface-hover)]"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
