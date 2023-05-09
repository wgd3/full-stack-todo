import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AuthService, jwtInterceptor } from '@fst/client/data-access';
import { fromTodos, todoEffects } from '@fst/client/state/ngrx';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(todoEffects),
    provideState(fromTodos.TODOS_FEATURE_KEY, fromTodos.todosReducer),
    provideEffects(),
    provideStore(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => {
        console.log(`[APP_INIT] Loading token from storage..`);
        auth.loadToken();
        return () => Promise.resolve();
      },
      deps: [AuthService],
      multi: true,
    },
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
