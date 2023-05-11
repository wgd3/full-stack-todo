import { of } from 'rxjs';

import { ICreateTodo, IUpdateTodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { randUuid } from '@ngneat/falso';
import { TodoService } from '../../todo.service';
import * as TodosActions from './todos.actions';
import * as todoEffects from './todos.effects';

describe('TodosEffects', () => {
  let todoServiceMock: Partial<
    Record<keyof TodoService, (...args: any[]) => unknown>
  >;

  describe('init$', () => {
    it('should load todos', () => {
      todoServiceMock = {
        getAllToDoItems: () => of([]),
      };
      const actionMock$ = of(TodosActions.initTodos());

      todoEffects
        .loadTodos(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toEqual(TodosActions.loadTodosSuccess({ todos: [] }));
        });
    });

    it('should gracefully handle a loading failure', () => {
      const errMsg = 'foo';
      todoServiceMock = {
        getAllToDoItems: () => {
          throw new Error(errMsg);
        },
      };
      const actionMock$ = of(TodosActions.initTodos());

      todoEffects
        .loadTodos(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toStrictEqual(
            TodosActions.loadTodosFailure({ error: errMsg })
          );
        });
    });
  });

  describe('createTodos', () => {
    it('should successfully create a todo', () => {
      const input: ICreateTodo = {
        title: 'foo',
        description: 'bar',
      };
      const newTodo = createMockTodo('', input);
      const todoServiceMock = {
        createToDo: (data: ICreateTodo) => newTodo,
      } as any as TodoService;
      const actionMock$ = of(TodosActions.createTodo.create({ data: input }));

      todoEffects
        .createTodos(actionMock$, todoServiceMock)
        .subscribe((action) => {
          expect(action).toEqual(
            TodosActions.createTodo.createSuccess({ todo: newTodo })
          );
        });
    });

    it('should gracefully handle a failure when creating a todo', () => {
      const errMsg = 'foo';
      todoServiceMock = {
        createToDo: () => {
          throw new Error(errMsg);
        },
      };
      const actionMock$ = of(
        TodosActions.createTodo.create({ data: createMockTodo('') })
      );

      todoEffects
        .createTodos(actionMock$, todoServiceMock as any as TodoService)
        .subscribe((action) => {
          expect(action).toEqual(
            TodosActions.createTodo.createFailure({ error: errMsg })
          );
        });
    });
  });

  describe('updateTodos', () => {
    it('shoud emit success when updating a todo', () => {
      const original = createMockTodo('');
      const updates: IUpdateTodo = {
        title: 'updated',
      };
      todoServiceMock = {
        updateToDo: () => ({
          ...original,
          ...updates,
        }),
      };
      const actionMock$ = of(
        TodosActions.updateTodo.update({ todoId: original.id, data: updates })
      );

      todoEffects
        .updateTodos(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toEqual(
            TodosActions.updateTodo.updateSuccess({
              update: { id: original.id, changes: updates },
            })
          );
        });
    });

    it('should gracefully handle a failure when updating a todo', () => {
      const errMsg = 'foo';
      todoServiceMock = {
        updateToDo: () => {
          throw new Error(errMsg);
        },
      };
      const actionMock$ = of(
        TodosActions.updateTodo.update({ todoId: '', data: {} })
      );

      todoEffects
        .updateTodos(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toEqual(
            TodosActions.updateTodo.updateFailure({ error: errMsg })
          );
        });
    });
  });

  describe('deleteTodo', () => {
    it('should emit success when deleting a todo', () => {
      const todoId = randUuid();
      todoServiceMock = {
        deleteToDo: () => null,
      };
      const actionMock$ = of(TodosActions.deleteTodo.delete({ todoId }));

      todoEffects
        .deleteTodo(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toStrictEqual(
            TodosActions.deleteTodo.deleteSuccess({ todoId })
          );
        });
    });

    it('should gracefully handle a failure when deleting a todo', () => {
      const todoId = randUuid();
      const errMsg = 'foo';
      todoServiceMock = {
        deleteToDo: () => {
          throw new Error(errMsg);
        },
      };
      const actionMock$ = of(TodosActions.deleteTodo.delete({ todoId }));

      todoEffects
        .deleteTodo(actionMock$, todoServiceMock as TodoService)
        .subscribe((action) => {
          expect(action).toStrictEqual(
            TodosActions.deleteTodo.deleteFailure({ error: errMsg })
          );
        });
    });
  });
});
