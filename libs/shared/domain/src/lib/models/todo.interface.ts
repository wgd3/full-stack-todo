export interface ITodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export type ICreateTodo = Pick<ITodo, 'title' | 'description'>;
export type IUpdateTodo = Partial<Omit<ITodo, 'id'>>;
export type IUpsertTodo = ITodo;
