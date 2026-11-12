import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 4107,
  login: '-aD6x@5k',
};

export const sampleWithPartialData: IUser = {
  id: 30028,
  login: 'EjFcy',
};

export const sampleWithFullData: IUser = {
  id: 25775,
  login: 'ze3eD',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
