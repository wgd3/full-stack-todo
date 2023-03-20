import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createMockTodo } from '@fst/shared/util-testing';
import { EditableModule } from '@ngneat/edit-in-place';

import { ToDoComponent } from './to-do.component';

describe('ToDoComponent', () => {
  let component: ToDoComponent;
  let fixture: ComponentFixture<ToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToDoComponent,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        EditableModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with data without issue', () => {
    const todo = createMockTodo();
    component.todo = todo;
    component.ngOnInit();
    expect(component.todoForm).toBeDefined();
  });

  it('should save data', (done) => {
    const todo = createMockTodo();
    component.updateTodo.subscribe((data) => {
      expect(data).toStrictEqual(todo);
      done();
    });

    component.todo = todo;
    component.ngOnInit();
    component.saveEdit();
  });

  it('should cancel an edit', () => {
    const todo = createMockTodo();
    component.todo = todo;
    component.ngOnInit();
    component.todoForm.controls.title.setValue('foo');
    component.cancelEdit();
    expect(component.todoForm.value.title).toBe(todo.title);
  });

  it('should successfully toggle completion', (done) => {
    const todo = createMockTodo();

    component.updateTodo.subscribe((data) => {
      expect(data).toStrictEqual({ ...todo, completed: !todo.completed });
      done();
    });

    component.todo = todo;
    component.ngOnInit();
    component.triggerToggleComplete();
  });

  it('should not trigger update when todo is undefined', () => {
    const res = component.triggerUpdate({});
    expect(res).toBeUndefined();
  });

  it('should save data', (done) => {
    const todo = createMockTodo();
    component.deleteTodo.subscribe((data) => {
      expect(data).toStrictEqual(todo);
      done();
    });

    component.todo = todo;
    component.ngOnInit();
    component.triggerDelete();
  });
});
