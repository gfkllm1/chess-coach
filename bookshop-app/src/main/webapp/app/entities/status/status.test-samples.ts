import { IStatus, NewStatus } from './status.model';

export const sampleWithRequiredData: IStatus = {
  id: 17351,
};

export const sampleWithPartialData: IStatus = {
  id: 8377,
};

export const sampleWithFullData: IStatus = {
  id: 3788,
  type: 'split',
};

export const sampleWithNewData: NewStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
