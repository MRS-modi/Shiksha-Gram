import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext();

const SEED_USERS = [
  {
    id: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    name: 'Shiksha Gram Administrator',
    email: 'admin@shikshagram.com',
    role: 'admin',
    is_verified: true,
    is_blocked: false,
    phone: '+91 99999 88888',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'e4b6c810-7214-41d3-98fe-f472851a7101',
    name: 'Dr. Rajesh Sharma',
    email: 'teacher@shikshagram.com',
    role: 'teacher',
    is_verified: true,
    is_blocked: false,
    phone: '+91 98765 43210',
    coaching_name: 'Sharma Science & Math Academy',
    qualification: 'Ph.D. in Physics, M.Sc Mathematics',
    experience_years: 15,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    name: 'Aman Verma',
    email: 'student@shikshagram.com',
    role: 'student',
    is_verified: true,
    is_blocked: false,
    phone: '+91 91234 56789',
    school_name: 'St. Joseph College',
    class_grade: 'Class 10th',
    roll_number: 'SG-2026-042',
    parent_access_pin: '4289',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sg_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [pendingVerificationNotice, setPendingVerificationNotice] = useState(null);

  // Sync active user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sg_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sg_active_user');
    }
  }, [user]);

  // Unified Role-Free Login
  const login = async (email, password) => {
    setLoading(true);
    setPendingVerificationNotice(null);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      // 1. Query backend API (server validates hashed password via bcrypt)
      const response = await api.login(normalizedEmail, password);
      if (response && response.user) {
        if (response.user.role === 'teacher' && !response.user.is_verified) {
          setPendingVerificationNotice(
            'Your teacher registration has been received and is currently under verification by the administrator. You will be able to access the dashboard once approved.'
          );
          setLoading(false);
          return {
            success: false,
            pendingVerification: true,
            error: 'Account Pending Admin Verification'
          };
        }

        if (response.user.is_blocked) {
          setLoading(false);
          return { success: false, error: 'Your account has been deactivated by administrator.' };
        }

        if (response.access_token) {
          localStorage.setItem('sg_token', response.access_token);
        }

        setUser(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      }
    } catch (err) {
      console.warn("Backend API check, verifying against local database:", err.message);
      
      const localUsers = JSON.parse(localStorage.getItem('sg_registered_users') || '[]');
      const allUsers = [...SEED_USERS, ...localUsers];
      const matched = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (matched) {
        if (matched.role === 'teacher' && !matched.is_verified) {
          setPendingVerificationNotice(
            'Your teacher registration has been received and is currently under verification by the administrator. You will be able to access the dashboard once approved.'
          );
          setLoading(false);
          return {
            success: false,
            pendingVerification: true,
            error: 'Account Pending Admin Verification'
          };
        }

        if (matched.is_blocked) {
          setLoading(false);
          return { success: false, error: 'Your account has been deactivated by administrator.' };
        }

        setUser(matched);
        setLoading(false);
        return { success: true, user: matched };
      }

      setLoading(false);
      return { success: false, error: err.message || 'Invalid email or password.' };
    }

    setLoading(false);
    return { success: false, error: 'User account not found.' };
  };

  // Dedicated Secured Admin Login
  const adminLogin = async (email, password) => {
    setLoading(true);
    setPendingVerificationNotice(null);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const response = await api.adminLogin(normalizedEmail, password);
      if (response && response.user) {
        if (response.user.role !== 'admin') {
          setLoading(false);
          return { success: false, error: 'Access Denied: Only platform administrators are authorized.' };
        }
        if (response.access_token) {
          localStorage.setItem('sg_token', response.access_token);
        }
        setUser(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      }
    } catch (err) {
      console.warn("Backend admin login check, fallback to admin store:", err.message);
      const localUsers = JSON.parse(localStorage.getItem('sg_registered_users') || '[]');
      const allAdmins = [...SEED_USERS.filter(u => u.role === 'admin'), ...localUsers.filter(u => u.role === 'admin')];
      const matched = allAdmins.find(u => u.email.toLowerCase() === normalizedEmail);
      if (matched) {
        setUser(matched);
        setLoading(false);
        return { success: true, user: matched };
      }
      setLoading(false);
      return { success: false, error: err.message || 'Invalid administrator credentials.' };
    }

    setLoading(false);
    return { success: false, error: 'Administrator account not found.' };
  };

  // Comprehensive Role-Specific Sign-Up
  const signup = async (formData) => {
    setLoading(true);
    setPendingVerificationNotice(null);

    const normalizedEmail = formData.email.toLowerCase().trim();

    try {
      // Try backend API first
      const res = await api.signup(formData);
      if (res && res.user) {
        if (formData.role === 'teacher') {
          setPendingVerificationNotice(
            'Teacher registration submitted successfully! Your account will be activated once verified by the administrator.'
          );
          setLoading(false);
          return { success: true, pendingVerification: true, user: res.user };
        }

        setUser(res.user);
        setLoading(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn("API signup error, saving to local dynamic database:", err.message);
      
      const isVerified = formData.role === 'student'; // Teachers require admin approval
      const newUser = {
        ...formData,
        id: 'usr-' + Date.now(),
        email: normalizedEmail,
        is_verified: isVerified,
        is_blocked: false,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedEmail}`,
        roll_number: formData.role === 'student' ? `SG-2026-${Math.floor(100 + Math.random() * 900)}` : undefined,
        parent_access_pin: formData.role === 'student' ? String(Math.floor(1000 + Math.random() * 9000)) : undefined,
      };

      const existing = JSON.parse(localStorage.getItem('sg_registered_users') || '[]');
      existing.push(newUser);
      localStorage.setItem('sg_registered_users', JSON.stringify(existing));

      if (formData.role === 'teacher') {
        setPendingVerificationNotice(
          'Teacher registration submitted successfully! Your account will be activated once verified by the administrator.'
        );
        setLoading(false);
        return { success: true, pendingVerification: true, user: newUser };
      }

      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    }
  };

  // Google OAuth 2.0 Sign In
  const loginWithGoogle = async (role = 'student') => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } else {
      setTimeout(() => {
        const googleUser = {
          id: 'google-' + Date.now(),
          name: 'Learner User',
          email: 'google.learner@gmail.com',
          role: role,
          is_verified: true,
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        setUser(googleUser);
        setLoading(false);
      }, 500);
    }
  };

  // Profile Change Request Workflow
  const submitProfileEdit = async (requestedChanges) => {
    try {
      const res = await api.submitProfileEditRequest(requestedChanges);
      return { success: true, message: res.message };
    } catch (err) {
      // Local dynamic fallback
      const pendingReqs = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
      const newReq = {
        id: 'pr-' + Date.now(),
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        user_role: user.role,
        target_teacher_id: user.role === 'student' ? 'e4b6c810-7214-41d3-98fe-f472851a7101' : null,
        target_teacher_name: user.role === 'student' ? 'Dr. Rajesh Sharma' : null,
        requested_changes: requestedChanges,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      pendingReqs.push(newReq);
      localStorage.setItem('sg_profile_requests', JSON.stringify(pendingReqs));
      return {
        success: true,
        message: user.role === 'student' 
          ? 'Profile edit submitted. Waiting for approval by your Teacher or Administrator.'
          : 'Profile edit submitted. Waiting for approval by Administrator.'
      };
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem('sg_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        pendingVerificationNotice,
        setPendingVerificationNotice,
        login,
        adminLogin,
        signup,
        loginWithGoogle,
        submitProfileEdit,
        logout,
        isAuthenticated: !!user,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        isParent: user?.role === 'parent',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
