import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'd8bb34c1-6a62-42d0-b2a0-470e7e3be366',
};

export const sampleWithPartialData: IAuthority = {
  name: 'e6201eca-a529-45bc-8182-1bacc2ddde1e',
};

export const sampleWithFullData: IAuthority = {
  name: '696388f5-88fc-4288-8f77-27c5a8ce7ffc',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
