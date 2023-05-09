import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { TodoFacade } from '@fst/client/data-access';
import { ToDoComponent } from '@fst/client/ui-components/to-do';
import { ICreateTodo, ITodo } from '@fst/shared/domain';
@Component({
  selector: 'full-stack-todo-feature-dashboard',
  standalone: true,
  imports: [CommonModule, ToDoComponent, FontAwesomeModule],
  templateUrl: './feature-dashboard.component.html',
  styleUrls: ['./feature-dashboard.component.scss'],
})
export class FeatureDashboardComponent implements OnInit {
  // private readonly apiService = inject(TodoService);
  private readonly todoFacade = inject(TodoFacade);

  // todos$ = new BehaviorSubject<ITodo[]>([]);
  todos$ = this.todoFacade.todos$;

  faPlusSquare = faPlusSquare;

  addingTodo = false;

  trackTodo(idx: number, todo: ITodo) {
    return todo.id;
  }

  ngOnInit(): void {
    this.refreshItems();
  }

  triggerEmptyTodo() {
    this.addingTodo = !this.addingTodo;
  }

  refreshItems() {
    // this.apiService
    //   .getAllToDoItems()
    //   .pipe(take(1))
    //   .subscribe((items) => this.todos$.next(items));
    this.todoFacade.loadTodos();
  }

  toggleComplete(todo: ITodo) {
    // this.apiService
    //   .updateToDo(todo.id, { completed: !todo.completed })
    //   .pipe(take(1))
    //   .subscribe(() => {
    //     this.refreshItems();
    //   });
    this.todoFacade.updateTodo(todo.id, { completed: !todo.completed });
  }

  deleteTodo({ id }: ITodo) {
    // this.apiService
    //   .deleteToDo(id)
    //   .pipe(take(1))
    //   .subscribe(() => {
    //     this.refreshItems();
    //   });
    this.todoFacade.deleteTodo(id);
  }

  editTodo({ id, title, description, completed }: ITodo) {
    // this.apiService
    //   .updateToDo(id, { title, description, completed })
    //   .pipe(take(1))
    //   .subscribe(() => {
    //     this.refreshItems();
    //   });
    this.todoFacade.updateTodo(id, { title, description, completed });
  }

  createTodo(data: ICreateTodo) {
    // this.apiService
    //   .createToDo(data)
    //   .pipe(take(1))
    //   .subscribe({
    //     next: () => {
    //       this.refreshItems();
    //       this.addingTodo = false;
    //     },
    //   });
    this.todoFacade.createTodo(data);
    this.addingTodo = false;
  }
}
