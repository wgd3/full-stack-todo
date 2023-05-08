import { TodosEntity } from './todos.models';
import {
  todosAdapter,
  TodosPartialState,
  initialTodosState,
} from './todos.reducer';
import * as TodosSelectors from './todos.selectors';

describe('Todos Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTodosId = (it: TodosEntity) => it.id;
  const createTodosEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as TodosEntity);

  let state: TodosPartialState;

  beforeEach(() => {
    state = {
      todos: todosAdapter.setAll(
        [
          createTodosEntity('PRODUCT-AAA'),
          createTodosEntity('PRODUCT-BBB'),
          createTodosEntity('PRODUCT-CCC'),
        ],
        {
          ...initialTodosState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Todos Selectors', () => {
    it('selectAllTodos() should return the list of Todos', () => {
      const results = TodosSelectors.selectAllTodos(state);
      const selId = getTodosId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = TodosSelectors.selectEntity(state) as TodosEntity;
      const selId = getTodosId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectTodosLoaded() should return the current "loaded" status', () => {
      const result = TodosSelectors.selectTodosLoaded(state);

      expect(result).toBe(true);
    });

    it('selectTodosError() should return the current "error" state', () => {
      const result = TodosSelectors.selectTodosError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
