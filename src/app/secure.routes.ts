// src/app/secure.routes.ts
import { Routes } from '@angular/router';
import { DecisionToolComponent } from './features/decision-tool/decision-tool.component';

export const SECURE_ROUTES: Routes = [
  { path: 'decision-tool', component: DecisionToolComponent },
  { path: '', redirectTo: 'decision-tool', pathMatch: 'full' },
];
