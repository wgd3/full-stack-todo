import { ITodo } from '@fst/shared/domain';
import { EntitySchema } from 'typeorm';

export const ToDoEntitySchema = new EntitySchema<ITodo>({
  name: 'todo',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: String,
      nullable: false,
      unique: true,
    },
    description: {
      type: String,
      nullable: true,
    },
    completed: {
      type: 'boolean',
      default: false,
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      joinColumn: {
        name: 'user_id',
      },
      inverseSide: 'todos',
    },
  },
});
