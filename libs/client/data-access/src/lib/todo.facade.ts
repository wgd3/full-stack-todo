import { Injectable, inject } from '@angular/core';
import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { Store } from '@ngrx/store';
import { TodoActions, TodoSelectors } from './state/ngrx';

@Injectable({
  providedIn: 'root',
})
export class TodoFacade {
  private readonly store = inject(Store);

  todos$ = this.store.select(TodoSelectors.selectAllTodos);
  loaded$ = this.store.select(TodoSelectors.selectTodosLoaded);
  error$ = this.store.select(TodoSelectors.selectTodosError);

  loadTodos() {
    this.store.dispatch(TodoActions.initTodos());
  }

  updateTodo(todoId: string, data: IUpdateTodo) {
    this.store.dispatch(TodoActions.updateTodo.update({ todoId, data }));
  }

  createTodo(data: ICreateTodo) {
    this.store.dispatch(TodoActions.createTodo.create({ data }));
  }

  deleteTodo(todoId: string) {
    this.store.dispatch(TodoActions.deleteTodo.delete({ todoId }));
  }
}
