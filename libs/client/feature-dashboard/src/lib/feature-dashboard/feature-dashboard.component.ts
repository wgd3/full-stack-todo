import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { ITodoFacade, TODO_FACADE_PROVIDER } from '@fst/client/data-access';
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
  private readonly todoFacade: ITodoFacade = inject(TODO_FACADE_PROVIDER);

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
    this.todoFacade.loadTodos();
  }

  toggleComplete(todo: ITodo) {
    this.todoFacade.updateTodo(todo.id, { completed: !todo.completed });
  }

  deleteTodo({ id }: ITodo) {
    this.todoFacade.deleteTodo(id);
  }

  editTodo({ id, title, description, completed }: ITodo) {
    this.todoFacade.updateTodo(id, { title, description, completed });
  }

  createTodo(data: ICreateTodo) {
    this.todoFacade.createTodo(data);
    this.addingTodo = false;
  }
}
