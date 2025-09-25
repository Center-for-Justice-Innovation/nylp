import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UIButtonComponent } from '../../ui/button.component';
import { 
  UICardComponent, 
  UICardDescriptionComponent, 
  UICardHeaderComponent, 
  UICardTitleComponent, 
  UICardContentComponent } from '../../ui/card.component';
import { UILabelComponent } from '../../ui/label.component';
import { UISelectComponent, SelectOption } from '../../ui/select.component';

import { MsalService } from '@azure/msal-angular';

export interface DecisionData {
  county: string;
  courtType: string;
  topCharge: string;
  pendingCases: string;
  onSupervision: string;
  priorConvictions: string;
}

const penalCodes: readonly string[] = [
  'PL 120.00 - Assault 3rd',
  'PL 120.05 - Assault 2nd',
  'PL 120.10 - Assault 1st',
  'PL 140.20 - Burglary 3rd',
  'PL 140.25 - Burglary 2nd',
  'PL 140.30 - Burglary 1st',
  'PL 155.25 - Petit Larceny',
  'PL 155.30 - Grand Larceny 4th',
  'PL 155.35 - Grand Larceny 3rd',
  'PL 155.40 - Grand Larceny 2nd',
  'PL 155.42 - Grand Larceny 1st',
  'PL 160.05 - Robbery 3rd',
  'PL 160.10 - Robbery 2nd',
  'PL 160.15 - Robbery 1st',
  'PL 220.03 - Criminal Possession Controlled Substance 7th',
  'PL 220.06 - Criminal Possession Controlled Substance 5th',
  'PL 220.09 - Criminal Possession Controlled Substance 4th',
  'PL 220.16 - Criminal Possession Controlled Substance 3rd',
  'PL 220.18 - Criminal Possession Controlled Substance 2nd',
  'PL 220.21 - Criminal Possession Controlled Substance 1st',
] as const;

@Component({
  selector: 'app-decision-page',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    UIButtonComponent, 
    UICardComponent, 
    UICardHeaderComponent, 
    UICardTitleComponent, 
    UICardDescriptionComponent, 
    UILabelComponent, 
    UICardContentComponent,
    UISelectComponent
  ],
  templateUrl: './decision-tool.component.html',
  styleUrls: ['./decision-tool.component.scss']
})
export class DecisionToolComponent {
  // @Input() username = '';
  @Output() submitDecision = new EventEmitter<DecisionData>();
  @Output() signOut = new EventEmitter<void>();
  private fb = inject(FormBuilder);

  penalCodes = penalCodes;

    // ⬇️ add these option arrays
    countyNameOptions: SelectOption[] = [
      { label: 'New York', value: 'newyork' },
      { label: 'Kings', value: 'kings' },
      { label: 'Queens', value: 'queens' },
      { label: 'Bronx', value: 'bronx' },
      { label: 'Richmond', value: 'richmond' },
    ];

    // ⬇️ add these option arrays
    courtTypeOptions: SelectOption[] = [
      { label: 'Local', value: 'local' },
      { label: 'Superior', value: 'superior' }
    ];


  form: FormGroup = this.fb.group<DecisionData>({
    county: this.fb.nonNullable.control('', { validators: Validators.required }),
    courtType: this.fb.nonNullable.control('', { validators: Validators.required }),
    topCharge: this.fb.nonNullable.control('', { validators: Validators.required }),
    pendingCases: this.fb.nonNullable.control('', { validators: Validators.required }),
    onSupervision: this.fb.nonNullable.control('', { validators: Validators.required }),
    priorConvictions: this.fb.nonNullable.control('', { validators: Validators.required }),
  } as any); // TS helper for typed group

  constructor(private msal: MsalService) {}

  username() {
    const a = this.msal.instance.getActiveAccount();
    return a?.name || a?.username || null;
  }

  logout() {
    this.msal.logoutRedirect();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // mirrors the React alert UX
      alert('Please fill in all fields before proceeding.');
      this.form.markAllAsTouched();
      return;
    }
    this.submitDecision.emit(this.form.value as DecisionData);
  }

  onSignOut(): void { this.signOut.emit(); }
}