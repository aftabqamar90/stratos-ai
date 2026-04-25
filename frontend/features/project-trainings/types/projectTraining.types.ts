export type ProjectTraining = {
  id: number;
  project_id: number;
  name: string;
};

export type ProjectTrainingWrite = {
  project_id: number;
  name: string;
};

export type ProjectTrainingDeleteResponse = {
  id: number;
  deleted: boolean;
};
