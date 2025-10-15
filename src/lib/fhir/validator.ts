/**
 * FHIR Validator - Validate FHIR resources against R4 spec
 */

import { FHIRResource, FHIRPatient, FHIRObservation } from '@/types/fhir';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

export class FHIRValidator {
  /**
   * Validate any FHIR resource
   */
  static validateResource(resource: FHIRResource): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Common validations
    if (!resource.resourceType) {
      errors.push({
        field: 'resourceType',
        message: 'resourceType is required',
        severity: 'error',
      });
    }

    // Resource-specific validations
    switch (resource.resourceType) {
      case 'Patient':
        this.validatePatient(resource as FHIRPatient, errors, warnings);
        break;
      case 'Observation':
        this.validateObservation(resource as FHIRObservation, errors, warnings);
        break;
      // Add more resource types as needed
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate Patient resource
   */
  private static validatePatient(
    patient: FHIRPatient,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Name validation
    if (!patient.name || patient.name.length === 0) {
      warnings.push({
        field: 'name',
        message: 'Patient should have at least one name',
        severity: 'warning',
      });
    }

    // Gender validation
    if (patient.gender && !['male', 'female', 'other', 'unknown'].includes(patient.gender)) {
      errors.push({
        field: 'gender',
        message: 'Invalid gender value',
        severity: 'error',
      });
    }

    // Birth date validation
    if (patient.birthDate && !this.isValidDate(patient.birthDate)) {
      errors.push({
        field: 'birthDate',
        message: 'Invalid birth date format',
        severity: 'error',
      });
    }

    // Telecom validation
    if (patient.telecom) {
      patient.telecom.forEach((telecom, index) => {
        if (telecom.system && !['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'].includes(telecom.system)) {
          errors.push({
            field: `telecom[${index}].system`,
            message: 'Invalid telecom system',
            severity: 'error',
          });
        }
      });
    }
  }

  /**
   * Validate Observation resource
   */
  private static validateObservation(
    observation: FHIRObservation,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Status validation (required)
    if (!observation.status) {
      errors.push({
        field: 'status',
        message: 'status is required',
        severity: 'error',
      });
    } else if (
      !['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'].includes(
        observation.status
      )
    ) {
      errors.push({
        field: 'status',
        message: 'Invalid status value',
        severity: 'error',
      });
    }

    // Code validation (required)
    if (!observation.code) {
      errors.push({
        field: 'code',
        message: 'code is required',
        severity: 'error',
      });
    }

    // Subject validation
    if (!observation.subject) {
      warnings.push({
        field: 'subject',
        message: 'Observation should reference a subject (patient)',
        severity: 'warning',
      });
    }

    // Effective date validation
    if (observation.effectiveDateTime && !this.isValidDateTime(observation.effectiveDateTime)) {
      errors.push({
        field: 'effectiveDateTime',
        message: 'Invalid effectiveDateTime format',
        severity: 'error',
      });
    }
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  private static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }

  /**
   * Validate datetime format (ISO 8601)
   */
  private static isValidDateTime(datetime: string): boolean {
    const parsedDate = new Date(datetime);
    return !isNaN(parsedDate.getTime());
  }

  /**
   * Validate coding system URL
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate multiple resources in a bundle
   */
  static validateBundle(bundle: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!bundle.entry || !Array.isArray(bundle.entry)) {
      errors.push({
        field: 'entry',
        message: 'Bundle must have an entry array',
        severity: 'error',
      });
      return { valid: false, errors, warnings };
    }

    bundle.entry.forEach((entry: any, index: number) => {
      if (!entry.resource) {
        errors.push({
          field: `entry[${index}]`,
          message: 'Entry must have a resource',
          severity: 'error',
        });
      } else {
        const result = this.validateResource(entry.resource);
        errors.push(
          ...result.errors.map((e) => ({
            ...e,
            field: `entry[${index}].${e.field}`,
          }))
        );
        warnings.push(
          ...result.warnings.map((w) => ({
            ...w,
            field: `entry[${index}].${w.field}`,
          }))
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}