import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { actionsFactory, props } from '@ngneat/effects';

export const todoActions = actionsFactory('todo');

export const loadTodos = todoActions.create('Load Todos');
export const createTodo = todoActions.create(
  'Add Todo',
  props<{ todo: ICreateTodo }>()
);
export const updateTodo = todoActions.create(
  'Update Todo',
  props<{ todoId: string; data: IUpdateTodo }>()
);

export const deleteTodo = todoActions.create(
  'Delete Todo',
  props<{ todoId: string }>()
);
