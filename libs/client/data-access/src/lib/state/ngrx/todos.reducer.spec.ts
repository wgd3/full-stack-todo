import { Action } from '@ngrx/store';

import { createMockTodo } from '@fst/shared/util-testing';
import * as TodosActions from './todos.actions';
import { TodosState, initialTodosState, todosReducer } from './todos.reducer';

describe('Todos Reducer', () => {
  describe('valid Todos actions', () => {
    it('loadTodosSuccess should return the list of known Todos', () => {
      const todos = [createMockTodo(''), createMockTodo('')];
      const action = TodosActions.loadTodosSuccess({ todos });

      const result: TodosState = todosReducer(initialTodosState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = todosReducer(initialTodosState, action);

      expect(result).toBe(initialTodosState);
    });
  });
});
