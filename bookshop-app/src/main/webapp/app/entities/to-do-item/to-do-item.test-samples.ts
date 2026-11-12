import dayjs from 'dayjs/esm';

import { IToDoItem, NewToDoItem } from './to-do-item.model';

export const sampleWithRequiredData: IToDoItem = {
  id: '19a30c8f-beb8-48fe-a6cd-18d4100a6474',
};

export const sampleWithPartialData: IToDoItem = {
  id: '5c817672-0be9-4c78-9e31-65102ffb7e1e',
  duedate: dayjs('2026-01-07'),
  completetiondate: dayjs('2026-01-07'),
};

export const sampleWithFullData: IToDoItem = {
  id: 'b60c4a78-aaa7-4fa8-bcc0-3cfea5da95f9',
  description: 'but impostor bah',
  duedate: dayjs('2026-01-06'),
  completetiondate: dayjs('2026-01-06'),
};

export const sampleWithNewData: NewToDoItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
