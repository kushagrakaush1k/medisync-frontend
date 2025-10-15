const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
const FHIR_BASE_URL = process.env.NEXT_PUBLIC_FHIR_BASE_URL || 'http://localhost:3001/fhir';

// Generic fetch wrapper with error handling
async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage (only in browser)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

// Patient API
export const patientAPI = {
  getAll: () => apiRequest('/patients'),
  getById: (id) => apiRequest(`/patients/${id}`),
  create: (data) => apiRequest('/patients', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  update: (id, data) => apiRequest(`/patients/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (id) => apiRequest(`/patients/${id}`, { 
    method: 'DELETE' 
  }),
  search: (query) => apiRequest(`/patients/search?q=${encodeURIComponent(query)}`),
};

// FHIR API
export const fhirAPI = {
  getPatient: (id) => apiRequest(`${FHIR_BASE_URL}/Patient/${id}`),
  getObservations: (patientId) => apiRequest(`${FHIR_BASE_URL}/Observation?patient=${patientId}`),
  getConditions: (patientId) => apiRequest(`${FHIR_BASE_URL}/Condition?patient=${patientId}`),
  getMedications: (patientId) => apiRequest(`${FHIR_BASE_URL}/MedicationRequest?patient=${patientId}`),
  getEncounters: (patientId) => apiRequest(`${FHIR_BASE_URL}/Encounter?patient=${patientId}`),
  exportBundle: (resourceTypes, dateRange) => 
    apiRequest(`${FHIR_BASE_URL}/$export`, {
      method: 'POST',
      body: JSON.stringify({ resourceTypes, dateRange }),
    }),
};

// Analytics API
export const analyticsAPI = {
  getPopulationMetrics: () => apiRequest('/analytics/population'),
  getTopConditions: () => apiRequest('/analytics/conditions'),
  getRiskStratification: () => apiRequest('/analytics/risk-stratification'),
  getAgeDistribution: () => apiRequest('/analytics/age-distribution'),
  getTrends: (timeRange = '30d') => apiRequest(`/analytics/trends?range=${timeRange}`),
};

// AI Assistant API
export const aiAPI = {
  chat: (message, conversationId = null) => 
    apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    }),
  assessRisk: (patientId) => 
    apiRequest('/ai/risk-assessment', {
      method: 'POST',
      body: JSON.stringify({ patientId }),
    }),
  generateSummary: (patientId) =>
    apiRequest('/ai/clinical-summary', {
      method: 'POST',
      body: JSON.stringify({ patientId }),
    }),
  getTreatmentRecommendations: (condition) =>
    apiRequest('/ai/treatment-guidelines', {
      method: 'POST',
      body: JSON.stringify({ condition }),
    }),
};

export default {
  patientAPI,
  fhirAPI,
  analyticsAPI,
  aiAPI,
};