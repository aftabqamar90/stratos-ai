"use client";

import { useState } from "react";

import { ProjectForm } from "./ProjectForm";
import { ProjectModalFrame } from "./ProjectModalFrame";

type ProjectCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  busy: boolean;
};

export function ProjectCreateDialog({ open, onClose, onCreate, busy }: ProjectCreateDialogProps) {
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
    <ProjectModalFrame
      title="New project"
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
      <ProjectForm id="create-project-name" value={name} onChange={setName} disabled={busy} />
      {error ? <p className="mt-2 text-sm text-[var(--admin-danger)]">{error}</p> : null}
    </ProjectModalFrame>
  );
}
