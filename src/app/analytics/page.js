'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/services/api';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  AlertTriangle,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        const [metricsData, conditionsData, riskDataRes, ageData] = await Promise.all([
          analyticsAPI.getPopulationMetrics().catch(() => []),
          analyticsAPI.getTopConditions().catch(() => []),
          analyticsAPI.getRiskStratification().catch(() => []),
          analyticsAPI.getAgeDistribution().catch(() => []),
        ]);

        setMetrics(metricsData);
        setConditions(conditionsData);
        setRiskData(riskDataRes);
        setAgeDistribution(ageData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Population Health Analytics</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-red-900 font-semibold mb-2">Error Loading Analytics</h3>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Population Health Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive insights into patient population and health trends
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className="mt-1 text-xs text-gray-500">from last period</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Conditions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Chronic Conditions</h2>
          <div className="space-y-4">
            {conditions.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.condition}</span>
                  <span className="text-sm text-gray-600">{item.count?.toLocaleString()} patients</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-right">
                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Stratification */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Stratification</h2>
          <div className="space-y-6">
            {riskData.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.level}</span>
                    <span className="text-sm text-gray-600">{item.count?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right min-w-[60px]">
                  <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Clinical Insight:</strong> {riskData.find(r => r.level === 'High Risk')?.percentage || 0}% of patients are in the high-risk category,
              requiring enhanced monitoring and intervention strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Age & Gender Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Age & Gender Distribution</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Range</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Male</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Female</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ageDistribution.map((item, idx) => {
                const total = (item.male || 0) + (item.female || 0);
                const totalPatients = ageDistribution.reduce((sum, row) => sum + (row.male || 0) + (row.female || 0), 0);
                const percentage = totalPatients > 0 ? ((total / totalPatients) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.range}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center">
                        <div className="w-16 h-2 bg-blue-200 rounded-full mr-2">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${total > 0 ? ((item.male || 0) / total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{item.male || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center">
                        <div className="w-16 h-2 bg-pink-200 rounded-full mr-2">
                          <div
                            className="h-2 bg-pink-600 rounded-full"
                            style={{ width: `${total > 0 ? ((item.female || 0) / total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{item.female || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                      {total}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-6 text-white">
          <Calendar className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Average Visit Frequency</h3>
          <p className="text-3xl font-bold mb-2">3.2</p>
          <p className="text-sm opacity-90">visits per patient per year</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <Heart className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Care Plan Adherence</h3>
          <p className="text-3xl font-bold mb-2">78%</p>
          <p className="text-sm opacity-90">patients following care plans</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <Activity className="h-8 w-8 mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">Preventive Care Rate</h3>
          <p className="text-3xl font-bold mb-2">85%</p>
          <p className="text-sm opacity-90">eligible patients screened</p>
        </div>
      </div>
    </div>
  );
}