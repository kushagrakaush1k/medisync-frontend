/**
 * FHIR R4 Converter - Convert internal data models to FHIR resources
 */

import {
  FHIRPatient,
  FHIRObservation,
  FHIRMedicationRequest,
  FHIRCondition,
  FHIREncounter,
  FHIRBundle,
} from '@/types/fhir';
import { Patient, VitalSign, Medication, Condition, Encounter } from '@/types/patient';

export class FHIRConverter {
  /**
   * Convert Patient to FHIR Patient resource
   */
  static toFHIRPatient(patient: Patient): FHIRPatient {
    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          system: 'http://hospital.example.org',
          value: patient.mrn,
        },
      ],
      name: [
        {
          use: 'official',
          family: patient.lastName,
          given: [patient.firstName],
        },
      ],
      telecom: [
        ...(patient.email
          ? [
              {
                system: 'email' as const,
                value: patient.email,
                use: 'home' as const,
              },
            ]
          : []),
        ...(patient.phone
          ? [
              {
                system: 'phone' as const,
                value: patient.phone,
                use: 'mobile' as const,
              },
            ]
          : []),
      ],
      gender: patient.gender,
      birthDate: patient.dateOfBirth,
      address: patient.address
        ? [
            {
              use: 'home',
              line: [patient.address.line1, patient.address.line2].filter(Boolean) as string[],
              city: patient.address.city,
              state: patient.address.state,
              postalCode: patient.address.zipCode,
              country: patient.address.country,
            },
          ]
        : undefined,
      active: patient.active,
    };
  }

  /**
   * Convert VitalSign to FHIR Observation resource
   */
  static toFHIRObservation(vital: VitalSign, patientId: string): FHIRObservation {
    const loincCodes: Record<string, { code: string; display: string }> = {
      blood_pressure_systolic: { code: '8480-6', display: 'Systolic blood pressure' },
      blood_pressure_diastolic: { code: '8462-4', display: 'Diastolic blood pressure' },
      heart_rate: { code: '8867-4', display: 'Heart rate' },
      temperature: { code: '8310-5', display: 'Body temperature' },
      respiratory_rate: { code: '9279-1', display: 'Respiratory rate' },
      oxygen_saturation: { code: '2708-6', display: 'Oxygen saturation' },
      weight: { code: '29463-7', display: 'Body weight' },
      height: { code: '8302-2', display: 'Body height' },
      bmi: { code: '39156-5', display: 'Body mass index' },
      glucose: { code: '2339-0', display: 'Glucose' },
    };

    const loincCode = loincCodes[vital.type] || { code: 'unknown', display: vital.type };

    return {
      resourceType: 'Observation',
      id: vital.id,
      status: vital.status,
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: loincCode.code,
            display: loincCode.display,
          },
        ],
        text: loincCode.display,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: vital.recordedAt,
      valueQuantity: {
        value: vital.value,
        unit: vital.unit,
        system: 'http://unitsofmeasure.org',
        code: vital.unit,
      },
    };
  }

  /**
   * Convert Medication to FHIR MedicationRequest resource
   */
  static toFHIRMedicationRequest(medication: Medication, patientId: string): FHIRMedicationRequest {
    return {
      resourceType: 'MedicationRequest',
      id: medication.id,
      status: medication.status,
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            display: medication.name,
          },
        ],
        text: medication.name,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      authoredOn: medication.startDate,
      requester: {
        display: medication.prescribedBy,
      },
      dosageInstruction: [
        {
          text: `${medication.dosage} ${medication.frequency} via ${medication.route}`,
          route: {
            coding: [
              {
                display: medication.route,
              },
            ],
          },
        },
      ],
    };
  }

  /**
   * Convert Condition to FHIR Condition resource
   */
  static toFHIRCondition(condition: Condition, patientId: string): FHIRCondition {
    return {
      resourceType: 'Condition',
      id: condition.id,
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: condition.status,
            display: condition.status.charAt(0).toUpperCase() + condition.status.slice(1),
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            code: 'confirmed',
            display: 'Confirmed',
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-category',
              code: 'encounter-diagnosis',
              display: 'Encounter Diagnosis',
            },
          ],
        },
      ],
      severity: condition.severity
        ? {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: condition.severity === 'mild' ? '255604002' : condition.severity === 'moderate' ? '6736007' : '24484000',
                display: condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1),
              },
            ],
          }
        : undefined,
      code: {
        coding: [
          ...(condition.icd10Code
            ? [
                {
                  system: 'http://hl7.org/fhir/sid/icd-10',
                  code: condition.icd10Code,
                  display: condition.name,
                },
              ]
            : []),
          ...(condition.snomedCode
            ? [
                {
                  system: 'http://snomed.info/sct',
                  code: condition.snomedCode,
                  display: condition.name,
                },
              ]
            : []),
        ],
        text: condition.name,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      onsetDateTime: condition.onsetDate,
      recordedDate: condition.onsetDate,
    };
  }

  /**
   * Convert Encounter to FHIR Encounter resource
   */
  static toFHIREncounter(encounter: Encounter, patientId: string): FHIREncounter {
    const encounterClassMap: Record<string, string> = {
      office_visit: 'AMB',
      telehealth: 'VR',
      emergency: 'EMER',
      inpatient: 'IMP',
      urgent_care: 'AMB',
      preventive: 'AMB',
      follow_up: 'AMB',
    };

    return {
      resourceType: 'Encounter',
      id: encounter.id,
      status: encounter.status === 'scheduled' ? 'planned' : encounter.status === 'in-progress' ? 'in-progress' : 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: encounterClassMap[encounter.type] || 'AMB',
        display: encounter.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      },
      type: [
        {
          coding: [
            {
              display: encounter.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            },
          ],
          text: encounter.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        },
      ],
      subject: {
        reference: `Patient/${patientId}`,
      },
      period: {
        start: encounter.startTime,
        end: encounter.endTime,
      },
      reasonCode: encounter.chiefComplaint
        ? [
            {
              text: encounter.chiefComplaint,
            },
          ]
        : undefined,
    };
  }

  /**
   * Create FHIR Bundle with all patient resources
   */
  static createPatientBundle(
    patient: Patient,
    vitals: VitalSign[],
    medications: Medication[],
    conditions: Condition[],
    encounters: Encounter[]
  ): FHIRBundle {
    const entries = [
      {
        fullUrl: `Patient/${patient.id}`,
        resource: this.toFHIRPatient(patient),
      },
      ...vitals.map((vital) => ({
        fullUrl: `Observation/${vital.id}`,
        resource: this.toFHIRObservation(vital, patient.id),
      })),
      ...medications.map((med) => ({
        fullUrl: `MedicationRequest/${med.id}`,
        resource: this.toFHIRMedicationRequest(med, patient.id),
      })),
      ...conditions.map((cond) => ({
        fullUrl: `Condition/${cond.id}`,
        resource: this.toFHIRCondition(cond, patient.id),
      })),
      ...encounters.map((enc) => ({
        fullUrl: `Encounter/${enc.id}`,
        resource: this.toFHIREncounter(enc, patient.id),
      })),
    ];

    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: entries.length,
      entry: entries,
    };
  }
}