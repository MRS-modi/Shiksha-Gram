import React from 'react';
import { UserCheck, GraduationCap, Users, Shield, RotateCcw, Sparkles, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { resetMockData } from '../services/mockData';
import { isSupabaseConfigured } from '../services/supabaseClient';

export const RoleSwitcherBar = ({ onGoLanding }) => {
  const { user, switchRole } = useAuth();
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-black/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl border border-slate-700/60 flex items-center gap-1.5 sm:gap-2 text-xs select-none">
      
      {/* Home / Public Website */}
      <button
        onClick={onGoLanding}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Public Website"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Landing</span>
      </button>

      <div className="h-4 w-px bg-slate-700" />

      {/* Role Switches */}
      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold pl-1 hidden md:inline">
        {lang === 'hi' ? 'रोल बदलें:' : 'Role:'}
      </span>

      <button
        onClick={() => switchRole('teacher')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          user?.role === 'teacher'
            ? 'bg-brand-600 text-white shadow-sm font-bold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'शिक्षक' : 'Teacher'}</span>
      </button>

      <button
        onClick={() => switchRole('student')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          user?.role === 'student'
            ? 'bg-emerald-600 text-white shadow-sm font-bold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'विद्यार्थी' : 'Student'}</span>
      </button>

      <button
        onClick={() => switchRole('parent')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          user?.role === 'parent'
            ? 'bg-amber-600 text-white shadow-sm font-bold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'अभिभावक' : 'Parent'}</span>
      </button>

      <button
        onClick={() => switchRole('admin')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          user?.role === 'admin'
            ? 'bg-rose-600 text-white shadow-sm font-bold'
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'एडमिन' : 'Admin'}</span>
      </button>

      <div className="h-4 w-px bg-slate-700" />

      {/* Supabase status badge */}
      <span className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-mono">
        <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        {isSupabaseConfigured ? 'Supabase Live' : 'Prototype Mode'}
      </span>

      {/* Reset data */}
      <button
        onClick={resetMockData}
        title={lang === 'hi' ? 'डेटा रीसेट करें' : 'Reset Sample Data'}
        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
