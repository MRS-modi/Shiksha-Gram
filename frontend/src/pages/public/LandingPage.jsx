import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  KeyRound,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  X,
  Flame,
  TrendingUp,
  Compass,
  Check,
  Send,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { getMockData } from '../../services/mockData';
import {
  DEFAULT_CMS_CONTENT,
  DEFAULT_PROMO_POSTERS,
  DEFAULT_COACHING_PARTNERS,
  DEFAULT_GLOBAL_BROADCASTS,
  getStoredLandingCMS,
  getStoredPromoPosters,
  getStoredCoachingPromotions,
  getStoredBroadcasts
} from '../../services/landingData';

export const LandingPage = ({ onNavigateAdmin, onLoginSuccess }) => {
  const { login, signup, loginWithGoogle, pendingVerificationNotice } = useAuth();
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

  // Dynamic Landing CMS & Promotions State (Managed dynamically via Admin Console)
  const [cmsContent, setCmsContent] = useState(getStoredLandingCMS);

  // Dynamic Posters & Coaching Directory
  const [promoPosters, setPromoPosters] = useState(getStoredPromoPosters);
  const [promotions, setPromotions] = useState(getStoredCoachingPromotions);
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  const [posterFilter, setPosterFilter] = useState('all'); // 'all' | 'boards' | 'jee_neet' | 'science'
  const [coachingSearch, setCoachingSearch] = useState('');
  const [selectedPosterModal, setSelectedPosterModal] = useState(null);

  // Live Global Broadcasts & Notices
  const [broadcasts, setBroadcasts] = useState(getStoredBroadcasts);
  const [broadcastFilter, setBroadcastFilter] = useState('all'); // 'all' | 'urgent' | 'academic' | 'platform'
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);

  // Parent PIN Quick Verification on Landing page
  const [parentRoll, setParentRoll] = useState('SG-2026-042');
  const [parentPin, setParentPin] = useState('4289');
  const [parentVerifiedData, setParentVerifiedData] = useState(null);
  const [parentVerificationError, setParentVerificationError] = useState('');

  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'English', 'Social Science'];

  // Auto-slide poster carousel every 5 seconds
  useEffect(() => {
    if (!promoPosters || promoPosters.length === 0) return;
    const timer = setInterval(() => {
      setActivePosterIndex((prev) => (prev + 1) % promoPosters.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoPosters.length]);

  // Synchronize dynamic Landing CMS, Posters, Coaching Promotions, and Broadcasts
  useEffect(() => {
    const handleSync = () => {
      setCmsContent(getStoredLandingCMS());
      setPromoPosters(getStoredPromoPosters());
      setPromotions(getStoredCoachingPromotions());
      setBroadcasts(getStoredBroadcasts());
    };

    window.addEventListener('sg_landing_sync', handleSync);
    window.addEventListener('storage', handleSync);

    const loadDynamicLandingData = async () => {
      // 1. Load CMS Content
      try {
        const content = await api.getLandingContent();
        if (content && content.hero_title) {
          setCmsContent(content);
        }
      } catch (e) {}

      // 2. Load Coaching Promotions (Admin published)
      try {
        const promos = await api.getCoachingPromotions();
        if (promos && promos.length > 0) {
          setPromotions(promos);
        }
      } catch (e) {}

      // 3. Load Global Broadcasts & Notices
      try {
        const [adminBroadcasts, generalNotices] = await Promise.allSettled([
          api.getAdminBroadcasts(),
          api.getNotices()
        ]);

        const fetchedList = [];
        if (adminBroadcasts.status === 'fulfilled' && Array.isArray(adminBroadcasts.value)) {
          fetchedList.push(...adminBroadcasts.value);
        }
        if (generalNotices.status === 'fulfilled' && Array.isArray(generalNotices.value)) {
          fetchedList.push(...generalNotices.value.filter(n => n.is_global || n.priority === 'urgent'));
        }

        if (fetchedList.length > 0) {
          setBroadcasts(fetchedList);
        }
      } catch (e) {}
    };

    loadDynamicLandingData();

    return () => {
      window.removeEventListener('sg_landing_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
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
        // Teacher not approved notice is displayed from context
      } else {
        setLoginError(res.error || (lang === 'hi' ? 'अमान्य क्रेडेंशियल्स। कृपया ईमेल एवं पासवर्ड की पुनः जांच करें।' : 'Invalid credentials. Please verify your email and password.'));
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
      setLoginError(res.error || (lang === 'hi' ? 'पंजीकरण विफल रहा। कृपया अपनी जानकारी की पुनः जांच करें।' : 'Registration failed. Please check your information.'));
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

  // Quick Demo fill buttons
  const fillCredentials = (role) => {
    setAuthMode('login');
    setLoginError('');
    if (role === 'admin') {
      setLoginEmail('admin@shikshagram.com');
      setLoginPassword('admin1234');
    } else if (role === 'teacher') {
      setLoginEmail('teacher@shikshagram.com');
      setLoginPassword('teacher123');
    } else if (role === 'student') {
      setLoginEmail('student@shikshagram.com');
      setLoginPassword('student123');
    }
  };

  // Parent PIN Verification Handler
  const handleParentVerify = (e) => {
    e.preventDefault();
    setParentVerificationError('');
    setParentVerifiedData(null);

    const mockDb = getMockData();
    const cleanRoll = parentRoll.trim().toUpperCase();
    const cleanPin = parentPin.trim();

    const matched = mockDb.students.find(
      s => s.rollNumber.toUpperCase() === cleanRoll && String(s.parentPin) === cleanPin
    );

    if (matched) {
      const batch = mockDb.batches.find(b => b.id === matched.batchId) || mockDb.batches[0];
      setParentVerifiedData({
        student: matched,
        batch
      });
    } else {
      setParentVerificationError(
        lang === 'hi' 
          ? 'अमान्य रोल नंबर अथवा 4-अंकीय पिन कोड। कृपया जांचें।' 
          : 'Invalid Student Roll Number or 4-digit Parent PIN. Please check.'
      );
    }
  };

  // Filtered Broadcasts
  const filteredBroadcasts = useMemo(() => {
    return (broadcasts || []).filter(b => {
      if (broadcastFilter === 'all') return true;
      if (broadcastFilter === 'urgent') return b.priority === 'urgent';
      if (broadcastFilter === 'academic') return b.category === 'academic' || b.category === 'scholarship';
      if (broadcastFilter === 'platform') return b.category === 'platform' || b.target_audience === 'teachers';
      return true;
    });
  }, [broadcasts, broadcastFilter]);

  // Filtered Coaching Promotions
  const filteredPromotions = useMemo(() => {
    return (promotions || []).filter(p => {
      const matchCat = posterFilter === 'all' || (p.category && p.category === posterFilter);
      const q = coachingSearch.toLowerCase().trim();
      const matchSearch = !q || 
        (p.coaching_name && p.coaching_name.toLowerCase().includes(q)) ||
        (p.mentor_name && p.mentor_name.toLowerCase().includes(q)) ||
        (p.subjects && p.subjects.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [promotions, posterFilter, coachingSearch]);

  const activePoster = (promoPosters && promoPosters.length > 0 && promoPosters[activePosterIndex]) || promoPosters?.[0] || DEFAULT_PROMO_POSTERS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 transition-colors font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 py-3.5 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.png" alt="Shiksha Gram" className="h-9 sm:h-10 object-contain hidden sm:block" />
            <img src="/logo-monogram.png" alt="Shiksha Gram" className="h-9 object-contain sm:hidden" />
          </div>

          {/* Nav Quick Jump Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#broadcasts" className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>{lang === 'hi' ? 'लाइव सूचनाएं' : 'Live Broadcasts'}</span>
            </a>
            <a href="#promotions" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? 'कोचिंग व ऑफर्स' : 'Coaching & Offers'}</span>
            </a>
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 transition-colors">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'hi' ? 'मुख्य फीचर्स' : 'Platform Features'}</span>
            </a>
            <a href="#parent-access" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 transition-colors">
              <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'hi' ? 'अभिभावक पोर्टल' : 'Parent Access'}</span>
            </a>
          </nav>

          {/* Action Tools: Lang, Theme, Admin Shortcut */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-xs"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin Login Dedicated Shortcut */}
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
              title="Admin Console Access"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Admin</span>
            </button>

          </div>
        </div>
      </header>

      {/* 2. DYNAMIC PROMOTIONS TICKER MARQUEE (Admin Controlled via CMS) */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-emerald-700 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-inner overflow-hidden relative">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
        <span className="truncate max-w-4xl tracking-wide">
          {lang === 'hi' ? cmsContent.promotions_banner_hi : cmsContent.promotions_banner}
        </span>
      </div>

      {/* 3. HERO & UNIFIED LOGIN / REGISTRATION HUB */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-10 left-1/4 -z-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Value Proposition & Animated Live Metrics */}
          <div className="lg:col-span-6 space-y-6 lg:pt-3">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'hi' ? '⚡ भारत का नंबर 1 स्मार्ट कोचिंग ऑपरेटिंग सिस्टम' : '⚡ India’s #1 Smart Coaching Operating System'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
              {lang === 'hi' ? (
                <>
                  जहाँ <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">तकनीक और शिक्षा</span> का संगम होता है
                </>
              ) : (
                <>
                  Where <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Technology Meets</span> Education
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' ? cmsContent.hero_subtitle_hi : cmsContent.hero_subtitle}
            </p>

            {/* Live Interactive Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-center transition-all hover:-translate-y-0.5">
                <p className="text-lg font-black text-brand-600 dark:text-brand-400">100+</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'पार्टनर कोचिंग' : 'Coaching Partners'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-center transition-all hover:-translate-y-0.5">
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">15,000+</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'नामांकित छात्र' : 'Active Students'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-center transition-all hover:-translate-y-0.5">
                <p className="text-lg font-black text-amber-500">99.4%</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'उपस्थिति परिशुद्धता' : 'Attendance Precision'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs text-center transition-all hover:-translate-y-0.5">
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">24x7</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'शिक्षा AI डाउट्स' : 'Shiksha AI Solver'}
                </p>
              </div>
            </div>

            {/* Core Value Checklist */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? '1-क्लिक में पूरी कक्षा की उपस्थिति (Mark All Present & Monthly Reports)' : '1-Click Attendance Marking with Instant Monthly Ratios'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'अभिभावकों को व्हाट्सएप पर सीधी उपस्थिति व रिपोर्ट कार्ड अलर्ट' : 'Instant WhatsApp Attendance & Report Card Alerts to Parents'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'शिक्षा AI शंका समाधान (STEM Doubt Solver) हिंदी व अंग्रेजी में 24x7' : '24x7 Shiksha AI STEM Doubt Solver in Hindi & English'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'hi' ? 'अभिभावक सिक्योर 4-अंकीय पिन एक्सेस (No App Login Required)' : 'Secure 4-Digit Parent Portal PIN Access with Instant Progress View'}</span>
              </div>
            </div>

            {/* Quick Demo Credentials hint for evaluation */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-brand-800 dark:text-brand-300 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Click Test Login Credentials:</span>
                </p>
                <span className="text-[10px] text-slate-400 font-medium">Click to pre-fill</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-400 text-slate-700 dark:text-slate-200 font-bold transition-all shadow-xs"
                >
                  🛡️ Admin: admin@shikshagram.com
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('teacher')}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-400 text-slate-700 dark:text-slate-200 font-bold transition-all shadow-xs"
                >
                  👨‍🏫 Teacher: teacher@shikshagram.com
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('student')}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-400 text-slate-700 dark:text-slate-200 font-bold transition-all shadow-xs"
                >
                  🎓 Student: student@shikshagram.com
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Unified Login & Registration Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 relative">
            
            {/* Mode Switcher: Sign In vs Sign Up */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 shadow-inner">
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

            {/* TAB 1: UNIFIED ROLE-FREE LOGIN (NO ROLE SELECTOR, DIRECT ROLE ROUTING) */}
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
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2.5 shadow-xs"
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

                <div>
                  <label className="block text-xs font-semibold mb-1">{t('addressLabel')}</label>
                  <input
                    type="text"
                    required
                    value={cityAddress}
                    onChange={(e) => setCityAddress(e.target.value)}
                    placeholder="Civil Lines, Kanpur"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
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
                                  ? 'bg-brand-600 text-white shadow-xs'
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

      {/* 4. SLIDE DOWN 1: LIVE GLOBAL BROADCASTING HUB (प्लेटफॉर्म सूचनाएं एवं लाइव घोषणाएं) */}
      <section id="broadcasts" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800 scroll-mt-20">
        
        {/* Section Header with Live Radar Pulsing Beacon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="tracking-wider uppercase">Live Broadcasting Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>{lang === 'hi' ? 'प्लेटफॉर्म सूचनाएं एवं लाइव घोषणाएं' : 'Global Broadcasting & Platform Notices'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {lang === 'hi' 
                ? 'प्रशासन, मुख्य संस्थानों एवं शिक्षकों द्वारा जारी आधिकारिक आदेश, परीक्षा तिथियां एवं सूचनाएं।' 
                : 'Official announcements, exam schedules, and urgent alerts issued by Platform Administration and Directors.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start md:self-auto shadow-inner">
            {[
              { id: 'all', label: lang === 'hi' ? 'सभी घोषणाएं' : 'All Notices' },
              { id: 'urgent', label: lang === 'hi' ? '🚨 अति-महत्वपूर्ण' : '🚨 Urgent Alerts' },
              { id: 'academic', label: lang === 'hi' ? '🎓 परीक्षा व परिणाम' : '🎓 Academics' },
              { id: 'platform', label: lang === 'hi' ? '📢 सिस्टम अपडेट' : '📢 Platform' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setBroadcastFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  broadcastFilter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBroadcasts.map((notice) => {
            const isUrgent = notice.priority === 'urgent';
            return (
              <div
                key={notice.id}
                className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  isUrgent
                    ? 'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 border-rose-200/80 dark:border-rose-900/60 shadow-sm hover:shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                      }`}>
                        {isUrgent ? '🚨 URGENT' : '📢 OFFICIAL'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {notice.target_audience === 'all' 
                          ? (lang === 'hi' ? 'सभी के लिए' : 'All Audiences')
                          : notice.target_audience === 'teachers' 
                            ? (lang === 'hi' ? 'केवल शिक्षक' : 'Teachers Only')
                            : (lang === 'hi' ? 'केवल छात्र' : 'Students Only')}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{notice.date || 'Recent'}</span>
                    </span>
                  </div>

                  {/* Notice Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                    {lang === 'hi' && notice.title_hi ? notice.title_hi : notice.title}
                  </h3>

                  {/* Notice Content */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {lang === 'hi' && notice.content_hi ? notice.content_hi : notice.content}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="truncate">{notice.author || 'Platform Authority'}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `📢 *${notice.title}*\n\n${notice.content}\n\n_Issued via Shiksha Gram Broadcasting_`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Share Notice via WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedNoticeModal(notice)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>{lang === 'hi' ? 'विस्तार से देखें' : 'View Full'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SLIDE DOWN 2: PROMOTIONS & COACHING SHOWCASE (कोचिंग प्रमोशन्स, पोस्टर्स व ऑफर्स) */}
      <section id="promotions" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800 scroll-mt-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 uppercase tracking-wider">
            ⭐ Admissions, Posters & Coaching Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {lang === 'hi' ? 'कोचिंग प्रमोशन्स, पोस्टर्स व विशेष ऑफर्स' : 'Coaching Promotions, Posters & Verified Showcases'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'hi' 
              ? 'प्रमाणित संस्थानों के नवीन बैच पोस्टर्स, छात्रवृत्ति परीक्षाएं एवं शीर्ष शिक्षकों की प्रोफाइल' 
              : 'Browse active admission posters, scholarship tests, and certified coaching partners across India.'}
          </p>
        </div>

        {/* PART A: MULTI-POSTER DYNAMIC BANNER CAROUSEL / SLIDER */}
        {activePoster && (
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl mb-12 border border-slate-800">
            
            <div className="relative h-[340px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden">
              
              {/* Background Poster Image with Gradient Overlay */}
              <img 
                src={activePoster.image} 
                alt={activePoster.title} 
                className="w-full h-full object-cover object-center filter brightness-[0.38] transition-all duration-700 scale-105"
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-4xl z-10">
                
                {/* Badge & Validity */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500 text-white shadow-md uppercase tracking-wider">
                    {lang === 'hi' ? activePoster.badge_hi : activePoster.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activePoster.discount}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-slate-200 backdrop-blur-xs">
                    Valid till: {activePoster.validTill}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2.5 my-auto py-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-sm">
                    {lang === 'hi' ? activePoster.title_hi : activePoster.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-amber-300">
                    {lang === 'hi' ? activePoster.tagline_hi : activePoster.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed hidden sm:block">
                    {lang === 'hi' ? activePoster.description_hi : activePoster.description}
                  </p>
                </div>

                {/* Call to action & Direct Inquiry */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${(activePoster.phone || '+919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello! I saw the "${activePoster.title}" poster on Shiksha Gram and would like to inquire regarding registration.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'व्हाट्सएप पर सीट बुक करें' : 'Claim Seat via WhatsApp'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedPosterModal(activePoster)}
                    className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-xs transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'बड़ा पोस्टर देखें' : 'View Full Poster'}</span>
                  </button>

                  <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-300 font-semibold">
                    <Building className="w-4 h-4 text-brand-400" />
                    <span>{activePoster.organizer}</span>
                  </div>
                </div>

              </div>

              {/* Slider Navigation Arrows */}
              <button
                onClick={() => setActivePosterIndex((prev) => (prev - 1 + promoPosters.length) % promoPosters.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all z-20"
                title="Previous Poster"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActivePosterIndex((prev) => (prev + 1) % promoPosters.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all z-20"
                title="Next Poster"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {promoPosters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePosterIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activePosterIndex === idx ? 'w-8 bg-brand-500' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>
        )}

        {/* PART B: VERIFIED COACHING DIRECTORY & PARTNER POSTERS */}
        <div className="space-y-6">
          
          {/* Controls Bar: Category Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: lang === 'hi' ? 'सभी संस्थान' : 'All Institutes' },
                { id: 'boards', label: lang === 'hi' ? 'बोर्ड परीक्षा (9वीं-12वीं)' : 'Boards (9th-12th)' },
                { id: 'jee_neet', label: lang === 'hi' ? 'आईआईटी-जेईई व नीट' : 'IIT-JEE / NEET' },
                { id: 'science', label: lang === 'hi' ? 'साइंस व केमिस्ट्री' : 'Science & Math' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setPosterFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    posterFilter === cat.id
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={coachingSearch}
                onChange={(e) => setCoachingSearch(e.target.value)}
                placeholder={lang === 'hi' ? 'कोचिंग, शिक्षक या विषय खोजें...' : 'Search academy, mentor...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>

          </div>

          {/* Coaching Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Poster Banner Header */}
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={p.banner_url || p.image_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'}
                      alt={p.coaching_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Badge and Rating */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-xs">
                        {p.badge || 'Verified'}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-amber-400 backdrop-blur-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Location Tag */}
                    <div className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-slate-200 flex items-center gap-1 drop-shadow-xs">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{p.location || 'Central Campus'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    
                    {/* Mentor Profile Preview */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                        alt={p.mentor_name} 
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/20 shadow-xs shrink-0" 
                      />
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {p.coaching_name}
                        </h3>
                        <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold truncate">
                          {p.mentor_name}
                        </p>
                      </div>
                    </div>

                    {/* Subjects Pill */}
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                      {p.subjects}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    {/* Achievements Tag */}
                    {p.achievements && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{p.achievements}</span>
                      </div>
                    )}

                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      {p.student_count || 50}+ {lang === 'hi' ? 'सक्रिय छात्र' : 'Students'}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${p.contact_phone || '+919876543210'}`}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Call Academy"
                      >
                        <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      </a>

                      <a
                        href={`https://wa.me/${(p.contact_phone || '+919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste! I am inquiring about admission in ${p.coaching_name} via Shiksha Gram.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Inquire'}</span>
                      </a>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </section>

      {/* 6. SLIDE DOWN 3: PLATFORM PILLARS & KEY CAPABILITIES */}
      <section id="features" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800 scroll-mt-20">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            Built for Real Indian Coachings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {lang === 'hi' ? 'कोचिंग संचालन को सरल एवं आधुनिक बनाएं' : 'Engineered for Modern Coaching Operations'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'hi' 
              ? 'रजिस्टर की पुरानी पद्धतियों से मुक्ति पाएं और हर छात्र की प्रगति पर पारदर्शी नजर रखें।' 
              : 'Replace paper registers with one unified, automated system for tutors, students, and parents.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? '1-क्लिक हाजिरी (Mark All)' : '1-Click Fast Attendance'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'कक्षा के सभी छात्रों को एक बटन में उपस्थित करें। मासिक अनुपात व अनुपस्थिति चेतावनी स्वतः तैयार।' 
                : 'Mark entire batch present in 2 seconds. Automatically logs ratios, alerts absent students, and maintains historical data.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'शिक्षा AI 24x7 शंका समाधान' : '24x7 Shiksha AI Tutor'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'गणित व विज्ञान के जटिल प्रश्नों का चरण-दर-चरण समाधान हिंदी और अंग्रेजी दोनों भाषाओं में।' 
                : 'Instant STEM homework and doubt solver with step-by-step conceptual proofs in both Hindi and English.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'व्हाट्सएप ऑटो अलर्ट्स' : 'WhatsApp Automation'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'उपस्थिति, टेस्ट अंक, फीस रसीद और जरूरी नोटिस अभिभावकों के फोन पर 1-क्लिक में प्रेषित करें।' 
                : 'Share formatted attendance summaries, test report cards, and fee receipts directly with parents.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? '4-अंकीय पिन अभिभावक पोर्टल' : 'Secure 4-Digit Parent PIN'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'माता-पिता बिना किसी जटिल लॉगिन के केवल रोल नंबर और 4-अंकीय पिन से बच्चे की प्रगति देख सकते हैं।' 
                : 'Frictionless parent oversight: Enter roll number and confidential PIN to view live attendance and rank.'}
            </p>
          </div>

        </div>

      </section>

      {/* 7. SLIDE DOWN 4: QUICK PARENT PORTAL VERIFICATION GATEWAY */}
      <section id="parent-access" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800 scroll-mt-20">
        
        <div className="bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-xs">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Parent Transparency Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {lang === 'hi' 
                  ? 'अभिभावक: अपने बच्चे की उपस्थिति एवं रिजल्ट तुरंत जांचें' 
                  : 'Parents: Check Your Ward’s Attendance & Marks Instantly'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {lang === 'hi'
                  ? 'कोचिंग द्वारा जारी छात्र का रोल नंबर एवं 4-अंकीय गुप्त पिन दर्ज करें। किसी ऐप इंस्टॉलेशन या पासवर्ड की आवश्यकता नहीं है।'
                  : 'Enter your student’s registered roll number and secret 4-digit PIN provided by their coaching institute for instant real-time oversight.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-mono">
                <span className="text-amber-300 font-bold">⚡ Try Sample Roll:</span>
                <button
                  type="button"
                  onClick={() => { setParentRoll('SG-2026-042'); setParentPin('4289'); }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                >
                  Roll: SG-2026-042 | PIN: 4289
                </button>
              </div>
            </div>

            {/* Verification Form Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 text-slate-800 dark:text-slate-100 shadow-xl border border-white/20">
              
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'hi' ? '4-अंकीय पिन से सत्यापन करें' : 'Verify Student Record'}</span>
              </h3>

              {parentVerificationError && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parentVerificationError}</span>
                </div>
              )}

              {parentVerifiedData && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      {parentVerifiedData.student.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Batch: {parentVerifiedData.batch.name}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">Attendance</p>
                      <p className="text-sm font-black text-emerald-600">{parentVerifiedData.student.attendanceRate}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 text-center">
                      <p className="text-[10px] text-slate-400 font-bold">Last Score</p>
                      <p className="text-sm font-black text-brand-600">{parentVerifiedData.student.lastScore}%</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleParentVerify} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Student Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={parentRoll}
                    onChange={(e) => setParentRoll(e.target.value)}
                    placeholder="e.g. SG-2026-042"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    4-Digit Secret PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={parentPin}
                    onChange={(e) => setParentPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold tracking-widest text-center text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'रिकॉर्ड सत्यापित करें' : 'Verify & View Overview'}</span>
                </button>
              </form>

            </div>

          </div>

        </div>

      </section>

      {/* 8. FOOTER WITH DEDICATED ADMIN ROUTE SHORTCUT */}
      <footer className="py-12 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <img src="/logo-icon-light.png" alt="Shiksha Gram" className="w-9 h-9 object-contain" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Shiksha Gram</p>
              <p className="text-[11px] text-slate-400">
                {lang === 'hi' ? 'जहाँ तकनीक और शिक्षा का संगम होता है' : 'Where Technology Meets Education'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <a href="#broadcasts" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {lang === 'hi' ? 'लाइव ब्रॉडकास्ट' : 'Broadcasts'}
            </a>
            <a href="#promotions" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {lang === 'hi' ? 'कोचिंग डायरेक्टरी' : 'Promotions'}
            </a>
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {lang === 'hi' ? 'फीचर्स' : 'Features'}
            </a>
            <a href="#parent-access" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {lang === 'hi' ? 'पिन एक्सेस' : 'Parent PIN'}
            </a>
            
            {/* Dedicated Admin Console link */}
            <button
              onClick={onNavigateAdmin}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Console (/admin/login)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center md:text-right">
            © 2026 Shiksha Gram. All rights reserved.
          </p>
        </div>
      </footer>

      {/* MODAL 1: FULL BROADCAST NOTICE EXPANDED VIEW */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedNoticeModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                selectedNoticeModal.priority === 'urgent'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
              }`}>
                {selectedNoticeModal.priority === 'urgent' ? '🚨 URGENT NOTICE' : '📢 OFFICIAL NOTICE'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {selectedNoticeModal.date || 'Recent'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {lang === 'hi' && selectedNoticeModal.title_hi ? selectedNoticeModal.title_hi : selectedNoticeModal.title}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap">
              {lang === 'hi' && selectedNoticeModal.content_hi ? selectedNoticeModal.content_hi : selectedNoticeModal.content}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold">Issued By: {selectedNoticeModal.author || 'Platform Authority'}</span>
              
              <button
                type="button"
                onClick={() => {
                  const text = `📢 *${selectedNoticeModal.title}*\n\n${selectedNoticeModal.content}\n\n_Issued via Shiksha Gram Broadcasting_`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: FULL POSTER & BROCHURE LIGHTBOX */}
      {selectedPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-800 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            <button
              onClick={() => setSelectedPosterModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 shrink-0">
              <img
                src={selectedPosterModal.image}
                alt={selectedPosterModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500 text-white uppercase tracking-wider mb-2 inline-block">
                  {lang === 'hi' ? selectedPosterModal.badge_hi : selectedPosterModal.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug drop-shadow-sm">
                  {lang === 'hi' ? selectedPosterModal.title_hi : selectedPosterModal.title}
                </h3>
              </div>
            </div>

            {/* Poster Details */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <p className="text-xs font-bold text-amber-500 dark:text-amber-400 mb-1">
                  {lang === 'hi' ? selectedPosterModal.tagline_hi : selectedPosterModal.tagline}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'hi' ? selectedPosterModal.description_hi : selectedPosterModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Benefit / Discount</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedPosterModal.discount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Registration Deadline</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedPosterModal.validTill}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">Organizer: {selectedPosterModal.organizer}</span>
                </div>

                <a
                  href={`https://wa.me/${(selectedPosterModal.phone || '+919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello! I am inquiring about the "${selectedPosterModal.title}" poster on Shiksha Gram.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप पूछताछ' : 'Inquire on WhatsApp'}</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
