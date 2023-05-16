import { IUser, SocialProviderEnum } from '@fst/shared/domain';
import {
  randFirstName,
  randImg,
  randLastName,
  randPassword,
  randUser,
} from '@ngneat/falso';

export const createMockUser = (data?: Partial<IUser>): IUser => {
  const { id, email } = randUser();
  const password = randPassword();
  return {
    id,
    email,
    password,
    todos: [],
    socialProvider: SocialProviderEnum.email,
    socialId: null,
    givenName: randFirstName(),
    familyName: randLastName(),
    profilePicture: randImg(),
    ...data,
  };
};
