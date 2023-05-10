import { Injectable, inject } from '@angular/core';
import { ICreateTodo, ITodo, IUpdateTodo } from '@fst/shared/domain';
import { BehaviorSubject } from 'rxjs';
import { TodoService } from '../../todo.service';
import { ITodoFacade } from '../todo-facade.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoRxjsFacade implements ITodoFacade {
  private readonly todoService = inject(TodoService);

  private readonly _todos$$ = new BehaviorSubject<ITodo[]>([]);
  todos$ = this._todos$$.asObservable();

  private readonly _loaded$$ = new BehaviorSubject<boolean>(false);
  loaded$ = this._loaded$$.asObservable();

  private readonly _error$$ = new BehaviorSubject<string | null | undefined>(
    undefined
  );
  error$ = this._error$$.asObservable();

  loadTodos() {
    console.log(`[RxJs Facade] loading todos`);
    this.clearError();
    this.todoService.getAllToDoItems().subscribe({
      next: (todos) => {
        this._todos$$.next(todos);
        this._loaded$$.next(true);
      },
      error: (err: Error) => {
        console.error(err);
        this._error$$.next(err.message);
        this._loaded$$.next(true);
      },
    });
  }

  updateTodo(todoId: string, data: IUpdateTodo) {
    this.clearError();
    this.todoService.updateToDo(todoId, data).subscribe({
      next: (todo) => {
        this._todos$$.next([
          ...this._todos$$.value.map((td) => (td.id === todoId ? todo : td)),
        ]);
      },
      error: (err: Error) => {
        console.error(err);
        this._error$$.next(err.message);
      },
    });
  }

  createTodo(todo: ICreateTodo) {
    this.clearError();
    this.todoService.createToDo(todo).subscribe({
      next: (todo) => this._todos$$.next([...this._todos$$.value, todo]),
      error: (err: Error) => {
        console.error(err);
        this._error$$.next(err.message);
      },
    });
  }

  deleteTodo(todoId: string) {
    this.clearError();
    this.todoService.deleteToDo(todoId).subscribe({
      next: () =>
        this._todos$$.next([
          ...this._todos$$.value.filter((td) => td.id !== todoId),
        ]),
      error: (err: Error) => {
        console.error(err);
        this._error$$.next(err.message);
      },
    });
  }

  private clearError() {
    this._error$$.next(null);
  }
}
