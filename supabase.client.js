// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== AUTH HELPERS ====================
export const authHelpers = {
  signUp: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: 'doctor'
          });

        if (profileError) throw profileError;
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ==================== PATIENT HELPERS ====================
export const patientHelpers = {
  getAll: async () => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          emergency_contacts(*),
          conditions(*),
          medications(*),
          vitals(*),
          lab_results(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get all patients error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          emergency_contacts(*),
          conditions(*),
          medications(*),
          vitals(*),
          lab_results(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get patient by ID error:', error);
      throw error;
    }
  },

  create: async (patientData) => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      // Generate MRN if not provided
      const mrn = patientData.mrn || `MRN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          user_id: user.id,
          mrn,
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          date_of_birth: patientData.dateOfBirth,
          gender: patientData.gender,
          phone: patientData.phone,
          email: patientData.email,
          address: patientData.address,
          blood_type: patientData.bloodType,
          status: patientData.status || 'active',
          risk_level: patientData.riskLevel || 'low',
          allergies: patientData.allergies || [],
          last_visit: patientData.lastVisit
        })
        .select()
        .single();

      if (error) throw error;

      // Add emergency contact if provided
      if (patientData.emergencyContact) {
        await emergencyContactHelpers.create(data.id, patientData.emergencyContact);
      }

      // Add conditions if provided
      if (patientData.conditions && patientData.conditions.length > 0) {
        for (const condition of patientData.conditions) {
          await conditionHelpers.create(data.id, condition);
        }
      }

      // Add medications if provided
      if (patientData.medications && patientData.medications.length > 0) {
        for (const medication of patientData.medications) {
          await medicationHelpers.create(data.id, medication);
        }
      }

      return data;
    } catch (error) {
      console.error('Create patient error:', error);
      throw error;
    }
  },

  update: async (id, patientData) => {
    try {
      const updateData = {
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        date_of_birth: patientData.dateOfBirth,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        blood_type: patientData.bloodType,
        status: patientData.status,
        risk_level: patientData.riskLevel,
        allergies: patientData.allergies,
        last_visit: patientData.lastVisit
      };

      const { data, error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  },

  search: async (searchTerm) => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,mrn.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Search patients error:', error);
      throw error;
    }
  }
};

// ==================== EMERGENCY CONTACT HELPERS ====================
export const emergencyContactHelpers = {
  create: async (patientId, contactData) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          patient_id: patientId,
          name: contactData.name,
          relationship: contactData.relationship,
          phone: contactData.phone
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create emergency contact error:', error);
      throw error;
    }
  },

  update: async (id, contactData) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(contactData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update emergency contact error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete emergency contact error:', error);
      throw error;
    }
  }
};

// ==================== CONDITION HELPERS ====================
export const conditionHelpers = {
  create: async (patientId, conditionData) => {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .insert({
          patient_id: patientId,
          name: conditionData.name,
          since: conditionData.since,
          status: conditionData.status || 'Active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create condition error:', error);
      throw error;
    }
  },

  update: async (id, conditionData) => {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .update(conditionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update condition error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('conditions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete condition error:', error);
      throw error;
    }
  }
};

// ==================== MEDICATION HELPERS ====================
export const medicationHelpers = {
  create: async (patientId, medicationData) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          patient_id: patientId,
          name: medicationData.name,
          dosage: medicationData.dosage,
          frequency: medicationData.frequency,
          prescribed_date: medicationData.prescribedDate
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create medication error:', error);
      throw error;
    }
  },

  update: async (id, medicationData) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .update(medicationData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update medication error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete medication error:', error);
      throw error;
    }
  }
};

// ==================== VITALS HELPERS ====================
export const vitalsHelpers = {
  getByPatientId: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get vitals error:', error);
      throw error;
    }
  },

  create: async (patientId, vitalData) => {
    try {
      const { data, error } = await supabase
        .from('vitals')
        .insert({
          patient_id: patientId,
          label: vitalData.label,
          value: vitalData.value,
          unit: vitalData.unit,
          icon: vitalData.icon || 'Activity',
          status: vitalData.status || 'normal',
          recorded_at: vitalData.recordedAt || new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create vital error:', error);
      throw error;
    }
  },

  bulkCreate: async (patientId, vitalsArray) => {
    try {
      const vitalsData = vitalsArray.map(vital => ({
        patient_id: patientId,
        label: vital.label,
        value: vital.value,
        unit: vital.unit,
        icon: vital.icon || 'Activity',
        status: vital.status || 'normal',
        recorded_at: vital.recordedAt || new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('vitals')
        .insert(vitalsData)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Bulk create vitals error:', error);
      throw error;
    }
  }
};

// ==================== VISIT HELPERS ====================
export const visitHelpers = {
  getByPatientId: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get visits error:', error);
      throw error;
    }
  },

  create: async (visitData) => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      const { data, error } = await supabase
        .from('visits')
        .insert({
          patient_id: visitData.patientId,
          user_id: user.id,
          visit_date: visitData.date || new Date().toISOString(),
          type: visitData.type,
          provider: visitData.provider,
          reason: visitData.reason,
          notes: visitData.notes
        })
        .select()
        .single();

      if (error) throw error;

      // Update patient's last_visit
      await supabase
        .from('patients')
        .update({ last_visit: data.visit_date })
        .eq('id', visitData.patientId);

      return data;
    } catch (error) {
      console.error('Create visit error:', error);
      throw error;
    }
  },

  update: async (id, visitData) => {
    try {
      const { data, error } = await supabase
        .from('visits')
        .update(visitData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update visit error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete visit error:', error);
      throw error;
    }
  }
};

// ==================== LAB RESULTS HELPERS ====================
export const labResultHelpers = {
  getByPatientId: async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select('*')
        .eq('patient_id', patientId)
        .order('test_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get lab results error:', error);
      throw error;
    }
  },

  create: async (patientId, labData) => {
    try {
      const { data, error } = await supabase
        .from('lab_results')
        .insert({
          patient_id: patientId,
          test: labData.test,
          value: labData.value,
          unit: labData.unit,
          test_date: labData.date,
          status: labData.status || 'normal'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create lab result error:', error);
      throw error;
    }
  },

  bulkCreate: async (patientId, labResultsArray) => {
    try {
      const labData = labResultsArray.map(lab => ({
        patient_id: patientId,
        test: lab.test,
        value: lab.value,
        unit: lab.unit,
        test_date: lab.date,
        status: lab.status || 'normal'
      }));

      const { data, error } = await supabase
        .from('lab_results')
        .insert(labData)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Bulk create lab results error:', error);
      throw error;
    }
  }
};

// ==================== ANALYTICS HELPERS ====================
export const analyticsHelpers = {
  get: async () => {
    try {
      const user = await authHelpers.getCurrentUser();

      // Get total patients count
      const { count: patientCount, error: patientError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (patientError) throw patientError;

      // Get total visits count
      const { count: visitCount, error: visitError } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (visitError) throw visitError;

      // Get critical cases (high risk patients)
      const { count: criticalCount, error: criticalError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('risk_level', 'high');

      if (criticalError) throw criticalError;

      // Get recent activity (last 10 visits)
      const { data: recentVisits, error: recentError } = await supabase
        .from('visits')
        .select(`
          *,
          patients(first_name, last_name)
        `)
        .eq('user_id', user.id)
        .order('visit_date', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      return {
        totalPatients: patientCount || 0,
        totalVisits: visitCount || 0,
        criticalCases: criticalCount || 0,
        recentActivity: recentVisits || []
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  },

  getPatientStats: async () => {
    try {
      const user = await authHelpers.getCurrentUser();

      // Get patients by status
      const { data: statusData, error: statusError } = await supabase
        .from('patients')
        .select('status')
        .eq('user_id', user.id);

      if (statusError) throw statusError;

      // Get patients by risk level
      const { data: riskData, error: riskError } = await supabase
        .from('patients')
        .select('risk_level')
        .eq('user_id', user.id);

      if (riskError) throw riskError;

      // Get patients by gender
      const { data: genderData, error: genderError } = await supabase
        .from('patients')
        .select('gender')
        .eq('user_id', user.id);

      if (genderError) throw genderError;

      return {
        byStatus: statusData,
        byRisk: riskData,
        byGender: genderData
      };
    } catch (error) {
      console.error('Get patient stats error:', error);
      throw error;
    }
  }
};

// ==================== USER PROFILE HELPERS ====================
export const userProfileHelpers = {
  get: async () => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  update: async (profileData) => {
    try {
      const user = await authHelpers.getCurrentUser();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profileData.fullName,
          role: profileData.role
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }
};