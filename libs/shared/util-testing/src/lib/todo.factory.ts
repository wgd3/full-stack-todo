import { ITodo } from '@fst/shared/domain';
import { randBoolean, randProduct } from '@ngneat/falso';

export const createMockTodo = (data?: Partial<ITodo>): ITodo => {
  const { id, title, description } = randProduct();
  const todo: ITodo = Object.assign({}, data, {
    id,
    title,
    description,
    completed: randBoolean(),
  });
  return todo;
};
