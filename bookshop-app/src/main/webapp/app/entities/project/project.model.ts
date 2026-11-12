export interface IProject {
  id: string;
  projectname?: string | null;
  budget?: number | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
