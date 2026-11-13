import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare, 
  Radio, 
  FolderGit2, 
  Menu 
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/public/LandingPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { TeacherWorkspace } from './pages/teacher/TeacherWorkspace';
import { StudentWorkspace } from './pages/student/StudentWorkspace';
import { ParentView } from './pages/parent/ParentView';
import { AdminWorkspace } from './pages/admin/AdminWorkspace';

export function App() {
  const { user, isAuthenticated, isTeacher, isStudent, isAdmin, isParent } = useAuth();
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  // Navigation flow state: 'landing' | 'admin_login' | 'app'
  const [viewState, setViewState] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') {
        return 'admin_login';
      }
    }
    return isAuthenticated ? 'app' : 'landing';
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handle direct admin login route
  const handleGoAdminLogin = () => {
    setViewState('admin_login');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', '#/admin/login');
    }
  };

  const handleAdminAuthComplete = (adminUser) => {
    setActiveTab('dashboard');
    setViewState('app');
  };

  const handleUserLoginSuccess = (authUser) => {
    setViewState('app');
    if (authUser?.role === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('overview');
    }
  };

  // Synchronize viewState when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setViewState('app');
      if (user.role === 'admin') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('overview');
      }
    } else if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const path = window.location.pathname;
        if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') {
          setViewState('admin_login');
          return;
        }
      }
      setViewState('landing');
    }
  }, [isAuthenticated, user?.role]);

  // If user is authenticated, we show the app shell
  const showAppShell = isAuthenticated && viewState === 'app';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. VISITOR / LANDING PAGE (Unified Login + Coaching Promotions + CMS) */}
      {!showAppShell && viewState === 'landing' && (
        <LandingPage
          onNavigateAdmin={handleGoAdminLogin}
          onLoginSuccess={handleUserLoginSuccess}
        />
      )}

      {/* 2. DEDICATED ADMIN LOGIN (/admin/login) */}
      {!showAppShell && viewState === 'admin_login' && (
        <AdminLoginPage
          onComplete={handleAdminAuthComplete}
          onBackToLanding={() => {
            setViewState('landing');
            if (typeof window !== 'undefined' && window.history.pushState) {
              window.history.pushState(null, '', '/');
            }
          }}
        />
      )}

      {/* 3. AUTHENTICATED PRODUCTION APP SHELL */}
      {showAppShell && (
        <div className="flex h-screen overflow-hidden">
          {/* Main Navigation Sidebar (Docked on desktop / Slide-over drawer on mobile & tab) */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area with Header */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar 
              onSearch={setSearchQuery} 
              searchQuery={searchQuery} 
              onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)}
            />

            <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-24 sm:pb-16">
              <div className="max-w-7xl mx-auto min-w-0">
                {isTeacher && (
                  <TeacherWorkspace 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                )}

                {isStudent && (
                  <StudentWorkspace 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                )}

                {isParent && (
                  <ParentView 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                )}

                {isAdmin && (
                  <AdminWorkspace 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                )}
              </div>
            </main>

            {/* Mobile Bottom Navigation Bar (Elevated z-index above injected widgets) */}
            <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-[999] flex items-center justify-around py-2 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none shadow-2xl">
              {isStudent && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'overview' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t('navOverview')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'attendance' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t('navAttendance')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('performance')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'performance' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>{t('navPerformance')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('learning')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'learning' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{t('navLearningHub')}</span>
                  </button>
                </>
              )}

              {isTeacher && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'overview' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t('navOverview')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('classes')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'classes' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>{t('navMyClasses')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('academics')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'academics' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>{t('navAcademics')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('learning')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'learning' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{t('navLearningHub')}</span>
                  </button>
                </>
              )}

              {isAdmin && (
                <>
                  <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'dashboard' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'users' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Users</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('batches')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'batches' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <FolderGit2 className="w-5 h-5" />
                    <span>Batches</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('broadcasts')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'broadcasts' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                    <span>Notices</span>
                  </button>
                </>
              )}

              {isParent && (
                <>
                  <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'overview' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>{t('navOverview')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'attendance' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t('navAttendance')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('performance')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'performance' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>{t('navPerformance')}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('notices')} 
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                      activeTab === 'notices' ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{t('navNotices')}</span>
                  </button>
                </>
              )}

              {/* Hamburger "More / Menu" button opens the full sidebar drawer */}
              <button 
                onClick={() => setMobileSidebarOpen(true)} 
                className="flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>{lang === 'hi' ? 'मेन्यू' : 'Menu'}</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* RoleSwitcherBar removed completely as requested by user */}

    </div>
  );
}

export default App;
