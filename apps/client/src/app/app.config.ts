import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import {
  AuthService,
  TODO_FACADE_PROVIDER,
  jwtInterceptor,
} from '@fst/client/data-access';
import { ElfTodosEffects } from '@fst/client/state/elf/todo.effects';
import { fromTodos, todoEffects } from '@fst/client/state/ngrx';
import { TodoNgRxFacade } from '@fst/client/state/ngrx/todo.facade';
import {
  provideEffectsManager,
  provideEffects as provideElfEffects,
} from '@ngneat/effects-ng';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';

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
    /** Elf and NgNeat Effects-related providers */
    provideEffectsManager(),
    provideElfEffects(ElfTodosEffects),
    {
      provide: TODO_FACADE_PROVIDER,
      useClass: TodoNgRxFacade,
      // useClass: TodoElfFacade,
      // useClass: TodoRxjsFacade,
    },
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1082517220825-693bq09as195vkni3uvhkaun3qdn79tr.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
};
