// src/app/app.config.ts
import { APP_INITIALIZER, PLATFORM_ID, inject, ApplicationConfig, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor
} from '@azure/msal-angular';

import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { auth as cfg } from '../environments/auth';

function initializeMsalFactory(platformId: Object, msal: MsalService) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      // IMPORTANT: returns a Promise; Angular will wait for it
      return msal.instance.initialize();
    }
    // On the server, do nothing
    return Promise.resolve();
  };
}

function authorityFor(policy: string) {
  return `https://${cfg.tenantDomain}/${cfg.b2cTenant}/${policy}`;
}

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: cfg.clientId,
      authority: authorityFor(cfg.policies.signUpSignIn),
      knownAuthorities: [cfg.tenantDomain],
      redirectUri: cfg.redirectUri,
      postLogoutRedirectUri: cfg.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false, // set true only for legacy IE
    },
    system: {
      // allowNativeBroker: false,
      loggerOptions: { loggerCallback: () => {}, logLevel: isDevMode() ? 3 : 1 }
    }
  });
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { scopes: ['openid', 'profile'] }
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  // Add your APIs here to auto-attach tokens:
  // ['https://api.example.com', ['https://<tenant>.onmicrosoft.com/<api-app-id-uri>/.default']]
  return { interactionType: InteractionType.Redirect, protectedResourceMap: new Map() };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalFactory,
      deps: [PLATFORM_ID, MsalService],
      multi: true,
    }
  ],
};
