import { SocialProviderEnum } from '../social-provider.enum';
import { ITodo } from './todo.interface';

export interface IUser {
  id: string;
  email: string | null;
  password: string | null;
  socialProvider: SocialProviderEnum | null;
  socialId: string | null;
  givenName: string | null;
  familyName: string | null;
  profilePicture: string | null;
  todos: ITodo[];
}

/**
 * Regardless of auth source, all properties are required as
 * part of the registration process - but they can be `null`.
 *
 * Excludes `id` and `todos`.
 */
export type ICreateUser = Omit<IUser, 'id' | 'todos'>;
export type IUpdateUser = Partial<Omit<IUser, 'id' | 'todos'>>;
export type IUpsertUser = IUser;
export type IPublicUserData = Omit<IUser, 'password'>;

/**
 * This interface represents the normalize data structure that
 * is passed around during the login flow with social providers.
 */
export type ISocialUserData = Partial<
  Pick<IUser, 'givenName' | 'familyName' | 'email' | 'profilePicture'>
> &
  Pick<IUser, 'id'>;
