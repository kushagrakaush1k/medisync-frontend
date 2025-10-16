'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { patientAPI, fhirAPI } from '@/services/api';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Download,
  AlertCircle,
  Activity,
  Heart,
  Droplet,
  Wind,
  Thermometer,
  Pill,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

   useEffect(() => {
    fetchPatient();
  }, [params.id]);

   const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientAPI.getById(params.id);
      setPatient(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch patient:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This patient does not exist'}</p>
          <Link
            href="/patients"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }
        // Fetch patient data and FHIR resources in parallel
        const [patientData, observationsData, conditionsData, medicationsData] = await Promise.all([
          patientAPI.getById(params.id),
          fhirAPI.getObservations(params.id).catch(() => ({ entry: [] })),
          fhirAPI.getConditions(params.id).catch(() => ({ entry: [] })),
          fhirAPI.getMedications(params.id).catch(() => ({ entry: [] })),
        ]);
        
        setPatient(patientData);
        setVitals(observationsData.entry || []);
        setConditions(conditionsData.entry || []);
        setMedications(medicationsData.entry || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch patient data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPatientData();
    }
  }, [params.id]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'medications', label: 'Medications' },
    { id: 'visits', label: 'Visits' },
    { id: 'labs', label: 'Lab Results' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'high':
      case 'borderline':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/patients"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-red-900 font-semibold mb-2">Error Loading Patient</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Patient not found
  if (!patient) {
    return (
      <div className="space-y-6">
        <Link
          href="/patients"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Link>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-900">Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/patients"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-cyan-600 font-bold text-2xl">
                  {patient.firstName?.[0]}
                  {patient.lastName?.[0]}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="mt-2 flex items-center space-x-4 text-cyan-50">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {patient.age} years old
                  </span>
                  <span>•</span>
                  <span className="font-mono">{patient.mrn}</span>
                  <span>•</span>
                  <span>{patient.bloodType}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors inline-flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors inline-flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export FHIR
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{patient.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{patient.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{patient.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {patient.allergies?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Allergies</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {patient.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vitals & Conditions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Vitals */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Vitals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patient.vitals?.map((vital, idx) => {
                  const Icon = vital.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        vital.status === 'high'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon
                          className={`h-5 w-5 ${
                            vital.status === 'high' ? 'text-red-600' : 'text-gray-400'
                          }`}
                        />
                        {vital.status === 'high' && (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{vital.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {vital.value}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {vital.unit}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Conditions</h2>
              <div className="space-y-3">
                {patient.conditions?.map((condition, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{condition.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Diagnosed: {new Date(condition.since).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {condition.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Visits */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits</h2>
              <div className="space-y-4">
                {patient.recentVisits?.map((visit, idx) => (
                  <div key={idx} className="border-l-4 border-cyan-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(visit.date).toLocaleDateString()}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-cyan-600">{visit.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Provider: {visit.provider}
                        </p>
                        <p className="text-sm text-gray-900 mt-2">{visit.reason}</p>
                        <p className="text-sm text-gray-500 mt-1">{visit.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Medications & Emergency Contact */}
          <div className="space-y-6">
            {/* Current Medications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-cyan-600" />
                Current Medications
              </h2>
              <div className="space-y-3">
                {patient.medications?.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-cyan-50 rounded-lg border border-cyan-100"
                  >
                    <h3 className="font-medium text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {med.dosage} - {med.frequency}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Since: {new Date(med.prescribedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Emergency Contact
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {patient.emergencyContact?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="text-sm font-medium text-gray-900">
                    {patient.emergencyContact?.relationship}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {patient.emergencyContact?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Schedule Appointment
                </button>
                <button className="w-full text-left px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Order Lab Tests
                </button>
                <button className="w-full text-left px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vitals' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vital Signs History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.vitals?.map((vital, idx) => {
              const Icon = vital.icon;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-cyan-600 mr-2" />
                      <h3 className="font-medium text-gray-900">{vital.label}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                      {vital.status}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {vital.value}
                    <span className="text-lg font-normal text-gray-500 ml-1">{vital.unit}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Last updated: Today</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Medication List</h2>
          <div className="space-y-4">
            {patient.medications?.map((med, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Dosage</p>
                        <p className="text-sm font-medium text-gray-900">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Frequency</p>
                        <p className="text-sm font-medium text-gray-900">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Prescribed</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(med.prescribedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-3 py-1 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Visit History</h2>
          <div className="space-y-6">
            {patient.recentVisits?.map((visit, idx) => (
              <div key={idx} className="border-l-4 border-cyan-500 bg-gray-50 rounded-r-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                        {visit.type}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        {new Date(visit.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{visit.reason}</h3>
                    <p className="text-sm text-gray-600 mb-2">Provider: {visit.provider}</p>
                    <p className="text-sm text-gray-700">{visit.notes}</p>
                  </div>
                  <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                    <FileText className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Laboratory Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.labResults?.map((lab, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lab.test}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lab.value} {lab.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lab.test === 'HbA1c' && '<5.7%'}
                      {lab.test === 'LDL Cholesterol' && '<100 mg/dL'}
                      {lab.test === 'HDL Cholesterol' && '>40 mg/dL'}
                      {lab.test === 'Triglycerides' && '<150 mg/dL'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lab.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                        {lab.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}