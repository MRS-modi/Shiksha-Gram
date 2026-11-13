import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarClock, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  FolderGit2, 
  Radio, 
  FileCheck2, 
  Sparkles, 
  UserCheck, 
  UserPlus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen = false, onClose }) => {
  const { user, logout, isTeacher, isStudent, isAdmin, isParent } = useAuth();
  const { t, lang } = useLanguage();

  // Navigation Items by Role
  const teacherNav = [
    { id: 'overview', label: t('navOverview'), icon: LayoutDashboard },
    { id: 'classes', label: t('navMyClasses'), icon: Users },
    { id: 'approvals', label: lang === 'hi' ? 'छात्र प्रोफ़ाइल अनुरोध' : 'Student Approvals', icon: UserCheck },
    { id: 'academics', label: t('navAcademics'), icon: GraduationCap },
    { id: 'learning', label: t('navLearningHub'), icon: BookOpen },
    { id: 'schedule', label: t('navScheduleFees'), icon: CalendarClock },
    { id: 'communication', label: t('navCommunication'), icon: MessageSquare },
  ];

  const studentNav = [
    { id: 'overview', label: t('navOverview'), icon: LayoutDashboard },
    { id: 'attendance', label: t('navAttendance'), icon: CheckCircle2 },
    { id: 'performance', label: t('navPerformance'), icon: GraduationCap },
    { id: 'learning', label: t('navLearningHub'), icon: BookOpen },
    { id: 'leaderboard', label: t('navLeaderboard'), icon: FileCheck2 },
    { id: 'notices', label: t('navNotices'), icon: MessageSquare },
  ];

  const adminNav = [
    { id: 'dashboard', label: t('navAdminDashboard'), icon: LayoutDashboard },
    { id: 'verification', label: t('navTeacherVerify'), icon: ShieldCheck },
    { id: 'users', label: t('navUserManagement'), icon: Users },
    { id: 'batches', label: lang === 'hi' ? 'बैच प्रबंधन' : 'Batch Operations', icon: FolderGit2 },
    { id: 'broadcasts', label: t('navGlobalNotices'), icon: Radio },
    { id: 'approvals', label: t('navProfileApprovals'), icon: UserCheck },
    { id: 'cms', label: t('navLandingCms'), icon: Sparkles },
    { id: 'admins', label: lang === 'hi' ? 'एडमिन सुरक्षा सेटिंग्स' : 'Admin Controls', icon: UserPlus },
  ];

  const parentNav = [
    { id: 'overview', label: t('navOverview'), icon: LayoutDashboard },
    { id: 'attendance', label: t('navAttendance'), icon: CheckCircle2 },
    { id: 'performance', label: t('navPerformance'), icon: GraduationCap },
    { id: 'notices', label: t('navNotices'), icon: MessageSquare },
  ];

  const navItems = isTeacher 
    ? teacherNav 
    : isStudent 
    ? studentNav 
    : isAdmin 
    ? adminNav 
    : parentNav;

  // Active batches / Friends section matching reference design
  const quickList = isTeacher ? [
    { name: 'Class 10th Maths', sub: '28 Students', color: 'bg-emerald-500' },
    { name: 'Class 12th Physics', sub: '22 Students', color: 'bg-brand-500' },
    { name: 'Class 9th Science', sub: '19 Students', color: 'bg-amber-500' },
  ] : [
    { name: 'Dr. Rajesh Sharma', sub: 'Math & Physics', color: 'bg-indigo-500' },
    { name: 'Er. Alok Pandey', sub: 'IIT Foundation', color: 'bg-cyan-500' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      {/* Top Brand Logo */}
      <div className="overflow-y-auto">
        <div className="p-4 sm:p-5 pb-3.5 sm:pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-monogram.png" 
              alt="Shiksha Gram Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm" 
            />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Shiksha<span className="text-emerald-600 dark:text-emerald-400">Gram</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-none">
                {lang === 'hi' ? 'शिक्षा और तकनीक का संगम' : 'Tech Meets Education'}
              </p>
            </div>
          </div>

          {/* Close button on mobile/tablet */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Nav Links */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {lang === 'hi' ? 'मुख्य मेन्यू' : 'Workspace'}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 dark:bg-brand-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Batches / Mentors list */}
        {!isAdmin && (
          <div className="px-3 sm:px-4 py-2 border-t border-slate-100 dark:border-slate-800/60">
            <p className="px-3 pb-2 text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {isTeacher 
                ? (lang === 'hi' ? 'सक्रिय बैच' : 'Active Batches')
                : (lang === 'hi' ? 'शिक्षक' : 'Your Mentors')}
            </p>
            <div className="space-y-1.5">
              {quickList.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>{t('settings')}</span>
        </button>

        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP DOCKED SIDEBAR (Visible on laptop & desktop: lg and above) */}
      <aside className="hidden lg:flex flex-col justify-between w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 h-screen sticky top-0 transition-colors select-none z-20 shrink-0">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. MOBILE & TABLET SLIDE-OVER DRAWER (Visible when isOpen on < lg screens) */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between lg:hidden transform transition-transform duration-300 ease-in-out select-none border-r border-slate-100 dark:border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
};
