import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TODOS_FEATURE_KEY, TodosState, todosAdapter } from './todos.reducer';

// Lookup the 'Todos' feature state managed by NgRx
export const selectTodosState =
  createFeatureSelector<TodosState>(TODOS_FEATURE_KEY);

const { selectAll, selectEntities } = todosAdapter.getSelectors();

export const selectTodosLoaded = createSelector(
  selectTodosState,
  (state: TodosState) => state.loaded
);

export const selectTodosError = createSelector(
  selectTodosState,
  (state: TodosState) => state.error
);

export const selectAllTodos = createSelector(
  selectTodosState,
  (state: TodosState) => selectAll(state)
);

export const selectTodosEntities = createSelector(
  selectTodosState,
  (state: TodosState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectTodosState,
  (state: TodosState) => state.selectedId
);

export const selectEntity = createSelector(
  selectTodosEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
