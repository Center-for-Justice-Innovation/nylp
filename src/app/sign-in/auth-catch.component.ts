// src/app/sign-in/auth-catch.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-auth-catch',
  standalone: true,
  template: `<p class="p-6">Still logging in…</p>`
})
export class AuthCatchComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private msal: MsalService,
    @Inject(PLATFORM_ID) private pid: Object
  ) {}

  async ngOnInit() {
    if (!isPlatformBrowser(this.pid)) return;

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/app/decision-tool';
    console.log('[auth-catch] LOADED', window.location.href);

    try {
      await this.msal.instance.initialize().catch(() => {});
      const result: AuthenticationResult | null = await this.msal.instance.handleRedirectPromise();
      console.log('[auth-catch] handleRedirectPromise →', !!result, result?.account?.username);

      if (result?.account) {
        this.msal.instance.setActiveAccount(result.account);
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
        return;
      }

      const acct = this.msal.instance.getActiveAccount() || this.msal.instance.getAllAccounts()[0];
      if (acct) {
        this.msal.instance.setActiveAccount(acct);
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
        return;
      }

      this.router.navigate(['/sign-in'], { queryParams: { returnUrl }, replaceUrl: true });
    } catch (e) {
      console.error('[auth-catch] error', e);
      this.router.navigate(['/sign-in'], { queryParams: { returnUrl }, replaceUrl: true });
    }
  }
}
