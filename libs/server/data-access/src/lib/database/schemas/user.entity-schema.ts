import { IUser, SocialProviderEnum } from '@fst/shared/domain';
import { EntitySchema } from 'typeorm';

export const UserEntitySchema = new EntitySchema<IUser>({
  name: 'user',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: String,
      nullable: true,
      unique: true,
    },
    password: {
      type: String,
      nullable: true,
    },
    socialProvider: {
      type: String,
      nullable: true,
      enum: SocialProviderEnum,
    },
    socialId: {
      type: String,
      nullable: true,
    },
    givenName: {
      type: String,
      nullable: true,
    },
    familyName: {
      type: String,
      nullable: true,
    },
    profilePicture: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    todos: {
      type: 'one-to-many',
      target: 'todo',
      inverseSide: 'user',
    },
  },
});
