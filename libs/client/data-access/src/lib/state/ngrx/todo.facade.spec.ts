import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { todoEffects } from '.';
import { TodoService } from '../../todo.service';
import { TodoNgRxFacade } from './todo.facade';
import { TODOS_FEATURE_KEY, todosReducer } from './todos.reducer';

describe('TodoNgRxFacadeService', () => {
  let facade: TodoNgRxFacade;
  let store: Store;
  let todoService: TodoService;

  beforeEach(() => {
    @NgModule({
      imports: [
        StoreModule.forFeature(TODOS_FEATURE_KEY, todosReducer),
        EffectsModule.forFeature([todoEffects]),
      ],
      providers: [TodoNgRxFacade],
    })
    class CustomFeatureModule {}

    @NgModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        CustomFeatureModule,
      ],
    })
    class RootModule {}

    TestBed.configureTestingModule({
      imports: [RootModule],
    });
    facade = TestBed.inject(TodoNgRxFacade);
    todoService = TestBed.inject(TodoService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start without having loaded any data', (done) => {
    combineLatest({ todos: facade.todos$, loaded: facade.loaded$ }).subscribe({
      next: ({ todos, loaded }) => {
        expect(todos.length).toEqual(0);
        expect(loaded).toBe(false);

        done();
      },
      error: () => done.fail,
    });
  });

  it('should load todos', (done) => {
    const rv: ITodo[] = Array.from({ length: 5 }).map(() => ({
      ...createMockTodo(''),
    }));
    jest.spyOn(todoService, 'getAllToDoItems').mockReturnValue(of(rv));

    facade.loadTodos();

    combineLatest([facade.todos$, facade.loaded$]).subscribe({
      next: ([todos, loaded]: [ITodo[], boolean]) => {
        expect(todos.length).toEqual(rv.length);
        expect(loaded).toBe(true);

        done();
      },
      error: () => done.fail,
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
