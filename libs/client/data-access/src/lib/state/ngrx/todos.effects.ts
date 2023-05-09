import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodoService } from '../../todo.service';
import * as TodosActions from './todos.actions';

export const loadTodos = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodosActions.initTodos),
      switchMap(() =>
        todoService.getAllToDoItems().pipe(
          map((todos) => TodosActions.loadTodosSuccess({ todos })),
          catchError((error) => {
            console.error('Error', error);
            return of(TodosActions.loadTodosFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const createTodos = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodosActions.createTodo.create),
      switchMap(({ data }) =>
        todoService.createToDo(data).pipe(
          map((todo) => TodosActions.createTodo.createSuccess({ todo })),
          catchError((error) => {
            console.error('Error', error);
            return of(TodosActions.createTodo.createFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const updateTodos = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodosActions.updateTodo.update),
      switchMap(({ todoId, data }) =>
        todoService.updateToDo(todoId, data).pipe(
          map(() =>
            TodosActions.updateTodo.updateSuccess({
              update: { id: todoId, changes: data },
            })
          ),
          catchError((error) => {
            console.error('Error', error);
            return of(TodosActions.createTodo.createFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const deleteTodo = createEffect(
  (actions$ = inject(Actions), todoService = inject(TodoService)) => {
    return actions$.pipe(
      ofType(TodosActions.deleteTodo.delete),
      switchMap(({ todoId }) =>
        todoService.deleteToDo(todoId).pipe(
          map(() => TodosActions.deleteTodo.deleteSuccess({ todoId })),
          catchError((error) => {
            console.error('Error', error);
            return of(TodosActions.deleteTodo.deleteFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true }
);
