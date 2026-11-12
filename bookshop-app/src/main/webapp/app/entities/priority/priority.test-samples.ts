import { IPriority, NewPriority } from './priority.model';

export const sampleWithRequiredData: IPriority = {
  id: 25062,
};

export const sampleWithPartialData: IPriority = {
  id: 8504,
  level: 'backburn where',
};

export const sampleWithFullData: IPriority = {
  id: 10235,
  level: 'intend',
};

export const sampleWithNewData: NewPriority = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
