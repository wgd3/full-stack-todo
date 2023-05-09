import { ICreateTodo, ITodo, IUpdateTodo } from '@fst/shared/domain';
import { Update } from '@ngrx/entity';
import { createAction, createActionGroup, props } from '@ngrx/store';
import { TodoEntity } from './todos.models';

export const initTodos = createAction('[Todos Page] Init');

const errorProps = props<{ error: string; data?: unknown }>;

export const loadTodosSuccess = createAction(
  '[Todos/API] Load Todos Success',
  props<{ todos: TodoEntity[] }>()
);

export const loadTodosFailure = createAction(
  '[Todos/API] Load Todos Failure',
  props<{ error: string }>()
);

export const updateTodo = createActionGroup({
  source: `Todo API`,
  events: {
    update: props<{ todoId: string; data: IUpdateTodo }>(),
    updateSuccess: props<{ update: Update<ITodo> }>(),
    updateFailure: errorProps(),
  },
});

export const createTodo = createActionGroup({
  source: `Todo API`,
  events: {
    create: props<{ data: ICreateTodo }>(),
    createSuccess: props<{ todo: ITodo }>(),
    createFailure: errorProps(),
  },
});

export const deleteTodo = createActionGroup({
  source: `Todo API`,
  events: {
    delete: props<{ todoId: string }>(),
    deleteSuccess: props<{ todoId: string }>(),
    deleteFailure: errorProps(),
  },
});
