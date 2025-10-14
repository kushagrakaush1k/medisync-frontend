'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PatientList from '../components/PatientList';
import AddPatient from '../components/AddPatient';
import UploadCSV from '../components/UploadCSV';

export default function PatientsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'upload'>(
    (tabParam as 'list' | 'add' | 'upload') || 'list'
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
        <Link
          href="/"
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 rounded-lg font-semibold transition shadow ${
            activeTab === 'list'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📋 Patient List
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 rounded-lg font-semibold transition shadow ${
            activeTab === 'add'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ➕ Add Patient
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-6 py-3 rounded-lg font-semibold transition shadow ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📤 Upload CSV
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        {activeTab === 'list' && <PatientList key={refreshKey} />}
        {activeTab === 'add' && <AddPatient onPatientAdded={handleRefresh} />}
        {activeTab === 'upload' && <UploadCSV onUploadSuccess={handleRefresh} />}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}