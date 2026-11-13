import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Share2, 
  Clock, 
  ShieldCheck, 
  Award, 
  Zap, 
  FileText, 
  Globe, 
  Sun, 
  Moon,
  Radio,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const LandingPage = ({ onNavigateAdmin, onLoginSuccess }) => {
  const { login, signup, loginWithGoogle, pendingVerificationNotice, setPendingVerificationNotice } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  // Unified Form Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');
  const [signupRole, setSignupRole] = useState('student'); // 'student' | 'teacher'

  // Unified Login state (NO role selector, NO captcha)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cityAddress, setCityAddress] = useState('');
  
  // Teacher sign up fields
  const [coachingName, setCoachingName] = useState('');
  const [coachingAddress, setCoachingAddress] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedSubjects, setSelectedSubjects] = useState(['Mathematics', 'Physics']);

  // Student sign up fields
  const [schoolName, setSchoolName] = useState('');
  const [classGrade, setClassGrade] = useState('Class 10th');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [dob, setDob] = useState('2008-05-15');

  // Dynamic Landing CMS & Promotions State
  const [cmsContent, setCmsContent] = useState({
    hero_title: 'Where Technology Meets Education',
    hero_title_hi: 'जहाँ तकनीक और शिक्षा का संगम होता है',
    hero_subtitle: "India's premier coaching management platform connecting independent tutors, institutes, students, and parents.",
    hero_subtitle_hi: 'कागजी रजिस्टर, उलझे हुए व्हाट्सएप ग्रुपों को कहें अलविदा। एक क्लिक में उपस्थिति, रिजल्ट और नोट्स प्रबंधित करें।',
    promotions_banner: '🔥 Admissions Open for Academic Session 2026-27! Register today for top batch seats.',
    promotions_banner_hi: '🔥 सत्र 2026-27 के नए बैच प्रारंभ! सीमित सीटें उपलब्ध, आज ही नामांकन कराएं।',
  });

  const [promotions, setPromotions] = useState([]);
  const [notices, setNotices] = useState([]);

  // Parent PIN Quick check on Landing page
  const [parentRoll, setParentRoll] = useState('SG-2026-042');
  const [parentPin, setParentPin] = useState('4289');
  const [parentViewOpen, setParentViewOpen] = useState(false);

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'English', 'Social Science'];

  // Load dynamic CMS & Promotions from API
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const content = await api.getLandingContent();
        if (content) setCmsContent(content);
      } catch (e) {
        // Fallback handled smoothly
      }

      try {
        const promos = await api.getCoachingPromotions();
        if (promos && promos.length > 0) setPromotions(promos);
      } catch (e) {}

      try {
        const activeNotices = await api.getNotices();
        if (activeNotices) setNotices(activeNotices.filter(n => n.is_global || n.priority === 'urgent'));
      } catch (e) {}
    };

    fetchLandingData();
  }, []);

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  // Unified Role-Free Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoginLoading(false);

    if (res.success && res.user) {
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } else {
      if (res.pendingVerification) {
        // Teacher not approved yet notice is set in context
      } else {
        setLoginError(res.error || 'Invalid credentials. Please verify your email and password.');
      }
    }
  };

  // Comprehensive Role-Specific Sign Up Handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const payload = {
      name: fullName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      phone,
      address: cityAddress,
      dob,
      coaching_name: signupRole === 'teacher' ? coachingName : undefined,
      coaching_address: signupRole === 'teacher' ? coachingAddress : undefined,
      qualification: signupRole === 'teacher' ? qualification : undefined,
      experience_years: signupRole === 'teacher' ? Number(experienceYears) : undefined,
      subjects: signupRole === 'teacher' ? selectedSubjects : undefined,
      school_name: signupRole === 'student' ? schoolName : undefined,
      class_grade: signupRole === 'student' ? classGrade : undefined,
      guardian_name: signupRole === 'student' ? guardianName : undefined,
      guardian_phone: signupRole === 'student' ? guardianPhone : undefined,
    };

    const res = await signup(payload);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || 'Registration failed. Please check your information.');
    } else {
      if (signupRole === 'student' && res.user) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
      }
    }
  };

  const handleGoogleAuth = async () => {
    setLoginError('');
    const res = await loginWithGoogle(signupRole);
    if (res && res.user && onLoginSuccess) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.png" alt="Shiksha Gram" className="h-9 sm:h-10 object-contain hidden sm:block" />
            <img src="/logo-monogram.png" alt="Shiksha Gram" className="h-9 object-contain sm:hidden" />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin Login Shortcut */}
            <button
              onClick={onNavigateAdmin}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

          </div>
        </div>
      </header>

      {/* 2. PROMOTIONS LIVE TICKER BANNER (Dynamic CMS controlled by Admin) */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-emerald-700 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
        <span>{lang === 'hi' ? cmsContent.promotions_banner_hi : cmsContent.promotions_banner}</span>
      </div>

      {/* 3. HERO & PROPER LOGIN PANEL ON VISITOR PAGE */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Platform Promise & Info */}
          <div className="lg:col-span-6 space-y-6 lg:pt-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? 'स्मार्ट कोचिंग प्रबंधन प्रणाली' : 'Smart Coaching Operating System'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              {lang === 'hi' ? cmsContent.hero_title_hi : cmsContent.hero_title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' ? cmsContent.hero_subtitle_hi : cmsContent.hero_subtitle}
            </p>

            {/* Value checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? '1-क्लिक में पूरी कक्षा की उपस्थिति (Mark All Present)' : '1-Click Attendance Marking & Monthly Ratios'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'अभिभावकों को व्हाट्सएप पर सीधी रिपोर्ट व अलर्ट' : 'Instant WhatsApp Attendance & Report Card Alerts'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'शिक्षा AI शंका समाधान (Doubt Solver) 24x7' : '24x7 Shiksha AI STEM Doubt Solver in Hindi & English'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'अभिभावक सिक्योर 4-अंकीय पिन एक्सेस' : 'Secure 4-Digit Parent Portal PIN Access'}</span>
              </div>
            </div>

            {/* Quick Demo Credentials hint for evaluation */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-brand-800 dark:text-brand-300 space-y-1.5">
              <p className="font-bold">⚡ Quick Access Test Credentials:</p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLoginEmail('admin@shikshagram.com'); setLoginPassword('admin1234'); }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 hover:border-brand-500 font-bold"
                >
                  Admin: admin@shikshagram.com / admin1234
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLoginEmail('teacher@shikshagram.com'); setLoginPassword('teacher123'); }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 hover:border-brand-500 font-bold"
                >
                  Teacher: teacher@shikshagram.com / teacher123
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLoginEmail('student@shikshagram.com'); setLoginPassword('student123'); }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 hover:border-brand-500 font-bold"
                >
                  Student: student@shikshagram.com / student123
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Integrated Unified Login & Sign-Up Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
            
            {/* Mode Switcher: Sign In vs Sign Up */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('loginBtn')}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('signUpBtn')}
              </button>
            </div>

            {/* Pending Teacher Verification Notification banner */}
            {pendingVerificationNotice && (
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed font-medium">{pendingVerificationNotice}</p>
              </div>
            )}

            {loginError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* TAB 1: UNIFIED ROLE-FREE LOGIN (NO ROLE SELECTOR, NO CAPTCHA) */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. name@shikshagram.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loginLoading ? 'Authenticating...' : t('loginBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">
                      {lang === 'hi' ? 'अथवा' : 'Or'}
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{t('signInWithGoogle')}</span>
                </button>
              </form>
            )}

            {/* TAB 2: COMPREHENSIVE ROLE-SPECIFIC SIGN UP */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                
                {/* Role Switcher for Registration */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('selectRoleToSignUp')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('student')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                        signupRole === 'student'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{t('roleStudent')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('teacher')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                        signupRole === 'teacher'
                          ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{t('roleTeacher')}</span>
                    </button>
                  </div>
                </div>

                {/* Common fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={signupRole === 'teacher' ? 'Dr. Rajesh Sharma' : 'Aman Verma'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">{t('phoneLabel')}</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">{t('emailLabel')}</label>
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">{t('passwordLabel')}</label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* TEACHER SPECIFIC FIELDS */}
                {signupRole === 'teacher' && (
                  <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold mb-1">{t('coachingNameLabel')}</label>
                      <input
                        type="text"
                        required
                        value={coachingName}
                        onChange={(e) => setCoachingName(e.target.value)}
                        placeholder="e.g. Sharma Science & Math Academy"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Qualification</label>
                        <input
                          type="text"
                          required
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          placeholder="M.Sc / B.Tech / Ph.D"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5">{t('subjectsTaughtLabel')}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {subjectOptions.map(sub => {
                          const isSel = selectedSubjects.includes(sub);
                          return (
                            <button
                              type="button"
                              key={sub}
                              onClick={() => toggleSubject(sub)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                isSel
                                  ? 'bg-brand-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STUDENT SPECIFIC FIELDS */}
                {signupRole === 'student' && (
                  <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">{t('schoolNameLabel')}</label>
                        <input
                          type="text"
                          required
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. St. Joseph College"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">{t('classGradeLabel')}</label>
                        <select
                          value={classGrade}
                          onChange={(e) => setClassGrade(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        >
                          <option value="Class 9th">Class 9th</option>
                          <option value="Class 10th">Class 10th (Board)</option>
                          <option value="Class 11th">Class 11th</option>
                          <option value="Class 12th">Class 12th (Board & JEE/NEET)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">{t('guardianNameLabel')}</label>
                        <input
                          type="text"
                          required
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="Parent / Guardian Name"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">{t('guardianPhoneLabel')}</label>
                        <input
                          type="text"
                          required
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          placeholder="+91 98111 22334"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 pt-3 disabled:opacity-50"
                >
                  <span>{loginLoading ? 'Registering...' : t('signUpBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* 4. COACHING PROMOTIONS SHOWCASE (Admin Controlled CMS) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Verified Partner Academies
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {t('promotionsHeader')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Top offline & hybrid coaching institutions running active batches on Shiksha Gram
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    {p.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img src={p.image_url} alt={p.mentor_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{p.coaching_name}</h3>
                    <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">{p.mentor_name}</p>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{p.subjects}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-semibold">{p.student_count}+ Active Students</span>
                <a
                  href={`tel:${p.contact_phone}`}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <span>Inquire / Call</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE NOTICES & ANNOUNCEMENTS BROADCAST */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('broadcastNoticesHeader')}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.slice(0, 2).map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                  {n.priority}
                </span>
                <span className="text-[10px] text-slate-400">{n.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">{n.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER WITH DEDICATED ADMIN ROUTE SHORTCUT */}
      <footer className="py-10 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-icon-light.png" alt="Shiksha Gram" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Shiksha Gram</p>
              <p className="text-[11px] text-slate-400">{t('tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <button
              onClick={onNavigateAdmin}
              className="hover:text-rose-600 flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Console (/admin/login)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 Shiksha Gram. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
