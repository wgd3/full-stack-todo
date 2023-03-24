import { IUser } from './user.interface';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user?: IUser;
  user_id?: string;
}

export type ICreateTodo = Pick<ITodo, 'title' | 'description' | 'user_id'>;
export type IUpdateTodo = Partial<Omit<ITodo, 'id' | 'user_id'>>;
export type IUpsertTodo = ITodo;
