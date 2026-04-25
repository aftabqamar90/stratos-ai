"use client";

import { useState } from "react";

import { ProjectTrainingForm } from "./ProjectTrainingForm";
import { ProjectTrainingModalFrame } from "./ProjectTrainingModalFrame";

type ProjectTrainingCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  busy: boolean;
};

export function ProjectTrainingCreateDialog({ open, onClose, onCreate, busy }: ProjectTrainingCreateDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setError(null);
    try {
      await onCreate(trimmed);
      setName("");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    }
  };

  return (
    <ProjectTrainingModalFrame
      title="New training"
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
            {busy ? "Saving…" : "Create"}
          </button>
        </>
      }
    >
      <ProjectTrainingForm id="create-project-training-name" value={name} onChange={setName} disabled={busy} />
      {error ? <p className="mt-2 text-sm text-[var(--admin-danger)]">{error}</p> : null}
    </ProjectTrainingModalFrame>
  );
}
