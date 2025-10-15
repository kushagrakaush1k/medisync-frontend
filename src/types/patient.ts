/**
 * Patient Domain Type Definitions
 */

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  email?: string;
  phone?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  insurance?: Insurance;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberId?: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  type: VitalType;
  value: number;
  unit: string;
  recordedAt: string;
  recordedBy?: string;
  status: 'preliminary' | 'final' | 'amended' | 'cancelled';
  notes?: string;
}

export type VitalType = 
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'heart_rate'
  | 'temperature'
  | 'respiratory_rate'
  | 'oxygen_saturation'
  | 'weight'
  | 'height'
  | 'bmi'
  | 'glucose';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'completed' | 'stopped' | 'on-hold';
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  pharmacy?: string;
  refills?: number;
  instructions?: string;
  sideEffects?: string[];
  interactions?: string[];
}

export interface Condition {
  id: string;
  patientId: string;
  name: string;
  icd10Code?: string;
  snomedCode?: string;
  status: 'active' | 'resolved' | 'inactive';
  severity?: 'mild' | 'moderate' | 'severe';
  onsetDate: string;
  resolvedDate?: string;
  diagnosedBy?: string;
  notes?: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  type: EncounterType;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  chiefComplaint?: string;
  provider: string;
  facility: string;
  startTime: string;
  endTime?: string;
  diagnosis?: string[];
  procedures?: string[];
  notes?: string;
  followUp?: string;
}

export type EncounterType = 
  | 'office_visit'
  | 'telehealth'
  | 'emergency'
  | 'inpatient'
  | 'urgent_care'
  | 'preventive'
  | 'follow_up';

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  loincCode?: string;
  value: string | number;
  unit?: string;
  referenceRange?: {
    low?: number;
    high?: number;
    text?: string;
  };
  status: 'pending' | 'preliminary' | 'final' | 'corrected';
  abnormal: boolean;
  critical: boolean;
  collectedAt: string;
  resultedAt?: string;
  orderedBy: string;
  performedBy?: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  type: 'food' | 'medication' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string[];
  onsetDate?: string;
  status: 'active' | 'resolved' | 'inactive';
  notes?: string;
}

export interface Immunization {
  id: string;
  patientId: string;
  vaccine: string;
  cvxCode?: string;
  date: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredBy: string;
  site?: string;
  route?: string;
  lotNumber?: string;
  expirationDate?: string;
  status: 'completed' | 'entered-in-error' | 'not-done';
}

export interface PatientSummary extends Patient {
  vitals: VitalSign[];
  medications: Medication[];
  conditions: Condition[];
  encounters: Encounter[];
  labResults: LabResult[];
  allergies: Allergy[];
  immunizations: Immunization[];
  riskScore?: RiskAssessment;
}

export interface RiskAssessment {
  overall: number; // 0-100
  cardiovascular: number;
  diabetes: number;
  readmission: number;
  lastUpdated: string;
  factors: string[];
}