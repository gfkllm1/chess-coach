import dayjs from 'dayjs/esm';
import { IOwner } from 'app/entities/owner/owner.model';
import { IProject } from 'app/entities/project/project.model';
import { IContext } from 'app/entities/context/context.model';
import { IPriority } from 'app/entities/priority/priority.model';
import { IStatus } from 'app/entities/status/status.model';

export interface IToDoItem {
  id: string;
  description?: string | null;
  duedate?: dayjs.Dayjs | null;
  completetiondate?: dayjs.Dayjs | null;
  owner?: IOwner | null;
  project?: IProject | null;
  context?: IContext | null;
  priority?: IPriority | null;
  status?: IStatus | null;
}

export type NewToDoItem = Omit<IToDoItem, 'id'> & { id: null };
