import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  Award, 
  MessageCircle, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  LogOut,
  Send,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMockData } from '../../services/mockData';

export const ParentView = ({ activeTab = 'overview', setActiveTab }) => {
  const { user, loginParent } = useAuth();
  const { lang, t } = useLanguage();
  const data = getMockData();

  // PIN login state if viewing without parent session
  const [rollInput, setRollInput] = useState('SG-2026-042');
  const [pinInput, setPinInput] = useState('4289');
  const [errorMsg, setErrorMsg] = useState('');

  // Child data
  const student = data.students.find(s => s.rollNumber === (user?.rollNumber || 'SG-2026-042')) || data.students[0];
  const batch = data.batches.find(b => b.id === student.batchId) || data.batches[0];

  const handlePinSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginParent(rollInput, pinInput);
    if (!res.success) {
      setErrorMsg(lang === 'hi' ? 'अमान्य रोल नंबर या 4-अंकीय पिन' : 'Invalid Roll Number or 4-digit Parent PIN');
    }
  };

  const handleWhatsAppTeacher = () => {
    const text = `Namaste Dr. Rajesh Sharma,\nI am the parent of ${student.name} (${student.rollNumber}, ${batch.name}). I am reaching out regarding their academic progress.\n\nThank you!`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-brand-700 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            {lang === 'hi' ? 'अभिभावक सिक्योर पोर्टल (Read-Only)' : 'Parent Read-Only Portal'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
            {lang === 'hi' ? `${student.name} का रिपोर्ट कार्ड व उपस्थिति` : `${student.name}'s Academic Progress`}
          </h2>
          <p className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed">
            {batch.name} • {batch.teacherName} (Phone: +91 98765 43210)
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleWhatsAppTeacher}
              className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'शिक्षक से व्हाट्सएप पर बात करें' : 'Chat with Teacher on WhatsApp'}</span>
            </button>
          </div>
        </div>

        <div className="absolute right-6 bottom-4 opacity-15 hidden md:block pointer-events-none">
          <img src="/logo-icon-light.png" alt="Shiksha Gram" className="w-52 h-52 object-contain" />
        </div>
      </div>

      {/* 3 Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold">{t('attendanceRate')}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{student.attendanceRate}%</span>
            <span className="text-xs text-slate-400 font-bold">22 of 24 Days</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">✓ Very regular attendance</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'नवीनतम टेस्ट रिजल्ट' : 'Latest Test Score'}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{student.lastScore}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Grade A+</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trigonometry & Heights Assessment</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold">{lang === 'hi' ? 'मासिक कोचिंग फीस' : 'Monthly Coaching Fee'}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">₹1,500</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Paid ✓</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Receipt: REC-SG-2026-11-042</p>
        </div>

      </div>

      {/* Teacher Remarks & Latest Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" />
            <span>{lang === 'hi' ? 'शिक्षक की टिप्पणी (Teacher Remarks)' : 'Teacher Remarks & Feedback'}</span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            "{student.name} shows exceptional dedication in Mathematics and Science. He actively participates in class discussions and solves exemplar problems with high speed. Keep encouraging his regular study habits."
            <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">— Dr. Rajesh Sharma (Director)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {lang === 'hi' ? 'कोचिंग सूचनाएँ (Announcements)' : 'Institute Notices for Parents'}
          </h3>
          <div className="space-y-3">
            {data.notices.slice(0, 2).map((n) => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-rose-600 uppercase">{n.priority} • {n.date}</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{n.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
