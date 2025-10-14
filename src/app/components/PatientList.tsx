'use client';

import { useEffect, useState } from 'react';
import { getPatients } from '@/lib/api';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-blue-600 text-lg">⏳ Loading patients...</div>;
  if (error) return <div className="text-center py-12 text-red-600 text-lg">❌ {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patients ({patients.length})</h2>
        <button
          onClick={fetchPatients}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          🔄 Refresh
        </button>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-8 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-lg">No patients found yet.</p>
          <p className="text-sm text-gray-500">Upload a CSV or add one manually to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-4 text-left font-semibold text-gray-700">ID</th>
                <th className="border p-4 text-left font-semibold text-gray-700">First Name</th>
                <th className="border p-4 text-left font-semibold text-gray-700">Last Name</th>
                <th className="border p-4 text-left font-semibold text-gray-700">Date of Birth</th>
                <th className="border p-4 text-left font-semibold text-gray-700">Gender</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, idx) => (
                <tr key={patient.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border p-4 text-gray-800 font-semibold">{patient.id}</td>
                  <td className="border p-4 text-gray-800">{patient.first_name}</td>
                  <td className="border p-4 text-gray-800">{patient.last_name}</td>
                  <td className="border p-4 text-gray-800">{patient.date_of_birth}</td>
                  <td className="border p-4 text-gray-800">{patient.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}