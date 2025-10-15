/**
 * FHIR Exporter - Download FHIR bundles in various formats
 */

import { FHIRBundle } from '@/types/fhir';
import { downloadFile } from '@/lib/utils';

export class FHIRExporter {
  /**
   * Download FHIR Bundle as JSON
   */
  static downloadFHIRBundle(bundle: FHIRBundle, filename: string = 'fhir-bundle.json'): void {
    const jsonString = JSON.stringify(bundle, null, 2);
    downloadFile(jsonString, filename, 'application/fhir+json');
  }

  /**
   * Download multiple bundles as NDJSON (newline-delimited JSON)
   */
  static downloadBulkFHIR(bundles: FHIRBundle[], filename: string = 'fhir-bulk-export.ndjson'): void {
    const ndjson = bundles.map((bundle) => JSON.stringify(bundle)).join('\n');
    downloadFile(ndjson, filename, 'application/ndjson');
  }

  /**
   * Convert FHIR Bundle to CSV for specific resource types
   */
  static bundleToCSV(bundle: FHIRBundle, resourceType: string): string {
    const resources = bundle.entry?.filter((entry) => entry.resource?.resourceType === resourceType).map((entry) => entry.resource) || [];

    if (resources.length === 0) {
      return '';
    }

    // Extract headers from first resource
    const headers = this.extractHeaders(resources[0]);
    const csvHeaders = headers.join(',');

    // Extract data rows
    const csvRows = resources.map((resource) => {
      return headers
        .map((header) => {
          const value = this.getNestedValue(resource, header);
          return this.escapeCSV(value);
        })
        .join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  /**
   * Extract headers from a FHIR resource (flattened)
   */
  private static extractHeaders(resource: any, prefix: string = ''): string[] {
    const headers: string[] = [];

    for (const key in resource) {
      if (resource.hasOwnProperty(key)) {
        const value = resource[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          headers.push(...this.extractHeaders(value, fullKey));
        } else if (!Array.isArray(value)) {
          headers.push(fullKey);
        }
      }
    }

    return headers;
  }

  /**
   * Get nested value from object using dot notation
   */
  private static getNestedValue(obj: any, path: string): string {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return '';
      }
    }

    return String(value || '');
  }

  /**
   * Escape CSV values
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Download FHIR Bundle as CSV
   */
  static downloadFHIRAsCSV(bundle: FHIRBundle, resourceType: string, filename: string): void {
    const csv = this.bundleToCSV(bundle, resourceType);
    if (csv) {
      downloadFile(csv, filename, 'text/csv');
    } else {
      console.warn(`No resources of type ${resourceType} found in bundle`);
    }
  }

  /**
   * Generate summary report from FHIR Bundle
   */
  static generateSummaryReport(bundle: FHIRBundle): string {
    const resourceCounts: Record<string, number> = {};

    bundle.entry?.forEach((entry) => {
      const resourceType = entry.resource?.resourceType || 'Unknown';
      resourceCounts[resourceType] = (resourceCounts[resourceType] || 0) + 1;
    });

    let report = `FHIR Bundle Summary Report\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total Resources: ${bundle.total || 0}\n\n`;
    report += `Resource Breakdown:\n`;

    Object.entries(resourceCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        report += `  ${type}: ${count}\n`;
      });

    return report;
  }

  /**
   * Validate FHIR Bundle structure
   */
  static validateBundle(bundle: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!bundle.resourceType || bundle.resourceType !== 'Bundle') {
      errors.push('Invalid resourceType. Expected "Bundle"');
    }

    if (!bundle.type) {
      errors.push('Missing required field: type');
    }

    if (!bundle.entry || !Array.isArray(bundle.entry)) {
      errors.push('Missing or invalid entry array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}