import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { of } from 'rxjs';
import { TodoFacade } from './todo.facade';
import { TodoService } from './todo.service';

describe('TodoFacadeService', () => {
  let facade: TodoFacade;
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    facade = TestBed.inject(TodoFacade);
    todoService = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start with an empty data source', (done) => {
    facade.todos$.subscribe((todos) => {
      expect(todos.length).toEqual(0);
      done();
    });
  });

  it('should load todos', (done) => {
    const rv: ITodo[] = Array.from({ length: 5 }).map(() => ({
      ...createMockTodo(''),
    }));
    jest.spyOn(todoService, 'getAllToDoItems').mockReturnValue(of(rv));
    facade.loadTodos();
    facade.todos$.subscribe((todos) => {
      expect(todos.length).toEqual(5);
      done();
    });
  });

  // test suites where the data should be populated beforehand
  describe('CRUD methods', () => {
    const data = Array.from({ length: 5 }).map(() => ({
      ...createMockTodo(''),
    }));
    beforeEach(() => {
      jest.spyOn(todoService, 'getAllToDoItems').mockReturnValue(of(data));
      facade.loadTodos();
    });

    it('should update a todo', (done) => {
      const original = { ...data[0] };
      const updated = { ...data[0], title: 'test' };
      jest.spyOn(todoService, 'updateToDo').mockReturnValue(of(updated));
      facade.updateTodo(original.id, updated);
      facade.todos$.subscribe((todos) => {
        expect(todos.some((td) => td.title === 'test')).toEqual(true);
        expect(todos.length).toEqual(data.length);
        done();
      });
    });

    it('should create a todo', (done) => {
      const newTodo = createMockTodo('');
      jest.spyOn(todoService, 'createToDo').mockReturnValue(of(newTodo));
      facade.createTodo(newTodo);
      facade.todos$.subscribe((todos) => {
        expect(todos.some((td) => td.id === newTodo.id)).toEqual(true);
        expect(todos.length).toEqual(data.length + 1);
        done();
      });
    });

    it('should delete a todo', (done) => {
      jest.spyOn(todoService, 'deleteToDo').mockReturnValue(of(null));
      facade.deleteTodo(data[0].id);
      facade.todos$.subscribe((todos) => {
        expect(todos.length).toEqual(data.length - 1);
        done();
      });
    });
  });
});
