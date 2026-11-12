import { IContext, NewContext } from './context.model';

export const sampleWithRequiredData: IContext = {
  id: '37501363-2d62-4f47-b885-d817933e0ada',
};

export const sampleWithPartialData: IContext = {
  id: '9a19d183-98a0-42b8-a99e-a518ffe74829',
};

export const sampleWithFullData: IContext = {
  id: '962dcc3a-f576-4cf6-bad9-9bf214bb81ea',
  descrription: 'sailor',
};

export const sampleWithNewData: NewContext = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
