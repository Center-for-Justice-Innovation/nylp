// src/app/auth.guard.ts
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

function segsToPath(segs: UrlSegment[]) {
  return '/' + segs.map(s => s.path).join('/');
}

export const authGuard: CanMatchFn = (_route, segments) => {
  const msal = inject(MsalService);
  const router = inject(Router);

  const accounts = msal.instance.getAllAccounts();
  if (accounts.length) {
    if (!msal.instance.getActiveAccount()) msal.instance.setActiveAccount(accounts[0]);
    return true; // allow /app/**
  }

  const returnUrl = '/app' + segsToPath(segments); // e.g., /app/decision-tool
  router.navigate(['/sign-in'], { queryParams: { returnUrl } });
  return false; // prevent /app/** from matching
};
