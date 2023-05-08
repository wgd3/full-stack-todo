import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.initTodos),
      switchMap(() => of(TodosActions.loadTodosSuccess({ todos: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(TodosActions.loadTodosFailure({ error }));
      })
    )
  );
}
