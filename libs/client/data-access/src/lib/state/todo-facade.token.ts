import { InjectionToken, inject } from '@angular/core';
import { TodoElfFacade } from './elf/todo.facade';
import { TodoNgRxFacade } from './ngrx/todo.facade';

export type TodoFacadeProviderType = TodoNgRxFacade | TodoElfFacade;

export const TODO_FACADE_PROVIDER = new InjectionToken<TodoFacadeProviderType>(
  'Specify the facade to be used for state management',
  {
    factory() {
      const defaultFacade = inject(TodoNgRxFacade);
      return defaultFacade;
    },
  }
);
