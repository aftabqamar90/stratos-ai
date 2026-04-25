import { ProjectTrainingsPage } from "../../../../features/project-trainings/components/ProjectTrainingsPage";

type ProjectTrainingsRoutePageProps = {
  params: {
    projectId: string;
  };
};

export default function ProjectTrainingsRoutePage({ params }: ProjectTrainingsRoutePageProps) {
  const projectId = Number.parseInt(params.projectId, 10);

  if (Number.isNaN(projectId)) {
    return <p className="p-6 text-sm text-[var(--admin-danger)]">Invalid project id.</p>;
  }

  return <ProjectTrainingsPage projectId={projectId} />;
}
