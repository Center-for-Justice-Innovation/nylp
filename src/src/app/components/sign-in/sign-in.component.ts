import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background p-4">
      <div class="w-full max-w-md bg-card border border-border rounded-lg shadow-sm">
        <div class="p-6 space-y-1">
          <h1 class="text-2xl font-semibold">Sign In</h1>
          <p class="text-muted-foreground">
            Enter your credentials to access the case calculator
          </p>
        </div>
        <div class="p-6 pt-0">
          <form (ngSubmit)="handleSubmit()" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="text-base font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                [(ngModel)]="email"
                name="email"
                required
                class="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-base font-medium">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                [(ngModel)]="password"
                name="password"
                required
                class="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button 
              type="submit" 
              class="w-full inline-flex items-center justify-center rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              [disabled]="isLoading || !email || !password"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>
          <div class="mt-4 text-sm text-muted-foreground text-center">
            Demo: Use any email and password to sign in
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class SignInComponent {
  @Output() signIn = new EventEmitter<string>();

  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  async handleSubmit(): Promise<void> {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isLoading = false;
    this.signIn.emit(this.email);
  }
}