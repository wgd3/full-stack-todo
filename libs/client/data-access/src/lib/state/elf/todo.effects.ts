import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { Action } from '@ngneat/effects/src/lib/actions.types';
import { Observable, map, switchMap, tap } from 'rxjs';
import { TodoService } from '../../todo.service';
import { createTodo, deleteTodo, loadTodos, updateTodo } from './todos.actions';
import { TodosRepository } from './todos.repository';

@Injectable({ providedIn: 'root' })
export class ElfTodosEffects {
  todoService = inject(TodoService);
  repo = inject(TodosRepository);

  loadTodosEffect$ = createEffect((actions$: Observable<Action>) => {
    return actions$.pipe(
      ofType(loadTodos),
      tap(() => console.log(`loading todos for elf`)),
      switchMap(() =>
        this.todoService
          .getAllToDoItems()
          .pipe(map((todos) => this.repo.loadTodos(todos)))
      )
    );
  });

  createTodo$ = createEffect((actions$: Observable<Action>) => {
    return actions$.pipe(
      ofType(createTodo),
      switchMap(({ todo }) =>
        this.todoService
          .createToDo(todo)
          .pipe(map((todo) => this.repo.addTodo(todo)))
      )
    );
  });

  updateTodo$ = createEffect((actions$: Observable<Action>) => {
    return actions$.pipe(
      ofType(updateTodo),
      switchMap(({ todoId, data }) =>
        this.todoService
          .updateToDo(todoId, data)
          .pipe(map((todo) => this.repo.updateTodo(todo)))
      )
    );
  });

  deleteTodo$ = createEffect((actions$: Observable<Action>) => {
    return actions$.pipe(
      ofType(deleteTodo),
      switchMap(({ todoId }) =>
        this.todoService
          .deleteToDo(todoId)
          .pipe(map(() => this.repo.deleteTodo(todoId)))
      )
    );
  });
}
