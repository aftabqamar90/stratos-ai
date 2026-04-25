"use client";

import { useState } from "react";

import type { Project } from "../types/project.types";

import { ProjectModalFrame } from "./ProjectModalFrame";

type DeleteProjectDialogProps = {
  project: Project | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  busy: boolean;
};

export function DeleteProjectDialog({ project, onClose, onConfirm, busy }: DeleteProjectDialogProps) {
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm(project.id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <ProjectModalFrame
      title="Delete project"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={busy}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--admin-text-muted)]">
        Delete <span className="font-medium text-[var(--admin-text)]">{project.name}</span>? Projects with training
        history cannot be deleted.
      </p>
      {error ? <p className="mt-2 text-sm text-[var(--admin-danger)]">{error}</p> : null}
    </ProjectModalFrame>
  );
}
