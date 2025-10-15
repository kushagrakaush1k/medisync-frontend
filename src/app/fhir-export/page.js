'use client';

import { useState } from 'react';
import {
  Download,
  FileJson,
  FileText,
  Database,
  CheckCircle2,
  Calendar,
  Users,
  Filter,
  Settings,
} from 'lucide-react';

export default function FHIRExportPage() {
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedResources, setSelectedResources] = useState([
    'Patient',
    'Observation',
    'Condition',
    'MedicationRequest',
  ]);
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const resourceTypes = [
    { id: 'Patient', label: 'Patient', count: 12458, icon: Users },
    { id: 'Observation', label: 'Observations (Vitals/Labs)', count: 45678, icon: Database },
    { id: 'Condition', label: 'Conditions/Diagnoses', count: 23456, icon: FileText },
    { id: 'MedicationRequest', label: 'Medications', count: 34567, icon: FileText },
    { id: 'Encounter', label: 'Encounters', count: 56789, icon: Calendar },
    { id: 'Procedure', label: 'Procedures', count: 12345, icon: Settings },
  ];

  const recentExports = [
    {
      id: 1,
      name: 'Full Patient Export - Q4 2024',
      date: '2024-10-10',
      format: 'JSON',
      size: '245 MB',
      resources: 4,
      status: 'completed',
    },
    {
      id: 2,
      name: 'Diabetes Patient Cohort',
      date: '2024-10-05',
      format: 'NDJSON',
      size: '89 MB',
      resources: 3,
      status: 'completed',
    },
    {
      id: 3,
      name: 'Monthly Analytics Export',
      date: '2024-09-30',
      format: 'CSV',
      size: '12 MB',
      resources: 2,
      status: 'completed',
    },
  ];

  const handleToggleResource = (resourceId) => {
    setSelectedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert('Export completed! File download started.');
    }, 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">FHIR Data Export</h1>
        <p className="mt-1 text-sm text-gray-500">
          Export patient data in HL7 FHIR R4 compliant format for interoperability
        </p>
      </div>

      {/* Export Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setExportFormat('json')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  exportFormat === 'json'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileJson className="h-8 w-8 text-cyan-600 mb-2" />
                <p className="font-semibold text-gray-900">JSON Bundle</p>
                <p className="text-xs text-gray-500 mt-1">Single FHIR Bundle</p>
              </button>

              <button
                onClick={() => setExportFormat('ndjson')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  exportFormat === 'ndjson'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Database className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-gray-900">NDJSON</p>
                <p className="text-xs text-gray-500 mt-1">Bulk Data Export</p>
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  exportFormat === 'csv'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-900">CSV</p>
                <p className="text-xs text-gray-500 mt-1">Flattened Data</p>
              </button>
            </div>
          </div>

          {/* Resource Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Resource Types</h2>
            <div className="space-y-3">
              {resourceTypes.map((resource) => {
                const Icon = resource.icon;
                const isSelected = selectedResources.includes(resource.id);
                return (
                  <div
                    key={resource.id}
                    onClick={() => handleToggleResource(resource.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 ${
                            isSelected
                              ? 'border-cyan-600 bg-cyan-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{resource.label}</p>
                          <p className="text-sm text-gray-500">
                            {resource.count.toLocaleString()} records
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Summary & Export */}
        <div className="space-y-6">
          {/* Export Summary */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Export Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Format:</span>
                <span className="font-semibold uppercase">{exportFormat}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Resources:</span>
                <span className="font-semibold">{selectedResources.length} types</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Date Range:</span>
                <span className="font-semibold capitalize">{dateRange}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/20">
                <span className="text-sm opacity-90">Est. Size:</span>
                <span className="font-semibold">~125 MB</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={selectedResources.length === 0 || isExporting}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Export Data
              </>
            )}
          </button>

          {/* Compliance Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">FHIR R4 Compliant</p>
                <p className="text-xs text-green-700 mt-1">
                  All exports meet HL7 FHIR R4 specifications and are compliant with ONC
                  Cures Act Final Rule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Exports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Export Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentExports.map((exportItem) => (
                <tr key={exportItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileJson className="h-5 w-5 text-cyan-600 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {exportItem.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exportItem.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {exportItem.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exportItem.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exportItem.resources} types
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(exportItem.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-cyan-600 hover:text-cyan-900 mr-4">
                      Download
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FHIR Resources Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Database className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              About FHIR Resource Types
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>Patient:</strong> Demographics and administrative information
              </p>
              <p>
                <strong>Observation:</strong> Clinical observations including vitals, lab results,
                and measurements
              </p>
              <p>
                <strong>Condition:</strong> Diagnoses, problems, and health concerns
              </p>
              <p>
                <strong>MedicationRequest:</strong> Prescriptions and medication orders
              </p>
              <p>
                <strong>Encounter:</strong> Healthcare visits and interactions
              </p>
              <p>
                <strong>Procedure:</strong> Clinical procedures and interventions performed
              </p>
            </div>
            <a
              href="https://www.hl7.org/fhir/resourcelist.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View Full FHIR R4 Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}