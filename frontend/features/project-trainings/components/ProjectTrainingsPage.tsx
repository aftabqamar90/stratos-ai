"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AdminHeader } from "../../../components/admin/AdminHeader";
import { useProjectTrainingMutations } from "../hooks/useProjectTrainingMutations";
import { useProjectTrainings } from "../hooks/useProjectTrainings";
import type { ProjectTraining } from "../types/projectTraining.types";
import { DeleteProjectTrainingDialog } from "./DeleteProjectTrainingDialog";
import { ProjectTrainingCreateDialog } from "./ProjectTrainingCreateDialog";
import { ProjectTrainingEditDialog } from "./ProjectTrainingEditDialog";
import { ProjectTrainingTable } from "./ProjectTrainingTable";

type ProjectTrainingsPageProps = {
  projectId: number;
};

export function ProjectTrainingsPage({ projectId }: ProjectTrainingsPageProps) {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("projectName");

  const { trainings, loading, error, refetch } = useProjectTrainings(projectId);
  const { create, update, remove, busy } = useProjectTrainingMutations();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTraining, setEditTraining] = useState<ProjectTraining | null>(null);
  const [deleteTraining, setDeleteTraining] = useState<ProjectTraining | null>(null);

  const handleCreate = async (name: string) => {
    await create({ project_id: projectId, name });
    await refetch();
  };

  const handleSaveEdit = async (id: number, name: string) => {
    await update(id, { project_id: projectId, name });
    await refetch();
  };

  const handleDeleteConfirm = async (id: number) => {
    await remove(id);
    await refetch();
  };

  return (
    <>
      <AdminHeader
        title={projectName ? `Trainings: ${projectName}` : `Trainings: Project ${projectId}`}
        actions={
          <>
            <Link
              href="/projects"
              className="rounded-md border border-[var(--admin-border)] px-3 py-2 text-sm font-medium text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)]"
            >
              Back to projects
            </Link>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-md bg-[var(--admin-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--admin-accent-hover)]"
            >
              New training
            </button>
          </>
        }
      />
      <main className="flex-1 space-y-4 overflow-auto p-6">
        {error ? <p className="text-sm text-[var(--admin-danger)]">{error}</p> : null}
        <ProjectTrainingTable trainings={trainings} loading={loading} onEdit={setEditTraining} onDelete={setDeleteTraining} />
      </main>

      <ProjectTrainingCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        busy={busy}
      />
      <ProjectTrainingEditDialog
        training={editTraining}
        onClose={() => setEditTraining(null)}
        onSave={handleSaveEdit}
        busy={busy}
      />
      <DeleteProjectTrainingDialog
        training={deleteTraining}
        onClose={() => setDeleteTraining(null)}
        onConfirm={handleDeleteConfirm}
        busy={busy}
      />
    </>
  );
}
