import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
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
import {
  AuthConfig,
  OAuthStorage,
  provideOAuthClient,
} from 'angular-oauth2-oidc';

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
    provideOAuthClient(),
    {
      provide: AuthConfig,
      useValue: {
        // Url of the Identity Provider
        issuer: 'https://accounts.google.com',

        // URL of the SPA to redirect the user to after login
        redirectUri: window.location.origin + '/',

        // URL of the SPA to redirect the user after silent refresh
        silentRefreshRedirectUri: window.location.origin + '/',
        loginUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        requestAccessToken: true,
        tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
        userinfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
        // responseType: 'token',
        oidc: true,

        // The SPA's id. The SPA is registerd with this id at the auth-server
        clientId:
          '1082517220825-693bq09as195vkni3uvhkaun3qdn79tr.apps.googleusercontent.com',

        strictDiscoveryDocumentValidation: false,

        // set the scope for the permissions the client should request
        // The first three are defined by OIDC. The 4th is a usecase-specific one
        scope: 'openid profile email',

        showDebugInformation: true,

        sessionChecksEnabled: true,
      },
    },
    {
      provide: OAuthStorage,
      useValue: localStorage,
    },
  ],
};
