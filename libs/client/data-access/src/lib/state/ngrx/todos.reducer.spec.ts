import { Action } from '@ngrx/store';

import { IUpdateTodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import * as TodosActions from './todos.actions';
import { TodosState, initialTodosState, todosReducer } from './todos.reducer';

describe('Todos Reducer', () => {
  describe('initTodos action', () => {
    it('should reset state when loading todos', () => {
      const action = TodosActions.initTodos();
      const result = todosReducer(initialTodosState, action);

      expect(result).toStrictEqual(initialTodosState);
    });
    it('should return the list of known todos', () => {
      const todos = [createMockTodo(''), createMockTodo('')];
      const action = TodosActions.loadTodosSuccess({ todos });

      const result: TodosState = todosReducer(initialTodosState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });

    it('should update the error when loading fails', () => {
      const errMsg = 'foo';
      const newState: TodosState = {
        ids: [],
        entities: {},
        loaded: false,
        error: errMsg,
      };

      const action = TodosActions.loadTodosFailure({ error: errMsg });
      const state = todosReducer(initialTodosState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialTodosState);
    });
  });

  describe('createTodo action', () => {
    it('should add a todo and update the state in an immutable way', () => {
      const newTodo = createMockTodo('');
      const newState: TodosState = {
        ids: [newTodo.id],
        entities: {
          [newTodo.id]: newTodo,
        },
        loaded: false,
      };

      const action = TodosActions.createTodo.createSuccess({ todo: newTodo });
      const state = todosReducer(initialTodosState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialTodosState);
    });

    it('should update the error when creation fails', () => {
      const errMsg = 'foo';
      const newState: TodosState = {
        ids: [],
        entities: {},
        loaded: false,
        error: errMsg,
      };

      const action = TodosActions.createTodo.createFailure({ error: errMsg });
      const state = todosReducer(initialTodosState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialTodosState);
    });
  });

  describe('updateTodo action', () => {
    it('should update a todo and update the state in an immutable way', () => {
      const newTodo = createMockTodo('');
      const updates: IUpdateTodo = {
        title: 'foo',
      };
      const initialState: TodosState = {
        ...initialTodosState,
        ids: [newTodo.id],
        entities: {
          [newTodo.id]: newTodo,
        },
      };
      const newState: TodosState = {
        ids: [newTodo.id],
        entities: {
          [newTodo.id]: { ...newTodo, ...updates },
        },
        loaded: false,
      };

      const action = TodosActions.updateTodo.updateSuccess({
        update: {
          id: newTodo.id,
          changes: updates,
        },
      });
      const state = todosReducer(initialState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialState);
    });

    it('should update the error when creation fails', () => {
      const errMsg = 'foo';
      const newState: TodosState = {
        ids: [],
        entities: {},
        loaded: false,
        error: errMsg,
      };

      const action = TodosActions.updateTodo.updateFailure({ error: errMsg });
      const state = todosReducer(initialTodosState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialTodosState);
    });
  });

  describe('deleteTodo action', () => {
    it('should delete a todo and update the state in an immutable way', () => {
      const newTodo = createMockTodo('');
      const initialState: TodosState = {
        ...initialTodosState,
        ids: [newTodo.id],
        entities: {
          [newTodo.id]: newTodo,
        },
        loaded: true,
      };
      const newState: TodosState = {
        ids: [],
        entities: {},
        loaded: true,
      };

      const action = TodosActions.deleteTodo.deleteSuccess({
        todoId: newTodo.id,
      });
      const state = todosReducer(initialState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialState);
    });

    it('should update the error when creation fails', () => {
      const errMsg = 'foo';
      const newState: TodosState = {
        ids: [],
        entities: {},
        loaded: false,
        error: errMsg,
      };

      const action = TodosActions.deleteTodo.deleteFailure({ error: errMsg });
      const state = todosReducer(initialTodosState, action);

      expect(state).toStrictEqual(newState);
      expect(state).not.toEqual(initialTodosState);
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
