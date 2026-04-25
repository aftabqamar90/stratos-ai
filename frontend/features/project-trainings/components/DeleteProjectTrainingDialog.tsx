"use client";

import { useState } from "react";

import type { ProjectTraining } from "../types/projectTraining.types";
import { ProjectTrainingModalFrame } from "./ProjectTrainingModalFrame";

type DeleteProjectTrainingDialogProps = {
  training: ProjectTraining | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  busy: boolean;
};

export function DeleteProjectTrainingDialog({ training, onClose, onConfirm, busy }: DeleteProjectTrainingDialogProps) {
  const [error, setError] = useState<string | null>(null);

  if (!training) return null;

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm(training.id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <ProjectTrainingModalFrame
      title="Delete training"
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
        Delete <span className="font-medium text-[var(--admin-text)]">{training.name}</span>?
      </p>
      {error ? <p className="mt-2 text-sm text-[var(--admin-danger)]">{error}</p> : null}
    </ProjectTrainingModalFrame>
  );
}
