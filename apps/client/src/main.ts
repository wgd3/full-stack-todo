import { appConfig } from './app/app.config';

import { bootstrapApplication } from '@angular/platform-browser';
import { devTools } from '@ngneat/elf-devtools';

import { initEffects } from '@ngneat/effects';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

initEffects();
devTools();
