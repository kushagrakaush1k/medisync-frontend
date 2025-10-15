/**
 * API Client with Authentication & Error Handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden:', message);
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error('API Error:', message);
      }

      return Promise.reject({
        status,
        message,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
      });
    }
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create singleton instance
const api = new APIClient();

// Export API methods
export const apiClient = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  getCurrentUser: () => api.get('/auth/me'),

  // Patients
  getPatients: (params?: any) => api.get('/patients', { params }),
  
  getPatientById: (id: string) => api.get(`/patients/${id}`),
  
  createPatient: (data: any) => api.post('/patients', data),
  
  updatePatient: (id: string, data: any) => api.put(`/patients/${id}`, data),
  
  deletePatient: (id: string) => api.delete(`/patients/${id}`),

  // Patient Clinical Data
  getPatientVitals: (patientId: string, params?: any) =>
    api.get(`/patients/${patientId}/vitals`, { params }),
  
  addVitalSign: (patientId: string, data: any) =>
    api.post(`/patients/${patientId}/vitals`, data),

  getPatientMedications: (patientId: string) =>
    api.get(`/patients/${patientId}/medications`),
  
  addMedication: (patientId: string, data: any) =>
    api.post(`/patients/${patientId}/medications`, data),

  getPatientConditions: (patientId: string) =>
    api.get(`/patients/${patientId}/conditions`),
  
  addCondition: (patientId: string, data: any) =>
    api.post(`/patients/${patientId}/conditions`, data),

  getPatientEncounters: (patientId: string) =>
    api.get(`/patients/${patientId}/encounters`),
  
  addEncounter: (patientId: string, data: any) =>
    api.post(`/patients/${patientId}/encounters`, data),

  getPatientLabResults: (patientId: string) =>
    api.get(`/patients/${patientId}/lab-results`),

  // Analytics
  getPopulationMetrics: (filters?: any) =>
    api.get('/analytics/population', { params: filters }),
  
  getCohortAnalysis: (cohortId: string) =>
    api.get(`/analytics/cohorts/${cohortId}`),
  
  getQualityMetrics: () => api.get('/analytics/quality'),
  
  getUtilizationTrends: (params?: any) =>
    api.get('/analytics/utilization', { params }),

  // AI Assistant
  getRiskAssessment: (patientId: string) =>
    api.get(`/ai/risk-assessment/${patientId}`),
  
  getDiagnosisSuggestions: (symptoms: string[]) =>
    api.post('/ai/diagnosis', { symptoms }),
  
  getTreatmentRecommendations: (patientId: string, conditionId: string) =>
    api.post('/ai/treatment', { patientId, conditionId }),

  // FHIR Operations
  exportPatientFHIR: (patientId: string) =>
    api.get(`/fhir/Patient/${patientId}/$export`),
  
  bulkExportFHIR: (params?: any) =>
    api.get('/fhir/$export', { params }),

  // CSV Import
  importCSV: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Audit Logs
  getAuditLogs: (params?: any) =>
    api.get('/audit/logs', { params }),
};

export default api;