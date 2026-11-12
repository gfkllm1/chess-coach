export interface IOwner {
  id: string;
  firstname?: string | null;
  surname?: string | null;
}

export type NewOwner = Omit<IOwner, 'id'> & { id: null };
