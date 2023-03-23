import { IUser } from '@fst/shared/domain';
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
      nullable: false,
      unique: true,
    },
    password: {
      type: String,
      nullable: false,
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
