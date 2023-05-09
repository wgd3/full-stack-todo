import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  Action,
  ActionCreator,
  ReducerTypes,
  createReducer,
  on,
} from '@ngrx/store';

import * as TodosActions from './todos.actions';
import { TodoEntity } from './todos.models';

export const TODOS_FEATURE_KEY = 'todos';

export interface TodosState extends EntityState<TodoEntity> {
  selectedId?: string | number; // which Todos record has been selected
  loaded: boolean; // has the Todos list been loaded
  error?: string | null; // last known error (if any)
}

export interface TodosPartialState {
  readonly [TODOS_FEATURE_KEY]: TodosState;
}

export const todosAdapter: EntityAdapter<TodoEntity> =
  createEntityAdapter<TodoEntity>();

export const initialTodosState: TodosState = todosAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const crudSuccessOns: ReducerTypes<TodosState, ActionCreator[]>[] = [
  on(
    TodosActions.createTodo.createSuccess,
    (state, { todo }): TodosState => todosAdapter.addOne(todo, { ...state })
  ),
  on(
    TodosActions.updateTodo.updateSuccess,
    (state, { update }): TodosState =>
      todosAdapter.updateOne(update, { ...state })
  ),
  on(
    TodosActions.deleteTodo.deleteSuccess,
    (state, { todoId }): TodosState =>
      todosAdapter.removeOne(todoId, { ...state })
  ),
  on(
    TodosActions.loadTodosSuccess,
    (state, { todos }): TodosState =>
      todosAdapter.setAll(todos, { ...state, loaded: true })
  ),
];

const reducer = createReducer(
  initialTodosState,
  on(
    TodosActions.initTodos,
    (state): TodosState => ({
      ...state,
      loaded: false,
      error: null,
    })
  ),
  on(
    TodosActions.loadTodosFailure,
    TodosActions.createTodo.createFailure,
    (state, { error }): TodosState => ({ ...state, error })
  ),
  ...crudSuccessOns
);

export function todosReducer(state: TodosState | undefined, action: Action) {
  return reducer(state, action);
}
