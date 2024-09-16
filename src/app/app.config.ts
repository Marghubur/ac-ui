import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AjaxService } from '../providers/AjaxServices/ajax.service';
import { iNavigation } from '../providers/iNavigation';
import { JwtService } from '../auth/jwtService';
import { ApplicationStorage } from '../providers/ApplicationStorage';
import { UserService } from '../providers/userService';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppHttpIntercepter } from '../auth/app.intercepter';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    AjaxService,
    iNavigation,
    JwtService,
    ApplicationStorage,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    UserService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AppHttpIntercepter,
        multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
