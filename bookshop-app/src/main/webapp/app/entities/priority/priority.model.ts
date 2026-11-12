export interface IPriority {
  id: number;
  level?: string | null;
}

export type NewPriority = Omit<IPriority, 'id'> & { id: null };
