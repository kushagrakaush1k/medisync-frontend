'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Activity, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  Heart,
  Pill,
  Calendar
} from 'lucide-react';

export default function HomePage() {
  const [stats] = useState({
    totalPatients: 12458,
    activePatients: 8932,
    highRiskPatients: 342,
    recentEncounters: 1284,
  });

  const quickActions = [
    {
      title: 'View Patients',
      description: 'Access patient records and clinical data',
      icon: Users,
      href: '/patients',
      color: 'bg-blue-500',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Population health metrics and insights',
      icon: TrendingUp,
      href: '/analytics',
      color: 'bg-green-500',
    },
    {
      title: 'AI Assistant',
      description: 'Clinical decision support and risk assessment',
      icon: Activity,
      href: '/ai-assistant',
      color: 'bg-purple-500',
    },
    {
      title: 'FHIR Export',
      description: 'Export data in FHIR R4 format',
      icon: FileText,
      href: '/admin',
      color: 'bg-orange-500',
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      patient: 'Johnson, Mary',
      message: 'Critical lab value: Glucose 245 mg/dL',
      severity: 'high',
      time: '5 minutes ago',
    },
    {
      id: 2,
      patient: 'Smith, John',
      message: 'Medication refill due in 3 days',
      severity: 'medium',
      time: '1 hour ago',
    },
    {
      id: 3,
      patient: 'Davis, Sarah',
      message: 'Overdue for annual wellness visit',
      severity: 'low',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MediSync</h1>
              <p className="text-sm text-gray-500 mt-1">Enterprise Healthcare Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-secondary">
                Settings
              </button>
              <button className="btn btn-primary">
                New Patient
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalPatients.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">↑ 12% from last month</p>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.activePatients.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">71.7% of total</p>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.highRiskPatients.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Requires attention</p>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Encounters (30d)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.recentEncounters.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">↑ 8% from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="card card-hover cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 ${action.color} rounded-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-4">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Alerts</h2>
            <div className="card">
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`badge ${
                          alert.severity === 'high'
                            ? 'badge-danger'
                            : alert.severity === 'medium'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{alert.patient}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary-600 font-medium hover:text-primary-700">
                View All Alerts →
              </button>
            </div>
          </div>
        </div>

        {/* Feature Banner */}
        <div className="mt-8 card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">FHIR R4 Compliant</h3>
              <p className="text-blue-100">
                Full interoperability with industry-standard healthcare data formats
              </p>
            </div>
            <Link href="/admin" className="btn bg-white text-blue-600 hover:bg-blue-50">
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}