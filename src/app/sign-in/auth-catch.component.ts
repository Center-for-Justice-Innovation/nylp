// src/app/sign-in/auth-catch.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult } from '@azure/msal-browser';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-catch',
  standalone: true,
  template: `<p class="p-6">Signing you in…</p>`
})
export class AuthCatchComponent implements OnInit {
  constructor(
    private router: Router,
    private msal: MsalService,
    private msalBroadcast: MsalBroadcastService
  ) {}

  ngOnInit() {
    // When redirect completes:
    this.msalBroadcast.msalSubject$
      .pipe(
        filter((e: EventMessage) => e.eventType === EventType.LOGIN_SUCCESS),
        take(1)
      )
      .subscribe((e: EventMessage) => {
        const result = e.payload as AuthenticationResult;
        this.msal.instance.setActiveAccount(result.account);
        this.router.navigateByUrl('/'); // go to protected root
      });

    // If already signed in (cached), just move on:
    const acct = this.msal.instance.getActiveAccount() || this.msal.instance.getAllAccounts()[0];
    if (acct) {
      this.msal.instance.setActiveAccount(acct);
      this.router.navigateByUrl('/');
    }
  }
}
