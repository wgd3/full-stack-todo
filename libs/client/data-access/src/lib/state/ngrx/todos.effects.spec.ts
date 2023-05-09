import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { TodoService } from '../../todo.service';
import * as TodosActions from './todos.actions';
import * as todoEffects from './todos.effects';

describe('TodosEffects', () => {
  let actions: Observable<Action>;
  // let effects: todoEffects;

  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   imports: [],
    //   providers: [
    //     todoEffects,
    //     provideMockActions(() => actions),
    //     provideMockStore(),
    //   ],
    // });

    // effects = TestBed.inject(todoEffects);
    const todoServiceMock = {
      getAllToDoItems: () => of([]),
    };
    const actionMock$ = of(TodosActions.initTodos());
  });

  describe('init$', () => {
    it('should work', () => {
      const todoServiceMock = {
        getAllToDoItems: () => of([]),
      } as any as TodoService;
      const actionMock$ = of(TodosActions.initTodos());

      todoEffects
        .loadTodos(actionMock$, todoServiceMock)
        .subscribe((action) => {
          expect(action).toEqual(TodosActions.loadTodosSuccess({ todos: [] }));
        });
    });
  });
});
