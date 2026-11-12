export interface IContext {
  id: string;
  descrription?: string | null;
}

export type NewContext = Omit<IContext, 'id'> & { id: null };
