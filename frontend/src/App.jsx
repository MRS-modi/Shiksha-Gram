import React, { useState, useEffect } from 'react';
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
  const { lang } = useLanguage();
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
          {/* Main Navigation Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area with Header */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-16">
              <div className="max-w-7xl mx-auto">
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
          </div>
        </div>
      )}

      {/* RoleSwitcherBar removed completely as requested by user */}

    </div>
  );
}

export default App;
