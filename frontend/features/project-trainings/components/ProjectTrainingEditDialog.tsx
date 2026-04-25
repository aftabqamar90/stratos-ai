"use client";

import { useEffect, useState } from "react";

import type { ProjectTraining } from "../types/projectTraining.types";
import { ProjectTrainingForm } from "./ProjectTrainingForm";
import { ProjectTrainingModalFrame } from "./ProjectTrainingModalFrame";

type ProjectTrainingEditDialogProps = {
  training: ProjectTraining | null;
  onClose: () => void;
  onSave: (id: number, name: string) => Promise<void>;
  busy: boolean;
};

export function ProjectTrainingEditDialog({ training, onClose, onSave, busy }: ProjectTrainingEditDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (training) setName(training.name);
    else setName("");
    setError(null);
  }, [training]);

  if (!training) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setError(null);
    try {
      await onSave(training.id, trimmed);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <ProjectTrainingModalFrame
      title="Edit training"
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
            onClick={() => void handleSubmit()}
            disabled={busy}
            className="rounded-md bg-[var(--admin-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--admin-accent-hover)] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </>
      }
    >
      <ProjectTrainingForm id="edit-project-training-name" value={name} onChange={setName} disabled={busy} />
      {error ? <p className="mt-2 text-sm text-[var(--admin-danger)]">{error}</p> : null}
    </ProjectTrainingModalFrame>
  );
}
