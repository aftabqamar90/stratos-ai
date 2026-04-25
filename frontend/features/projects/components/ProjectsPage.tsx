"use client";

import { useState } from "react";

import { AdminHeader } from "../../../components/admin/AdminHeader";

import { useProjectMutations } from "../hooks/useProjectMutations";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../types/project.types";

import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ProjectCreateDialog } from "./ProjectCreateDialog";
import { ProjectEditDialog } from "./ProjectEditDialog";
import { ProjectTable } from "./ProjectTable";

export function ProjectsPage() {
  const { projects, loading, error, refetch } = useProjects();
  const { create, update, remove, busy: mutationBusy } = useProjectMutations();

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const handleCreate = async (name: string) => {
    await create({ name });
    await refetch();
  };

  const handleSaveEdit = async (id: number, name: string) => {
    await update(id, { name });
    await refetch();
  };

  const handleDeleteConfirm = async (id: number) => {
    await remove(id);
    await refetch();
  };

  return (
    <>
      <AdminHeader
        title="Projects"
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-md bg-[var(--admin-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--admin-accent-hover)]"
          >
            New project
          </button>
        }
      />
      <main className="flex-1 space-y-4 overflow-auto p-6">
        {error ? <p className="text-sm text-[var(--admin-danger)]">{error}</p> : null}
        <ProjectTable
          projects={projects}
          loading={loading}
          onEdit={setEditProject}
          onDelete={setDeleteProject}
        />
      </main>

      <ProjectCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        busy={mutationBusy}
      />
      <ProjectEditDialog
        project={editProject}
        onClose={() => setEditProject(null)}
        onSave={handleSaveEdit}
        busy={mutationBusy}
      />
      <DeleteProjectDialog
        project={deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleDeleteConfirm}
        busy={mutationBusy}
      />
    </>
  );
}
