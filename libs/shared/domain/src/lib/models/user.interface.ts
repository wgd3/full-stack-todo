import { ITodo } from './todo.interface';

export interface IUser {
  id: string;
  email: string;
  password: string;
  todos: ITodo[];
}

export type ICreateUser = Pick<IUser, 'email' | 'password'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
export type IPublicUserData = Omit<IUser, 'password'>;
