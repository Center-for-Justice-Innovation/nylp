import { ApplicationConfig, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

import {
  MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG,
  MsalService, MsalBroadcastService,
  MsalGuardConfiguration, MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { auth as cfg, defaultAuthority } from '../environments/auth';

export function bootstrapMsalFactory(platformId: Object, msal: MsalService) {
  return async () => {
    if (!isPlatformBrowser(platformId)) return;
    await msal.instance.initialize().catch(() => {});
    // If a cached account exists, set it active so deep links work
    const acct = msal.instance.getActiveAccount() || msal.instance.getAllAccounts()[0];
    if (acct) msal.instance.setActiveAccount(acct);
    console.log('[init] authority =', defaultAuthority);
  };
}

export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: cfg.clientId,
      authority: defaultAuthority,                 // ✅ https://nylp.ciamlogin.com/nylp.onmicrosoft.com
      knownAuthorities: [cfg.knownAuthority],      // ✅ ['nylp.ciamlogin.com']
      redirectUri: cfg.redirectUri,                // ✅ http://localhost:4200/auth
      postLogoutRedirectUri: cfg.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false
      // IMPORTANT: do NOT set authorityMetadata here (we want discovery)
    },
    cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false }
  });
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect, authRequest: { scopes: ['openid','profile','email'] } };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return { interactionType: InteractionType.Redirect, protectedResourceMap: new Map() };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },
    MsalService, MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrapMsalFactory,
      deps: [PLATFORM_ID, MsalService],
      multi: true
    },
  ],
};
