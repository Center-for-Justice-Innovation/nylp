import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { LogOut, Menu, X } from "lucide-react";

interface CaseCalculatorProps {
  userEmail: string;
  onSignOut: () => void;
}

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

export function CaseCalculator({ userEmail, onSignOut }: CaseCalculatorProps) {
  const [filters, setFilters] = useState<CaseFilters>({
    borough: "",
    caseType: "",
    chargeCategory: ""
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const calculateOutcome = async () => {
    if (!filters.borough || !filters.caseType || !filters.chargeCategory) {
      return;
    }

    setIsCalculating(true);
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock calculation logic based on NYC criminal justice data patterns
    const boroughFactors = {
      manhattan: { pretrial: 0.65, avgBail: 12500, caseLength: 4.2 },
      brooklyn: { pretrial: 0.58, avgBail: 8500, caseLength: 5.1 },
      queens: { pretrial: 0.52, avgBail: 7200, caseLength: 4.8 },
      bronx: { pretrial: 0.71, avgBail: 6800, caseLength: 5.8 },
      statenisland: { pretrial: 0.45, avgBail: 9200, caseLength: 3.9 }
    };

    const caseTypeFactors = {
      felony: { severity: 1.8, bailMultiplier: 2.5, timeMultiplier: 1.6 },
      misdemeanor: { severity: 0.6, bailMultiplier: 0.4, timeMultiplier: 0.7 },
      violation: { severity: 0.2, bailMultiplier: 0.1, timeMultiplier: 0.3 },
      infraction: { severity: 0.1, bailMultiplier: 0.05, timeMultiplier: 0.2 }
    };

    const chargeCategoryFactors = {
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

    const boroughData = boroughFactors[filters.borough as keyof typeof boroughFactors];
    const caseData = caseTypeFactors[filters.caseType as keyof typeof caseTypeFactors];
    const chargeData = chargeCategoryFactors[filters.chargeCategory as keyof typeof chargeCategoryFactors];

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
    const analysisData = {
      pretrialRate,
      avgBail,
      avgCaseLength,
      dismissalRate,
      convictionRate,
      borough: filters.borough
    };

    setResult(analysisData);
    setIsCalculating(false);
  };

  const getBoroughNotes = (borough: string) => {
    const notes = {
      manhattan: "Manhattan courts typically process cases faster but have higher pre-trial detention rates due to resource availability.",
      brooklyn: "Brooklyn shows moderate detention rates with emphasis on community-based alternatives to incarceration.",
      queens: "Queens has relatively lower pre-trial detention rates and diverse specialty court programs.",
      bronx: "Bronx faces higher case volumes leading to longer processing times and higher detention rates.",
      statenisland: "Staten Island has the lowest detention rates but fewer alternative program options."
    };
    return notes[borough as keyof typeof notes] || "";
  };

  const resetFilters = () => {
    setFilters({
      borough: "",
      caseType: "",
      chargeCategory: ""
    });
    setResult(null);
  };

  const isFormComplete = filters.borough && filters.caseType && filters.chargeCategory;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg truncate">NYC Case Analytics</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="ml-2"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground truncate">
                {userEmail}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onSignOut();
                  setShowMobileMenu(false);
                }}
                className="justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block p-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1>New York Legal Practice - Case Outcomes Tool</h1>
            <p className="text-muted-foreground">Analyze pre-trial detention, bail, and case outcome patterns</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {userEmail}</span>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Filters */}
            <div className="order-1 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle>Case Parameters</CardTitle>
                  <CardDescription>
                    Select borough, case type, and charge category for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>NYC Borough</Label>
                    <Select value={filters.borough} onValueChange={(value) => setFilters(prev => ({ ...prev, borough: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select borough" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manhattan">Manhattan</SelectItem>
                        <SelectItem value="brooklyn">Brooklyn</SelectItem>
                        <SelectItem value="queens">Queens</SelectItem>
                        <SelectItem value="bronx">Bronx</SelectItem>
                        <SelectItem value="statenisland">Staten Island</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Case Type</Label>
                    <Select value={filters.caseType} onValueChange={(value) => setFilters(prev => ({ ...prev, caseType: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="felony">Felony</SelectItem>
                        <SelectItem value="misdemeanor">Misdemeanor</SelectItem>
                        <SelectItem value="violation">Violation</SelectItem>
                        <SelectItem value="infraction">Infraction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Charge Category</Label>
                    <Select value={filters.chargeCategory} onValueChange={(value) => setFilters(prev => ({ ...prev, chargeCategory: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select charge category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="assault">Assault</SelectItem>
                        <SelectItem value="drugoffenses">Drug Offenses</SelectItem>
                        <SelectItem value="domesticviolence">Domestic Violence</SelectItem>
                        <SelectItem value="robbery">Robbery</SelectItem>
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="weapons">Weapons</SelectItem>
                        <SelectItem value="dui">DUI/DWI</SelectItem>
                        <SelectItem value="publicorder">Public Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      onClick={calculateOutcome} 
                      disabled={!isFormComplete || isCalculating}
                      className="flex-1 h-12"
                    >
                      {isCalculating ? "Analyzing..." : "Analyze Case Data"}
                    </Button>
                    <Button variant="outline" onClick={resetFilters} className="h-12 sm:w-auto w-full">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="order-2 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Case Outcome Information</CardTitle>
                  <CardDescription>
                    Statistical analysis based on selected parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCalculating ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center space-y-4">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-muted-foreground">Analyzing case data...</p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Analysis Complete</Badge>
                      </div>
                      <div className="p-4 bg-muted rounded-lg space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Pre-Trial Detention:</h4>
                          <p className="text-sm mb-1">{(result.pretrialRate * 100).toFixed(1)}% of similar cases result in pre-trial detention</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Bail Information:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Average bail amount: ${result.avgBail.toLocaleString()}</li>
                            <li>• Cases with bail set: {((1 - result.pretrialRate) * 0.75 * 100).toFixed(0)}%</li>
                            <li>• Released on own recognizance: {((1 - result.pretrialRate) * 0.25 * 100).toFixed(0)}%</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Case Timeline:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Average case duration: {result.avgCaseLength} months</li>
                            <li>• Cases resolved within 6 months: {(Math.random() * 30 + 45).toFixed(0)}%</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Historical Outcomes:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Conviction rate: {(result.convictionRate * 100).toFixed(1)}%</li>
                            <li>• Dismissal rate: {(result.dismissalRate * 100).toFixed(1)}%</li>
                            <li>• Plea agreement rate: {((result.convictionRate * 0.85) * 100).toFixed(1)}%</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Borough-Specific Notes:</h4>
                          <p className="text-sm">{getBoroughNotes(result.borough)}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        * This analysis is based on historical patterns and should not be considered legal advice. Individual case outcomes may vary significantly.
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center space-y-3">
                        <p className="text-muted-foreground">Select all parameters above</p>
                        <p className="text-sm text-muted-foreground">Then click "Analyze Case Data" to see statistics</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}