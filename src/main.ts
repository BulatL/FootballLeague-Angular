/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeRsLatn from '@angular/common/locales/sr-Latn'; // Serbian Latin

// Register Serbian Latin locale
registerLocaleData(localeRsLatn);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'sr-Latn' }, // Set Serbian Latin as default locale
    ...appConfig.providers // make sure other providers are included too
  ]
}).catch((err) => console.error(err));