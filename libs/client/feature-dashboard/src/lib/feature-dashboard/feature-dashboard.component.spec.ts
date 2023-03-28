import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoService } from '@fst/client/data-access';
import { createMockTodo, createMockUser } from '@fst/shared/util-testing';
import { of } from 'rxjs';

import { FeatureDashboardComponent } from './feature-dashboard.component';

const mockUser = createMockUser();

describe('FeatureDashboardComponent', () => {
  let component: FeatureDashboardComponent;
  let todoService: TodoService;
  let fixture: ComponentFixture<FeatureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDashboardComponent, HttpClientTestingModule],
      providers: [TodoService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDashboardComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a unique id for each todo', () => {
    const todo = createMockTodo(mockUser.id);
    expect(component.trackTodo(0, todo)).toBe(todo.id);
  });

  it('should trigger a refresh of data', (done) => {
    const todos = Array.from({ length: 5 }).map(() =>
      createMockTodo(mockUser.id)
    );
    const spy = jest
      .spyOn(todoService, 'getAllToDoItems')
      .mockReturnValue(of(todos));
    component.refreshItems();
    expect(spy).toHaveBeenCalled();
    expect(component.todos$.value.length).toBe(todos.length);
    done();
  });

  it('should be able to toggle the completion of a todo', (done) => {
    const todo = createMockTodo(mockUser.id, { completed: false });
    const updateSpy = jest
      .spyOn(todoService, 'updateToDo')
      .mockReturnValue(of({ ...todo, completed: true }));
    const refreshSpy = jest
      .spyOn(todoService, 'getAllToDoItems')
      .mockReturnValue(of([{ ...todo, completed: true }]));
    component.toggleComplete(todo);
    expect(refreshSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(component.todos$.value.length).toBe(1);
    expect(component.todos$.value[0].completed).toBe(true);
    done();
  });

  it('should be able to delete a todo', (done) => {
    const todos = Array.from({ length: 5 }).map(() =>
      createMockTodo(mockUser.id)
    );
    component.todos$.next(todos);
    const deleteSpy = jest
      .spyOn(todoService, 'deleteToDo')
      .mockReturnValue(of(null));
    const refreshSpy = jest
      .spyOn(todoService, 'getAllToDoItems')
      .mockReturnValue(of([...todos.slice(1)]));
    component.deleteTodo(todos[0]);
    expect(deleteSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
    expect(component.todos$.value.length).toBe(4);
    done();
  });

  it('should be able to toggle the completion of a todo', (done) => {
    const todo = createMockTodo(mockUser.id, { completed: false });
    const updateSpy = jest
      .spyOn(todoService, 'updateToDo')
      .mockReturnValue(of({ ...todo, completed: true }));
    const refreshSpy = jest
      .spyOn(todoService, 'getAllToDoItems')
      .mockReturnValue(of([{ ...todo, completed: true }]));
    component.editTodo(todo);
    expect(refreshSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(component.todos$.value.length).toBe(1);
    expect(component.todos$.value[0].completed).toBe(true);
    done();
  });
});
