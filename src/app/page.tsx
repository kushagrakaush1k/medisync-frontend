'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getPatientCount } from '@/lib/api';

export default function Home() {
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getPatientCount();
        setPatientCount(data.total_patients);
      } catch (err) {
        console.error('Failed to fetch patient count');
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-12 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-3">Welcome to MediSync</h2>
        <p className="text-lg text-blue-100">
          A modern healthcare patient management system built with Next.js and FastAPI.
          Manage your patients efficiently and securely.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 shadow">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {loading ? '...' : patientCount}
          </div>
          <p className="text-gray-600 font-semibold">Total Patients</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 shadow">
          <div className="text-4xl font-bold text-green-600 mb-2">✅</div>
          <p className="text-gray-600 font-semibold">System Status</p>
          <p className="text-sm text-gray-500">All systems operational</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500 shadow">
          <div className="text-4xl font-bold text-purple-600 mb-2">🚀</div>
          <p className="text-gray-600 font-semibold">Version</p>
          <p className="text-sm text-gray-500">Production Ready</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/patients"
          className="group bg-blue-50 p-8 rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
        >
          <h3 className="text-2xl font-bold text-blue-700 mb-2 group-hover:text-blue-800">
            👥 Manage Patients
          </h3>
          <p className="text-gray-600 mb-4">
            View, search, and manage patient information efficiently
          </p>
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
            Go to Patients →
          </span>
        </Link>

        <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-700 mb-2">📊 Upload Data</h3>
          <p className="text-gray-600 mb-4">
            Bulk upload patient data using CSV files for quick data entry
          </p>
          <Link
            href="/patients?tab=upload"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Upload CSV →
          </Link>
        </div>

        <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">➕ Add Patient</h3>
          <p className="text-gray-600 mb-4">
            Create new patient records with detailed demographic information
          </p>
          <Link
            href="/patients?tab=add"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add New Patient →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">✨ Key Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Patient Management</p>
              <p className="text-sm text-gray-600">View all patients in a clean table format</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Add Individual Records</p>
              <p className="text-sm text-gray-600">Create single patient records with validation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Bulk CSV Upload</p>
              <p className="text-sm text-gray-600">Upload multiple patients at once</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Real-time Sync</p>
              <p className="text-sm text-gray-600">Live data synchronization with backend</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Responsive Design</p>
              <p className="text-sm text-gray-600">Works on desktop, tablet, and mobile</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Production Ready</p>
              <p className="text-sm text-gray-600">Deployed and tested on cloud infrastructure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-indigo-50 p-8 rounded-lg border border-indigo-200 shadow">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">🛠️ Technology Stack</h3>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-bold text-indigo-700">Frontend</p>
            <p className="text-sm text-gray-600">Next.js + TypeScript</p>
          </div>
          <div>
            <p className="font-bold text-indigo-700">Backend</p>
            <p className="text-sm text-gray-600">FastAPI + Python</p>
          </div>
          <div>
            <p className="font-bold text-indigo-700">Database</p>
            <p className="text-sm text-gray-600">PostgreSQL</p>
          </div>
          <div>
            <p className="font-bold text-indigo-700">Hosting</p>
            <p className="text-sm text-gray-600">Vercel + Render</p>
          </div>
        </div>
      </div>
    </div>
  );
}