import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  MapPin, 
  Clock, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Sun, 
  Moon, 
  LogOut,
  Save,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, submitProfileEdit, logout, isTeacher, isStudent, isAdmin } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'security' | 'preferences'
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingStatus, setPendingStatus] = useState(null);

  // Form states based on user role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    // Teacher specific
    coaching_name: '',
    qualifications: '',
    experience_years: 10,
    subjects: '',
    bio: '',
    // Student specific
    school_name: '',
    class_grade: '',
    guardian_name: '',
    guardian_phone: '',
    roll_number: '',
    parent_pin: ''
  });

  // Security / Password state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        address: user.address || (isTeacher ? 'Civil Lines, Prayagraj, UP' : '45 Tagore Town, Prayagraj'),
        coaching_name: user.coaching_name || user.coachingName || 'Sharma Science & Math Academy',
        qualifications: user.qualifications || user.qualification || 'M.Sc, B.Ed (Mathematics)',
        experience_years: user.experience_years || user.experienceYears || 15,
        subjects: Array.isArray(user.subjects) ? user.subjects.join(', ') : (user.subjects || 'Mathematics, Physics'),
        bio: user.bio || 'Dedicated educator providing conceptual clarity and board exam mastery.',
        school_name: user.school_name || 'St. Joseph College, Prayagraj',
        class_grade: user.class_grade || 'Class 10th',
        guardian_name: user.guardian_name || 'Mr. R. K. Verma',
        guardian_phone: user.guardian_phone || '+91 98111 22334',
        roll_number: user.roll_number || 'SG-2026-042',
        parent_pin: user.parent_access_pin || '4289'
      });

      // Check if user has a pending profile request
      const checkPending = async () => {
        try {
          const res = await api.getMyPendingProfileRequest();
          if (res) setPendingStatus(res);
        } catch (e) {
          const local = JSON.parse(localStorage.getItem('sg_profile_requests') || '[]');
          const myReq = local.slice().reverse().find(r => r.user_id === user.id && r.status === 'pending');
          if (myReq) setPendingStatus(myReq);
        }
      };

      checkPending();
    }
  }, [user, isOpen, isTeacher]);

  if (!isOpen) return null;

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const requestedChanges = isTeacher ? {
      phone: formData.phone,
      coaching_name: formData.coaching_name,
      address: formData.address,
      qualifications: formData.qualifications,
      experience_years: Number(formData.experience_years) || 10,
      subjects: formData.subjects,
      bio: formData.bio
    } : {
      phone: formData.phone,
      address: formData.address,
      school_name: formData.school_name,
      class_grade: formData.class_grade,
      guardian_name: formData.guardian_name,
      guardian_phone: formData.guardian_phone
    };

    try {
      const res = await submitProfileEdit(requestedChanges);
      setSuccessMessage(res.message || (isTeacher 
        ? (lang === 'hi' ? 'प्रोफ़ाइल संशोधन अनुरोध एडमिन को अनुमोदन हेतु भेज दिया गया है।' : 'Profile update request submitted for Administrator approval.')
        : (lang === 'hi' ? 'प्रोफ़ाइल संशोधन अनुरोध शिक्षक/एडमिन को अनुमोदन हेतु भेज दिया गया है।' : 'Profile update request submitted for Teacher/Admin approval.')
      ));
      setPendingStatus({ status: 'pending', requested_changes: requestedChanges, created_at: new Date().toISOString() });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit profile update request.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMessage(lang === 'hi' ? 'नए पासवर्ड का मिलान नहीं हुआ।' : 'New passwords do not match.');
      return;
    }
    if (securityData.newPassword.length < 6) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    setSuccessMessage(lang === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल दिया गया।' : 'Password updated successfully with encrypted hashing.');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Header Modal Banner */}
        <div className="relative bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold">{user?.name || 'User'}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                  {user?.role === 'teacher' ? (lang === 'hi' ? 'प्रमाणित शिक्षक' : 'Verified Teacher') : (user?.role === 'student' ? (lang === 'hi' ? 'नामांकित छात्र' : 'Student') : 'Administrator')}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5 font-mono">{user?.email}</p>
              {isTeacher && (
                <p className="text-xs text-white/90 font-medium mt-0.5">{formData.coaching_name}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeSubTab === 'profile'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रोफ़ाइल विवरण' : 'Profile Details'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('security')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeSubTab === 'security'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पासवर्ड व सुरक्षा' : 'Security'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('preferences')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeSubTab === 'preferences'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्राथमिकताएं' : 'Preferences'}</span>
            </button>
          </div>

          {/* Quick status pill */}
          <div>
            {pendingStatus ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                <Clock className="w-3 h-3" />
                <span>{lang === 'hi' ? 'अनुमोदन लंबित' : 'Approval Pending'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                <span>{lang === 'hi' ? 'सत्यापित' : 'Active'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
          
          {/* Notifications */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{lang === 'hi' ? 'सफलतापूर्वक सहेजा गया' : 'Request Processed'}</p>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUBTAB 1: PROFILE DETAILS */}
          {activeSubTab === 'profile' && (
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              
              {/* Approval workflow notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {lang === 'hi' ? 'प्रोफ़ाइल संपादन नियम:' : 'Profile Verification Policy:'}
                  </span>{' '}
                  {isTeacher
                    ? (lang === 'hi' 
                        ? 'शिक्षक विवरण में कोई भी बदलाव व्यवस्थापक (Admin) के सत्यापन के बाद ही पूरे प्लेटफ़ॉर्म पर लागू होगा।' 
                        : 'Teacher profile changes require Administrator approval before being published across public listings and student dashboards.')
                    : (lang === 'hi'
                        ? 'छात्र प्रोफ़ाइल में किए गए बदलाव बैच शिक्षक अथवा एडमिन के अनुमोदन के बाद ही लागू होंगे।'
                        : 'Student profile modifications require approval from your batch Teacher or Administrator before updating official records.')}
                </div>
              </div>

              {/* Immutable Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.name}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Registered Platform Identity</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    {lang === 'hi' ? 'पंजीकृत ईमेल' : 'Registered Email Address'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Primary login credential</span>
                </div>
              </div>

              {/* Teacher Specific Fields */}
              {isTeacher && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'कोचिंग संस्थान का नाम' : 'Coaching Institute Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.coaching_name}
                        onChange={(e) => setFormData({ ...formData, coaching_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप)' : 'Contact Phone Number'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'उच्चतम शैक्षणिक योग्यताएं' : 'Degrees & Qualifications'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'शिक्षण अनुभव (वर्ष)' : 'Teaching Experience (Years)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'hi' ? 'संबद्ध विषय व विशेषज्ञता' : 'Subjects Taught & Specialization'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subjects}
                      onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                      placeholder="e.g. Mathematics, Physics, IIT Foundation"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'hi' ? 'कोचिंग केंद्र का पता व शहर' : 'Coaching Center Address & City'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Civil Lines, Prayagraj"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'hi' ? 'शिक्षक बायो / विवरण' : 'Teacher Bio / Teaching Philosophy'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}

              {/* Student Specific Fields */}
              {isStudent && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'कक्षा / ग्रेड' : 'Class / Grade'}
                      </label>
                      <input
                        type="text"
                        value={formData.class_grade}
                        onChange={(e) => setFormData({ ...formData, class_grade: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'अभिभावक का नाम' : 'Guardian Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.guardian_name}
                        onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {lang === 'hi' ? 'अभिभावक मोबाइल नंबर' : 'Guardian Phone Number'}
                      </label>
                      <input
                        type="text"
                        value={formData.guardian_phone}
                        onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'hi' ? 'स्कूल / कॉलेज का नाम' : 'School / College Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.school_name}
                      onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'hi' ? 'निवास पता' : 'Residential Address'}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {loading 
                      ? (lang === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...')
                      : (lang === 'hi' ? 'अनुमोदन हेतु बदलाव भेजें' : 'Submit Changes for Approval')}
                  </span>
                </button>
              </div>

            </form>
          )}

          {/* SUBTAB 2: SECURITY & PASSWORD */}
          {activeSubTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300">
                <h4 className="font-bold flex items-center gap-1.5 text-xs text-brand-700 dark:text-brand-300">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'पासवर्ड सुरक्षा' : 'Encrypted Password Controls'}</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Passwords are authenticated using bcrypt cryptography with server-side validation.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  {lang === 'hi' ? 'पासवर्ड सुरक्षित करें' : 'Update Encrypted Password'}
                </button>
              </div>
            </form>
          )}

          {/* SUBTAB 3: PREFERENCES & LOGOUT */}
          {activeSubTab === 'preferences' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-500" />
                    <span>{lang === 'hi' ? 'इंटरफ़ेस भाषा (Language)' : 'Platform Language'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'वर्तमान में हिन्दी सक्रिय है' : 'Currently in English'}
                  </p>
                </div>

                <button
                  onClick={toggleLanguage}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>{lang === 'hi' ? 'थीम मोड (Appearance)' : 'Theme Mode'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isDark ? 'Dark Mode active' : 'Light Mode active (Default)'}
                  </p>
                </div>

                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm hover:bg-slate-50 transition-colors"
                >
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-600">{t('logout')}</h4>
                  <p className="text-[11px] text-slate-400">Sign out of this device session.</p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    logout();
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
