import { ITodo } from '@fst/shared/domain';
import { randBoolean, randProduct } from '@ngneat/falso';

export const createMockTodo = (
  user_id: string,
  data?: Partial<ITodo>
): ITodo => {
  const { id, title, description } = randProduct();

  return {
    id,
    title,
    description,
    completed: randBoolean(),
    ...data,
    user_id,
  };
};
