import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CaptchaWidget } from '../../components/CaptchaWidget';
import { getMockData } from '../../services/mockData';

export const AuthPage = ({ initialMode = 'login', onComplete, onBackToLanding }) => {
  const { login, signup, loginWithGoogle } = useAuth();
  const { lang, t } = useLanguage();

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [role, setRole] = useState('teacher'); // 'teacher' or 'student'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('batch-1');
  
  const [captchaValid, setCaptchaValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { batches } = getMockData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!captchaValid) {
      setErrorMsg(lang === 'hi' ? 'कृपया सही सुरक्षा कोड (कैप्चा) दर्ज करें।' : 'Please complete the security check (CAPTCHA).');
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || (lang === 'hi' ? 'गलत ईमेल या पासवर्ड' : 'Invalid email or password'));
        setLoading(false);
      } else {
        setLoading(false);
        onComplete(res.user);
      }
    } else {
      // Signup
      if (!name.trim()) {
        setErrorMsg(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
        setLoading(false);
        return;
      }
      const res = await signup({
        name,
        email,
        password,
        role,
        batchId: role === 'student' ? selectedBatch : null
      });
      setLoading(false);
      if (res.success) {
        onComplete(res.user, true); // trigger profile setup
      }
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    const res = await loginWithGoogle(role);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Google login error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors">
      
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: Brand Visuals & Role Selector */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-800 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white mb-6 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएँ' : 'Back to Home'}</span>
            </button>

            <img src="/logo-icon-light.png" alt="Logo" className="w-14 h-14 object-contain drop-shadow mb-4" />
            
            <h2 className="text-2xl font-extrabold tracking-tight">
              Shiksha<span className="text-emerald-400">Gram</span>
            </h2>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              {t('tagline')}
            </p>

            {/* Role Tab Selector as described in report section 2 & 3 */}
            <div className="mt-8 bg-black/20 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-wider text-white/70 px-2 py-1">
                {lang === 'hi' ? 'अपनी भूमिका चुनें:' : 'Select Your Role:'}
              </p>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    role === 'teacher'
                      ? 'bg-white text-brand-700 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'शिक्षक' : 'Teacher'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    role === 'student'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'विद्यार्थी' : 'Student'}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs text-white/80">
              {role === 'teacher' ? (
                <>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'एक क्लिक में बैच व उपस्थिति प्रबंधन' : '1-Click Attendance & Batch Management'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'व्हाट्सएप पर रिपोर्ट कार्ड व टेस्ट मार्क्स' : 'WhatsApp-friendly Test Reports'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'एडमिन सत्यापन के बाद पूर्ण नियंत्रण' : 'Admin Verified Safe Platform'}
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'अपनी उपस्थिति व टेस्ट रिजल्ट देखें' : 'Real-time Attendance & Score Tracking'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'नोट्स, पीडीएफ और वीडियो एक्सेस' : 'PDF Notes & Video Lecture Access'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'hi' ? 'अभिभावक के लिए 4-अंकीय सुरक्षित पिन' : 'Parent PIN Access for Reports'}
                  </p>
                </>
              )}
            </div>
          </div>

          <p className="text-[10px] text-white/60 relative z-10 mt-6">
            Protected with Supabase Auth & JWT Sessions.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between">
          
          <div>
            {/* Mode Toggle (Login vs Signup) */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {mode === 'login'
                    ? (lang === 'hi' ? 'लॉगिन करें' : 'Welcome Back')
                    : (lang === 'hi' ? 'नया खाता बनाएँ' : 'Create Account')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {role === 'teacher' 
                    ? (lang === 'hi' ? 'शिक्षक पैनल में प्रवेश' : 'Teacher Access Panel')
                    : (lang === 'hi' ? 'विद्यार्थी पोर्टल में प्रवेश' : 'Student Access Panel')}
                </p>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang === 'hi' ? 'लॉगिन' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang === 'hi' ? 'साइन-अप' : 'Sign-up'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Credentials hint */}
            <div className="mt-4 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-brand-700 dark:text-brand-300 flex items-center justify-between">
              <span>
                💡 Demo {role}: <code className="font-mono font-bold">{role}@shikshagram.com</code> / <code className="font-mono font-bold">{role}123</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail(`${role}@shikshagram.com`);
                  setPassword(`${role}123`);
                }}
                className="underline hover:text-brand-900 dark:hover:text-white font-bold"
              >
                Auto-fill
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              
              {/* Name (for Signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'teacher' ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Aman Verma'}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              {/* Student Batch Selection on Signup as specified in report */}
              {mode === 'signup' && role === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'बैच का चयन करें (नामांकन अनुरोध हेतु)' : 'Select Target Batch (For Enrollment Request)'}
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CAPTCHA Widget as specified in report section 2 & 7 */}
              <div className="pt-1">
                <CaptchaWidget onValidate={setCaptchaValid} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                <span>
                  {loading
                    ? (lang === 'hi' ? 'प्रतीक्षा करें...' : 'Processing...')
                    : mode === 'login'
                    ? (lang === 'hi' ? 'लॉगिन करें' : 'Sign In to Dashboard')
                    : (lang === 'hi' ? 'खाता बनाएँ व आगे बढ़ें' : 'Create Account & Continue')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">
                  {lang === 'hi' ? 'अथवा' : 'Or continue with'}
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2.5 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{lang === 'hi' ? 'गूगल (Google) से लॉगिन करें' : 'Sign in with Google'}</span>
            </button>

          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              {lang === 'hi' ? 'सुरक्षित प्रमाणीकरण • 256-बिट एन्क्रिप्शन' : 'Protected by Supabase Row Level Security • 256-bit SSL'}
            </p>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Password'}
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {lang === 'hi' 
                ? 'अपना पंजीकृत ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने के निर्देश भेजेंगे।'
                : 'Enter your registered email address to receive password reset OTP.'}
            </p>
            {forgotSent ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs">
                {lang === 'hi' ? '✓ रीसेट निर्देश आपके ईमेल पर भेज दिए गए हैं!' : '✓ Reset instructions sent to your email!'}
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="block mt-3 w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-center"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSent(true)}
                    className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
