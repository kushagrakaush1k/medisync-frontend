import axios from 'axios';

// Get backend URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define Patient type
interface PatientData {
  patient_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
}

// Patient endpoints
export const getPatients = async (skip = 0, limit = 100) => {
  const response = await api.get('/patients/', {
    params: { skip, limit },
  });
  return response.data;
};

export const getPatient = async (patientId: string) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

export const createPatient = async (patientData: PatientData) => {
  // Transform the data to match backend schema
  const backendData = {
    id: patientData.patient_id, // Backend expects 'id', not 'patient_id'
    first_name: patientData.first_name,
    last_name: patientData.last_name,
    date_of_birth: patientData.date_of_birth,
    gender: patientData.gender.toLowerCase(), // Convert 'M' to 'm', 'F' to 'f', etc.
  };
  
  const response = await api.post('/patients/', backendData);
  return response.data;
};

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/patients/upload/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPatientCount = async () => {
  const response = await api.get('/stats/patient-count');
  return response.data;
};

export default api;