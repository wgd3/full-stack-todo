import { Injectable, inject } from '@angular/core';
import { ICreateTodo, ITodo, IUpdateTodo } from '@fst/shared/domain';
import { BehaviorSubject } from 'rxjs';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root',
})
export class TodoFacade {
  private readonly todoService = inject(TodoService);

  private todos$$ = new BehaviorSubject<ITodo[]>([]);
  todos$ = this.todos$$.asObservable();

  loadTodos() {
    this.todoService.getAllToDoItems().subscribe({
      next: (todos) => {
        this.todos$$.next(todos);
      },
    });
  }

  updateTodo(todoId: string, todoData: IUpdateTodo) {
    this.todoService.updateToDo(todoId, todoData).subscribe({
      next: (todo) => {
        const current = this.todos$$.value;
        // update the single to-do in place instead of
        // requesting _all_ todos again
        this.todos$$.next([
          ...current.map((td) => (td.id === todo.id ? todo : td)),
        ]);
      },
    });
  }

  createTodo(todoData: ICreateTodo) {
    this.todoService.createToDo(todoData).subscribe({
      next: (todo) => {
        // insert new todo to the current array
        this.todos$$.next([...this.todos$$.value, todo]);
      },
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteToDo(id).subscribe({
      next: () => {
        this.todos$$.next([...this.todos$$.value.filter((td) => td.id !== id)]);
      },
    });
  }
}
