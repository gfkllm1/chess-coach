import { IOwner, NewOwner } from './owner.model';

export const sampleWithRequiredData: IOwner = {
  id: '85569af1-755b-4c5b-ba38-9dcc42e36a7a',
  firstname: 'ack sympathetically near',
  surname: 'whenever afore quiet',
};

export const sampleWithPartialData: IOwner = {
  id: 'c0310c1f-2b56-4e9c-beb7-38653c18c501',
  firstname: 'past diligently depot',
  surname: 'stiffen',
};

export const sampleWithFullData: IOwner = {
  id: 'd7d04ebe-8b7c-45f1-99fb-962b44cd2dfd',
  firstname: 'dead wildly animated',
  surname: 'house properly desecrate',
};

export const sampleWithNewData: NewOwner = {
  firstname: 'hubris gorgeous owlishly',
  surname: 'transom',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
