import { ICreateTodo, ITodo, IUpdateTodo } from '@fst/shared/domain';
import { Observable } from 'rxjs';

/**
 * With multiple state management libraries, it became easier to
 * separate the facades into library-specific services. This interface
 * serves as a guide to the facade structure
 */
export interface ITodoFacade {
  todos$: Observable<ITodo[]>;
  loaded$: Observable<boolean>;
  error$: Observable<string | null | undefined>;

  loadTodos: () => void;
  updateTodo: (todoId: string, data: IUpdateTodo) => void;
  createTodo: (todo: ICreateTodo) => void;
  deleteTodo: (todoId: string) => void;
}
