// frontend/src/hooks/usePatients.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all patients
  const fetchPatients = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('patients')
        .select(`
          *,
          vitals(*),
          conditions(*),
          medications(*),
          visits(*),
          lab_results(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.riskLevel) {
        query = query.eq('risk_level', filters.riskLevel);
      }
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,mrn.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPatients(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get single patient by ID
  const getPatient = async (patientId) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select(`
          *,
          vitals(*),
          conditions(*),
          medications(*),
          visits(*),
          lab_results(*),
          emergency_contacts(*)
        `)
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new patient
  const createPatient = async (patientData) => {
    try {
      setLoading(true);
      setError(null);

      // Generate MRN if not provided
      if (!patientData.mrn) {
        patientData.mrn = `MRN${Date.now()}`;
      }

      // Calculate age from date of birth
      if (patientData.date_of_birth) {
        const birthDate = new Date(patientData.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        patientData.age = age;
      }

      const { data, error: insertError } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add to local state
      setPatients(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Error creating patient:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update patient
  const updatePatient = async (patientId, updates) => {
    try {
      setLoading(true);
      setError(null);

      // Recalculate age if date of birth is updated
      if (updates.date_of_birth) {
        const birthDate = new Date(updates.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        updates.age = age;
      }

      const { data, error: updateError } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state
      setPatients(prev => prev.map(p => p.id === patientId ? data : p));
      return { success: true, data };
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete patient
  const deletePatient = async (patientId) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (deleteError) throw deleteError;

      // Remove from local state
      setPatients(prev => prev.filter(p => p.id !== patientId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add vital signs
  const addVitals = async (patientId, vitalsData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('vitals')
        .insert([{ ...vitalsData, patient_id: patientId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, data };
    } catch (err) {
      console.error('Error adding vitals:', err);
      return { success: false, error: err.message };
    }
  };

  // Add medication
  const addMedication = async (patientId, medicationData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('medications')
        .insert([{ ...medicationData, patient_id: patientId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, data };
    } catch (err) {
      console.error('Error adding medication:', err);
      return { success: false, error: err.message };
    }
  };

  // Add condition
  const addCondition = async (patientId, conditionData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('conditions')
        .insert([{ ...conditionData, patient_id: patientId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, data };
    } catch (err) {
      console.error('Error adding condition:', err);
      return { success: false, error: err.message };
    }
  };

  // Add visit
  const addVisit = async (patientId, visitData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('visits')
        .insert([{ ...visitData, patient_id: patientId }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update last_visit on patient
      await supabase
        .from('patients')
        .update({ last_visit: visitData.date })
        .eq('id', patientId);

      return { success: true, data };
    } catch (err) {
      console.error('Error adding visit:', err);
      return { success: false, error: err.message };
    }
  };

  // Add lab result
  const addLabResult = async (patientId, labResultData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('lab_results')
        .insert([{ ...labResultData, patient_id: patientId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, data };
    } catch (err) {
      console.error('Error adding lab result:', err);
      return { success: false, error: err.message };
    }
  };

  // Get patient statistics
  const getPatientStats = async () => {
    try {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_patient_statistics');

      if (statsError) throw statsError;
      return stats;
    } catch (err) {
      console.error('Error fetching patient stats:', err);
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    addVitals,
    addMedication,
    addCondition,
    addVisit,
    addLabResult,
    getPatientStats
  };
};