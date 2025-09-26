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
import { defaultAuthority } from '../../../environments/auth';

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
  @Input() username = '';
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

    // ⬇️ add these option arrays
    topChargeOptions: SelectOption[] = [
      { label: 'PL 120.00 - Assault 3rd', value: 'PL 120.00 - Assault 3rd' },
      { label: 'PL 120.05 - Assault 2nd', value: 'PL 120.05 - Assault 2nd' },
      { label: 'PL 120.10 - Assault 1st', value: 'PL 120.10 - Assault 1st' },
      { label: 'PL 140.20 - Burglary 3rd', value: 'PL 140.20 - Burglary 3rd' },
      { label: 'PL 140.25 - Burglary 2nd', value: 'PL 140.25 - Burglary 2nd' },
      { label: 'PL 140.30 - Burglary 1st', value: 'PL 140.30 - Burglary 1st' },
      { label: 'PL 155.25 - Petit Larceny', value: 'PL 155.25 - Petit Larceny' },
      { label: 'PL 155.30 - Grand Larceny 4th', value: 'PL 155.30 - Grand Larceny 4th' },
      { label: 'PL 155.35 - Grand Larceny 3rd', value: 'PL 155.35 - Grand Larceny 3rd' },
      { label: 'PL 155.40 - Grand Larceny 2nd', value: 'PL 155.40 - Grand Larceny 2nd' },
      { label: 'PL 155.42 - Grand Larceny 1st', value: 'PL 155.42 - Grand Larceny 1st' },
      { label: 'PL 160.05 - Robbery 3rd', value: 'PL 160.05 - Robbery 3rd' },
      { label: 'PL 160.10 - Robbery 2nd', value: 'PL 160.10 - Robbery 2nd' },
      { label: 'PL 160.15 - Robbery 1st', value: 'PL 160.15 - Robbery 1st' },
      { label: 'PL 220.03 - Criminal Possession Controlled Substance 7th', value: 'PL 220.03 - Criminal Possession Controlled Substance 7th' },
      { label: 'PL 220.06 - Criminal Possession Controlled Substance 5th', value: 'PL 220.06 - Criminal Possession Controlled Substance 5th' },
      { label: 'PL 220.09 - Criminal Possession Controlled Substance 4th', value: 'PL 220.09 - Criminal Possession Controlled Substance 4th' },
      { label: 'PL 220.16 - Criminal Possession Controlled Substance 3rd', value: 'PL 220.16 - Criminal Possession Controlled Substance 3rd' },
      { label: 'PL 220.18 - Criminal Possession Controlled Substance 2nd', value: 'PL 220.18 - Criminal Possession Controlled Substance 2nd' },
      { label: 'PL 220.21 - Criminal Possession Controlled Substance 1st', value: 'PL 220.21 - Criminal Possession Controlled Substance 1st' }
    ];

    // ⬇️ add these option arrays
    pendingCaseStatusOptions: SelectOption[] = [
      { label: 'No open cases', value: 'no open cases' },
      { label: 'Open felony', value: 'open felony' },
      { label: 'Open misdemeanor', value: 'open misdemeanor' },
      { label: 'Missing/null', value: 'missing or null' },
    ];

    // ⬇️ add these option arrays
    supervisionOptions: SelectOption[] = [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
      { label: 'Null', value: 'null' },
    ];

    // ⬇️ add these option arrays
    priorConvictionOptions: SelectOption[] = [
      { label: 'No prior convictions', value: 'no prior convictions' },
      { label: 'Prior misdemeanor', value: 'prior misdemeanor' },
      { label: 'Prior non-violent felony offense (NVFO)', value: 'prior nvfo' },
      { label: 'Prior violent felony offense (VFO)', value: 'prior vfo' },
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

  email() {
    const acc = this.msal.instance.getActiveAccount();
    const claims = acc?.idTokenClaims as any | undefined;
  
    // Try common places CIAM/B2C put email, then fall back to username
    return claims?.emails?.[0] ?? claims?.email ?? acc?.username ?? null;
  }

  logout() {
    const account =
    this.msal.instance.getActiveAccount() ||
    this.msal.instance.getAllAccounts()[0] ||
    undefined;

    this.msal.logoutRedirect({
      account,
      authority: defaultAuthority,                 // e.g. https://nylp.ciamlogin.com/nylp.onmicrosoft.com
      postLogoutRedirectUri: 'http://localhost:4200/sign-in'
    });
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