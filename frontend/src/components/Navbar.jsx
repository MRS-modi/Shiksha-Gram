import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  LogOut, 
  CheckCheck, 
  User, 
  Sparkles, 
  Edit3, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ProfileModal } from './ProfileModal';

export const Navbar = ({ onSearch, searchQuery }) => {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Global platform notifications covering enrollment, materials, attendance, notices, marks
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'enrollment_request',
      icon: User,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      title: lang === 'hi' ? 'नया प्रवेश अनुरोध' : 'New Enrollment Request',
      desc: lang === 'hi' ? 'कविता चावला ने क्लास 10th बैच में जुड़ने का अनुरोध किया है।' : 'Kavita Chawla requested to join Class 10th - Board Mastery batch.',
      time: '5m ago',
      unread: true
    },
    {
      id: 2,
      type: 'marks_uploaded',
      icon: GraduationCap,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      title: lang === 'hi' ? 'टेस्ट परिणाम अपलोड' : 'Marks Uploaded',
      desc: lang === 'hi' ? 'क्लास 10th - त्रिकोणमिति असेसमेंट के अंक प्रकाशित किए गए।' : 'Trigonometry & Heights assessment marks published for Class 10th.',
      time: '45m ago',
      unread: true
    },
    {
      id: 3,
      type: 'study_material',
      icon: BookOpen,
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/40',
      title: lang === 'hi' ? 'नया अध्ययन नोट्स' : 'New Study Material',
      desc: lang === 'hi' ? 'NCERT Exemplar Solutions पीडीएफ अपलोड किया गया।' : 'NCERT Exemplar Solutions PDF added to Learning Hub.',
      time: '2h ago',
      unread: true
    },
    {
      id: 4,
      type: 'attendance_marked',
      icon: CheckCircle2,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40',
      title: lang === 'hi' ? 'दैनिक उपस्थिति दर्ज' : 'Attendance Marked',
      desc: lang === 'hi' ? 'क्लास 12th भौतिकी बैच: 22 में से 20 छात्र उपस्थित।' : 'Class 12th Physics Batch: 20/22 students present today.',
      time: '4h ago',
      unread: false
    },
    {
      id: 5,
      type: 'notice',
      icon: Radio,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      title: lang === 'hi' ? 'सार्वजनिक सूचना' : 'Platform Notice',
      desc: lang === 'hi' ? 'रविवार 9:00 AM पर 3 घंटे का विशेष बोर्ड मॉक टेस्ट आयोजित होगा।' : 'Special 3-Hour Board Mock Test scheduled for Sunday 9:00 AM.',
      time: '1d ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 md:px-8 py-3.5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          
          {/* Search Bar matching reference "Coursue" layout */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all border border-transparent focus:border-brand-500/50"
            />
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5 md:gap-3.5">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Bell (Covering enrollment, marks, materials, attendance, notices) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-3 z-50 transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-500" />
                      {t('notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.map((n) => {
                      const IconComponent = n.icon;
                      return (
                        <div
                          key={n.id}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${
                            n.unread ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {n.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {n.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill in Upper Tab (Clicking directly opens Profile View & Edit Modal) */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                title={lang === 'hi' ? 'प्रोफ़ाइल देखें व संपादित करें' : 'View & Edit Profile'}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[10px] font-medium text-brand-600 dark:text-brand-400 capitalize">
                    {user?.role === 'teacher' ? t('roleTeacher') : user?.role === 'student' ? t('roleStudent') : user?.role === 'parent' ? t('roleParent') : t('roleAdmin')}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown with Direct View & Edit Action */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-60 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 capitalize">
                      {user?.role || 'teacher'}
                    </span>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {/* View & Edit Profile Button */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                      <span>{lang === 'hi' ? 'प्रोफ़ाइल देखें व बदलें' : 'View & Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="p-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
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
      </header>

      {/* Profile View & Edit Modal (Accessible directly from upper tab) */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
