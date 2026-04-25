export type Project = {
  id: number;
  name: string;
};

export type ProjectWrite = {
  name: string;
};

export type ProjectDeleteResponse = {
  id: number;
  deleted: boolean;
};
