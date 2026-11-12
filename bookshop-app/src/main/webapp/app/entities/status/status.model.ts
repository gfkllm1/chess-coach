export interface IStatus {
  id: number;
  type?: string | null;
}

export type NewStatus = Omit<IStatus, 'id'> & { id: null };
