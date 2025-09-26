import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthCatchComponent } from './sign-in/auth-catch.component';
import { DecisionToolComponent } from './features/decision-tool/decision-tool.component';

// export const routes: Routes = [
//   { path: 'decision-tool', component: DecisionToolComponent },
//   { path: '', pathMatch: 'full', redirectTo: 'decision-tool' },
//   { path: '**', redirectTo: 'decision-tool' }
// ];

// // src/app/app.routes.ts
// import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },     // public landing
  { path: 'auth', component: AuthCatchComponent },     // redirect target after login
  {
    path: '',
    component: DecisionToolComponent,
    canActivate: [MsalGuard],                           // everything else requires auth
    loadChildren: () => import('./features/decision-tool/decision-tool.component').then(m => m.DecisionToolComponent)
  },
  { path: '**', redirectTo: '' }
];
