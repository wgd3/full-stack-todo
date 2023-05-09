import { Injectable, inject } from '@angular/core';
import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { Store } from '@ngrx/store';
import { TodoActions, TodoSelectors } from '.';
import { ITodoFacade } from '../todo-facade.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoNgRxFacade implements ITodoFacade {
  private readonly store = inject(Store);

  todos$ = this.store.select(TodoSelectors.selectAllTodos);

  loaded$ = this.store.select(TodoSelectors.selectTodosLoaded);
  error$ = this.store.select(TodoSelectors.selectTodosError);

  loadTodos() {
    console.log(`[NgRx Facade] Loading todos`);
    this.store.dispatch(TodoActions.initTodos());
  }

  updateTodo(todoId: string, data: IUpdateTodo) {
    this.store.dispatch(TodoActions.updateTodo.update({ todoId, data }));
  }

  createTodo(todo: ICreateTodo) {
    this.store.dispatch(TodoActions.createTodo.create({ data: todo }));
  }

  deleteTodo(todoId: string) {
    this.store.dispatch(TodoActions.deleteTodo.delete({ todoId }));
  }
}
