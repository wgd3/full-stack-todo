import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircle as faCircleOutline,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import { faCheck, faPencil } from '@fortawesome/free-solid-svg-icons';
import { ITodo } from '@fst/shared/domain';
import { EditableModule } from '@ngneat/edit-in-place';

/**
 * Create a type for the FormGroup, using only the properties of
 * a to-do item that we want to be able to edit.
 */
type TodoFormType = {
  [k in keyof Pick<ITodo, 'description' | 'title'>]: FormControl<string>;
};

@Component({
  selector: 'fst-todo',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    EditableModule,
  ],
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoComponent implements OnInit {
  @Input() todo: ITodo | undefined;

  @Output() toggleComplete = new EventEmitter<ITodo>();
  @Output() updateTodo = new EventEmitter<ITodo>();
  @Output() deleteTodo = new EventEmitter<ITodo>();

  faCheck = faCheck;
  faCircleOutline = faCircleOutline;
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  todoForm!: FormGroup<TodoFormType>;

  ngOnInit(): void {
    if (this.todo) {
      this.todoForm = new FormGroup({
        title: new FormControl(this.todo.title, { nonNullable: true }),
        description: new FormControl(this.todo.description, {
          nonNullable: true,
        }),
      });
    }
  }

  saveEdit() {
    this.triggerUpdate({
      ...this.todo,
      ...this.todoForm.value,
    });
  }

  cancelEdit() {
    this.todoForm.reset();
  }

  triggerToggleComplete() {
    this.triggerUpdate({
      ...this.todo,
      completed: !this.todo?.completed,
    });
  }

  triggerUpdate(todo: Partial<ITodo>) {
    if (!this.todo) {
      return;
    }
    this.updateTodo.emit({
      ...this.todo,
      ...todo,
    });
  }

  /**
   * Emit the current todo data, although only the ID will most likely
   * be needed for deletion.
   */
  triggerDelete() {
    this.deleteTodo.emit(this.todo);
  }
}
