import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as TodosActions from './todos.actions';
import { TodoEffects } from './todos.effects';

describe('TodosEffects', () => {
  let actions: Observable<Action>;
  let effects: TodoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TodoEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(TodoEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: TodosActions.initTodos() });

      const expected = hot('-a-|', {
        a: TodosActions.loadTodosSuccess({ todos: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
