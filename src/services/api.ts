const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call handler
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  blood_type: string;
  allergies: string[];
  conditions: string[];
  visit_count?: number;
  visits?: Visit[];
}

export interface Visit {
  id: number;
  patient_id: number;
  visit_date: string;
  reason: string;
  diagnosis: string;
  prescription: any[];
  notes: string;
  vitals: any;
}

export interface Analytics {
  totalPatients: number;
  totalVisits: number;
  criticalCases: number;
  recentActivity: any[];
}

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (email: string, password: string, fullName: string) =>
    apiCall<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    }),

  me: () => apiCall<User>('/auth/me')
};

// Patient APIs
export const patientAPI = {
  getAll: () => apiCall<Patient[]>('/patients'),

  getById: (id: string | number) => apiCall<Patient>(`/patients/${id}`),

  create: (patientData: Partial<Patient>) =>
    apiCall<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData)
    }),

  update: (id: string | number, patientData: Partial<Patient>) =>
    apiCall<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData)
    }),

  delete: (id: string | number) =>
    apiCall(`/patients/${id}`, {
      method: 'DELETE'
    })
};

// AI Assistant APIs
export const aiAPI = {
  chat: (message: string, patientId?: number | null) =>
    apiCall<{ response: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, patientId })
    })
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => apiCall<Analytics>('/analytics')
};

export default {
  auth: authAPI,
  patient: patientAPI,
  ai: aiAPI,
  analytics: analyticsAPI
};