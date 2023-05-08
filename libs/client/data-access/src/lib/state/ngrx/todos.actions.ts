import { createAction, props } from '@ngrx/store';
import { TodoEntity } from './todos.models';

export const initTodos = createAction('[Todos Page] Init');

export const loadTodosSuccess = createAction(
  '[Todos/API] Load Todos Success',
  props<{ todos: TodoEntity[] }>()
);

export const loadTodosFailure = createAction(
  '[Todos/API] Load Todos Failure',
  props<{ error: any }>()
);
