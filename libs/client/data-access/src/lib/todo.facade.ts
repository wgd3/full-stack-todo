import { Injectable, inject } from '@angular/core';
import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { dispatch as dispatchElfAction } from '@ngneat/effects';
import { filterError } from '@ngneat/elf-requests';
import { map } from 'rxjs';
import { ElfActions, TodosRepository as ElfTodosRepository } from './state/elf';

@Injectable({
  providedIn: 'root',
})
export class TodoFacade {
  // private readonly ngrxStore = inject(Store);
  private readonly elfRepository = inject(ElfTodosRepository);

  // todos$ = this.store.select(TodoSelectors.selectAllTodos);
  todos$ = this.elfRepository.todos$.pipe(
    // tap((res) => console.log(`[request result]`, res)),
    map(({ data }) => data)
  );
  // loaded$ = this.ngrxStore.select(TodoSelectors.selectTodosLoaded);
  loaded$ = this.elfRepository.todos$.pipe(map(({ isSuccess }) => isSuccess));
  // error$ = this.ngrxStore.select(TodoSelectors.selectTodosError);
  error$ = this.elfRepository.todos$.pipe(
    filterError(),
    map(({ error }) => error)
  );

  loadTodos() {
    // this.store.dispatch(TodoActions.initTodos());
    dispatchElfAction(ElfActions.loadTodos());
  }

  updateTodo(todoId: string, data: IUpdateTodo) {
    // this.ngrxStore.dispatch(TodoActions.updateTodo.update({ todoId, data }));
    dispatchElfAction(ElfActions.updateTodo({ todoId, data }));
  }

  createTodo(todo: ICreateTodo) {
    // this.ngrxStore.dispatch(TodoActions.createTodo.create({ data }));
    dispatchElfAction(ElfActions.createTodo({ todo }));
  }

  deleteTodo(todoId: string) {
    // this.ngrxStore.dispatch(TodoActions.deleteTodo.delete({ todoId }));
    dispatchElfAction(ElfActions.deleteTodo({ todoId }));
  }
}
