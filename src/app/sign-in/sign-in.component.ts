// src/app/sign-in/sign-in.component.ts
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { defaultAuthority } from '../../environments/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  template: `
    <section class="p-6">
      <h1>Welcome</h1>
      <button type="button" (click)="go()">Sign in / Register</button>
    </section>
  `
})
export class SignInComponent {
  constructor(private msal: MsalService, @Inject(PLATFORM_ID) private pid: Object) {}
  go() {
    if (!isPlatformBrowser(this.pid)) return;

    const req: RedirectRequest = {
      scopes: ['openid', 'profile', 'email'],
      authority: defaultAuthority,
      // 🔑 Force code to be returned in the URL (not form_post)
      extraQueryParameters: { response_mode: 'query' }
      // If you also ever call acquireTokenRedirect, add the same extraQueryParameters there too
    };

    this.msal.instance.initialize().finally(() => this.msal.loginRedirect(req));
  }
}
