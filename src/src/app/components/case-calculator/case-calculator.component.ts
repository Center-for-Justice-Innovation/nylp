import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CaseFilters {
  borough: string;
  caseType: string;
  chargeCategory: string;
}

interface AnalysisResult {
  pretrialRate: number;
  avgBail: number;
  avgCaseLength: number;
  dismissalRate: number;
  convictionRate: number;
  borough: string;
}

@Component({
  selector: 'app-case-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Mobile Header -->
      <div class="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 lg:hidden">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-lg truncate">NYC Case Analytics</h1>
          </div>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 ml-2"
            (click)="showMobileMenu = !showMobileMenu"
          >
            <svg *ngIf="!showMobileMenu" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg *ngIf="showMobileMenu" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu Dropdown -->
        <div *ngIf="showMobileMenu" class="mt-3 pt-3 border-t border-border">
          <div class="flex flex-col space-y-2">
            <div class="text-sm text-muted-foreground truncate">
              {{ userEmail }}
            </div>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 justify-start"
              (click)="handleSignOut()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Header -->
      <div class="hidden lg:block p-6 border-b border-border">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1>NYC Criminal Justice Analytics</h1>
            <p class="text-muted-foreground">Analyze pre-trial detention, bail, and case outcome patterns</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground">Welcome, {{ userEmail }}</span>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              (click)="signOut.emit()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 lg:p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="grid lg:grid-cols-2 gap-6">
            <!-- Filters -->
            <div class="order-1 lg:order-1">
              <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6">
                  <h3 class="text-lg font-semibold">Case Parameters</h3>
                  <p class="text-muted-foreground">
                    Select borough, case type, and charge category for analysis
                  </p>
                </div>
                <div class="p-6 pt-0 space-y-6">
                  <div class="space-y-3">
                    <label class="text-base font-medium">NYC Borough</label>
                    <select 
                      [(ngModel)]="filters.borough"
                      class="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select borough</option>
                      <option value="manhattan">Manhattan</option>
                      <option value="brooklyn">Brooklyn</option>
                      <option value="queens">Queens</option>
                      <option value="bronx">Bronx</option>
                      <option value="statenisland">Staten Island</option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <label class="text-base font-medium">Case Type</label>
                    <select 
                      [(ngModel)]="filters.caseType"
                      class="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select case type</option>
                      <option value="felony">Felony</option>
                      <option value="misdemeanor">Misdemeanor</option>
                      <option value="violation">Violation</option>
                      <option value="infraction">Infraction</option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <label class="text-base font-medium">Charge Category</label>
                    <select 
                      [(ngModel)]="filters.chargeCategory"
                      class="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select charge category</option>
                      <option value="theft">Theft</option>
                      <option value="assault">Assault</option>
                      <option value="drugoffenses">Drug Offenses</option>
                      <option value="domesticviolence">Domestic Violence</option>
                      <option value="robbery">Robbery</option>
                      <option value="fraud">Fraud</option>
                      <option value="weapons">Weapons</option>
                      <option value="dui">DUI/DWI</option>
                      <option value="publicorder">Public Order</option>
                    </select>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button 
                      (click)="calculateOutcome()"
                      [disabled]="!isFormComplete || isCalculating"
                      class="flex-1 h-12 inline-flex items-center justify-center rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {{ isCalculating ? 'Analyzing...' : 'Analyze Case Data' }}
                    </button>
                    <button 
                      (click)="resetFilters()"
                      class="h-12 sm:w-auto w-full inline-flex items-center justify-center rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Results -->
            <div class="order-2 lg:order-2">
              <div class="bg-card border border-border rounded-lg shadow-sm">
                <div class="p-6">
                  <h3 class="text-lg font-semibold">Criminal Justice Analytics</h3>
                  <p class="text-muted-foreground">
                    Statistical analysis based on selected parameters
                  </p>
                </div>
                <div class="p-6 pt-0">
                  <div *ngIf="isCalculating" class="flex items-center justify-center py-16">
                    <div class="text-center space-y-4">
                      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p class="text-muted-foreground">Analyzing case data...</p>
                    </div>
                  </div>
                  
                  <div *ngIf="result && !isCalculating" class="space-y-4">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        Analysis Complete
                      </span>
                    </div>
                    <div class="p-4 bg-muted rounded-lg space-y-4">
                      <div>
                        <h4 class="font-semibold mb-2">Pre-Trial Detention:</h4>
                        <p class="text-sm mb-1">{{ (result.pretrialRate * 100).toFixed(1) }}% of similar cases result in pre-trial detention</p>
                      </div>

                      <div>
                        <h4 class="font-semibold mb-2">Bail Information:</h4>
                        <ul class="text-sm space-y-1">
                          <li>• Average bail amount: ${{ result.avgBail.toLocaleString() }}</li>
                          <li>• Cases with bail set: {{ ((1 - result.pretrialRate) * 0.75 * 100).toFixed(0) }}%</li>
                          <li>• Released on own recognizance: {{ ((1 - result.pretrialRate) * 0.25 * 100).toFixed(0) }}%</li>
                        </ul>
                      </div>

                      <div>
                        <h4 class="font-semibold mb-2">Case Timeline:</h4>
                        <ul class="text-sm space-y-1">
                          <li>• Average case duration: {{ result.avgCaseLength }} months</li>
                          <li>• Cases resolved within 6 months: {{ (Math.random() * 30 + 45).toFixed(0) }}%</li>
                        </ul>
                      </div>

                      <div>
                        <h4 class="font-semibold mb-2">Historical Outcomes:</h4>
                        <ul class="text-sm space-y-1">
                          <li>• Conviction rate: {{ (result.convictionRate * 100).toFixed(1) }}%</li>
                          <li>• Dismissal rate: {{ (result.dismissalRate * 100).toFixed(1) }}%</li>
                          <li>• Plea agreement rate: {{ ((result.convictionRate * 0.85) * 100).toFixed(1) }}%</li>
                        </ul>
                      </div>

                      <div>
                        <h4 class="font-semibold mb-2">Borough-Specific Notes:</h4>
                        <p class="text-sm">{{ getBoroughNotes(result.borough) }}</p>
                      </div>
                    </div>
                    <div class="text-xs text-muted-foreground">
                      * This analysis is based on historical patterns and should not be considered legal advice. Individual case outcomes may vary significantly.
                    </div>
                  </div>
                  
                  <div *ngIf="!result && !isCalculating" class="flex items-center justify-center py-16">
                    <div class="text-center space-y-3">
                      <p class="text-muted-foreground">Select all parameters above</p>
                      <p class="text-sm text-muted-foreground">Then click "Analyze Case Data" to see statistics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class CaseCalculatorComponent {
  @Input() userEmail!: string;
  @Output() signOut = new EventEmitter<void>();

  filters: CaseFilters = {
    borough: '',
    caseType: '',
    chargeCategory: ''
  };

  result: AnalysisResult | null = null;
  isCalculating: boolean = false;
  showMobileMenu: boolean = false;

  get isFormComplete(): boolean {
    return !!(this.filters.borough && this.filters.caseType && this.filters.chargeCategory);
  }

  // Make Math available in template
  Math = Math;

  async calculateOutcome(): Promise<void> {
    if (!this.filters.borough || !this.filters.caseType || !this.filters.chargeCategory) {
      return;
    }

    this.isCalculating = true;
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock calculation logic based on NYC criminal justice data patterns
    const boroughFactors: Record<string, any> = {
      manhattan: { pretrial: 0.65, avgBail: 12500, caseLength: 4.2 },
      brooklyn: { pretrial: 0.58, avgBail: 8500, caseLength: 5.1 },
      queens: { pretrial: 0.52, avgBail: 7200, caseLength: 4.8 },
      bronx: { pretrial: 0.71, avgBail: 6800, caseLength: 5.8 },
      statenisland: { pretrial: 0.45, avgBail: 9200, caseLength: 3.9 }
    };

    const caseTypeFactors: Record<string, any> = {
      felony: { severity: 1.8, bailMultiplier: 2.5, timeMultiplier: 1.6 },
      misdemeanor: { severity: 0.6, bailMultiplier: 0.4, timeMultiplier: 0.7 },
      violation: { severity: 0.2, bailMultiplier: 0.1, timeMultiplier: 0.3 },
      infraction: { severity: 0.1, bailMultiplier: 0.05, timeMultiplier: 0.2 }
    };

    const chargeCategoryFactors: Record<string, any> = {
      theft: { riskScore: 0.7, bailAdj: 1.2 },
      assault: { riskScore: 1.4, bailAdj: 1.8 },
      drugoffenses: { riskScore: 0.9, bailAdj: 1.1 },
      domesticviolence: { riskScore: 1.6, bailAdj: 2.0 },
      robbery: { riskScore: 1.8, bailAdj: 2.4 },
      fraud: { riskScore: 0.5, bailAdj: 1.0 },
      weapons: { riskScore: 1.9, bailAdj: 2.8 },
      dui: { riskScore: 0.8, bailAdj: 0.9 },
      publicorder: { riskScore: 0.4, bailAdj: 0.6 }
    };

    const boroughData = boroughFactors[this.filters.borough];
    const caseData = caseTypeFactors[this.filters.caseType];
    const chargeData = chargeCategoryFactors[this.filters.chargeCategory];

    // Calculate statistics
    const pretrialRate = Math.min(Math.max(
      boroughData.pretrial * caseData.severity * chargeData.riskScore, 0.15
    ), 0.85);

    const avgBail = Math.round(
      boroughData.avgBail * caseData.bailMultiplier * chargeData.bailAdj
    );

    const avgCaseLength = Math.round(
      (boroughData.caseLength * caseData.timeMultiplier) * 10
    ) / 10;

    const dismissalRate = Math.max(0.12, Math.min(0.45, 
      0.28 - (caseData.severity * 0.15) + (Math.random() * 0.1 - 0.05)
    ));

    const convictionRate = Math.max(0.35, Math.min(0.78,
      0.65 + (caseData.severity * 0.12) - (dismissalRate * 0.3)
    ));

    // Create structured result object
    this.result = {
      pretrialRate,
      avgBail,
      avgCaseLength,
      dismissalRate,
      convictionRate,
      borough: this.filters.borough
    };

    this.isCalculating = false;
  }

  getBoroughNotes(borough: string): string {
    const notes: Record<string, string> = {
      manhattan: "Manhattan courts typically process cases faster but have higher pre-trial detention rates due to resource availability.",
      brooklyn: "Brooklyn shows moderate detention rates with emphasis on community-based alternatives to incarceration.",
      queens: "Queens has relatively lower pre-trial detention rates and diverse specialty court programs.",
      bronx: "Bronx faces higher case volumes leading to longer processing times and higher detention rates.",
      statenisland: "Staten Island has the lowest detention rates but fewer alternative program options."
    };
    return notes[borough] || "";
  }

  resetFilters(): void {
    this.filters = {
      borough: '',
      caseType: '',
      chargeCategory: ''
    };
    this.result = null;
  }

  handleSignOut(): void {
    this.signOut.emit();
    this.showMobileMenu = false;
  }
}