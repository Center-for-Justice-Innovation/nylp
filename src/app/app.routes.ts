// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthCatchComponent } from './sign-in/auth-catch.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // PUBLIC first (not nested under any shell/guard!)
  { path: 'auth', component: AuthCatchComponent },
  { path: 'sign-in', component: SignInComponent },

  // Protected area lives under /app/**
  {
    path: 'app',
    canMatch: [authGuard],
    loadChildren: () => import('./secure.routes').then(m => m.SECURE_ROUTES),
  },

  // Defaults
  { path: '', redirectTo: 'app/decision-tool', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/decision-tool' },
];
