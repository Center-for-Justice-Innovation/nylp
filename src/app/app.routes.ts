import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { DecisionToolComponent } from './features/decision-tool/decision-tool.component';

export const routes: Routes = [
  { path: 'decision-tool', component: DecisionToolComponent },
  { path: '', pathMatch: 'full', redirectTo: 'decision-tool' },
  { path: '**', redirectTo: 'decision-tool' }
];