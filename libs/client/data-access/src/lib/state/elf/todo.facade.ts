import { Injectable, inject } from '@angular/core';
import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { dispatch as dispatchElfAction } from '@ngneat/effects';
import { filterError } from '@ngneat/elf-requests';
import { map } from 'rxjs';
import { ElfActions, TodosRepository as ElfTodosRepository } from '.';
import { ITodoFacade } from '../todo-facade.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoElfFacade implements ITodoFacade {
  private readonly elfRepository = inject(ElfTodosRepository);

  todos$ = this.elfRepository.todos$.pipe(map(({ data }) => data));
  loaded$ = this.elfRepository.todos$.pipe(map(({ isSuccess }) => isSuccess));
  error$ = this.elfRepository.todos$.pipe(
    filterError(),
    map(({ error }) => error)
  );

  loadTodos() {
    console.log(`[Elf Facade] Loading todos`);
    dispatchElfAction(ElfActions.loadTodos());
  }

  updateTodo(todoId: string, data: IUpdateTodo) {
    dispatchElfAction(ElfActions.updateTodo({ todoId, data }));
  }

  createTodo(todo: ICreateTodo) {
    dispatchElfAction(ElfActions.createTodo({ todo }));
  }

  deleteTodo(todoId: string) {
    dispatchElfAction(ElfActions.deleteTodo({ todoId }));
  }
}
