import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthCatchComponent } from './sign-in/auth-catch.component';
import { DecisionToolComponent } from './features/decision-tool/decision-tool.component';

export const routes: Routes = [
  { path: 'decision-tool', component: DecisionToolComponent },
  { path: '', pathMatch: 'full', redirectTo: 'decision-tool' },
  { path: '**', redirectTo: 'decision-tool' }
];

// // src/app/app.routes.ts
// import { Routes } from '@angular/router';


// export const routes: Routes = [
//   { path: 'sign-in', component: SignInComponent },     // public landing
//   { path: 'auth', component: AuthCatchComponent },     // redirect target after login
//   {
//     path: '',
//     component: AppShellComponent,
//     canActivate: [MsalGuard],                           // everything else requires auth
//     loadChildren: () => import('./features/routes').then(m => m.FEATURE_ROUTES)
//   },
//   { path: '**', redirectTo: '' }
// ];
