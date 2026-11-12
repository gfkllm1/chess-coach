import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 'ed15c480-aa54-4b44-93b0-a1d9a0464003',
  projectname: 'advancement despite',
};

export const sampleWithPartialData: IProject = {
  id: 'c1c250ed-0bcc-4847-9ac4-df0caef9e27f',
  projectname: 'defrag yet',
};

export const sampleWithFullData: IProject = {
  id: '013e6cbf-379a-4b26-96d4-be33bf1161e2',
  projectname: 'log lively',
  budget: 12172.85,
};

export const sampleWithNewData: NewProject = {
  projectname: 'pish hoof generally',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
