import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { CaseCalculatorComponent } from './components/case-calculator/case-calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SignInComponent, CaseCalculatorComponent],
  template: `
    <div class="size-full">
      <app-case-calculator 
        *ngIf="user; else signInTemplate"
        [userEmail]="user"
        (signOut)="handleSignOut()">
      </app-case-calculator>
      
      <ng-template #signInTemplate>
        <app-sign-in (signIn)="handleSignIn($event)"></app-sign-in>
      </ng-template>
    </div>
  `,
  styleUrls: []
})
export class AppComponent {
  user: string | null = null;

  handleSignIn(email: string): void {
    this.user = email;
  }

  handleSignOut(): void {
    this.user = null;
  }
}