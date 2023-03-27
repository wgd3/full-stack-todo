import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo, createMockUser } from '@fst/shared/util-testing';
import { of } from 'rxjs';

import { TodoService } from './todo.service';

const mockUser = createMockUser();

describe('ApiService', () => {
  let service: TodoService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a list of to-do items', (done) => {
    const todos: ITodo[] = Array.from({ length: 5 }).map(() =>
      createMockTodo(mockUser.id)
    );
    const httpSpy = jest.spyOn(http, 'get').mockReturnValue(of(todos));
    service.getAllToDoItems().subscribe({
      next: (val) => {
        expect(val).toStrictEqual(todos);
        expect(val.length).toEqual(todos.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should get a single to-do item', (done) => {
    const todo = createMockTodo(mockUser.id);
    const httpSpy = jest.spyOn(http, 'get').mockReturnValue(of(todo));
    service.getToDoById(todo.id).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(todo);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a single to-do item', (done) => {
    const todo = createMockTodo(mockUser.id);
    const httpSpy = jest.spyOn(http, 'post').mockReturnValue(of(todo));
    service.createToDo(todo).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(todo);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/todos`, { ...todo });
  });

  it('should update a single to-do item', (done) => {
    const todo = createMockTodo(mockUser.id);
    const httpSpy = jest.spyOn(http, 'patch').mockReturnValue(of(todo));
    service.updateToDo(todo.id, todo).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(todo);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/todos/${todo.id}`, { ...todo });
  });

  it('should update a single to-do item', (done) => {
    const todo = createMockTodo(mockUser.id);
    const httpSpy = jest.spyOn(http, 'put').mockReturnValue(of(todo));
    service.createOrUpdateToDo(todo.id, todo).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(todo);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/todos/${todo.id}`, { ...todo });
  });

  it('should delete a single to-do item', (done) => {
    const todo = createMockTodo(mockUser.id);
    const httpSpy = jest.spyOn(http, 'delete').mockReturnValue(of(null));
    service.deleteToDo(todo.id).subscribe({
      next: (val) => {
        expect(val).toBeNull();
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/todos/${todo.id}`);
  });
});
