import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, RedirectRequest } from '@azure/msal-browser';
import { auth as cfg } from '../../environments/auth';
import { UIButtonComponent } from '../ui/button.component';

function authorityFor(policy: string) {
  return `https://${cfg.tenantDomain}/${cfg.b2cTenant}/${policy}`;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [UIButtonComponent],
  template: `
  <section class="min-h-screen grid place-items-center p-6">
    <div class="max-w-md w-full border rounded-2xl p-6 shadow-sm">
      <h1 class="text-2xl font-semibold mb-2">Welcome</h1>
      <p class="text-sm text-gray-600 mb-6">Sign in or create an account to continue.</p>

      <div class="grid gap-3">
        <ui-button class="btn" (click)="signIn()">Sign in</ui-button>
        <ui-button class="btn-outline" (click)="register()">Register</ui-button>
        <a class="link text-sm" (click)="resetPassword()">Forgot your password?</a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .btn{padding:.75rem 1rem;border-radius:.75rem;border:none}
    .btn{background:#111;color:#fff}
    .btn-outline{background:#fff;border:1px solid #ddd}
    .link{cursor:pointer}
  `]
})
export class SignInComponent {
  constructor(private msal: MsalService) {}

  signIn() {
    const req: RedirectRequest = { scopes: ['openid','profile'] };
    this.msal.loginRedirect(req);
  }

  register() {
    // Use a dedicated sign-up policy if you created one,
    // else reuse the signUpSignIn policy.
    this.msal.loginRedirect({
      scopes: ['openid', 'profile'],
      authority: authorityFor(cfg.policies.signUpSignIn)
    });
  }

  resetPassword() {
    // If you created a password reset policy:
    this.msal.loginRedirect({
      scopes: ['openid', 'profile'],
      authority: authorityFor(cfg.policies.passwordReset)
    });
  }
}
