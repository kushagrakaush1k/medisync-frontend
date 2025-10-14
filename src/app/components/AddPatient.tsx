'use client';

import { useState } from 'react';
import { createPatient } from '@/lib/api';

interface AddPatientProps {
  onPatientAdded?: () => void;
}

interface FormData {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
}

export default function AddPatient({ onPatientAdded }: AddPatientProps) {
  const [formData, setFormData] = useState<FormData>({
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.patient_id || !formData.first_name || !formData.last_name || !formData.date_of_birth) {
      setMessage('All fields are required');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      await createPatient(formData);
      
      setMessage('Patient added successfully!');
      setMessageType('success');
      
      setFormData({
        patient_id: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'M',
      });

      if (onPatientAdded) {
        setTimeout(onPatientAdded, 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add patient';
      setMessage(`Error: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Patient</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Patient ID:</label>
          <input
            type="text"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            placeholder="e.g., P001"
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Doe"
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
        >
          {loading ? 'Adding...' : 'Add Patient'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-4 rounded ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}