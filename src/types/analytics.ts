/**
 * Analytics & Population Health Type Definitions
 */

export interface PopulationMetrics {
  totalPatients: number;
  activePatients: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  chronicConditionPrevalence: ConditionPrevalence[];
  utilizationMetrics: UtilizationMetrics;
  qualityMetrics: QualityMetrics;
}

export interface ConditionPrevalence {
  condition: string;
  count: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface UtilizationMetrics {
  totalEncounters: number;
  averageEncountersPerPatient: number;
  encountersByType: {
    type: string;
    count: number;
  }[];
  readmissionRate: number;
  emergencyVisitRate: number;
  noShowRate: number;
}

export interface QualityMetrics {
  hedisMetrics: HEDISMetric[];
  mipsMetrics: MIPSMetric[];
  overallScore: number;
  benchmarkComparison: {
    metric: string;
    yourScore: number;
    benchmark: number;
    percentile: number;
  }[];
}

export interface HEDISMetric {
  id: string;
  name: string;
  description: string;
  score: number;
  target: number;
  numerator: number;
  denominator: number;
  category: string;
}

export interface MIPSMetric {
  id: string;
  name: string;
  measure: string;
  score: number;
  performanceRate: number;
  benchmark: number;
}

export interface CohortAnalysis {
  cohortId: string;
  name: string;
  criteria: CohortCriteria;
  patientCount: number;
  demographics: Demographics;
  clinicalCharacteristics: ClinicalCharacteristics;
  outcomes: OutcomeMetrics;
}

export interface CohortCriteria {
  ageRange?: { min: number; max: number };
  gender?: string[];
  conditions?: string[];
  medications?: string[];
  riskLevel?: string[];
  insurance?: string[];
}

export interface Demographics {
  ageGroups: { range: string; count: number }[];
  genderBreakdown: { gender: string; count: number }[];
  raceEthnicity: { category: string; count: number }[];
  insuranceTypes: { type: string; count: number }[];
}

export interface ClinicalCharacteristics {
  commonConditions: { condition: string; percentage: number }[];
  commonMedications: { medication: string; percentage: number }[];
  averageRiskScore: number;
  comorbidityIndex: number;
}

export interface OutcomeMetrics {
  hospitalizationRate: number;
  emergencyVisitRate: number;
  readmissionRate: number;
  mortalityRate: number;
  costPerPatient: number;
}

export interface TrendData {
  date: string;
  value: number;
  category?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: string[];
  conditions?: string[];
  riskLevel?: string[];
  provider?: string[];
  facility?: string[];
}

export interface ReportConfig {
  id: string;
  name: string;
  type: 'population' | 'quality' | 'utilization' | 'financial' | 'clinical';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  filters: DashboardFilters;
  parameters?: Record<string, any>;
}